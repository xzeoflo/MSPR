package com.example.demo.controllers;

import com.example.demo.models.HealthProfile;
import com.example.demo.models.User;
import com.example.demo.services.HealthProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/health-profiles")
public class HealthProfileController {

    private final HealthProfileService healthProfileService;

    public HealthProfileController(HealthProfileService healthProfileService) {
        this.healthProfileService = healthProfileService;
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
    public ResponseEntity<List<HealthProfile>> getAll(Principal principal) {
        String brand = getRequestingUserPartner(principal);
        return ResponseEntity.ok(healthProfileService.getAllProfiles(brand));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH', 'CLIENT')")
    public ResponseEntity<HealthProfile> getById(@PathVariable Integer id, Principal principal) {
        String brand = getRequestingUserPartner(principal);
        return ResponseEntity.ok(healthProfileService.getProfileById(id, brand));
    }

    @PostMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public ResponseEntity<HealthProfile> create(@PathVariable Integer userId, @RequestBody HealthProfile profile,
            Principal principal) {
        String brand = getRequestingUserPartner(principal);
        return ResponseEntity.status(201).body(healthProfileService.createProfile(userId, profile, brand));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public ResponseEntity<HealthProfile> update(@PathVariable Integer id, @RequestBody HealthProfile profile,
            Principal principal) {
        String brand = getRequestingUserPartner(principal);
        return ResponseEntity.ok(healthProfileService.updateProfile(id, profile, brand));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Integer id, Principal principal) {
        String brand = getRequestingUserPartner(principal);
        healthProfileService.deleteProfile(id, brand);
        return ResponseEntity.noContent().build();
    }
}
