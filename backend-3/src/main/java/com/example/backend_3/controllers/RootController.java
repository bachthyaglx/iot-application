package com.example.backend_3.controllers;

import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
public class RootController {

    @GetMapping("/")
    public Map<String, Object> listAllEndpoints() {
        List<String> endpoints = List.of(
            "/api/information",
            "/api/information/{id}",
            "/api/picture",
            "/api/picture/{id}",
            "/api/data",
            "/api/data/{id}"
        );

        Map<String, Object> response = new HashMap<>();
        response.put("available_endpoints", endpoints);
        response.put("total", endpoints.size());
        return response;
    }
}
