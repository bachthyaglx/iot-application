package com.example.backend_3.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SensorData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sensorType;

    @Column(name = "data_value")  // ✅ đổi tên cột tránh từ khóa
    private Double value;

    private Long timestamp;
}
