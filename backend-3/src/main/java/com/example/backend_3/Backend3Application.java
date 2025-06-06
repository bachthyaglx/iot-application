package com.example.backend_3;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableAsync
@EnableScheduling 
public class Backend3Application {
    public static void main(String[] args) {
        SpringApplication.run(Backend3Application.class, args);
    }
}