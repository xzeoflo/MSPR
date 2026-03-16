-- 1. VIDAGE COMPLET (Ordre respectant les contraintes)
TRUNCATE eat, workout_exercises, exercise_equipments, exercises, workouts, meals, users
RESTART IDENTITY CASCADE;

-- 2. EXERCISES (Tous d'un coup pour être sûr que les IDs existent)
INSERT INTO exercises (id, name, description, duration_in_seconds, repetitions, sets, calories_burned, intensity_level, exercise_type, status, sequence_order) VALUES
(1, 'Burpees', 'Cardio intense', 60, 15, 3, 45, 'ADVANCED', 'CARDIO', 'APPROVED', 1),
(2, 'Push-ups', 'Haut du corps', 0, 20, 4, 25, 'INTERMEDIATE', 'STRENGTH', 'APPROVED', 2),
(3, 'Squats', 'Bas du corps et fessiers', 0, 15, 4, 30, 'BEGINNER', 'STRENGTH', 'APPROVED', 3),
(4, 'Plank', 'Gainage abdominal', 60, 1, 3, 15, 'INTERMEDIATE', 'STRENGTH', 'APPROVED', 4),
(5, 'Mountain Climbers', 'Cardio et abdos', 45, 0, 3, 35, 'INTERMEDIATE', 'CARDIO', 'APPROVED', 5),
(6, 'Deadlift', 'Force polyarticulaire', 0, 8, 4, 60, 'ADVANCED', 'STRENGTH', 'APPROVED', 6),
(7, 'Downward Dog', 'Yoga stretching', 30, 0, 3, 5, 'BEGINNER', 'STRETCHING', 'APPROVED', 7),
(8, 'Lunges', 'Fentes alternées', 0, 20, 3, 30, 'INTERMEDIATE', 'STRENGTH', 'APPROVED', 8),
(9, 'Jumping Jacks', 'Cardio de base', 60, 0, 3, 40, 'BEGINNER', 'CARDIO', 'APPROVED', 9);

-- 3. EQUIPMENTS
INSERT INTO exercise_equipments (exercise_id, equipment_name) VALUES
(1, 'None'), (2, 'None'), (3, 'Dumbbells'), (4, 'None'), (5, 'None'), (6, 'Barbell'), (7, 'Yoga Mat'), (8, 'Dumbbells'), (9, 'None');

-- 4. WORKOUTS
INSERT INTO workouts (id, title, description, difficulty, workout_type, partner_brand) VALUES
(1, 'Nike Morning HIIT', 'Session matinale', 'INTERMEDIATE', 'CARDIO', 'Nike'),
(2, 'Adidas Leg Day', 'Focus fessiers et jambes', 'ADVANCED', 'STRENGTH', 'Adidas'),
(3, 'Full Body Express', 'Entraînement rapide 15min', 'BEGINNER', 'STRENGTH', 'Internal'),
(4, 'Puma Power Flow', 'Mélange force et souplesse', 'INTERMEDIATE', 'CARDIO', 'Puma'),
(5, 'Gymshark Beast Mode', 'Intensité maximale force', 'ADVANCED', 'STRENGTH', 'Gymshark'),
(6, 'Home Cardio Blast', 'Brûle-graisse sans matériel', 'BEGINNER', 'CARDIO', 'Internal');

-- 5. JOINTURES (Maintenant tous les IDs existent à 100%)
INSERT INTO workout_exercises (workout_id, exercise_id) VALUES
(1, 1), (1, 5), (1, 9),
(2, 3), (2, 8), (2, 6),
(3, 3), (3, 4), (3, 2),
(4, 7), (4, 3), (4, 4),
(5, 6), (5, 2), (5, 8),
(6, 9), (6, 5), (6, 1);

-- 6. USERS
INSERT INTO users (email, password, first_name, last_name, role, partner_brand, subscription_tier) VALUES
('admin@healthai.com', '$2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqEnLPz0zke.6vNAnv3N.8p.EomG', 'Admin', 'System', 'ADMIN', 'Internal', 'PREMIUM_PLUS'),
('coach.nike@test.com', '$2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqEnLPz0zke.6vNAnv3N.8p.EomG', 'Marc', 'NikeCoach', 'COACH', 'Nike', 'PREMIUM'),
('lisa.active@gmail.com', '$2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqEnLPz0zke.6vNAnv3N.8p.EomG', 'Lisa', 'Active', 'CLIENT', 'Nike', 'PREMIUM');

-- 7. MEALS
INSERT INTO meals (meal_id, name, meal_type, allergies, calories_kcal, quantity_g, protein_g, carbs_g, fiber_g, fats_g, sugar_g, sodium_mg, cholesterol_mg, partner_brand, status) VALUES
(1, 'Grilled Chicken & Rice', 'Lunch', 'None', 450.0, 400.0, 35.0, 50.0, 4.0, 8.0, 2.0, 450.0, 85.0, 'Nike', 'APPROVED'),
(2, 'Quinoa Salad', 'Lunch', 'Nuts', 320.0, 350.0, 12.0, 45.0, 8.0, 10.0, 5.0, 280.0, 0.0, 'Internal', 'APPROVED');

-- 8. SEQUENCES
SELECT setval('users_user_id_seq', (SELECT MAX(user_id) FROM users));
SELECT setval('exercises_id_seq', (SELECT MAX(id) FROM exercises));
SELECT setval('workouts_id_seq', (SELECT MAX(id) FROM workouts));
SELECT setval('meals_meal_id_seq', (SELECT MAX(meal_id) FROM meals));
