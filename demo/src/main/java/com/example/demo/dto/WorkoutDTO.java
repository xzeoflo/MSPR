package com.example.demo.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;

import com.example.demo.models.Workout;
import com.example.demo.models.enums.Intensity;

@Data
public class WorkoutDTO {
    @NotBlank(message = "title is required")
    private String title;

    private String description;

    @Pattern(regexp = "^(Beginner|Intermediate|Advanced)$", message = "Difficulty invalid")
    private String difficulty;

    @NotBlank(message = "workoutType is required")
    private Intensity workoutType;

    private String partnerBrand;

    private Integer totalCalories;
    private Integer totalDuration;

    @NotEmpty(message = "workout must contain at least 1 exercise")
    private List<ExerciseDTO> exercises;
}
