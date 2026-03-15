package com.example.demo.controllers;

import com.example.demo.dto.ReferenceImportDTO;
import com.example.demo.services.HealthReferenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/import")
@RequiredArgsConstructor
public class ImportController {

    private final HealthReferenceService healthReferenceService;

    @PostMapping("/references")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> importRefs(@RequestBody List<ReferenceImportDTO> data) {
        healthReferenceService.importJsonData(data);
        return ResponseEntity.ok("Importation de " + data.size() + " références réussie.");
    }
}