package com.example.demo.dto.external;

import lombok.Data;
import java.util.List;

@Data
public class ExternalExerciseDTO {
    private String name;
    private String exerciseType;
    private List<String> equipments;
    private List<String> bodyParts;
    private List<String> targetMuscles;
}
