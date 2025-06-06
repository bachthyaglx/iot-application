package com.example.backend_3.config;

import com.example.backend_3.redis.RedisSubscriber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.*;
import org.springframework.data.redis.connection.lettuce.*;
import org.springframework.data.redis.listener.*;

import java.net.URI;

@Configuration
public class RedisConfig {

    @Value("${REDIS_URL}")
    private String redisUrl;

    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        RedisStandaloneConfiguration config = new RedisStandaloneConfiguration();
        URI uri = URI.create(redisUrl);

        config.setHostName(uri.getHost());
        config.setPort(uri.getPort());

        String userInfo = uri.getUserInfo();
        // If userInfo is not null and contains a colon, split it into username and password
        if (userInfo != null && userInfo.contains(":")) {
            String[] parts = userInfo.split(":");
            config.setUsername(parts[0]);
            config.setPassword(parts[1]);
        }

        return new LettuceConnectionFactory(config);
    }

    @Bean
    public RedisMessageListenerContainer container(RedisConnectionFactory factory, RedisSubscriber subscriber) {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(factory);

        container.addMessageListener(subscriber, new ChannelTopic("sensor:temperature"));
        container.addMessageListener(subscriber, new ChannelTopic("sensor:humidity"));
        container.addMessageListener(subscriber, new ChannelTopic("sensor:voltage"));

        return container;
    }
}
