# 🌳 Microverse Meds

A gamified medication adherence tracker that grows your **Life Tree** as you maintain your medication habits.

## Features

- **Life Tree Growth System**: Your tree evolves from a sapling to an ancient tree based on total doses logged
- **Season Cycling**: Experience all four seasons (Spring → Summer → Fall → Winter) as you maintain your streak
- **HIPAA-Compliant**: Encrypted medication storage with full audit logging
- **Gamification**: Earn HP, unlock badges, and purchase decorations for your tree
- **Social Support**: Connect with friends and send encouragement messages
- **Educational Quizzes**: Reinforce medication knowledge with interactive quizzes

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Animations**: Framer Motion
- **Encryption**: AES-256-GCM for PHI protection

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Supabase account (or local Supabase installation)

### Installation

1. Clone and install dependencies:
```bash
pnpm install
```

2. Generate encryption key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

3. Create `.env.local`:
```bash
cp .env.example .env.local
```

4. Fill in your environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
MEDICATION_ENCRYPTION_KEY=your-generated-key
```

### Database Setup

#### Option 1: Local Supabase

```bash
# Initialize Supabase locally
npx supabase init

# Start local Supabase
npx supabase start

# Run migrations
npx supabase db reset

# Run seed data
psql postgresql://postgres:postgres@localhost:54322/postgres < supabase/seed.sql
```

#### Option 2: Supabase Cloud

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy the SQL from `supabase/migrations/20250130000000_initial_schema.sql`
3. Run it in the SQL editor
4. Run the seed data from `supabase/seed.sql`

### Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
microverse-meds/
├── app/                      # Next.js App Router
│   ├── (auth)/               # Auth pages (login, signup)
│   ├── (app)/                # Main app (protected routes)
│   │   ├── home/             # Dashboard with tree
│   │   ├── microverse/       # Tree shop & customization
│   │   ├── quiz-quest/       # Educational quizzes
│   │   ├── med-friend/       # Social features
│   │   └── settings/         # User settings
│   └── globals.css
│
├── components/               # React components
│   ├── tree/                 # Tree visualization
│   ├── doses/                # Medication tracking
│   ├── ui/                   # Reusable UI components
│   └── shared/               # Shared components
│
├── lib/
│   ├── supabase/             # Supabase clients
│   ├── encryption/           # PHI encryption
│   └── gamification/         # Game logic
│
├── types/
│   ├── database.types.ts     # Supabase types
│   └── gamification.ts       # Game types
│
└── supabase/
    ├── migrations/           # Database migrations
    └── seed.sql              # Initial data
```

## Gamification System

### Tree Growth Stages

| Stage | Name | Doses Required | Visual |
|-------|------|----------------|--------|
| 1 | Sapling | 0-29 | Small, 2 branches |
| 2 | Young Tree | 30-99 | Medium, 5 branches |
| 3 | Mature Tree | 100-299 | Large, 8 branches |
| 4 | Ancient Tree | 300+ | Massive, 12 branches |

### Season Cycling

Each season lasts 30 days of streak:
- **Spring**: Cherry blossoms, butterflies, light rain
- **Summer**: Full foliage, fruits, sunny
- **Fall**: Orange/red leaves, windy, harvest
- **Winter**: Snow, bare branches, icicles

Streak breaks reset the tree to Spring.

### HP System

| Action | HP Reward |
|--------|-----------|
| Log Dose | 10 HP |
| Log On-Time | +5 HP bonus |
| Complete Quiz | 50 HP |
| Daily Login | 5 HP |
| Send Encouragement | 3 HP |

## HIPAA Compliance

- **Encryption**: All medication names encrypted with AES-256-GCM
- **Audit Logs**: Every PHI access is logged with timestamp and user
- **Row Level Security**: Users can only access their own data
- **Data Rights**: Users can export and delete all their data
- **Privacy Policy**: Clear disclosure of PHI handling

## Development Roadmap

- [ ] Phase 1: Foundation & Database ✅
- [ ] Phase 2: Tree System Core
- [ ] Phase 3: Medication Management
- [ ] Phase 4: Core Game Loop
- [ ] Phase 5: Tree Shop
- [ ] Phase 6: Quiz Quest
- [ ] Phase 7: Social Features
- [ ] Phase 8: Polish & Testing

## License

Private - Hackathon Project

## Contributors

Built with ❤️ for better medication adherence
