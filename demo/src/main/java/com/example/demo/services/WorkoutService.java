package com.example.demo.services;

import com.example.demo.models.Workout;
import com.example.demo.models.User;
import com.example.demo.repositories.WorkoutRepository;
import com.example.demo.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkoutService {

    private final WorkoutRepository workoutRepository;
    private final UserRepository userRepository;

    public WorkoutService(WorkoutRepository workoutRepository, UserRepository userRepository) {
        this.workoutRepository = workoutRepository;
        this.userRepository = userRepository;
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
        workout.setPartnerBrand(requestingUserPartnerBrand);

        if (workout.getExercises() != null) {
            workout.getExercises().forEach(exercise -> exercise.setWorkout(workout));
        }

        return workoutRepository.save(workout);
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
        if (birthDate == null) return 0;
        return Period.between(birthDate, LocalDate.now()).getYears();
    }

    public List<Workout> getWorkoutsByMaxDuration(int maxMinutes, String requestingUserPartnerBrand) {
        int maxSeconds = maxMinutes * 60;

        return getAllWorkouts(requestingUserPartnerBrand).stream()
                .filter(w -> w.getTotalDurationInSeconds() <= maxSeconds)
                .collect(Collectors.toList());
    }

    public List<Workout> getWorkoutsByDifficulty(String difficulty, String requestingUserPartnerBrand) {
        return getAllWorkouts(requestingUserPartnerBrand).stream()
                .filter(w -> w.getDifficulty().equalsIgnoreCase(difficulty))
                .collect(Collectors.toList());
    }
}