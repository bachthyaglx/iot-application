package com.example.backend_3.controllers;

import com.example.backend_3.service.InformationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class InformationController {

    private final InformationService informationService;

    public InformationController(InformationService informationService) {
        this.informationService = informationService;
    }

    @GetMapping("/information")
    public Map<String, Object> getInformation() {
        return informationService.getInformation();
    }

    @PutMapping("/information")
    public ResponseEntity<?> updateInformation(@RequestBody Map<String, Object> payload) {
        if (payload.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No data provided"));
        }

        payload.forEach((key, value) -> informationService.updateInformation(key, value));

        return ResponseEntity.ok(Map.of(
            "message", "Information updated successfully",
            "updated", payload
        ));
    }
}

