package com.vitallink.controller;

import com.vitallink.dto.BloodRequestDto;
import com.vitallink.model.*;
import com.vitallink.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class BloodRequestController {

    private final UserRepository userRepository;
    private final ReceiverRepository receiverRepository;
    private final DonorRepository donorRepository;
    private final HospitalRepository hospitalRepository;
    private final BloodRequestRepository bloodRequestRepository;
    private final DonationRepository donationRepository;
    private final PaymentRepository paymentRepository;
    private final RewardRepository rewardRepository;
    private final NotificationRepository notificationRepository;

    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody BloodRequestDto dto, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Receiver receiver = receiverRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Receiver profile not found"));

        GeoJsonPoint point = new GeoJsonPoint(dto.getLongitude(), dto.getLatitude());

        BloodRequest request = BloodRequest.builder()
                .patientName(dto.getPatientName())
                .bloodGroup(dto.getBloodGroup())
                .urgency(dto.getUrgency())
                .hospitalId(dto.getHospitalId())
                .receiverId(receiver.getId())
                .status("PENDING")
                .requestedAt(LocalDateTime.now())
                .location(point)
                .build();

        BloodRequest savedRequest = bloodRequestRepository.save(request);

        // Notify nearby available donors of the requested blood group
        List<Donor> allDonors = donorRepository.findByIsAvailableTrue();
        for (Donor donor : allDonors) {
            if (donor.getBloodGroup().equalsIgnoreCase(dto.getBloodGroup()) && donor.getLocation() != null) {
                double dist = calculateDistance(
                        dto.getLatitude(), dto.getLongitude(),
                        donor.getLocation().getCoordinates().get(1), donor.getLocation().getCoordinates().get(0)
                );
                if (dist <= 50.0) { // 50km threshold
                    Notification notif = Notification.builder()
                            .userId(donor.getUserId())
                            .message("🚨 Urgent blood requirement: " + dto.getBloodGroup() + " at nearby hospital for patient " + dto.getPatientName() + ".")
                            .type("BLOOD_REQUIRED")
                            .timestamp(LocalDateTime.now())
                            .isRead(false)
                            .build();
                    notificationRepository.save(notif);
                }
            }
        }

        return ResponseEntity.ok(savedRequest);
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<?> acceptRequest(@PathVariable String id, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Donor donor = donorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Donor profile not found"));

        BloodRequest request = bloodRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!"PENDING".equalsIgnoreCase(request.getStatus())) {
            return ResponseEntity.badRequest().body("Request is already matched or completed.");
        }

        request.setDonorId(donor.getId());
        request.setStatus("ACCEPTED");
        bloodRequestRepository.save(request);

        // Notify Receiver
        Receiver receiver = receiverRepository.findById(request.getReceiverId()).orElse(null);
        if (receiver != null) {
            Notification notif = Notification.builder()
                    .userId(receiver.getUserId())
                    .message("🎉 Good news! Donor " + donor.getName() + " (" + donor.getBloodGroup() + ") has accepted your blood request.")
                    .type("DONOR_ACCEPTED")
                    .timestamp(LocalDateTime.now())
                    .isRead(false)
                    .build();
            notificationRepository.save(notif);
        }

        // Notify Hospital
        Hospital hospital = hospitalRepository.findById(request.getHospitalId()).orElse(null);
        if (hospital != null) {
            Notification notif = Notification.builder()
                    .userId(hospital.getUserId())
                    .message("🏥 Donor " + donor.getName() + " (" + donor.getBloodGroup() + ") is coming to donate blood for " + request.getPatientName() + ".")
                    .type("DONOR_ACCEPTED")
                    .timestamp(LocalDateTime.now())
                    .isRead(false)
                    .build();
            notificationRepository.save(notif);
        }

        return ResponseEntity.ok(request);
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<?> confirmRequest(@PathVariable String id, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Hospital hospital = hospitalRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Hospital profile not found"));

        BloodRequest request = bloodRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!"ACCEPTED".equalsIgnoreCase(request.getStatus())) {
            return ResponseEntity.badRequest().body("Request must be accepted by a donor first.");
        }

        Donor donor = donorRepository.findById(request.getDonorId())
                .orElseThrow(() -> new RuntimeException("Donor not found"));

        // Update request status
        request.setStatus("COMPLETED");
        bloodRequestRepository.save(request);

        // Record Donation
        Donation donation = Donation.builder()
                .requestId(request.getId())
                .donorId(donor.getId())
                .hospitalId(hospital.getId())
                .donatedAt(LocalDateTime.now())
                .status("COMPLETED")
                .build();
        donationRepository.save(donation);

        // Deduct Maintenance Fee from Hospital wallet (150.0 INR)
        double maintenanceFee = 150.0;
        hospital.setWalletBalance(hospital.getWalletBalance() - maintenanceFee);
        hospitalRepository.save(hospital);

        // Log payment transaction
        Payment payment = Payment.builder()
                .hospitalId(hospital.getId())
                .amount(maintenanceFee)
                .type("MAINTENANCE")
                .timestamp(LocalDateTime.now())
                .description("Maintenance deduction for request: " + request.getId())
                .receiptNumber("MNT-" + System.currentTimeMillis())
                .build();
        paymentRepository.save(payment);

        // Increment donation count for donor and evaluate rewards
        int newDonationCount = donor.getDonationCount() + 1;
        donor.setDonationCount(newDonationCount);
        donor.setLastDonationDate(LocalDateTime.now());
        donorRepository.save(donor);

        // Check rewards milestones
        checkAndAwardRewards(donor);

        // Notify Receiver
        Receiver receiver = receiverRepository.findById(request.getReceiverId()).orElse(null);
        if (receiver != null) {
            Notification notif = Notification.builder()
                    .userId(receiver.getUserId())
                    .message("🩸 The blood donation has been successfully completed. We wish the patient a speedy recovery.")
                    .type("REQUEST_COMPLETED")
                    .timestamp(LocalDateTime.now())
                    .isRead(false)
                    .build();
                    notificationRepository.save(notif);
        }

        // Notify Donor
        Notification donorNotif = Notification.builder()
                .userId(donor.getUserId())
                .message("❤️ Thank you! Hospital has confirmed your blood donation. You saved a life today!")
                .type("REQUEST_COMPLETED")
                .timestamp(LocalDateTime.now())
                .isRead(false)
                .build();
        notificationRepository.save(donorNotif);

        return ResponseEntity.ok(request);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelRequest(@PathVariable String id) {
        BloodRequest request = bloodRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus("CANCELLED");
        bloodRequestRepository.save(request);
        return ResponseEntity.ok(request);
    }

    @GetMapping("/active")
    public ResponseEntity<?> getActiveRequests() {
        return ResponseEntity.ok(bloodRequestRepository.findByStatus("PENDING"));
    }

    @GetMapping("/hospital")
    public ResponseEntity<?> getHospitalRequests(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Hospital hospital = hospitalRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Hospital profile not found"));

        return ResponseEntity.ok(bloodRequestRepository.findByHospitalId(hospital.getId()));
    }

    @GetMapping("/receiver")
    public ResponseEntity<?> getReceiverRequests(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Receiver receiver = receiverRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Receiver profile not found"));

        return ResponseEntity.ok(bloodRequestRepository.findByReceiverId(receiver.getId()));
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllRequests() {
        return ResponseEntity.ok(bloodRequestRepository.findAll());
    }

    private void checkAndAwardRewards(Donor donor) {
        int count = donor.getDonationCount();
        String level = null;
        String badge = null;

        if (count == 2) {
            level = "BRONZE";
            badge = "Bronze Hero";
        } else if (count == 5) {
            level = "SILVER";
            badge = "Silver Hero";
        } else if (count == 10) {
            level = "GOLD";
            badge = "Gold Hero";
        } else if (count >= 20) {
            level = "LEGEND";
            badge = "Life Saver Legend";
        }

        if (level != null) {
            // Check if already awarded this level to avoid duplicates
            List<Reward> existing = rewardRepository.findByDonorId(donor.getId());
            boolean alreadyAwarded = false;
            for (Reward r : existing) {
                if (r.getLevel().equalsIgnoreCase(level)) {
                    alreadyAwarded = true;
                    break;
                }
            }

            if (!alreadyAwarded) {
                Reward reward = Reward.builder()
                        .donorId(donor.getId())
                        .level(level)
                        .badgeName(badge)
                        .createdAt(LocalDateTime.now())
                        .build();
                rewardRepository.save(reward);

                Notification rewardNotif = Notification.builder()
                        .userId(donor.getUserId())
                        .message("🎖️ Congratulations! You've been promoted to " + badge + " (" + level + " Hero status) for your selfless donations.")
                        .type("REWARD_EARNED")
                        .timestamp(LocalDateTime.now())
                        .isRead(false)
                        .build();
                notificationRepository.save(rewardNotif);
            }
        }
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double earthRadius = 6371; // in kilometers
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadius * c;
    }
}
