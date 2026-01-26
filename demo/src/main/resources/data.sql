-- =============================================
-- 1. USERS (5 profils : 2 Coachs, 3 Clients)
-- =============================================
INSERT INTO users (email, password, firstname, lastname, role, partner_brand, subscription_tier) VALUES
('coach.nike@test.com', '$2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqEnLPz0zke.6vNAnv3N.8p.EomG', 'Marc', 'NikeCoach', 'COACH', 'Nike', 'PREMIUM'),
('coach.adidas@test.com', '$2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqEnLPz0zke.6vNAnv3N.8p.EomG', 'Sarah', 'AdiCoach', 'COACH', 'Adidas', 'PREMIUM'),
('client1.nike@test.com', '$2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqEnLPz0zke.6vNAnv3N.8p.EomG', 'Paul', 'Runner', 'CLIENT', 'Nike', 'FREEMIUM'),
('client2.nike@test.com', '$2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqEnLPz0zke.6vNAnv3N.8p.EomG', 'Julie', 'Fitness', 'CLIENT', 'Nike', 'PREMIUM'),
('client.adidas@test.com', '$2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqEnLPz0zke.6vNAnv3N.8p.EomG', 'Kevin', 'Yoga', 'CLIENT', 'Adidas', 'FREEMIUM');

-- =============================================
-- 2. WORKOUTS (5 programmes)
-- =============================================
INSERT INTO workouts (id, title, description, difficulty, partner_brand) VALUES
(1, 'Nike Morning HIIT', 'Quick high intensity session', 'Intermediate', 'Nike'),
(2, 'Power Lift Nike', 'Heavy weight session', 'Advanced', 'Nike'),
(3, 'Adidas Cardio Flow', 'Endurance and breathing', 'Beginner', 'Adidas'),
(4, 'Nike Core Express', 'Abs workout', 'Beginner', 'Nike'),
(5, 'Adidas Strength 101', 'Basic full body strength', 'Intermediate', 'Adidas');

-- =============================================
-- 3. EXERCISES (2-3 par workout)
-- =============================================
-- Exercises for Workout 1 (Nike HIIT)
INSERT INTO exercises (name, description, duration_in_seconds, repetitions, sets, calories_burned, intensity_level, sequence_order, workout_id) VALUES
('Burpees', 'Full body cardio', 60, 15, 3, 45, 'High', 1, 1),
('Mountain Climbers', 'Core and cardio', 45, 40, 3, 30, 'Medium', 2, 1),
('Sprints', 'Max speed', 30, 1, 5, 50, 'Very High', 3, 1);

-- Exercises for Workout 2 (Power Lift Nike)
INSERT INTO exercises (name, description, duration_in_seconds, repetitions, sets, calories_burned, intensity_level, sequence_order, workout_id) VALUES
('Deadlift', 'Back and legs', 120, 5, 5, 80, 'Very High', 1, 2),
('Bench Press', 'Chest power', 120, 8, 4, 60, 'High', 2, 2);

-- Exercises for Workout 3 (Adidas Cardio Flow)
INSERT INTO exercises (name, description, duration_in_seconds, repetitions, sets, calories_burned, intensity_level, sequence_order, workout_id) VALUES
('Jumping Jacks', 'Warmup cardio', 60, 50, 3, 25, 'Low', 1, 3),
('Running in place', 'Easy cardio', 300, 0, 1, 120, 'Medium', 2, 3),
('Plank', 'Static hold', 60, 0, 3, 15, 'Medium', 3, 3);

-- Exercises for Workout 4 (Nike Core)
INSERT INTO exercises (name, description, duration_in_seconds, repetitions, sets, calories_burned, intensity_level, sequence_order, workout_id) VALUES
('Crunches', 'Upper abs', 60, 25, 3, 20, 'Medium', 1, 4),
('Leg Raises', 'Lower abs', 60, 15, 3, 20, 'Medium', 2, 4);

-- Exercises for Workout 5 (Adidas Strength)
INSERT INTO exercises (name, description, duration_in_seconds, repetitions, sets, calories_burned, intensity_level, sequence_order, workout_id) VALUES
('Squats', 'Leg strength', 90, 15, 4, 40, 'Medium', 1, 5),
('Pushups', 'Chest strength', 60, 12, 4, 30, 'Medium', 2, 5),
('Lunges', 'Balance and legs', 60, 20, 3, 35, 'Medium', 3, 5);