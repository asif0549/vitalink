package com.vitallink.controller;

import com.vitallink.model.*;
import com.vitallink.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/rewards")
@RequiredArgsConstructor
public class RewardController {

    private final UserRepository userRepository;
    private final DonorRepository donorRepository;
    private final RewardRepository rewardRepository;

    @GetMapping
    public ResponseEntity<?> getRewards(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Donor donor = donorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Donor not found"));

        List<Reward> rewards = rewardRepository.findByDonorId(donor.getId());
        return ResponseEntity.ok(rewards);
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<?> getLeaderboard() {
        List<Donor> donors = donorRepository.findAll();
        // Sort donors by donation count descending
        donors.sort((a, b) -> Integer.compare(b.getDonationCount(), a.getDonationCount()));
        
        List<Map<String, Object>> leaderboard = new ArrayList<>();
        int rank = 1;
        for (Donor donor : donors) {
            Map<String, Object> map = new HashMap<>();
            map.put("rank", rank++);
            map.put("name", donor.getName());
            map.put("bloodGroup", donor.getBloodGroup());
            map.put("donationCount", donor.getDonationCount());
            map.put("city", donor.getCity());
            
            // Determine level
            String badge = "Active Donor";
            if (donor.getDonationCount() >= 20) badge = "Life Saver Legend";
            else if (donor.getDonationCount() >= 10) badge = "Gold Hero";
            else if (donor.getDonationCount() >= 5) badge = "Silver Hero";
            else if (donor.getDonationCount() >= 2) badge = "Bronze Hero";
            map.put("badgeName", badge);
            
            leaderboard.add(map);
        }
        return ResponseEntity.ok(leaderboard);
    }

    @GetMapping("/certificate/{level}")
    public ResponseEntity<?> getCertificateDetails(@PathVariable String level, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Donor donor = donorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Donor not found"));

        Map<String, Object> details = new HashMap<>();
        details.put("recipientName", donor.getName());
        details.put("bloodGroup", donor.getBloodGroup());
        details.put("level", level.toUpperCase());
        details.put("dateAwarded", new Date());
        details.put("certificateId", "CERT-" + donor.getId().substring(0, 4) + "-" + level.toUpperCase());
        
        String description = "For exemplary dedication to saving lives in India by successfully donating blood.";
        details.put("description", description);
        
        return ResponseEntity.ok(details);
    }
}
