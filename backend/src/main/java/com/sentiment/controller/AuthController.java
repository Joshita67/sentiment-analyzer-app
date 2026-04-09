package com.sentiment.controller;

import com.sentiment.dto.AuthRequest;
import com.sentiment.model.User;
import com.sentiment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    
    // Simple in-memory token map instead of complex JWT setup for beginner ease
    public static final ConcurrentHashMap<String, Long> tokenStore = new ConcurrentHashMap<>();

    @Autowired
    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody AuthRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword()); // Plain text for demo purposes
        userRepository.save(user);
        return ResponseEntity.ok("Registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody AuthRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(request.getPassword())) {
            String token = UUID.randomUUID().toString();
            tokenStore.put(token, userOpt.get().getId());
            return ResponseEntity.ok(token); // Send token to frontend
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }
}
