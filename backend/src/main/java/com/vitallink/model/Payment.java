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
@Document(collection = "payments")
public class Payment {
    @Id
    private String id;
    
    @Indexed
    private String hospitalId;
    
    private double amount;
    private String type; // SUBSCRIPTION, MAINTENANCE, RECHARGE
    private LocalDateTime timestamp;
    private String description;
    private String receiptNumber;
}
