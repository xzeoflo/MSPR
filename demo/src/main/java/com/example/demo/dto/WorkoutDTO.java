package com.example.demo.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;

@Data
public class WorkoutDTO {
    @NotBlank(message = "title is required")
    private String title;

    private String description;

    @Pattern(regexp = "^(Beginner|Intermediate|Advanced)$", message = "Difficulty invalid")
    private String difficulty;

    @NotBlank(message = "workoutType is required")
    private String workoutType;

    private String partnerBrand;

    private Integer totalCalories;
    private Integer totalDuration;

    @NotEmpty(message = "workout must contain at least 1 exercise")
    private List<ExerciseDTO> exercises;
}