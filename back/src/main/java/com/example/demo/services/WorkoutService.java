package com.example.demo.services;

import com.example.demo.mappers.WorkoutMapper;
import com.example.demo.models.Exercise;
import com.example.demo.models.Workout;
import com.example.demo.models.Includes;
import com.example.demo.repositories.WorkoutRepository;
import com.example.demo.repositories.UserRepository;
import com.example.demo.repositories.ExerciseRepository;
import com.example.demo.repositories.IncludesRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.example.demo.dto.WorkoutDTO;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkoutService {

    private final WorkoutRepository workoutRepository;
    private final UserRepository userRepository;
    private final ExerciseRepository exerciseRepository;
    private final IncludesRepository includesRepository;
    private final WorkoutMapper workoutMapper;

    public WorkoutService(WorkoutRepository workoutRepository,
                          UserRepository userRepository,
                          ExerciseRepository exerciseRepository,
                          IncludesRepository includesRepository,
                          WorkoutMapper workoutMapper) {
        this.workoutRepository = workoutRepository;
        this.userRepository = userRepository;
        this.exerciseRepository = exerciseRepository;
        this.includesRepository = includesRepository;
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
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }
        return workout;
    }

    @Transactional
    public Workout createWorkout(Workout workout, String requestingUserPartnerBrand) {
        if (requestingUserPartnerBrand != null && !requestingUserPartnerBrand.isEmpty()) {
            workout.setPartnerBrand(requestingUserPartnerBrand);
        }

        validateWorkoutCoherence(workout);

        Workout savedWorkout = workoutRepository.save(workout);

        if (workout.getIncludedExercises() != null) {
            for (Includes inc : workout.getIncludedExercises()) {
                inc.setWorkout(savedWorkout);
                includesRepository.save(inc);
            }
        }

        return savedWorkout;
    }

    @Transactional
    public Workout updateWorkout(Integer id, Workout details, String userBrand, String role) {
        Workout workout = workoutRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        String cleanRole = role.replace("ROLE_", "");
        if (!cleanRole.equals("ADMIN") && !workout.getPartnerBrand().equals(userBrand)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        workout.setTitle(details.getTitle());
        workout.setDescription(details.getDescription());
        workout.setDifficulty(details.getDifficulty());
        workout.setWorkoutType(details.getWorkoutType());

        workout.getIncludedExercises().clear();
        workoutRepository.save(workout);

        if (details.getIncludedExercises() != null) {
            for (Includes inc : details.getIncludedExercises()) {
                inc.setWorkout(workout);
                workout.getIncludedExercises().add(inc);
            }
        }

        validateWorkoutCoherence(workout);
        return workoutRepository.save(workout);
    }

    @Transactional
    public void deleteWorkout(Integer id, String userBrand, String role) {
        Workout workout = workoutRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        String cleanRole = role.replace("ROLE_", "");

        if (cleanRole.equals("ADMIN") || (cleanRole.equals("COACH") && workout.getPartnerBrand().equals(userBrand))) {
            workoutRepository.delete(workout);
        } else {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
    }

    public List<Workout> getWorkoutsByMaxDuration(int maxMinutes, String requestingUserPartnerBrand) {
        int maxSeconds = maxMinutes * 60;
        return getAllWorkouts(requestingUserPartnerBrand).stream()
                .filter(w -> (w.getTotalDurationInMinutes() * 60) <= maxSeconds)
                .collect(Collectors.toList());
    }

    public List<Workout> getWorkoutsByExerciseType(String exerciseType, String requestingUserPartnerBrand) {
        return getAllWorkouts(requestingUserPartnerBrand).stream()
                .filter(w -> w.getIncludedExercises().stream()
                        .anyMatch(inc -> inc.getExercise() != null
                                && inc.getExercise().getExerciseType() != null
                                && inc.getExercise().getExerciseType().equalsIgnoreCase(exerciseType)))
                .collect(Collectors.toList());
    }

    public List<WorkoutDTO> exportWorkouts(String brand) {
        List<Workout> workouts = (brand == null) ? workoutRepository.findAll()
                : workoutRepository.findByPartnerBrand(brand);
        return workouts.stream()
                .map(workoutMapper::toDTO)
                .collect(Collectors.toList());
    }

    private void validateWorkoutCoherence(Workout workout) {
        if (workout.getIncludedExercises() != null && workout.getWorkoutType() != null) {
            String expectedType = workout.getWorkoutType().toString();

            workout.getIncludedExercises().forEach(inc -> {
                Exercise ex = inc.getExercise();
                if (ex != null && ex.getExerciseType() != null && !expectedType.equalsIgnoreCase(ex.getExerciseType())) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Incohérence type");
                }
            });
        }
    }
}