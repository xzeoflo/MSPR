package com.example.demo.services;

import com.example.demo.models.HealthProfile;
import com.example.demo.models.User;
import com.example.demo.repositories.HealthProfileRepository;
import com.example.demo.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class HealthProfileService {

    private final HealthProfileRepository healthProfileRepository;
    private final UserRepository userRepository;

    public HealthProfileService(HealthProfileRepository healthProfileRepository, UserRepository userRepository) {
        this.healthProfileRepository = healthProfileRepository;
        this.userRepository = userRepository;
    }

    public List<HealthProfile> getAllProfiles(String brand) {
        return healthProfileRepository.findAllByBrand(brand);
    }

    public HealthProfile getProfileById(Integer id, String brand) {
        HealthProfile profile = healthProfileRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (brand != null && !brand.equals(profile.getUser().getPartnerBrand())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        return profile;
    }

    public HealthProfile createProfile(Integer userId, HealthProfile profile, String brand) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (brand != null && !brand.equals(user.getPartnerBrand())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        if (healthProfileRepository.findByUserId(userId).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User already has a health profile");
        }

        profile.setUser(user);
        return healthProfileRepository.save(profile);
    }

    public HealthProfile updateProfile(Integer id, HealthProfile details, String brand) {
        HealthProfile profile = getProfileById(id, brand);

        if (details.getDiseaseType() != null)
            profile.setDiseaseType(details.getDiseaseType());
        if (details.getDiseaseSeverity() != null)
            profile.setDiseaseSeverity(details.getDiseaseSeverity());
        if (details.getBloodPressureAvg() != null)
            profile.setBloodPressureAvg(details.getBloodPressureAvg());
        if (details.getBloodGlucoseMg() != null)
            profile.setBloodGlucoseMg(details.getBloodGlucoseMg());
        if (details.getCholesterolMgDl() != null)
            profile.setCholesterolMgDl(details.getCholesterolMgDl());
        if (details.getDietaryRestrictions() != null)
            profile.setDietaryRestrictions(details.getDietaryRestrictions());
        if (details.getAllergies() != null)
            profile.setAllergies(details.getAllergies());
        if (details.getDietaryRecommendation() != null)
            profile.setDietaryRecommendation(details.getDietaryRecommendation());

        return healthProfileRepository.save(profile);
    }

    public void deleteProfile(Integer id, String brand) {
        HealthProfile profile = getProfileById(id, brand);
        healthProfileRepository.delete(profile);
    }
}
