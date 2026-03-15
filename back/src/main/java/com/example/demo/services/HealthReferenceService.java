package com.example.demo.services;

import com.example.demo.dto.ReferenceImportDTO;
import com.example.demo.models.User;
import com.example.demo.models.HealthProfile;
import com.example.demo.models.Biometrics;
import com.example.demo.models.enums.SubscriptionTier;
import com.example.demo.repositories.UserRepository;
import com.example.demo.repositories.HealthProfileRepository;
import com.example.demo.repositories.BiometricsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HealthReferenceService {

    private final UserRepository userRepository;
    private final HealthProfileRepository healthProfileRepository;
    private final BiometricsRepository biometricsRepository;

    @Transactional
    public void importJsonData(List<ReferenceImportDTO> dtos) {
        for (ReferenceImportDTO dto : dtos) {
            User user = new User();
            user.setFirstName(dto.getID().substring(0, 5));
            user.setGender(dto.getGender());
            user.setActivityLevel(dto.getActivityLevel());
            user.setSubscriptionTier(SubscriptionTier.REFERENCE);
            user.setPartnerBrand("SYSTEM");
            user.setEmail(dto.getID() + "@reference.com");
            user.setPassword("EXTERNAL_REF");
            user = userRepository.save(user);

            HealthProfile profile = new HealthProfile();
            profile.setDiseaseType(dto.getCondition());
            profile.setDiseaseSeverity(dto.getSeverity());
            profile.setDietaryRecommendation("Daily Calories: " + dto.getCalories());
            profile.setUser(user);
            healthProfileRepository.save(profile);

            Biometrics bio = new Biometrics();
            bio.setWeightKg(dto.getWeight());
            bio.setHeightCm(dto.getHeight() != null ? dto.getHeight().doubleValue() : 0.0);
            bio.setMeasuredAt(LocalDate.now());
            bio.setUser(user);
            biometricsRepository.save(bio);
        }
    }
}