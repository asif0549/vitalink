package com.vitallink.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;
    
    @Indexed
    private String userId;
    
    private String message;
    private String type; // DONOR_ACCEPTED, HOSPITAL_CONFIRMED, BLOOD_REQUIRED, REQUEST_COMPLETED, REWARD_EARNED, SUBSCRIPTION_EXPIRY
    private LocalDateTime timestamp;
    private boolean isRead;
}
