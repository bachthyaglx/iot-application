package com.example.backend_3.controllers;

import com.example.backend_3.exception.SensorDataSerializationException;
import com.example.backend_3.redis.RedisSubscriber;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class SensorDataController {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping("/data")
    public String getAllSensorData() {
        try {
            return objectMapper.writeValueAsString(RedisSubscriber.getAll());
        } catch (Exception e) {
            throw new SensorDataSerializationException("Failed to serialize sensor data", e);
        }
    }

    @GetMapping("/data/{type}")
    public String getSensorData(@PathVariable String type) {
        try {
            return objectMapper.writeValueAsString(RedisSubscriber.getData(type));
        } catch (Exception e) {
            throw new SensorDataSerializationException("Failed to serialize sensor data for type: " + type, e);
        }
    }
}
