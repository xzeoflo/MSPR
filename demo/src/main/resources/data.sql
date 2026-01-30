-- Nettoyage préalable (Optionnel si tu es en ddl-auto=create)
-- DELETE FROM user_workouts;
-- DELETE FROM exercises;
-- DELETE FROM workouts;
-- DELETE FROM users;

-- =============================================
-- 1. USERS (2 Coachs, 3 Clients)
-- Le mot de passe est 'password123' (BCrypt)
-- =============================================
INSERT INTO users (email, password, firstname, lastname, role, partner_brand, subscription_tier) VALUES
('coach.nike@test.com', '$2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqEnLPz0zke.6vNAnv3N.8p.EomG', 'Marc', 'NikeCoach', 'COACH', 'Nike', 'PREMIUM'),
('coach.adidas@test.com', '$2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqEnLPz0zke.6vNAnv3N.8p.EomG', 'Sarah', 'AdiCoach', 'COACH', 'Adidas', 'PREMIUM'),
('client1.nike@test.com', '$2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqEnLPz0zke.6vNAnv3N.8p.EomG', 'Paul', 'Runner', 'CLIENT', 'Nike', 'FREEMIUM'),
('client2.nike@test.com', '$2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqEnLPz0zke.6vNAnv3N.8p.EomG', 'Julie', 'Fitness', 'CLIENT', 'Nike', 'PREMIUM'),
('client.adidas@test.com', '$2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqEnLPz0zke.6vNAnv3N.8p.EomG', 'Kevin', 'Yoga', 'CLIENT', 'Adidas', 'FREEMIUM');

-- =============================================
-- 2. WORKOUTS
-- =============================================
INSERT INTO workouts (title, description, difficulty, partner_brand, workout_type) VALUES
('Nike Morning HIIT', 'Quick high intensity session', 'Intermediate', 'Nike', 'HIIT'),
('Power Lift Nike', 'Heavy weight session', 'Advanced', 'Nike', 'STRENGTH'),
('Adidas Cardio Flow', 'Endurance and breathing', 'Beginner', 'Adidas', 'CARDIO'),
('Nike Core Express', 'Abs workout', 'Beginner', 'Nike', 'CORE'),
('Adidas Strength 101', 'Basic full body strength', 'Intermediate', 'Adidas', 'STRENGTH');

-- =============================================
-- 3. EXERCISES
-- =============================================
-- Pour Workout 1 (Nike HIIT)
INSERT INTO exercises (name, description, duration_in_seconds, repetitions, sets, calories_burned, intensity_level, sequence_order, workout_id, exercise_type) VALUES
('Burpees', 'Full body cardio', 60, 15, 3, 45, 'High', 1, 1, 'CARDIO'),
('Mountain Climbers', 'Core and cardio', 45, 40, 3, 30, 'Medium', 2, 1, 'CARDIO'),
('Sprints', 'Max speed', 30, 1, 5, 50, 'Very High', 3, 1, 'CARDIO');

-- Pour Workout 2 (Power Lift Nike)
INSERT INTO exercises (name, description, duration_in_seconds, repetitions, sets, calories_burned, intensity_level, sequence_order, workout_id, exercise_type) VALUES
('Deadlift', 'Back and legs', 120, 5, 5, 80, 'Very High', 1, 2, 'STRENGTH'),
('Bench Press', 'Chest power', 120, 8, 4, 60, 'High', 2, 2, 'STRENGTH');

-- Pour Workout 3 (Adidas Cardio Flow)
INSERT INTO exercises (name, description, duration_in_seconds, repetitions, sets, calories_burned, intensity_level, sequence_order, workout_id, exercise_type) VALUES
('Jumping Jacks', 'Warmup cardio', 60, 50, 3, 25, 'Low', 1, 3, 'CARDIO'),
('Plank', 'Static hold', 60, 0, 3, 15, 'Medium', 3, 3, 'CORE');

-- Pour Workout 4 (Nike Core)
INSERT INTO exercises (name, description, duration_in_seconds, repetitions, sets, calories_burned, intensity_level, sequence_order, workout_id, exercise_type) VALUES
('Crunches', 'Upper abs', 60, 25, 3, 20, 'Medium', 1, 4, 'CORE'),
('Leg Raises', 'Lower abs', 60, 15, 3, 20, 'Medium', 2, 4, 'CORE');

-- Pour Workout 5 (Adidas Strength)
INSERT INTO exercises (name, description, duration_in_seconds, repetitions, sets, calories_burned, intensity_level, sequence_order, workout_id, exercise_type) VALUES
('Squats', 'Leg strength', 90, 15, 4, 40, 'Medium', 1, 5, 'STRENGTH'),
('Pushups', 'Chest strength', 60, 12, 4, 30, 'Medium', 2, 5, 'STRENGTH');