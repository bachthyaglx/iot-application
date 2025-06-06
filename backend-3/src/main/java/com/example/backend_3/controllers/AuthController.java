package com.example.backend_3.controllers;

import com.example.backend_3.auth.JwtUtil;
import com.example.backend_3.models.User;
import com.example.backend_3.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final UserRepository userRepo;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepo, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> payload) {
      String username = payload.get("username");
      String rawPassword = payload.get("password");

      User user = userRepo.findByUsername(username);
      if (user == null || !passwordEncoder.matches(rawPassword, user.getPassword())) {
          return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
      }

      String token = jwtUtil.generateToken(username);
      return ResponseEntity.ok(Map.of(
        "token", "Bearer " + token
      ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        // Stateless logout
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}
