package com.example.demo.config;

import com.example.demo.services.ExerciseSyncService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
public class IngestionTriggerConfig {

    @Bean
    @Profile("ingestion") // S'active grâce au script Bash existant
    public CommandLineRunner runIngestion(ExerciseSyncService syncService) {
        return args -> {
            System.out.println(">>> PROFIL INGESTION DÉTECTÉ : Lancement de la synchro...");
            syncService.syncExercises();
            System.out.println(">>> SYNCHRO TERMINÉE.");
        };
    }
}