-- ==========================================================
-- 0. CLEAN (Ordre respecté pour les clés étrangères)
-- ==========================================================
TRUNCATE eat, exercises, workouts, meals, users RESTART IDENTITY CASCADE;

-- ==========================================================
-- 1. USERS
-- ==========================================================
INSERT INTO users (email, password, first_name, last_name, role, partner_brand, subscription_tier) VALUES
('admin@healthai.com', '$2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqEnLPz0zke.6vNAnv3N.8p.EomG', 'Admin', 'System', 'ADMIN', 'Internal', 'PREMIUM_PLUS'),
('coach.nike@test.com', '$2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqEnLPz0zke.6vNAnv3N.8p.EomG', 'Marc', 'NikeCoach', 'COACH', 'Nike', 'PREMIUM'),
('client1.nike@test.com', '$2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqEnLPz0zke.6vNAnv3N.8p.EomG', 'Paul', 'Runner', 'CLIENT', 'Nike', 'FREEMIUM')
ON CONFLICT (email) DO NOTHING;

-- ==========================================================
-- 2. WORKOUTS (Format : UPPERCASE pour difficulty)
-- ==========================================================
INSERT INTO workouts (id, title, description, difficulty, partner_brand, workout_type) VALUES
(1, 'Nike Morning HIIT', 'Quick high intensity session', 'INTERMEDIATE', 'Nike', 'HIIT'),
(2, 'Power Lift Nike', 'Heavy weight session', 'ADVANCED', 'Nike', 'STRENGTH')
ON CONFLICT (id) DO NOTHING;

-- ==========================================================
-- 3. EXERCISES (Format : UPPERCASE pour intensity_level)
-- ==========================================================
INSERT INTO exercises (id, name, description, duration_in_seconds, repetitions, sets, calories_burned, intensity_level, sequence_order, workout_id, exercise_type) VALUES
(1, 'Burpees', 'Full body cardio', 60, 15, 3, 45, 'ADVANCED', 1, 1, 'CARDIO')
ON CONFLICT (id) DO NOTHING;

-- ==========================================================
-- 4. MEALS
-- ==========================================================
INSERT INTO meals (meal_id, meal_type, quantity_g, allergies, calories_kcal, protein_g, carbs_g, fats_g, sugar_g, sodium_mg, partner_brand) VALUES
(1, 'Chicken Salad', 350, 'None', 450, 35, 15, 20, 5, 400, 'Nike'),
(2, 'Protein Shake', 500, 'Dairy', 250, 40, 10, 5, 2, 150, 'Internal')
ON CONFLICT (meal_id) DO NOTHING;

-- ==========================================================
-- 5. EAT (Lien via sous-requête pour éviter les IDs en dur)
-- ==========================================================
INSERT INTO eat (user_id, meal_id, date_ate) VALUES
((SELECT user_id FROM users WHERE email = 'client1.nike@test.com'), 1, '2026-03-14 12:30:00'),
((SELECT user_id FROM users WHERE email = 'client1.nike@test.com'), 2, '2026-03-14 15:00:00')
ON CONFLICT DO NOTHING;

-- ==========================================================
-- 6. SEQUENCES (Recalage après TRUNCATE / INSERT)
-- ==========================================================
SELECT setval('users_user_id_seq', COALESCE((SELECT MAX(user_id) FROM users), 1));
SELECT setval('workouts_id_seq', COALESCE((SELECT MAX(id) FROM workouts), 1));
SELECT setval('exercises_id_seq', COALESCE((SELECT MAX(id) FROM exercises), 1));
SELECT setval('meals_meal_id_seq', COALESCE((SELECT MAX(meal_id) FROM meals), 1));
SELECT setval('eat_id_seq', COALESCE((SELECT MAX(id) FROM eat), 1));
