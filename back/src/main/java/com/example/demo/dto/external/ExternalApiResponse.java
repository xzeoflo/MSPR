package com.example.demo.dto.external;

import lombok.Data;
import java.util.List;

@Data
public class ExternalApiResponse {
    private boolean success;
    private List<ExternalExerciseDTO> data;
}

