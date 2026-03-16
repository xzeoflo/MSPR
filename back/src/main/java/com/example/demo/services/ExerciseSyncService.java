package com.example.demo.services;

import com.example.demo.dto.external.ExternalExerciseDTO;
import com.example.demo.models.Exercise;
import com.example.demo.models.enums.DataStatus;
import com.example.demo.models.enums.Intensity;
import com.example.demo.repositories.ExerciseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.FileWriter;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExerciseSyncService {

    private final ExerciseRepository exerciseRepository;
    private final RestTemplate restTemplate;
    private final String ERROR_LOG_PATH = "MSPR/logs/sync_errors.log";

    public void syncExercises() {
        String url = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json";
        try {
            MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
            converter.setSupportedMediaTypes(Collections.singletonList(MediaType.ALL));
            restTemplate.getMessageConverters().add(0, converter);

            ResponseEntity<List<ExternalExerciseDTO>> response = restTemplate.exchange(
                    url, HttpMethod.GET, null, new ParameterizedTypeReference<List<ExternalExerciseDTO>>() {
                    });

            if (response.getBody() != null) {
                response.getBody().forEach(this::processEntry);
            }
        } catch (Exception e) {
            logErrorToFile("GLOBAL_SYNC", e.getMessage());
            throw new RuntimeException("Erreur sync: " + e.getMessage());
        }
    }

    private void processEntry(ExternalExerciseDTO ext) {
        try {
            if (ext.getName() == null || exerciseRepository.existsByName(ext.getName()))
                return;

            Exercise ex = new Exercise();
            ex.setName(ext.getName());

            if (ext.getInstructions() != null) {
                ex.setDescription(String.join(" ", ext.getInstructions()));
            }

            ex.setExerciseType(ext.getCategory() != null ? ext.getCategory().toUpperCase() : "STRENGTH");
            ex.setIntensityLevel(mapLevelToIntensity(ext.getLevel()));

            ex.setOriginSource("EXTERNAL_API");
            ex.setStatus(DataStatus.PENDING);

            List<String> equipment = new ArrayList<>();
            if (ext.getEquipment() != null)
                equipment.add(ext.getEquipment());
            ex.setExerciseEquipments(equipment);

            ex.setDurationInSeconds(0);
            ex.setCaloriesBurned(0);
            ex.setRepetitions(0);
            ex.setSets(0);

            exerciseRepository.save(ex);

            System.out.println("Synchronisé (Pending): " + ex.getName());

        } catch (Exception e) {
            logErrorToFile(ext.getName(), e.getMessage());
        }
    }

    private Intensity mapLevelToIntensity(String level) {
        if (level == null)
            return Intensity.INTERMEDIATE;
        return switch (level.toLowerCase()) {
            case "beginner" -> Intensity.BEGINNER;
            case "expert" -> Intensity.ADVANCED;
            default -> Intensity.INTERMEDIATE;
        };
    }

    private void logErrorToFile(String name, String error) {
        try (FileWriter fw = new FileWriter(ERROR_LOG_PATH, true);
                PrintWriter pw = new PrintWriter(fw)) {
            pw.println("[" + LocalDateTime.now() + "] ERROR: " + name + " | " + error);
        } catch (Exception ignored) {
        }
    }
}
