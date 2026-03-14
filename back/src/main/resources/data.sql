-- 1. USERS (Fixed column names: first_name, last_name)
INSERT INTO users (email, password, first_name, last_name, role, partner_brand, subscription_tier) VALUES
('admin@healthai.com', '$2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqEnLPz0zke.6vNAnv3N.8p.EomG', 'Admin', 'System', 'ADMIN', 'Internal', 'PREMIUM_PLUS'),
('coach.nike@test.com', '$2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqEnLPz0zke.6vNAnv3N.8p.EomG', 'Marc', 'NikeCoach', 'COACH', 'Nike', 'PREMIUM'),
('client1.nike@test.com', '$2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqEnLPz0zke.6vNAnv3N.8p.EomG', 'Paul', 'Runner', 'CLIENT', 'Nike', 'FREEMIUM')
ON CONFLICT (email) DO NOTHING;

-- 2. WORKOUTS
INSERT INTO workouts (id, title, description, difficulty, partner_brand, workout_type) VALUES
(1, 'Nike Morning HIIT', 'Quick high intensity session', 'Intermediate', 'Nike', 'HIIT'),
(2, 'Power Lift Nike', 'Heavy weight session', 'Advanced', 'Nike', 'STRENGTH')
ON CONFLICT (id) DO NOTHING;

-- 3. EXERCISES
INSERT INTO exercises (id, name, description, duration_in_seconds, repetitions, sets, calories_burned, intensity_level, sequence_order, workout_id, exercise_type) VALUES
(1, 'Burpees', 'Full body cardio', 60, 15, 3, 45, 'ADVANCED', 1, 1, 'CARDIO')
ON CONFLICT (id) DO NOTHING;

-- 4. MEALS (The new part)
INSERT INTO meals (meal_id, meal_type, quantity_g, allergies, calories_kcal, protein_g, carbs_g, fats_g, sugar_g, sodium_mg, partner_brand) VALUES
(1, 'Chicken Salad', 350, 'None', 450, 35, 15, 20, 5, 400, 'Nike'),
(2, 'Protein Shake', 500, 'Dairy', 250, 40, 10, 5, 2, 150, 'Internal')
ON CONFLICT (meal_id) DO NOTHING;

-- 5. EAT (Linking users to meals)
-- Assuming client1.nike has user_id 3 (check your DB sequence)
INSERT INTO eat (user_id, meal_id, date_ate) VALUES
(3, 1, '2026-03-14 12:30:00'),
(3, 2, '2026-03-14 15:00:00')
ON CONFLICT DO NOTHING;

-- 6. SEQUENCES (Crucial for Hibernate)
SELECT setval('users_user_id_seq', (SELECT MAX(user_id) FROM users));
SELECT setval('workouts_id_seq', (SELECT MAX(id) FROM workouts));
SELECT setval('exercises_id_seq', (SELECT MAX(id) FROM exercises));
SELECT setval('meals_meal_id_seq', (SELECT MAX(meal_id) FROM meals));
SELECT setval('eat_id_seq', (SELECT MAX(id) FROM eat));
