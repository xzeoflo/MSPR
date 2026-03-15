-- ==========================================================
-- 0. CLEAN (Ordre respecté pour les clés étrangères)
-- ==========================================================
TRUNCATE eat, includes, exercises, user_workouts, workouts, meals, users RESTART IDENTITY CASCADE;

-- ==========================================================
-- 1. USERS
-- ==========================================================
INSERT INTO users (email, password, first_name, last_name, role, partner_brand, subscription_tier) VALUES
('admin@healthai.com', '$2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqEnLPz0zke.6vNAnv3N.8p.EomG', 'Admin', 'System', 'ADMIN', 'Internal', 'PREMIUM_PLUS'),
('coach.nike@test.com', '$2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqEnLPz0zke.6vNAnv3N.8p.EomG', 'Marc', 'NikeCoach', 'COACH', 'Nike', 'PREMIUM'),
('client1.nike@test.com', '$2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqEnLPz0zke.6vNAnv3N.8p.EomG', 'Paul', 'Runner', 'CLIENT', 'Nike', 'FREEMIUM')
ON CONFLICT (email) DO NOTHING;

-- ==========================================================
-- 2. WORKOUTS
-- ==========================================================
INSERT INTO workouts (id, title, description, difficulty, partner_brand, workout_type) VALUES
(1, 'Nike Morning HIIT', 'Quick high intensity session', 'INTERMEDIATE', 'Nike', 'HIIT'),
(2, 'Power Lift Nike', 'Heavy weight session', 'ADVANCED', 'Nike', 'STRENGTH')
ON CONFLICT (id) DO NOTHING;

-- ==========================================================
-- 3. EXERCISES (Uniquement les colonnes de la table exercises)
-- ==========================================================
INSERT INTO exercises (id, name, description, duration_in_seconds, repetitions, sets, calories_burned, intensity_level, exercise_type, status) VALUES
(1, 'Burpees', 'Full body cardio', 60, 15, 3, 45, 'ADVANCED', 'CARDIO', 'APPROVED'),
(2, 'Squats', 'Leg power', 45, 20, 4, 30, 'BEGINNER', 'STRENGTH', 'APPROVED')
ON CONFLICT (id) DO NOTHING;

-- ==========================================================
-- 4. INCLUDES (Lien entre Workouts et Exercises)
-- ==========================================================
INSERT INTO includes (workout_id, exercise_id, sequence_order) VALUES
(1, 1, 1), -- Ajoute Burpees au workout 1 en position 1
(2, 2, 1)  -- Ajoute Squats au workout 2 en position 1
ON CONFLICT DO NOTHING;

-- ==========================================================
-- 5. MEALS
-- ==========================================================
INSERT INTO meals (meal_id, meal_type, quantity_g, allergies, calories_kcal, protein_g, carbs_g, fats_g, sugar_g, sodium_mg, partner_brand) VALUES
(1, 'Chicken Salad', 350, 'None', 450, 35, 15, 20, 5, 400, 'Nike'),
(2, 'Protein Shake', 500, 'Dairy', 250, 40, 10, 5, 2, 150, 'Internal')
ON CONFLICT (meal_id) DO NOTHING;

-- ==========================================================
-- 6. EAT
-- ==========================================================
INSERT INTO eat (user_id, meal_id, date_ate) VALUES
((SELECT user_id FROM users WHERE email = 'client1.nike@test.com'), 1, '2026-03-14 12:30:00'),
((SELECT user_id FROM users WHERE email = 'client1.nike@test.com'), 2, '2026-03-14 15:00:00')
ON CONFLICT DO NOTHING;

-- ==========================================================
-- 7. SEQUENCES (Recalage automatique)
-- ==========================================================
SELECT setval('users_user_id_seq', (SELECT MAX(user_id) FROM users));
SELECT setval('workouts_id_seq', (SELECT MAX(id) FROM workouts));
SELECT setval('exercises_id_seq', (SELECT MAX(id) FROM exercises));
SELECT setval('meals_meal_id_seq', (SELECT MAX(meal_id) FROM meals));