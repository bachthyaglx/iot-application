package com.example.backend_3.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class InformationService {

  private final StringRedisTemplate redisTemplate;
  private final JdbcTemplate jdbcTemplate;
  private final ObjectMapper objectMapper = new ObjectMapper();
  private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(InformationService.class);
  private final String redisKey;

  public InformationService(
    StringRedisTemplate redisTemplate,
    JdbcTemplate jdbcTemplate,
    @Value("${DEVICE_NAME}") String serverUrl
  ) {
    this.redisTemplate = redisTemplate;
    this.jdbcTemplate = jdbcTemplate;

    // Sử dụng base URL từ properties để đặt tên cache key
    this.redisKey = "information:" + serverUrl;
    logger.info("✅ Redis key set to: {}", this.redisKey);
  }

  public Map<String, Object> getInformation() {
    try {
      // 1️⃣ Lấy từ Redis nếu có
      String cached = redisTemplate.opsForValue().get(redisKey);
      if (cached != null) {
          return objectMapper.readValue(cached, new TypeReference<>() {});
      }

      // 2️⃣ Nếu không có, lấy từ MySQL
      Map<String, Object> info = jdbcTemplate.queryForMap("""
          SELECT deviceClass, manufacturer, manufacturerUri, model,
                productCode, hardwareRevision, softwareRevision, serialNumber,
                productInstanceUri, webshopUri, sysDescr, sysName,
                sysContact, sysLocation
          FROM information
          LIMIT 1
      """);

      // 3️⃣ Cache lại vào Redis
      String json = objectMapper.writeValueAsString(info);
      redisTemplate.opsForValue().set(redisKey, json);

      return info;

    } catch (Exception e) {
      logger.error("❌ Failed to fetch system information", e);
      throw new RuntimeException("❌ Failed to fetch system information", e);
    }
  }

  public void updateInformation(String key, Object value) {
    try {
        // 1️⃣ Cập nhật vào MySQL (giả định bảng 'information' chỉ có 1 dòng)
        String sql = "UPDATE information SET " + key + " = ? LIMIT 1";
        jdbcTemplate.update(sql, value);

        // 2️⃣ Xoá cache Redis để lần sau sẽ đọc lại DB mới
        redisTemplate.delete(redisKey);

        logger.info("✅ Updated '{}' in MySQL with value '{}', cache cleared.", key, value);

    } catch (Exception e) {
        logger.error("❌ Failed to update key: {}", key, e);
        throw new RuntimeException("Failed to update key: " + key, e);
    }
  }
}
