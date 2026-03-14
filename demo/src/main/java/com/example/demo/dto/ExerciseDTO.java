package com.example.demo.dto;

import com.example.demo.models.enums.Intensity;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ExerciseDTO {
    @NotBlank(message = "name of exercise is required")
    @Size(max = 100)
    private String name;

    private String description;

    @PositiveOrZero(message = "duration must be positive")
    private Integer durationInSeconds = 0;

    @PositiveOrZero(message = "repetition must be positive")
    private Integer repetitions = 0;

    @PositiveOrZero(message = "sets must be positive")
    private Integer sets = 0;

    @PositiveOrZero(message = "calories must be positive")
    private Integer caloriesBurned = 0;

    @Pattern(regexp = "^(Low|Medium|High|Very High)$", message = "Intensity invalid")
    private Intensity intensityLevel;

    @NotBlank(message = "exerciseType is required")
    private String exerciseType;

    @Min(1)
    private Integer sequenceOrder;
}
