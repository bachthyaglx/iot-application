package com.example.backend_3.redis;

import com.example.backend_3.websocket.DataWebSocketHandler;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RedisSubscriber implements MessageListener {

    private static final Logger logger = LoggerFactory.getLogger(RedisSubscriber.class);
    private static final ObjectMapper objectMapper = new ObjectMapper();

    private static final Map<String, Map<String, Object>> latestDataMap = new ConcurrentHashMap<>();

    public static Map<String, Map<String, Object>> getAll() {
        return latestDataMap;
    }

    public static Map<String, Object> getData(String type) {
        return latestDataMap.getOrDefault(type, Map.of());
    }

    @Override
    public void onMessage(@NonNull Message message, @Nullable byte[] pattern) {
        try {
            String channel = new String(message.getChannel());  // e.g., sensor:temperature
            String sensorType = channel.replace("sensor:", "");
            String json = new String(message.getBody());

            Map<String, Object> parsed = objectMapper.readValue(json, new TypeReference<>() {});
            latestDataMap.put(sensorType, parsed);

            // Push real-time to WebSocket
            String payload = objectMapper.writeValueAsString(Map.of(sensorType, parsed));
            DataWebSocketHandler.broadcast(payload);

        } catch (JsonProcessingException e) {
            logger.error("❌ Invalid JSON format received from Redis", e);
        } catch (Exception e) {
            logger.error("❌ RedisSubscriber error", e);
        }
    }
}
