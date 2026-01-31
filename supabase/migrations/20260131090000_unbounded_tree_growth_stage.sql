-- Allow unlimited tree growth stages (one per dose)
ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS profiles_tree_growth_stage_check;

ALTER TABLE profiles
  ADD CONSTRAINT profiles_tree_growth_stage_check
  CHECK (tree_growth_stage >= 1);
