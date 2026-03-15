package com.example.demo.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;

import com.example.demo.models.enums.Intensity;
import com.example.demo.models.enums.WorkoutType;

@Data
public class WorkoutDTO {
    @NotBlank(message = "title is required")
    private String title;

    private String description;

    @NotNull(message = "Difficulty is required")
    private Intensity difficulty;

    @NotNull(message = "workoutType is required")
    private WorkoutType workoutType;

    private String partnerBrand;

    private Integer totalCalories;
    private Integer totalDuration;

    @NotEmpty(message = "workout must contain at least 1 exercise")
    private List<ExerciseDTO> exercises;
}
