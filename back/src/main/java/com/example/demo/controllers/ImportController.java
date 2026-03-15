package com.example.demo.controllers;

import com.example.demo.dto.ReferenceImportDTO;
import com.example.demo.services.HealthReferenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/import")
@RequiredArgsConstructor
public class ImportController {

    private final HealthReferenceService healthReferenceService;

    @PostMapping(value = "/references", consumes = "application/json")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> importRefsJson(@RequestBody List<ReferenceImportDTO> data) {
        healthReferenceService.importJsonData(data);
        return ResponseEntity.ok("Import JSON réussi : " + data.size() + " lignes traitées.");
    }

    @PostMapping(value = "/references", consumes = "multipart/form-data")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> importRefsCsv(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Le fichier CSV est vide.");
        }
        try {
            int count = healthReferenceService.importCsvData(file);
            return ResponseEntity.ok("Import CSV réussi : " + count + " lignes traitées.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erreur CSV : " + e.getMessage());
        }
    }
}