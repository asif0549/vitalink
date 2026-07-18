package com.vitallink.controller;

import com.vitallink.dto.AuthResponse;
import com.vitallink.dto.LoginRequest;
import com.vitallink.dto.RegisterRequest;
import com.vitallink.model.*;
import com.vitallink.repository.*;
import com.vitallink.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final DonorRepository donorRepository;
    private final ReceiverRepository receiverRepository;
    private final HospitalRepository hospitalRepository;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> response = new HashMap<>();
        response.put("user", user);

        if ("DONOR".equalsIgnoreCase(user.getRole())) {
            donorRepository.findByUserId(user.getId()).ifPresent(d -> response.put("profile", d));
        } else if ("RECEIVER".equalsIgnoreCase(user.getRole())) {
            receiverRepository.findByUserId(user.getId()).ifPresent(r -> response.put("profile", r));
        } else if ("HOSPITAL".equalsIgnoreCase(user.getRole())) {
            hospitalRepository.findByUserId(user.getId()).ifPresent(h -> response.put("profile", h));
        }

        return ResponseEntity.ok(response);
    }
}
