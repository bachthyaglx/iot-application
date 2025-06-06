package com.example.backend_3.redis;

import com.example.backend_3.exception.RedisPublishException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;

import redis.clients.jedis.Jedis;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

public class RedisPublisher {

  @Value("${REDIS_URL}")
  private static String redisUrl;

  private static final Logger logger = LoggerFactory.getLogger(RedisPublisher.class);

  public static void main(String[] args) {
    try (Jedis jedis = new Jedis(URI.create(redisUrl))) {
      ObjectMapper mapper = new ObjectMapper();

      while (!Thread.currentThread().isInterrupted()) {
        publishOnce(jedis, mapper);
      }

    } catch (RedisPublishException e) {
      logger.error(e.getMessage(), e);
    } catch (Exception e) {
      logger.error("❌ Fatal Redis connection error", e);
    }
  }

  private static void publishOnce(Jedis jedis, ObjectMapper mapper) {
    try {
      Map<String, Object> data = new HashMap<>();
      data.put("value", Math.round(Math.random() * 1000) / 10.0);
      data.put("timestamp", System.currentTimeMillis());

      String json = mapper.writeValueAsString(data);
      jedis.publish("sensor:temperature", json);

      logger.info("📤 Published to Redis: {}", json);
      Thread.sleep(1000);
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      logger.warn("⏹️ Publisher thread interrupted", e);
    } catch (Exception e) {
      throw new RedisPublishException("❌ Failed to publish to Redis", e);
    }
  }
}
