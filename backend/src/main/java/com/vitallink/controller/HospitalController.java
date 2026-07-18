package com.vitallink.controller;

import com.vitallink.dto.RechargeRequest;
import com.vitallink.dto.SubscriptionRequest;
import com.vitallink.model.*;
import com.vitallink.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/hospitals")
@RequiredArgsConstructor
public class HospitalController {

    private final UserRepository userRepository;
    private final HospitalRepository hospitalRepository;
    private final PaymentRepository paymentRepository;
    private final NotificationRepository notificationRepository;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Hospital hospital = hospitalRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Hospital profile not found"));

        return ResponseEntity.ok(hospital);
    }

    @PutMapping("/inventory")
    public ResponseEntity<?> updateInventory(@RequestBody List<String> availableBloodTypes, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Hospital hospital = hospitalRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Hospital profile not found"));

        hospital.setAvailableBloodTypes(availableBloodTypes);
        hospitalRepository.save(hospital);

        return ResponseEntity.ok(hospital);
    }

    @PostMapping("/wallet/recharge")
    public ResponseEntity<?> rechargeWallet(@RequestBody RechargeRequest request, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Hospital hospital = hospitalRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Hospital profile not found"));

        double oldBalance = hospital.getWalletBalance();
        hospital.setWalletBalance(oldBalance + request.getAmount());
        hospitalRepository.save(hospital);

        String receiptNumber = "REC-" + System.currentTimeMillis();
        Payment payment = Payment.builder()
                .hospitalId(hospital.getId())
                .amount(request.getAmount())
                .type("RECHARGE")
                .timestamp(LocalDateTime.now())
                .description("Wallet recharge online payment")
                .receiptNumber(receiptNumber)
                .build();
        paymentRepository.save(payment);

        Notification notification = Notification.builder()
                .userId(user.getId())
                .message("Recharged wallet with Rs." + request.getAmount() + ". Receipt: " + receiptNumber)
                .type("RECHARGE")
                .timestamp(LocalDateTime.now())
                .isRead(false)
                .build();
        notificationRepository.save(notification);

        return ResponseEntity.ok(hospital);
    }

    @PostMapping("/subscription")
    public ResponseEntity<?> buySubscription(@RequestBody SubscriptionRequest request, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Hospital hospital = hospitalRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Hospital profile not found"));

        double price = 0;
        int durationDays = 30;
        String planName = request.getPlanName().toUpperCase();

        if ("BASIC".equals(planName)) {
            price = 500.0;
        } else if ("PREMIUM".equals(planName)) {
            price = 1200.0;
        } else if ("ENTERPRISE".equals(planName)) {
            price = 3000.0;
        } else {
            return ResponseEntity.badRequest().body("Invalid plan selected: " + planName);
        }

        if (hospital.getWalletBalance() < price) {
            return ResponseEntity.badRequest().body("Insufficient wallet balance. Recharge wallet first.");
        }

        hospital.setWalletBalance(hospital.getWalletBalance() - price);
        hospital.setSubscribed(true);
        hospital.setSubscriptionPlan(planName);
        
        LocalDateTime expiry = hospital.getSubscriptionExpiry();
        if (expiry == null || expiry.isBefore(LocalDateTime.now())) {
            expiry = LocalDateTime.now();
        }
        hospital.setSubscriptionExpiry(expiry.plusDays(durationDays));
        hospitalRepository.save(hospital);

        String receiptNumber = "SUB-" + System.currentTimeMillis();
        Payment payment = Payment.builder()
                .hospitalId(hospital.getId())
                .amount(price)
                .type("SUBSCRIPTION")
                .timestamp(LocalDateTime.now())
                .description("Subscription package: " + planName)
                .receiptNumber(receiptNumber)
                .build();
        paymentRepository.save(payment);

        Notification notification = Notification.builder()
                .userId(user.getId())
                .message("Subscribed to plan " + planName + " successfully! Price: Rs." + price)
                .type("SUBSCRIPTION_CONFIRMED")
                .timestamp(LocalDateTime.now())
                .isRead(false)
                .build();
        notificationRepository.save(notification);

        return ResponseEntity.ok(hospital);
    }

    @GetMapping("/payments")
    public ResponseEntity<?> getPayments(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Hospital hospital = hospitalRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Hospital profile not found"));

        return ResponseEntity.ok(paymentRepository.findByHospitalId(hospital.getId()));
    }

    @GetMapping("/nearby")
    public ResponseEntity<?> getNearbyHospitals(@RequestParam double lat, @RequestParam double lng, @RequestParam(defaultValue = "500") double radius) {
        List<Hospital> allHospitals = hospitalRepository.findAll();
        List<Map<String, Object>> responseList = new ArrayList<>();

        for (Hospital hospital : allHospitals) {
            if (hospital.getLocation() != null && hospital.getLocation().getCoordinates().size() >= 2) {
                double hLng = hospital.getLocation().getCoordinates().get(0);
                double hLat = hospital.getLocation().getCoordinates().get(1);

                double distance = calculateDistance(lat, lng, hLat, hLng);
                if (distance <= radius) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("hospital", hospital);
                    map.put("distance", Math.round(distance * 100.0) / 100.0);
                    map.put("eta", Math.round((distance / 30.0) * 60.0));
                    responseList.add(map);
                }
            }
        }

        responseList.sort((a, b) -> Double.compare((Double) a.get("distance"), (Double) b.get("distance")));
        return ResponseEntity.ok(responseList);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllHospitals() {
        return ResponseEntity.ok(hospitalRepository.findAll());
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
