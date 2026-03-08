-- 1. USERS : On ne touche à rien si l'email existe déjà
INSERT INTO users (email, password, firstname, lastname, role, partner_brand, subscription_tier) VALUES
('admin@healthai.com', '$2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqEnLPz0zke.6vNAnv3N.8p.EomG', 'Admin', 'System', 'ADMIN', 'Internal', 'PREMIUM_PLUS'),
('coach.nike@test.com', '$2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqEnLPz0zke.6vNAnv3N.8p.EomG', 'Marc', 'NikeCoach', 'COACH', 'Nike', 'PREMIUM'),
('coach.adidas@test.com', '$2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqEnLPz0zke.6vNAnv3N.8p.EomG', 'Sarah', 'AdiCoach', 'COACH', 'Adidas', 'PREMIUM'),
('client1.nike@test.com', '$2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqEnLPz0zke.6vNAnv3N.8p.EomG', 'Paul', 'Runner', 'CLIENT', 'Nike', 'FREEMIUM'),
('client2.nike@test.com', '$2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqEnLPz0zke.6vNAnv3N.8p.EomG', 'Julie', 'Fitness', 'CLIENT', 'Nike', 'PREMIUM'),
('client.adidas@test.com', '$2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqEnLPz0zke.6vNAnv3N.8p.EomG', 'Kevin', 'Yoga', 'CLIENT', 'Adidas', 'FREEMIUM')
ON CONFLICT (email) DO NOTHING;

-- 2. WORKOUTS : On force les ID pour lier les exercices correctement
INSERT INTO workouts (id, title, description, difficulty, partner_brand, workout_type) VALUES
(1, 'Nike Morning HIIT', 'Quick high intensity session', 'Intermediate', 'Nike', 'HIIT'),
(2, 'Power Lift Nike', 'Heavy weight session', 'Advanced', 'Nike', 'STRENGTH'),
(3, 'Adidas Cardio Flow', 'Endurance and breathing', 'Beginner', 'Adidas', 'CARDIO'),
(4, 'Nike Core Express', 'Abs workout', 'Beginner', 'Nike', 'CORE'),
(5, 'Adidas Strength 101', 'Basic full body strength', 'Intermediate', 'Adidas', 'STRENGTH')
ON CONFLICT (id) DO NOTHING;

-- 3. EXERCISES
INSERT INTO exercises (id, name, description, duration_in_seconds, repetitions, sets, calories_burned, intensity_level, sequence_order, workout_id, exercise_type) VALUES
(1, 'Burpees', 'Full body cardio', 60, 15, 3, 45, 'ADVANCED', 1, 1, 'CARDIO'),
(2, 'Mountain Climbers', 'Core and cardio', 45, 40, 3, 30, 'INTERMEDIATE', 2, 1, 'CARDIO'),
(3, 'Sprints', 'Max speed', 30, 1, 5, 50, 'NIGHTMARE', 3, 1, 'CARDIO'),
(4, 'Deadlift', 'Back and legs', 120, 5, 5, 80, 'NIGHTMARE', 1, 2, 'STRENGTH'),
(5, 'Bench Press', 'Chest power', 120, 8, 4, 60, 'ADVANCED', 2, 2, 'STRENGTH'),
(6, 'Jumping Jacks', 'Warmup cardio', 60, 50, 3, 25, 'BEGINNER', 1, 3, 'CARDIO'),
(7, 'Plank', 'Static hold', 60, 0, 3, 15, 'INTERMEDIATE', 3, 3, 'CORE'),
(8, 'Crunches', 'Upper abs', 60, 25, 3, 20, 'INTERMEDIATE', 1, 4, 'CORE'),
(9, 'Leg Raises', 'Lower abs', 60, 15, 3, 20, 'INTERMEDIATE', 2, 4, 'CORE'),
(10, 'Squats', 'Leg strength', 90, 15, 4, 40, 'INTERMEDIATE', 1, 5, 'STRENGTH'),
(11, 'Pushups', 'Chest strength', 60, 12, 4, 30, 'INTERMEDIATE', 2, 5, 'STRENGTH')
ON CONFLICT (id) DO NOTHING;

-- 4. USER_WORKOUTS : On utilise une condition pour éviter les doublons sur la table de jointure
-- Si ta table a une clé primaire composée (user_id, workout_id), ON CONFLICT fonctionne.
INSERT INTO user_workouts (user_id, workout_id) VALUES
(4, 1), (4, 4), (6, 3), (6, 5)
ON CONFLICT DO NOTHING;

-- 5. SYNCHRONISATION DES SÉQUENCES (Crucial pour PostgreSQL)
-- Cela évite que ton prochain "Save" depuis le Front ne tente d'utiliser un ID (ex: 1) déjà pris par le script.
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('workouts_id_seq', (SELECT MAX(id) FROM workouts));
SELECT setval('exercises_id_seq', (SELECT MAX(id) FROM exercises));
