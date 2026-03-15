package com.example.demo.services;

import com.example.demo.mappers.WorkoutMapper;
import com.example.demo.models.Exercise;
import com.example.demo.models.Workout;
import com.example.demo.models.User;
import com.example.demo.repositories.WorkoutRepository;
import com.example.demo.repositories.UserRepository;
import com.example.demo.repositories.ExerciseRepository;
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
    private final ExerciseRepository exerciseRepository;
    private final WorkoutMapper workoutMapper;

    public WorkoutService(WorkoutRepository workoutRepository,
            UserRepository userRepository,
            ExerciseRepository exerciseRepository,
            WorkoutMapper workoutMapper) {
        this.workoutRepository = workoutRepository;
        this.userRepository = userRepository;
        this.exerciseRepository = exerciseRepository;
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

    @Transactional
    public Workout createWorkout(Workout workout, String requestingUserPartnerBrand) {
        if (requestingUserPartnerBrand != null && !requestingUserPartnerBrand.isEmpty()) {
            workout.setPartnerBrand(requestingUserPartnerBrand);
        }

        if (workout.getExercises() != null && !workout.getExercises().isEmpty()) {
            List<Exercise> managedExercises = workout.getExercises().stream()
                    .map(ex -> exerciseRepository.findByName(ex.getName())
                            .orElseGet(() -> exerciseRepository.save(ex)))
                    .collect(Collectors.toList());

            workout.setExercises(managedExercises);
            validateWorkoutCoherence(workout);
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
        workout.setPartnerBrand(details.getPartnerBrand());

        if (details.getExercises() != null) {
            workout.getExercises().clear();
            for (Exercise ex : details.getExercises()) {
                Exercise managedEx = exerciseRepository.findByName(ex.getName())
                        .orElseGet(() -> exerciseRepository.save(ex));
                workout.getExercises().add(managedEx);
            }
            validateWorkoutCoherence(workout);
        }

        return workoutRepository.save(workout);
    }

    @Transactional
    public void deleteWorkout(Integer id, String userBrand, String role) {
        Workout workout = workoutRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Workout not found"));

        String cleanRole = role.replace("ROLE_", "");

        if (cleanRole.equals("ADMIN")) {
            workoutRepository.delete(workout);
            return;
        }

        if (cleanRole.equals("COACH")) {
            boolean isSameBrand = workout.getPartnerBrand() != null && workout.getPartnerBrand().equals(userBrand);
            if (isSameBrand) {
                workoutRepository.delete(workout);
            } else {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: Brand mismatch");
            }
        } else {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: Role not authorized");
        }
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
        List<Workout> workouts = (brand == null) ? workoutRepository.findAll()
                : workoutRepository.findByPartnerBrand(brand);
        return workouts.stream()
                .map(workoutMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void importWorkouts(List<WorkoutDTO> dtos, String brand) {
        for (WorkoutDTO dto : dtos) {
            dto.setPartnerBrand(brand);
            Workout entity = workoutMapper.toEntity(dto);
            if (entity.getExercises() != null) {
                List<Exercise> managed = entity.getExercises().stream()
                        .map(ex -> exerciseRepository.findByName(ex.getName())
                                .orElseGet(() -> exerciseRepository.save(ex)))
                        .toList();
                entity.setExercises(managed);
            }
            validateWorkoutCoherence(entity);
            workoutRepository.save(entity);
        }
    }

    private void validateWorkoutCoherence(Workout workout) {
        if (workout.getExercises() != null && workout.getWorkoutType() != null) {
            String expectedType = workout.getWorkoutType().toString();

            workout.getExercises().forEach(ex -> {
                if (ex.getExerciseType() != null &&
                        !expectedType.equalsIgnoreCase(ex.getExerciseType().toString())) {

                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Incohérence : L'exercice '" + ex.getName() +
                                    "' (Type: " + ex.getExerciseType() +
                                    ") ne correspond pas au type du workout (" + expectedType + ").");
                }
            });
        }
    }
}
