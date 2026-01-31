-- =====================================================
-- SEED DATA for Microverse Meds
-- =====================================================

-- =====================================================
-- ACTIONS (Gamification events)
-- =====================================================
INSERT INTO actions (title, base_value, description, icon) VALUES
  ('LOG_DOSE', 10, 'Log a medication dose', '💊'),
  ('PUNCTUAL_DOSE', 15, 'Log a dose on time', '⏰'),
  ('DAILY_LOGIN', 5, 'Open the app each day', '📱'),
  ('COMPLETE_QUIZ', 50, 'Complete an educational quiz', '🎯'),
  ('SUPPORTIVE_FRIEND', 3, 'Send encouragement to a friend', '💚'),
  ('PURCHASE_ITEM', 0, 'Purchase an item from the shop', '🛒'),
  ('REACH_TIER_2', 25, 'Grow tree to Young Tree stage', '🌱'),
  ('REACH_TIER_3', 50, 'Grow tree to Mature Tree stage', '🌳'),
  ('REACH_TIER_4', 100, 'Grow tree to Ancient Tree stage', '🌲'),
  ('SEASON_CHANGE', 20, 'Complete a full season cycle', '🍂');

-- =====================================================
-- BADGES (Achievements)
-- =====================================================

-- Insert badges
INSERT INTO badges (title, description, image_url, tier) VALUES
  -- Beginner badges
  ('First Dose', 'Log your very first dose', '/badges/first_dose.svg', 'BRONZE'),
  ('Getting Started', 'Log 5 doses', '/badges/getting_started.svg', 'BRONZE'),
  ('Early Bird', 'Log a dose before 8 AM', '/badges/early_bird.svg', 'BRONZE'),

  -- Streak badges
  ('Week Warrior', 'Maintain a 7-day streak', '/badges/week_warrior.svg', 'SILVER'),
  ('Month Master', 'Maintain a 30-day streak', '/badges/month_master.svg', 'GOLD'),
  ('Century Club', 'Maintain a 100-day streak', '/badges/century_club.svg', 'PLATINUM'),

  -- Consistency badges
  ('Perfect Week', 'Log all doses on time for a week', '/badges/perfect_week.svg', 'SILVER'),
  ('On-Time Champion', 'Log 50 doses on time', '/badges/on_time_champion.svg', 'GOLD'),

  -- Tree growth badges
  ('Sapling Tender', 'Reach Young Tree stage', '/badges/sapling_tender.svg', 'BRONZE'),
  ('Garden Master', 'Reach Mature Tree stage', '/badges/garden_master.svg', 'SILVER'),
  ('Ancient Keeper', 'Reach Ancient Tree stage', '/badges/ancient_keeper.svg', 'GOLD'),

  -- Seasonal badges
  ('Spring Awakening', 'Experience Spring season', '/badges/spring.svg', 'BRONZE'),
  ('Summer Bloom', 'Experience Summer season', '/badges/summer.svg', 'BRONZE'),
  ('Autumn Harvest', 'Experience Fall season', '/badges/fall.svg', 'BRONZE'),
  ('Winter Wonder', 'Experience Winter season', '/badges/winter.svg', 'BRONZE'),
  ('Four Seasons', 'Complete all 4 seasons', '/badges/four_seasons.svg', 'GOLD'),

  -- Education badges
  ('Quiz Novice', 'Complete 1 quiz', '/badges/quiz_novice.svg', 'BRONZE'),
  ('Quiz Expert', 'Complete 10 quizzes', '/badges/quiz_expert.svg', 'SILVER'),
  ('Knowledge Master', 'Complete 50 quizzes', '/badges/knowledge_master.svg', 'GOLD'),

  -- Social badges
  ('Supportive Friend', 'Send 10 encouragement messages', '/badges/supportive.svg', 'SILVER'),
  ('Community Builder', 'Connect with 5 friends', '/badges/community.svg', 'SILVER'),

  -- Shop badges
  ('First Purchase', 'Buy your first shop item', '/badges/first_purchase.svg', 'BRONZE'),
  ('Collector', 'Own 10 shop items', '/badges/collector.svg', 'SILVER'),
  ('Tree Decorator', 'Own 25 shop items', '/badges/decorator.svg', 'GOLD');

-- =====================================================
-- BADGE CONDITIONS
-- =====================================================

-- Get badge and action IDs for references
WITH badge_ids AS (
  SELECT id, title FROM badges
),
action_ids AS (
  SELECT id, title FROM actions
)

INSERT INTO badge_conditions (badge_id, action_id, quantity, consecutive)
SELECT
  b.id,
  a.id,
  CASE b.title
    WHEN 'First Dose' THEN 1
    WHEN 'Getting Started' THEN 5
    WHEN 'Early Bird' THEN 1
    WHEN 'Week Warrior' THEN 7
    WHEN 'Month Master' THEN 30
    WHEN 'Century Club' THEN 100
    WHEN 'Perfect Week' THEN 7
    WHEN 'On-Time Champion' THEN 50
    WHEN 'Quiz Novice' THEN 1
    WHEN 'Quiz Expert' THEN 10
    WHEN 'Knowledge Master' THEN 50
    WHEN 'Supportive Friend' THEN 10
    WHEN 'Community Builder' THEN 5
    WHEN 'First Purchase' THEN 1
    WHEN 'Collector' THEN 10
    WHEN 'Tree Decorator' THEN 25
    ELSE 1
  END,
  CASE b.title
    WHEN 'Week Warrior' THEN true
    WHEN 'Month Master' THEN true
    WHEN 'Century Club' THEN true
    WHEN 'Perfect Week' THEN true
    ELSE false
  END
FROM badge_ids b
CROSS JOIN action_ids a
WHERE
  (b.title IN ('First Dose', 'Getting Started') AND a.title = 'LOG_DOSE') OR
  (b.title = 'Early Bird' AND a.title = 'LOG_DOSE') OR
  (b.title IN ('Week Warrior', 'Month Master', 'Century Club') AND a.title = 'LOG_DOSE') OR
  (b.title IN ('Perfect Week', 'On-Time Champion') AND a.title = 'PUNCTUAL_DOSE') OR
  (b.title IN ('Quiz Novice', 'Quiz Expert', 'Knowledge Master') AND a.title = 'COMPLETE_QUIZ') OR
  (b.title = 'Supportive Friend' AND a.title = 'SUPPORTIVE_FRIEND') OR
  (b.title = 'First Purchase' AND a.title = 'PURCHASE_ITEM') OR
  (b.title = 'Collector' AND a.title = 'PURCHASE_ITEM') OR
  (b.title = 'Tree Decorator' AND a.title = 'PURCHASE_ITEM') OR
  (b.title = 'Sapling Tender' AND a.title = 'REACH_TIER_2') OR
  (b.title = 'Garden Master' AND a.title = 'REACH_TIER_3') OR
  (b.title = 'Ancient Keeper' AND a.title = 'REACH_TIER_4') OR
  (b.title IN ('Spring Awakening', 'Summer Bloom', 'Autumn Harvest', 'Winter Wonder', 'Four Seasons') AND a.title = 'SEASON_CHANGE');

-- =====================================================
-- SHOP ITEMS (Tree decorations, creatures, boosts)
-- =====================================================

INSERT INTO shop_items (name, description, category, price, image_url, placement_zone, required_growth_stage, required_season) VALUES
  -- DECORATIONS
  ('Fairy Lights', 'Magical twinkling lights for your tree', 'decoration', 25, '/items/fairy_lights.png', 'branches', 1, NULL),
  ('Ribbon Garland', 'Colorful ribbons wrapped around the trunk', 'decoration', 15, '/items/ribbon.png', 'trunk', 1, NULL),
  ('Wind Chimes', 'Gentle chimes that sway in the breeze', 'decoration', 30, '/items/windchimes.png', 'branches', 2, NULL),
  ('Lanterns', 'Glowing lanterns hanging from branches', 'decoration', 35, '/items/lanterns.png', 'branches', 2, NULL),
  ('Tree Swing', 'A charming swing beneath your tree', 'decoration', 40, '/items/swing.png', 'branches', 2, NULL),
  ('Flower Bed', 'Beautiful flowers surrounding the tree base', 'decoration', 20, '/items/flower_bed.png', 'ground', 1, NULL),
  ('Mushroom Circle', 'Magical mushrooms growing in a circle', 'decoration', 30, '/items/mushrooms.png', 'ground', 2, NULL),

  -- CREATURES
  ('Bluebird Nest', 'A family of bluebirds makes a home', 'creature', 50, '/items/bluebird.png', 'branches', 2, 'spring'),
  ('Wise Owl', 'A wise owl watches over your tree', 'creature', 75, '/items/owl.png', 'canopy', 2, NULL),
  ('Garden Fairy', 'A magical fairy that tends your tree', 'creature', 100, '/items/fairy.png', 'branches', 3, NULL),
  ('Butterfly Swarm', 'Beautiful butterflies flutter around', 'creature', 60, '/items/butterflies.png', 'canopy', 2, 'spring'),
  ('Friendly Squirrel', 'A playful squirrel lives in your tree', 'creature', 45, '/items/squirrel.png', 'trunk', 2, NULL),
  ('Fireflies', 'Glowing fireflies light up the evening', 'creature', 55, '/items/fireflies.png', 'canopy', 2, 'summer'),
  ('Cardinal Bird', 'A bright red cardinal perches proudly', 'creature', 50, '/items/cardinal.png', 'branches', 2, 'winter'),

  -- SEASONAL ITEMS
  ('Cherry Blossoms', 'Beautiful pink blossoms', 'seasonal', 40, '/items/cherry_blossoms.png', 'canopy', 2, 'spring'),
  ('Spring Flowers', 'Vibrant spring wildflowers', 'seasonal', 25, '/items/spring_flowers.png', 'ground', 1, 'spring'),
  ('Summer Fruits', 'Delicious fruits hanging from branches', 'seasonal', 35, '/items/fruits.png', 'branches', 2, 'summer'),
  ('Autumn Leaves', 'Vibrant orange and red leaves', 'seasonal', 40, '/items/autumn_leaves.png', 'canopy', 2, 'fall'),
  ('Pumpkin Patch', 'Halloween pumpkins at the tree base', 'seasonal', 30, '/items/pumpkins.png', 'ground', 2, 'fall'),
  ('Snow Blanket', 'Fresh snow covering the ground', 'seasonal', 35, '/items/snow.png', 'ground', 1, 'winter'),
  ('Icicles', 'Sparkling icicles hanging from branches', 'seasonal', 30, '/items/icicles.png', 'branches', 2, 'winter'),
  ('Holiday Ornaments', 'Festive ornaments for winter', 'seasonal', 45, '/items/ornaments.png', 'branches', 2, 'winter'),

  -- BOOSTS
  ('Growth Fertilizer', '2x HP for next 10 doses', 'boost', 200, '/items/fertilizer.png', NULL, 1, NULL),
  ('HP Multiplier', '1.5x HP for 24 hours', 'boost', 150, '/items/multiplier.png', NULL, 1, NULL),
  ('Streak Shield', 'Protect your streak for 1 missed day', 'boost', 250, '/items/shield.png', NULL, 2, NULL),
  ('Season Lock', 'Keep current season for 14 days', 'boost', 300, '/items/season_lock.png', NULL, 2, NULL),
  ('Instant Growth', 'Add 50 doses to tree growth progress', 'boost', 500, '/items/instant_growth.png', NULL, 3, NULL),
  ('Eternal Spring', 'Force tree to Spring permanently', 'boost', 1000, '/items/eternal_spring.png', NULL, 4, NULL);

-- Note: In production, you would also want to add:
-- - A default admin user in the profiles table
-- - Sample medications for testing
-- - Initial quest templates
