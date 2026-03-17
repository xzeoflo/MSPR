package com.example.demo.services;

import com.example.demo.dto.ExerciseDTO;
import com.example.demo.mappers.ExerciseMapper;
import com.example.demo.models.Exercise;
import com.example.demo.models.Workout;
import com.example.demo.models.enums.DataStatus;
import com.example.demo.models.enums.Intensity;
import com.example.demo.repositories.ExerciseRepository;
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
class ExerciseServiceTest {

    @Mock
    private ExerciseRepository exerciseRepository;

    @Mock
    private WorkoutRepository workoutRepository;

    @Mock
    private ExerciseMapper exerciseMapper;

    @InjectMocks
    private ExerciseService exerciseService;

    @Test
    void create_ShouldSetStatusAndSource() {
        Exercise exercise = new Exercise();
        when(exerciseRepository.save(any(Exercise.class))).thenAnswer(i -> i.getArguments()[0]);

        Exercise result = exerciseService.create(exercise, "Brand", "ROLE_USER");

        assertEquals(DataStatus.APPROVED, result.getStatus());
        assertEquals("MANUAL", result.getOriginSource());
    }

    @Test
    void getAll_AsAdmin_ShouldReturnAll() {
        Exercise ex = new Exercise();
        when(exerciseRepository.findByStatus(DataStatus.APPROVED)).thenReturn(List.of(ex));

        List<Exercise> result = exerciseService.getAll("Any", "ROLE_ADMIN");

        assertEquals(1, result.size());
    }

    @Test
    void getAll_AsCoach_ShouldFilterByBrand() {
        Workout w1 = new Workout();
        w1.setPartnerBrand("Nike");

        Exercise ex1 = new Exercise();
        ex1.setWorkouts(List.of(w1));

        when(exerciseRepository.findByStatus(DataStatus.APPROVED)).thenReturn(List.of(ex1));

        List<Exercise> result = exerciseService.getAll("Nike", "ROLE_COACH");

        assertEquals(1, result.size());
    }

    @Test
    void importExercises_EmptyList_ShouldThrowException() {
        assertThrows(ResponseStatusException.class, () -> exerciseService.importExercises(new ArrayList<>()));
    }

    @Test
    void importExercises_ValidDtos_ShouldSaveAll() {
        ExerciseDTO dto = new ExerciseDTO();
        dto.setName("Pushup");
        dto.setIntensityLevel(Intensity.INTERMEDIATE);

        Exercise entity = new Exercise();
        when(exerciseMapper.toEntity(any())).thenReturn(entity);

        exerciseService.importExercises(List.of(dto));

        verify(exerciseRepository, times(1)).saveAll(any());
    }

    @Test
    void getByWorkout_AsCoach_Forbidden() {
        Workout workout = new Workout();
        workout.setPartnerBrand("Adidas");
        when(workoutRepository.findById(1)).thenReturn(Optional.of(workout));

        assertThrows(RuntimeException.class, () -> exerciseService.getByWorkout(1, "Nike", "ROLE_COACH"));
    }

    @Test
    void rejectExercise_ShouldChangeStatus() {
        Exercise exercise = new Exercise();
        when(exerciseRepository.findById(1)).thenReturn(Optional.of(exercise));

        exerciseService.rejectExercise(1);

        assertEquals(DataStatus.REJECTED, exercise.getStatus());
        verify(exerciseRepository).save(exercise);
    }

    @Test
    void validateExercise_ShouldApprove() {
        Exercise exercise = new Exercise();
        Exercise details = new Exercise();
        details.setName("New Name");

        when(exerciseRepository.findById(1)).thenReturn(Optional.of(exercise));
        when(exerciseRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        Exercise result = exerciseService.validateExercise(1, details);

        assertEquals("New Name", result.getName());
        assertEquals(DataStatus.APPROVED, result.getStatus());
    }

    @Test
    void delete_ShouldCallRepository() {
        Exercise exercise = new Exercise();
        when(exerciseRepository.findById(1)).thenReturn(Optional.of(exercise));

        exerciseService.delete(1, "Nike", "ROLE_ADMIN");

        verify(exerciseRepository).delete(exercise);
    }
}