-- =====================================================
-- MIGRATION: Simplify Schema - Remove seasons and shop
-- =====================================================
-- This migration removes:
-- - Season tracking and 30-day seasonal cycles
-- - Tree decorations shop system (shop_items, inventory_items)
-- - Separate tree_state table (merge into profiles)
--
-- Keeping: encryption, dosage tracking, visual customization,
--          badges, quests, social features
-- =====================================================

-- 1. DROP SHOP TABLES (in dependency order)
DROP TABLE IF EXISTS inventory_items CASCADE;
DROP TABLE IF EXISTS shop_items CASCADE;

-- 2. DROP TREE_STATE TABLE
-- (Growth stage will live in profiles.tree_growth_stage only)
DROP TABLE IF EXISTS tree_state CASCADE;

-- 3. REMOVE SEASON TRACKING FROM PROFILES
ALTER TABLE profiles
  DROP COLUMN IF EXISTS tree_season,
  DROP COLUMN IF EXISTS last_season_change_at;

-- 4. DROP TREE_STATE TRIGGER AND FUNCTION
DROP TRIGGER IF EXISTS profile_create_tree_state ON profiles;
DROP FUNCTION IF EXISTS create_tree_state() CASCADE;

-- NOTE: Medications table unchanged - keeping encryption, dosage, color, icon
-- NOTE: Keeping all gamification tables: actions, events, badges, badge_conditions, user_badges
-- NOTE: Keeping social tables: friendships, encouragements
-- NOTE: Keeping quests table
-- NOTE: Keeping audit_logs for HIPAA compliance
