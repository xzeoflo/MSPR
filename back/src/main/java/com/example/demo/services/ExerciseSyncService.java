package com.example.demo.services;

import com.example.demo.dto.external.ExternalApiResponse;
import com.example.demo.dto.external.ExternalExerciseDTO;
import com.example.demo.models.Exercise;
import com.example.demo.models.enums.DataStatus;
import com.example.demo.models.enums.Intensity;
import com.example.demo.repositories.ExerciseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.FileWriter;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class ExerciseSyncService {

    private final ExerciseRepository exerciseRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final String ERROR_LOG_PATH = "MSPR/logs/sync_errors.log";

    public void syncExercises() {
        String url = "https://exercisedbv2.ascendapi.com/api/v1/exercises?limit=25";
        try {
            Files.createDirectories(Paths.get("MSPR/logs"));
            ExternalApiResponse response = restTemplate.getForObject(url, ExternalApiResponse.class);

            if (response != null && response.getData() != null) {
                for (ExternalExerciseDTO ext : response.getData()) {
                    processEntry(ext);
                }
            }
        } catch (Exception e) {
            logErrorToFile("GLOBAL_SYNC", e.getMessage());
        }
    }

    private void processEntry(ExternalExerciseDTO ext) {
        try {
            if (exerciseRepository.existsByName(ext.getName())) return;

            Exercise exercise = new Exercise();
            exercise.setName(ext.getName());
            exercise.setExerciseType(ext.getExerciseType());
            exercise.setExerciseEquipments(new ArrayList<>(ext.getEquipments()));
            exercise.setStatus(DataStatus.APPROVED);
            exerciseRepository.save(exercise);
        } catch (Exception e) {
            logErrorToFile(ext.getName(), e.getMessage());
            createTemporaryExercise(ext);
        }
    }

    private void createTemporaryExercise(ExternalExerciseDTO ext) {
        Exercise temp = new Exercise();
        temp.setName(ext.getName() != null ? ext.getName() : "TEMP_" + LocalDateTime.now());
        temp.setStatus(DataStatus.PENDING);
        temp.setExerciseType("A_VALIDER");
        exerciseRepository.save(temp);
    }

    private void logErrorToFile(String name, String error) {
        try (FileWriter fw = new FileWriter(ERROR_LOG_PATH, true);
             PrintWriter pw = new PrintWriter(fw)) {
            pw.println("[" + LocalDateTime.now() + "] ERROR: " + name + " | " + error);
        } catch (Exception ignored) {}
    }
}