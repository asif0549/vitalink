package com.vitallink.controller;

import com.vitallink.model.*;
import com.vitallink.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final DonorRepository donorRepository;
    private final HospitalRepository hospitalRepository;
    private final BloodRequestRepository bloodRequestRepository;
    private final PaymentRepository paymentRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        long totalUsers = userRepository.count();
        long totalDonors = donorRepository.count();
        long totalHospitals = hospitalRepository.count();
        long totalRequests = bloodRequestRepository.count();
        long completedRequests = bloodRequestRepository.findByStatus("COMPLETED").size();

        // Calculate total revenue from payment collections
        List<Payment> payments = paymentRepository.findAll();
        double subscriptionRevenue = 0.0;
        double maintenanceRevenue = 0.0;
        for (Payment payment : payments) {
            if ("SUBSCRIPTION".equalsIgnoreCase(payment.getType())) {
                subscriptionRevenue += payment.getAmount();
            } else if ("MAINTENANCE".equalsIgnoreCase(payment.getType())) {
                maintenanceRevenue += payment.getAmount();
            }
        }
        double totalRevenue = subscriptionRevenue + maintenanceRevenue;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("totalDonors", totalDonors);
        stats.put("totalHospitals", totalHospitals);
        stats.put("totalRequests", totalRequests);
        stats.put("completedRequests", completedRequests);
        stats.put("subscriptionRevenue", subscriptionRevenue);
        stats.put("maintenanceRevenue", maintenanceRevenue);
        stats.put("totalRevenue", totalRevenue);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/donors/locations")
    public ResponseEntity<?> getDonorLocations() {
        return ResponseEntity.ok(donorRepository.findAll());
    }
}
