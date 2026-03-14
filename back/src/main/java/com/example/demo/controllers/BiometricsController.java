package com.example.demo.controllers;

import com.example.demo.models.Biometrics;
import com.example.demo.models.User;
import com.example.demo.services.BiometricsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/biometrics")
public class BiometricsController {

    private final BiometricsService biometricsService;

    public BiometricsController(BiometricsService biometricsService) {
        this.biometricsService = biometricsService;
    }

    private String getRequestingUserPartner(Principal principal) {
        if (principal instanceof Authentication authentication) {
            Object userPrincipal = authentication.getPrincipal();
            if (userPrincipal instanceof User user) {
                return user.getPartnerBrand();
            }
        }
        return null;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<List<Biometrics>> getAllBiometrics(Principal principal) {
        String brand = getRequestingUserPartner(principal);
        return ResponseEntity.ok(biometricsService.getAllBiometrics(brand));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH', 'CLIENT')")
    public ResponseEntity<List<Biometrics>> getBiometricsByUserId(@PathVariable Integer userId, Principal principal) {
        String brand = getRequestingUserPartner(principal);
        return ResponseEntity.ok(biometricsService.getBiometricsByUserId(userId, brand));
    }

    @PostMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public ResponseEntity<Biometrics> createBiometrics(@PathVariable Integer userId, @RequestBody Biometrics biometrics,
            Principal principal) {
        String brand = getRequestingUserPartner(principal);
        return ResponseEntity.status(201).body(biometricsService.createBiometrics(userId, biometrics, brand));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public ResponseEntity<Biometrics> updateBiometrics(@PathVariable Integer id, @RequestBody Biometrics biometrics,
            Principal principal) {
        String brand = getRequestingUserPartner(principal);
        return ResponseEntity.ok(biometricsService.updateBiometrics(id, biometrics, brand));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBiometrics(@PathVariable Integer id, Principal principal) {
        String brand = getRequestingUserPartner(principal);
        biometricsService.deleteBiometrics(id, brand);
        return ResponseEntity.noContent().build();
    }
}
