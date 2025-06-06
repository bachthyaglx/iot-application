package com.example.backend_3.simulator;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Random;

@Component
public class DataSimulator {

    private static final Logger logger = LoggerFactory.getLogger(DataSimulator.class);

    private static final String FIELD_VALUE = "value";
    private static final String FIELD_TIMESTAMP = "timestamp";

    private final StringRedisTemplate redisTemplate;
    private final Random random = new Random();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public DataSimulator(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    private double generateValue() {
        return Math.round((10 + random.nextDouble() * 90) * 10.0) / 10.0;
    }

    @Scheduled(fixedRate = 1000)
    public void publishAllSensors() {
        try {
            double timestamp = System.currentTimeMillis() / 1000.0;

            Map<String, Object> temperature = Map.of(FIELD_VALUE, generateValue(), FIELD_TIMESTAMP, timestamp);
            Map<String, Object> humidity = Map.of(FIELD_VALUE, generateValue(), FIELD_TIMESTAMP, timestamp);
            Map<String, Object> voltage = Map.of(FIELD_VALUE, generateValue(), FIELD_TIMESTAMP, timestamp);

            redisTemplate.convertAndSend("sensor:temperature", objectMapper.writeValueAsString(temperature));
            redisTemplate.convertAndSend("sensor:humidity", objectMapper.writeValueAsString(humidity));
            redisTemplate.convertAndSend("sensor:voltage", objectMapper.writeValueAsString(voltage));

        } catch (Exception e) {
            logger.error("❌ Failed to publish sensor data", e);
        }
    }
}
