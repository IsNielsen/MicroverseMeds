# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Microverse Meds** is a gamified medication adherence tracker that helps users maintain medication habits by growing a virtual "Life Tree" that evolves through different growth stages and seasons.

**Core Concept**: Users log medication doses → earn HP → grow their tree through 4 stages → cycle through 4 seasons → unlock badges and decorations.

## Tech Stack

- **Framework**: Next.js 15 (App Router) with React 19 and TypeScript
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Auth**: Supabase Auth (email/password, OAuth)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **PHI Encryption**: AES-256-GCM (Node.js crypto module)

## Development Commands

```bash
# Development
pnpm dev                    # Start Next.js dev server (http://localhost:3000)

# Build & Deploy
pnpm build                  # Production build
pnpm start                  # Start production server

# Database Operations
#give me sql snippets to run on supabase web
# Linting
pnpm lint                   # Run ESLint
```

## Database Schema Architecture
use supabase mcp

The database uses **PostgreSQL via Supabase** with the following core tables:

### `profiles` (User game state)
- Links to `auth.users` via foreign key
- Stores gamification state: `health_points`, `total_doses_logged`, `current_streak`, `longest_streak`
- Tree state: `tree_growth_stage` (1-4), `tree_season` ('spring'|'summer'|'fall'|'winter'), `last_season_change_at`

### `medications` (PHI - Encrypted)
- **CRITICAL**: `medication_name` and `dosage` fields are encrypted at application level using AES-256-GCM
- Encryption pattern: `{field}_iv` and `{field}_tag` columns store initialization vector and auth tag
- User-facing fields: `nickname`, `color`, `icon` (NOT encrypted, shown in UI)
- Schedule: `frequency` (enum), `time_windows` (JSONB array)

### `doses` (Medication log)
- Records each medication dose with `logged_at` timestamp
- Calculates `hp_earned` (base 10 HP + bonus for on-time)
- Links to `medications` and `profiles`

### `actions` (Gamification action types)
- Defines action types: `LOG_DOSE`, `REACH_TIER_2`, `COMPLETE_QUIZ`, etc.
- Each action has a `base_value` (HP reward)

### `events` (User action history)
- Records when users perform actions
- Used for badge unlock conditions and analytics

### `badges` (Achievement system)
- Conditions stored in separate `conditions` table (many-to-many via `badge_id` and `action_id`)

### `tree_decorations` (Shop items)
- Purchasable with HP
- Applied to tree in `tree_state.decorations` JSONB field

### `tree_state` (Tree metadata)
- Current season details, decoration placements
- Separate from `profiles` for potential future scaling

## Key Architectural Patterns

### 1. PHI Encryption Pattern

**IMPORTANT**: All Protected Health Information (PHI) must be encrypted before storage.

```typescript
// Encrypting medication name
import { encryptText, decryptText } from '@/lib/encryption'

// On save
const { encrypted, iv, authTag } = encryptText(medicationName)
await supabase.from('medications').insert({
  medication_name: encrypted,
  medication_name_iv: iv,
  medication_name_tag: authTag,
  // ... other fields
})

// On read
const { data } = await supabase.from('medications').select('*').single()
const decryptedName = decryptText(
  data.medication_name,
  data.medication_name_iv,
  data.medication_name_tag
)
```

**Files that handle encryption**:
- `lib/encryption/index.ts` - Encryption utilities
- Environment variable: `MEDICATION_ENCRYPTION_KEY` (32-byte hex, 64 chars)

### 2. Server Actions Pattern

All database mutations use Next.js Server Actions (marked with `'use server'`).

```typescript
// Example: app/(app)/home/actions.ts
'use server'

export async function logDose(medicationId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  // 1. Insert dose
  // 2. Update profile stats (HP, total doses)
  // 3. Check for tree growth
  // 4. Update streak
  // 5. Check for season change
  // 6. Record event
  // 7. Revalidate page

  revalidatePath('/home')
  return { success: true }
}
```

**Pattern**: Always call `revalidatePath()` after mutations to update cached data.

### 3. Gamification Logic

Tree growth and season changes are calculated in `lib/gamification/tree.ts`:

**Growth Stages** (based on `total_doses_logged`):
1. Sapling: 0-29 doses
2. Young Tree: 30-99 doses
3. Mature Tree: 100-299 doses
4. Ancient Tree: 300+ doses

**Season Cycle** (based on `current_streak` days):
- Spring → Summer → Fall → Winter (30 days each)
- Streak breaks reset to Spring

**Key functions**:
- `getGrowthStage(totalDoses)` - Returns current stage info
- `calculateCurrentSeason(streakDays, lastSeasonChange)` - Returns current season
- `shouldTreeGrow(currentStage, totalDoses)` - Check if stage should increase
- `shouldSeasonChange(lastSeasonChange, currentStreak)` - Check if season should advance

### 4. Authentication & Middleware

`middleware.ts` handles route protection:
- **Protected routes**: `/home`, `/microverse`, `/quiz-quest`, `/med-friend`, `/settings`
- **Auth routes**: `/login`, `/signup`
- Redirects unauthenticated users to `/login`
- Redirects authenticated users away from auth pages to `/home`

**Supabase clients**:
- `lib/supabase/server.ts` - Server-side client (use in Server Components and Actions)
- `lib/supabase/client.ts` - Client-side client (use in Client Components)

### 5. Type Safety

Database types are auto-generated from Supabase schema:
pull from supabase mcp 

Import types from:
- `types/database.types.ts` - Database table types
- `types/gamification.ts` - Game-specific types (Season, GrowthStage, TreeState)

## Route Structure

```
app/
├── page.tsx                    # Landing page (redirects to /home if logged in)
├── (auth)/                     # Auth route group (public)
│   ├── login/page.tsx
│   └── signup/page.tsx
└── (app)/                      # Protected route group (requires auth)
    ├── home/                   # Main dashboard with tree
    │   ├── page.tsx
    │   └── actions.ts          # Server actions (logDose)
    ├── microverse/             # Tree shop & customization
    ├── quiz-quest/             # Educational quizzes
    ├── med-friend/             # Social features
    └── settings/               # User settings & medication management
        └── add-medication/
```

## Component Organization

```
components/
├── tree/
│   ├── TreeCanvas.tsx          # Main tree visualization
│   └── SeasonalEffects.tsx     # Weather effects (rain, snow, etc.)
├── doses/
│   └── MedicationCard.tsx      # Card for logging doses
├── shared/
│   ├── HPDisplay.tsx           # Health points counter
│   ├── StreakBadge.tsx         # Streak indicator
│   └── SideNav.tsx             # Side navigation with hamburger menu
└── ui/                         # Reusable UI components
```

## Environment Variables

Required variables (see `.env.example`):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=            # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=  # Publishable anon key
SUPABASE_SERVICE_ROLE_KEY=           # Service role key (server-side only)

# Encryption
MEDICATION_ENCRYPTION_KEY=           # 32-byte hex string (64 chars)
                                     # Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## HIPAA Compliance Considerations

This application handles Protected Health Information (PHI). When modifying code:

1. **Always encrypt** medication names and dosages before database storage
2. **Use service role key** only in server-side code (never expose to client)
3. **Audit logging**: Every PHI access should be logged in `audit_logs` table
4. **Row Level Security**: Verify RLS policies prevent cross-user data access
5. **Data export**: Support user data export (future feature)
6. **Data deletion**: Support full data deletion on account closure

## Common Development Tasks

### Adding a New Medication Field

1. Add column to `medications` table in new migration:
   ```sql
   ALTER TABLE medications ADD COLUMN new_field TEXT;
   ALTER TABLE medications ADD COLUMN new_field_iv TEXT;
   ALTER TABLE medications ADD COLUMN new_field_tag TEXT;
   ```

2. Regenerate types: `pnpm db:generate`

3. Update encryption in medication form/action

### Adding a New Action Type

1. Insert into `actions` table (via Supabase dashboard or migration):
   ```sql
   INSERT INTO actions (title, base_value, description, icon)
   VALUES ('NEW_ACTION', 15, 'Description', '🎯');
   ```

2. Trigger action in relevant Server Action:
   ```typescript
   await supabase.from('events').insert({
     user_id: user.id,
     action_id: actionId,
     hp_earned: 15,
   })
   ```

### Adding a New Badge

1. Insert badge and conditions via Supabase dashboard or seed script
2. Update badge unlock logic in gamification system (currently in `logDose` action)

### Modifying Tree Growth Thresholds

Edit `types/gamification.ts` → `GROWTH_STAGES` constant:
```typescript
export const GROWTH_STAGES: Record<GrowthStage, GrowthStageInfo> = {
  1: { minDoses: 0, maxDoses: 29, ... },
  2: { minDoses: 30, maxDoses: 99, ... },
  // Modify these thresholds
}
```

## Testing Considerations

- **Test encryption**: Verify encrypted fields are not readable in database
- **Test RLS policies**: Create multiple users and verify data isolation
- **Test streak logic**: Manually adjust `last_season_change_at` to test season transitions

## Known Limitations & TODOs

- Streak calculation is simplified (increments on each dose, should be daily-based)
- "On-time" dose detection not fully implemented (always `true`)
- Badge unlock conditions not automatically evaluated (manual trigger needed)
- Quiz system is placeholder (no quiz content yet)
- Social features are placeholder (no friend connections yet)
- Tree visualization is placeholder (no actual SVG rendering)

## Architecture Decisions

**Why Supabase?**
- Built-in auth, RLS, and real-time subscriptions
- PostgreSQL with strong encryption support
- Audit logging via triggers

**Why App Router?**
- Server Actions simplify data mutations
- Server Components reduce client-side bundle
- Built-in loading/error states

**Why encrypt at app level instead of database?**
- Column-level encryption in PostgreSQL requires extensions
- App-level gives full control over encryption key rotation
- Supports multiple encryption algorithms

**Why separate `tree_state` from `profiles`?**
- Future scaling: Tree state could be cached separately
- Separation of concerns: User data vs. game state
- Easier to add tree-specific features (e.g., shared trees)
