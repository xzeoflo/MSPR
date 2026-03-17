package com.example.demo.services;

import com.example.demo.dto.WorkoutDTO;
import com.example.demo.mappers.WorkoutMapper;
import com.example.demo.models.Exercise;
import com.example.demo.models.Workout;
import com.example.demo.models.enums.WorkoutType;
import com.example.demo.repositories.ExerciseRepository;
import com.example.demo.repositories.UserRepository;
import com.example.demo.repositories.WorkoutRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WorkoutServiceTest {

    @Mock private WorkoutRepository workoutRepository;
    @Mock private ExerciseRepository exerciseRepository;
    @Mock private WorkoutMapper workoutMapper;
    @Mock private UserRepository userRepository;

    @InjectMocks private WorkoutService workoutService;

    @Test
    void createWorkout_InconsistentType_ShouldThrowException() {
        // 1. Préparation du Workout et de l'exercice incohérent
        Workout workout = new Workout();
        workout.setWorkoutType(WorkoutType.CARDIO);

        Exercise ex = new Exercise();
        ex.setName("Heavy Squat");
        ex.setExerciseType("STRENGTH");
        workout.setExercises(List.of(ex));

        // 2. Mock du repository pour éviter le NullPointerException
        // On simule que l'exercice existe déjà ou est sauvegardé
        when(exerciseRepository.findByName("Heavy Squat")).thenReturn(Optional.of(ex));

        // 3. Vérification que l'exception ResponseStatusException est bien lancée
        assertThrows(ResponseStatusException.class, () ->
                workoutService.createWorkout(workout, "Nike")
        );
    }

    @Test
    void createWorkout_ConsistentType_ShouldSave() {
        Workout workout = new Workout();
        workout.setWorkoutType(WorkoutType.STRENGTH);

        Exercise ex = new Exercise();
        ex.setName("Bench Press");
        ex.setExerciseType("STRENGTH");
        workout.setExercises(List.of(ex));

        // Mocks indispensables pour passer les étapes du service
        when(exerciseRepository.findByName("Bench Press")).thenReturn(Optional.of(ex));
        when(workoutRepository.save(any(Workout.class))).thenReturn(workout);

        Workout result = workoutService.createWorkout(workout, "Nike");

        assertNotNull(result);
        verify(workoutRepository).save(any(Workout.class));
    }

    @Test
    void deleteWorkout_AsCoach_UnauthorizedBrand_ShouldFail() {
        Workout workout = new Workout();
        workout.setPartnerBrand("Adidas");
        when(workoutRepository.findById(1)).thenReturn(Optional.of(workout));

        assertThrows(ResponseStatusException.class, () ->
                workoutService.deleteWorkout(1, "Nike", "ROLE_COACH")
        );
    }
}