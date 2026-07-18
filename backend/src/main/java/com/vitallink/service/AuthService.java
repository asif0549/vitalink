package com.vitallink.service;

import com.vitallink.config.JwtService;
import com.vitallink.dto.AuthResponse;
import com.vitallink.dto.LoginRequest;
import com.vitallink.dto.RegisterRequest;
import com.vitallink.model.*;
import com.vitallink.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final DonorRepository donorRepository;
    private final ReceiverRepository receiverRepository;
    private final HospitalRepository hospitalRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered: " + request.getEmail());
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .role(request.getRole().toUpperCase())
                .contactNumber(request.getContactNumber())
                .city(request.getCity())
                .state(request.getState())
                .createdAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);

        // Handle profile mapping based on Role
        if ("DONOR".equalsIgnoreCase(request.getRole())) {
            GeoJsonPoint point = new GeoJsonPoint(80.4367, 16.2973); // Default Guntur coordinates
            if (request.getLongitude() != null && request.getLatitude() != null) {
                point = new GeoJsonPoint(request.getLongitude(), request.getLatitude());
            }
            Donor donor = Donor.builder()
                    .userId(savedUser.getId())
                    .name(request.getName())
                    .age(request.getAge() != null ? request.getAge() : 25)
                    .bloodGroup(request.getBloodGroup() != null ? request.getBloodGroup() : "O+")
                    .city(request.getCity())
                    .state(request.getState())
                    .contactNumber(request.getContactNumber())
                    .isAvailable(true)
                    .donationCount(0)
                    .location(point)
                    .build();
            donorRepository.save(donor);
        } else if ("RECEIVER".equalsIgnoreCase(request.getRole())) {
            Receiver receiver = Receiver.builder()
                    .userId(savedUser.getId())
                    .name(request.getName())
                    .city(request.getCity())
                    .state(request.getState())
                    .contactNumber(request.getContactNumber())
                    .build();
            receiverRepository.save(receiver);
        } else if ("HOSPITAL".equalsIgnoreCase(request.getRole())) {
            GeoJsonPoint point = new GeoJsonPoint(80.4367, 16.2973);
            if (request.getLongitude() != null && request.getLatitude() != null) {
                point = new GeoJsonPoint(request.getLongitude(), request.getLatitude());
            }
            Hospital hospital = Hospital.builder()
                    .userId(savedUser.getId())
                    .name(request.getName())
                    .city(request.getCity())
                    .state(request.getState())
                    .address(request.getAddress() != null ? request.getAddress() : request.getCity())
                    .contactNumber(request.getContactNumber())
                    .isSubscribed(false)
                    .walletBalance(500.0) // Demo credits
                    .availableBloodTypes(request.getAvailableBloodTypes() != null ? request.getAvailableBloodTypes() : new ArrayList<>())
                    .location(point)
                    .build();
            hospitalRepository.save(hospital);
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
        String token = jwtService.generateToken(userDetails, savedUser.getRole(), savedUser.getId());

        return AuthResponse.builder()
                .token(token)
                .email(savedUser.getEmail())
                .name(savedUser.getName())
                .role(savedUser.getRole())
                .userId(savedUser.getId())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails, user.getRole(), user.getId());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole())
                .userId(user.getId())
                .build();
    }
}
