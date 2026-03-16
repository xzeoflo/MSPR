package com.example.demo.dto.external;

import lombok.Data;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ExternalExerciseDTO {
    private String name;
    private String level;
    private String equipment;
    private String category;
    private List<String> primaryMuscles;
    private List<String> instructions;

    public String getDescriptionFromInstructions() {
        if (instructions == null || instructions.isEmpty())
            return "";
        return String.join(" ", instructions);
    }
}
