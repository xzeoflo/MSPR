package com.example.demo.services;

import com.example.demo.mappers.WorkoutMapper;
import com.example.demo.models.Exercise;
import com.example.demo.models.Workout;
import com.example.demo.models.User;
import com.example.demo.repositories.WorkoutRepository;
import com.example.demo.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.example.demo.dto.WorkoutDTO;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

import java.time.LocalDate;
import java.time.Period;

@Service
public class WorkoutService {

    private final WorkoutRepository workoutRepository;
    private final UserRepository userRepository;
    private final WorkoutMapper workoutMapper;

    public WorkoutService(WorkoutRepository workoutRepository, UserRepository userRepository,
            WorkoutMapper workoutMapper) {
        this.workoutRepository = workoutRepository;
        this.userRepository = userRepository;
        this.workoutMapper = workoutMapper;
    }

    public List<Workout> getAllWorkouts(String requestingUserPartnerBrand) {
        if (requestingUserPartnerBrand == null || requestingUserPartnerBrand.isEmpty()) {
            return workoutRepository.findAll();
        }
        return workoutRepository.findByPartnerBrand(requestingUserPartnerBrand);
    }

    public Workout getWorkoutById(Integer id, String requestingUserPartnerBrand) {
        Workout workout = workoutRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Workout not found"));

        if (requestingUserPartnerBrand != null && !requestingUserPartnerBrand.equals(workout.getPartnerBrand())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied to this workout");
        }
        return workout;
    }

    public Workout createWorkout(Workout workout, String requestingUserPartnerBrand) {
        if (requestingUserPartnerBrand != null && !requestingUserPartnerBrand.isEmpty()) {
            workout.setPartnerBrand(requestingUserPartnerBrand);
        }
        if (workout.getExercises() != null && !workout.getExercises().isEmpty()) {
            String expectedIntensity = workout.getWorkoutType().toString();

            for (Exercise exercise : workout.getExercises()) {
                if (expectedIntensity != null
                        && !expectedIntensity.equalsIgnoreCase(exercise.getIntensityLevel().toString())) {
                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "Incohérence de type : L'exercice '" + exercise.getName() + "' est d'intensité ["
                                    + exercise.getIntensityLevel().toString() + "] mais le workout est d'intensité ["
                                    + expectedIntensity + "].");
                }
                exercise.setWorkout(workout);
            }
        }
        return workoutRepository.save(workout);
    }

    @Transactional
    public Workout updateWorkout(Integer id, Workout details, String userBrand, String role) {
        Workout workout = workoutRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workout not found"));

        if (!role.equals("ADMIN") && !workout.getPartnerBrand().equals(userBrand)) {
            throw new RuntimeException("Access Denied: Brand mismatch");
        }

        workout.setTitle(details.getTitle());
        workout.setDescription(details.getDescription());
        workout.setDifficulty(details.getDifficulty());
        workout.setWorkoutType(details.getWorkoutType());
        if (details.getExercises() != null) {
            workout.getExercises().clear();

            String expectedType = workout.getWorkoutType().name();

            for (Exercise exercise : details.getExercises()) {
                if (expectedType != null && !expectedType.equalsIgnoreCase(exercise.getExerciseType())) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Type mismatch for exercise: " + exercise.getName());
                }

                exercise.setWorkout(workout);
                workout.getExercises().add(exercise);
            }
        }

        return workoutRepository.save(workout);
    }

    @Transactional
    public void deleteWorkout(Integer id, String userBrand, String role) {
        Workout workout = workoutRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workout not found"));

        if (!role.equals("ADMIN") && !workout.getPartnerBrand().equals(userBrand)) {
            throw new RuntimeException("Access Denied: Brand mismatch");
        }
        workoutRepository.delete(workout);
    }

    public List<Workout> getWorkoutsByAgeRange(int minAge, int maxAge, String requestingUserPartnerBrand) {
        List<User> users;
        if (requestingUserPartnerBrand == null) {
            users = userRepository.findAll();
        } else {
            users = userRepository.findAll().stream()
                    .filter(u -> requestingUserPartnerBrand.equals(u.getPartnerBrand()))
                    .toList();
        }

        return users.stream()
                .filter(user -> {
                    int age = calculateAge(user.getBirthday());
                    return age >= minAge && age <= maxAge;
                })
                .flatMap(user -> user.getCompletedWorkouts().stream())
                .distinct()
                .collect(Collectors.toList());
    }

    private int calculateAge(LocalDate birthDate) {
        if (birthDate == null)
            return 0;
        return Period.between(birthDate, LocalDate.now()).getYears();
    }

    public List<Workout> getWorkoutsByMaxDuration(int maxMinutes, String requestingUserPartnerBrand) {
        int maxSeconds = maxMinutes * 60;

        return getAllWorkouts(requestingUserPartnerBrand).stream()
                .filter(w -> w.getTotalDurationInSeconds() <= maxSeconds)
                .collect(Collectors.toList());
    }

    public List<Workout> getWorkoutsIntensity(String intensity, String requestingUserPartnerBrand) {
        return getAllWorkouts(requestingUserPartnerBrand).stream()
                .filter(w -> w.getWorkoutType().toString().equalsIgnoreCase(intensity))
                .collect(Collectors.toList());
    }

    public List<Workout> getWorkoutsByType(String type, String requestingUserPartnerBrand) {
        return getAllWorkouts(requestingUserPartnerBrand).stream()
                .filter(w -> w.getWorkoutType() != null
                        && w.getWorkoutType().toString().equalsIgnoreCase(type))
                .collect(Collectors.toList());
    }

    public List<Workout> getWorkoutsByExerciseType(String exerciseType, String requestingUserPartnerBrand) {
        return getAllWorkouts(requestingUserPartnerBrand).stream()
                .filter(w -> w.getExercises().stream()
                        .anyMatch(e -> e.getExerciseType() != null
                                && e.getExerciseType().toString().equalsIgnoreCase(exerciseType)))
                .collect(Collectors.toList());
    }

    public List<Workout> getWorkoutByTypeAndIntensity(String workoutType, String exerciseType,
            String requestingUserPartnerBrand) {
        return getAllWorkouts(requestingUserPartnerBrand).stream()
                .filter(w -> w.getWorkoutType() != null
                        && w.getWorkoutType().toString().equalsIgnoreCase(workoutType))
                .filter(w -> w.getExercises().stream()
                        .allMatch(e -> e.getExerciseType() != null
                                && e.getExerciseType().toString().equalsIgnoreCase(exerciseType)))
                .collect(Collectors.toList());
    }

    public List<WorkoutDTO> exportWorkouts(String brand) {
        List<Workout> workouts;
        if (brand == null) {
            workouts = workoutRepository.findAll();
        } else {
            workouts = workoutRepository.findByPartnerBrand(brand);
        }
        return workouts.stream()
                .map(workoutMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void importWorkouts(List<WorkoutDTO> dtos, String brand) {
        for (WorkoutDTO dto : dtos) {
            dto.setPartnerBrand(brand);
            Workout entity = workoutMapper.toEntity(dto);
            validateWorkoutCoherence(entity);
            workoutRepository.save(entity);
        }
    }

    private void validateWorkoutCoherence(Workout workout) {
        if (workout.getExercises() != null) {
            String expectedIntensity = workout.getWorkoutType().toString();
            workout.getExercises().forEach(ex -> {
                if (expectedIntensity != null
                        && !expectedIntensity.equalsIgnoreCase(ex.getIntensityLevel().toString())) {
                    throw new IllegalArgumentException("Type mismatch for exercise: " + ex.getName());
                }
            });
        }
    }
}
