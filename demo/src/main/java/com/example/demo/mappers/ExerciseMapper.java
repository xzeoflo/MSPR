package com.example.demo.mappers;

import com.example.demo.dto.ExerciseDTO;
import com.example.demo.models.Exercise;
import com.example.demo.models.enums.Intensity;

import org.springframework.stereotype.Component;

@Component
public class ExerciseMapper {

    public ExerciseDTO toDTO(Exercise entity) {
        if (entity == null)
            return null;
        ExerciseDTO dto = new ExerciseDTO();
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setDurationInSeconds(entity.getDurationInSeconds());
        dto.setRepetitions(entity.getRepetitions());
        dto.setSets(entity.getSets());
        dto.setCaloriesBurned(entity.getCaloriesBurned());
        dto.setIntensityLevel(entity.getIntensityLevel());
        dto.setExerciseType(entity.getExerciseType());
        dto.setSequenceOrder(entity.getSequenceOrder());
        return dto;
    }

    public Exercise toEntity(ExerciseDTO dto) {
        if (dto == null)
            return null;
        Exercise exercise = new Exercise();

        exercise.setName(dto.getName() != null ? dto.getName() : "Sans nom");
        exercise.setDescription(dto.getDescription());
        exercise.setDurationInSeconds(dto.getDurationInSeconds() != null ? dto.getDurationInSeconds() : 0);
        exercise.setRepetitions(dto.getRepetitions() != null ? dto.getRepetitions() : 0);
        exercise.setSets(dto.getSets() != null ? dto.getSets() : 0);
        exercise.setCaloriesBurned(dto.getCaloriesBurned() != null ? dto.getCaloriesBurned() : 0);
        exercise.setIntensityLevel(dto.getIntensityLevel() != null ? dto.getIntensityLevel() : Intensity.INTERMEDIATE);
        exercise.setExerciseType(dto.getExerciseType());
        exercise.setSequenceOrder(dto.getSequenceOrder() != null ? dto.getSequenceOrder() : 1);

        return exercise;
    }
}
