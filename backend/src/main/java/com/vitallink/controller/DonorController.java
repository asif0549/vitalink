package com.vitallink.controller;

import com.vitallink.dto.LocationUpdateDto;
import com.vitallink.model.*;
import com.vitallink.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/donors")
@RequiredArgsConstructor
public class DonorController {

    private final UserRepository userRepository;
    private final DonorRepository donorRepository;
    private final LocationHistoryRepository locationHistoryRepository;

    @PutMapping("/location")
    public ResponseEntity<?> updateLocation(@RequestBody LocationUpdateDto updateDto, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Donor donor = donorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Donor profile not found"));

        GeoJsonPoint newPoint = new GeoJsonPoint(updateDto.getLongitude(), updateDto.getLatitude());
        donor.setLocation(newPoint);
        donorRepository.save(donor);

        // Log location history
        LocationHistory history = LocationHistory.builder()
                .donorId(donor.getId())
                .location(newPoint)
                .timestamp(LocalDateTime.now())
                .build();
        locationHistoryRepository.save(history);

        return ResponseEntity.ok(donor);
    }

    @PutMapping("/availability")
    public ResponseEntity<?> toggleAvailability(@RequestParam boolean available, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Donor donor = donorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Donor profile not found"));

        donor.setAvailable(available);
        donorRepository.save(donor);

        return ResponseEntity.ok(donor);
    }

    @GetMapping("/nearby")
    public ResponseEntity<?> getNearbyDonors(@RequestParam double lat, @RequestParam double lng, @RequestParam(defaultValue = "50") double radius) {
        // Fetch all available donors
        List<Donor> allDonors = donorRepository.findByIsAvailableTrue();
        List<Map<String, Object>> responseList = new ArrayList<>();

        for (Donor donor : allDonors) {
            if (donor.getLocation() != null && donor.getLocation().getCoordinates().size() >= 2) {
                double donorLng = donor.getLocation().getCoordinates().get(0);
                double donorLat = donor.getLocation().getCoordinates().get(1);

                double distance = calculateDistance(lat, lng, donorLat, donorLng);
                if (distance <= radius) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("donor", donor);
                    map.put("distance", Math.round(distance * 100.0) / 100.0); // distance in km
                    map.put("eta", Math.round((distance / 30.0) * 60.0)); // ETA in minutes (30km/h speed)
                    responseList.add(map);
                }
            }
        }

        // Sort by distance
        responseList.sort((a, b) -> Double.compare((Double) a.get("distance"), (Double) b.get("distance")));

        return ResponseEntity.ok(responseList);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllDonors() {
        return ResponseEntity.ok(donorRepository.findAll());
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
