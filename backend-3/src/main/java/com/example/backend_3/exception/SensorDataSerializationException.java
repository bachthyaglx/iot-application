package com.example.backend_3.exception;

public class SensorDataSerializationException extends RuntimeException {
    public SensorDataSerializationException(String message, Throwable cause) {
        super(message, cause);
    }
}