-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- PROFILES TABLE (User metadata & game state)
-- =====================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,

  -- GAMIFICATION
  health_points INTEGER DEFAULT 0 CHECK (health_points >= 0),
  total_doses_logged INTEGER DEFAULT 0 CHECK (total_doses_logged >= 0),
  current_streak INTEGER DEFAULT 0 CHECK (current_streak >= 0),
  longest_streak INTEGER DEFAULT 0 CHECK (longest_streak >= 0),

  -- TREE STATE
  tree_growth_stage INTEGER DEFAULT 1 CHECK (tree_growth_stage BETWEEN 1 AND 4),
  tree_season TEXT DEFAULT 'spring' CHECK (tree_season IN ('spring', 'summer', 'fall', 'winter')),
  last_season_change_at TIMESTAMPTZ DEFAULT NOW(),

  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- MEDICATIONS TABLE (Stores PHI - ENCRYPTED)
-- =====================================================
CREATE TABLE medications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  -- ACTUAL MEDICATION DATA (PHI - Medical Records)
  medication_name TEXT NOT NULL, -- Will be encrypted at app level
  medication_name_iv TEXT, -- Initialization vector for encryption
  medication_name_tag TEXT, -- Auth tag for encryption
  dosage TEXT,
  dosage_iv TEXT,
  dosage_tag TEXT,
  prescriber_name TEXT,
  prescription_date DATE,
  refill_reminder_days INTEGER,

  -- USER-FACING DATA (Displayed in UI)
  nickname TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  icon TEXT DEFAULT '💊',

  -- SCHEDULE
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'twice_daily', 'three_times_daily', 'weekly', 'as_needed')),
  time_windows JSONB DEFAULT '[]'::jsonb,

  -- STATUS
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON COLUMN medications.medication_name IS 'Encrypted - PHI';
COMMENT ON COLUMN medications.dosage IS 'Encrypted - PHI';

-- =====================================================
-- DOSES TABLE (Log of completed medication doses)
-- =====================================================
CREATE TABLE doses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  medication_id UUID REFERENCES medications(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  scheduled_time TIME,
  hp_earned INTEGER DEFAULT 10,
  was_on_time BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ACTIONS TABLE (Gamification action types)
-- =====================================================
CREATE TABLE actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT UNIQUE NOT NULL,
  base_value INTEGER NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- EVENTS TABLE (User action history)
-- =====================================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  action_id UUID REFERENCES actions(id) NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  hp_earned INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- BADGES TABLE (Achievements)
-- =====================================================
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  tier TEXT DEFAULT 'BRONZE' CHECK (tier IN ('BRONZE', 'SILVER', 'GOLD', 'PLATINUM')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- BADGE CONDITIONS TABLE
-- =====================================================
CREATE TABLE badge_conditions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE NOT NULL,
  action_id UUID REFERENCES actions(id) NOT NULL,
  quantity INTEGER DEFAULT 1,
  consecutive BOOLEAN DEFAULT false,
  within_days INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- USER BADGES TABLE (Unlocked achievements)
-- =====================================================
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  badge_id UUID REFERENCES badges(id) NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  is_equipped BOOLEAN DEFAULT false,
  UNIQUE(user_id, badge_id)
);

-- =====================================================
-- SHOP ITEMS TABLE (Tree decorations & boosts)
-- =====================================================
CREATE TABLE shop_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('decoration', 'creature', 'boost', 'seasonal')),
  price INTEGER NOT NULL CHECK (price > 0),
  image_url TEXT,
  effect TEXT,
  placement_zone TEXT CHECK (placement_zone IN ('roots', 'trunk', 'branches', 'canopy', 'ground')),
  is_available BOOLEAN DEFAULT true,
  required_growth_stage INTEGER DEFAULT 1 CHECK (required_growth_stage BETWEEN 1 AND 4),
  required_season TEXT CHECK (required_season IN ('spring', 'summer', 'fall', 'winter')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INVENTORY ITEMS TABLE (Purchased shop items)
-- =====================================================
CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES shop_items(id) NOT NULL,
  quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
  is_active BOOLEAN DEFAULT false,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_id)
);

-- =====================================================
-- TREE STATE TABLE (Detailed tree visualization state)
-- =====================================================
CREATE TABLE tree_state (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  growth_stage INTEGER DEFAULT 1 CHECK (growth_stage BETWEEN 1 AND 4),
  current_season TEXT DEFAULT 'spring' CHECK (current_season IN ('spring', 'summer', 'fall', 'winter')),
  active_decorations JSONB DEFAULT '[]'::jsonb,
  doses_to_next_stage INTEGER,
  days_to_next_season INTEGER DEFAULT 30,
  is_blooming BOOLEAN DEFAULT false,
  has_snow BOOLEAN DEFAULT false,
  has_fruit BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- QUESTS TABLE (Educational quizzes)
-- =====================================================
CREATE TABLE quests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  questions JSONB NOT NULL,
  hp_reward INTEGER DEFAULT 50,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- FRIENDSHIPS TABLE (Social connections)
-- =====================================================
CREATE TABLE friendships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  friend_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, friend_id),
  CHECK (user_id != friend_id)
);

-- =====================================================
-- ENCOURAGEMENTS TABLE (Support messages)
-- =====================================================
CREATE TABLE encouragements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  to_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- AUDIT LOGS TABLE (HIPAA requirement)
-- =====================================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES for performance
-- =====================================================
CREATE INDEX idx_medications_user_id ON medications(user_id);
CREATE INDEX idx_doses_user_id ON doses(user_id);
CREATE INDEX idx_doses_medication_id ON doses(medication_id);
CREATE INDEX idx_doses_logged_at ON doses(logged_at);
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_action_id ON events(action_id);
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX idx_inventory_items_user_id ON inventory_items(user_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE doses ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tree_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE encouragements ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Medications policies
CREATE POLICY "Users can view own medications" ON medications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own medications" ON medications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own medications" ON medications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own medications" ON medications FOR DELETE USING (auth.uid() = user_id);

-- Doses policies
CREATE POLICY "Users can view own doses" ON doses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own doses" ON doses FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Events policies
CREATE POLICY "Users can view own events" ON events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own events" ON events FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User badges policies
CREATE POLICY "Users can view own badges" ON user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own badges" ON user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Inventory policies
CREATE POLICY "Users can view own inventory" ON inventory_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert to own inventory" ON inventory_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own inventory" ON inventory_items FOR UPDATE USING (auth.uid() = user_id);

-- Tree state policies
CREATE POLICY "Users can view own tree state" ON tree_state FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tree state" ON tree_state FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tree state" ON tree_state FOR UPDATE USING (auth.uid() = user_id);

-- Quests policies
CREATE POLICY "Users can view own quests" ON quests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quests" ON quests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own quests" ON quests FOR UPDATE USING (auth.uid() = user_id);

-- Friendships policies (can see friendships where they're involved)
CREATE POLICY "Users can view own friendships" ON friendships FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = friend_id);
CREATE POLICY "Users can create friendships" ON friendships FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own friendships" ON friendships FOR UPDATE
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Encouragements policies
CREATE POLICY "Users can view received encouragements" ON encouragements FOR SELECT
  USING (auth.uid() = to_user_id OR auth.uid() = from_user_id);
CREATE POLICY "Users can send encouragements" ON encouragements FOR INSERT
  WITH CHECK (auth.uid() = from_user_id);

-- Audit logs (users can only see their own logs)
CREATE POLICY "Users can view own audit logs" ON audit_logs FOR SELECT USING (auth.uid() = user_id);

-- Public read access for reference tables
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE badge_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view actions" ON actions FOR SELECT USING (true);
CREATE POLICY "Anyone can view badges" ON badges FOR SELECT USING (true);
CREATE POLICY "Anyone can view badge conditions" ON badge_conditions FOR SELECT USING (true);
CREATE POLICY "Anyone can view shop items" ON shop_items FOR SELECT USING (true);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to increment profile stats (HP, doses)
CREATE OR REPLACE FUNCTION increment_profile_stats(
  user_id UUID,
  hp_amount INTEGER,
  dose_count INTEGER
)
RETURNS TABLE(health_points INTEGER, total_doses_logged INTEGER) AS $$
BEGIN
  UPDATE profiles
  SET
    health_points = profiles.health_points + hp_amount,
    total_doses_logged = profiles.total_doses_logged + dose_count,
    updated_at = NOW()
  WHERE id = user_id;

  RETURN QUERY SELECT profiles.health_points, profiles.total_doses_logged
  FROM profiles WHERE profiles.id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (user_id, action, resource_type, resource_id)
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers to PHI tables
CREATE TRIGGER medications_audit
AFTER INSERT OR UPDATE OR DELETE ON medications
FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- Trigger to auto-create tree_state when profile is created
CREATE OR REPLACE FUNCTION create_tree_state()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO tree_state (user_id, growth_stage, current_season)
  VALUES (NEW.id, 1, 'spring');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER profile_create_tree_state
AFTER INSERT ON profiles
FOR EACH ROW EXECUTE FUNCTION create_tree_state();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medications_updated_at BEFORE UPDATE ON medications
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tree_state_updated_at BEFORE UPDATE ON tree_state
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
