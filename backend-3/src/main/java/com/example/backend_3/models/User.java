package com.example.backend_3.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user") // Quan trọng nếu MySQL table là `user`
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;
}
