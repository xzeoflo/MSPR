package com.example.demo.services;

import com.example.demo.models.Biometrics;
import com.example.demo.models.User;
import com.example.demo.repositories.BiometricsRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class BiometricsService {

    private final BiometricsRepository biometricsRepository;
    private final UserService userService;

    public BiometricsService(BiometricsRepository biometricsRepository, UserService userService) {
        this.biometricsRepository = biometricsRepository;
        this.userService = userService;
    }

    public List<Biometrics> getAllBiometrics(String requestingUserPartnerBrand) {
        if (requestingUserPartnerBrand == null || requestingUserPartnerBrand.isEmpty()) {
            return biometricsRepository.findAll();
        }
        return biometricsRepository.findAll().stream()
                .filter(b -> requestingUserPartnerBrand.equals(b.getUser().getPartnerBrand()))
                .toList();
    }

    public List<Biometrics> getBiometricsByUserId(Integer userId, String requestingUserPartnerBrand) {
        User user = userService.getUserById(userId, requestingUserPartnerBrand);
        return biometricsRepository.findByUserId(user.getId());
    }

    public Biometrics createBiometrics(Integer userId, Biometrics biometrics, String requestingUserPartnerBrand) {
        User user = userService.getUserById(userId, requestingUserPartnerBrand);
        biometrics.setUser(user);
        if (biometrics.getMeasuredAt() == null) {
            biometrics.setMeasuredAt(LocalDate.now());
        }
        return biometricsRepository.save(biometrics);
    }

    public Biometrics updateBiometrics(Integer id, Biometrics details, String requestingUserPartnerBrand) {
        Biometrics biometrics = biometricsRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Biometrics not found"));

        if (requestingUserPartnerBrand != null && !requestingUserPartnerBrand.equals(biometrics.getUser().getPartnerBrand())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        if (details.getWeightKg() != null) biometrics.setWeightKg(details.getWeightKg());
        if (details.getHeightCm() != null) biometrics.setHeightCm(details.getHeightCm());
        if (details.getHeartRate() != null) biometrics.setHeartRate(details.getHeartRate());
        if (details.getMeasuredAt() != null) biometrics.setMeasuredAt(details.getMeasuredAt());

        return biometricsRepository.save(biometrics);
    }

    public void deleteBiometrics(Integer id, String requestingUserPartnerBrand) {
        Biometrics biometrics = biometricsRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Biometrics not found"));

        if (requestingUserPartnerBrand != null && !requestingUserPartnerBrand.equals(biometrics.getUser().getPartnerBrand())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        biometricsRepository.delete(biometrics);
    }
}