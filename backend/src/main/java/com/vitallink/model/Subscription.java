package com.vitallink.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "subscriptions")
public class Subscription {
    @Id
    private String id;
    private String name; // BASIC, PREMIUM, ENTERPRISE
    private double price;
    private int durationDays;
    private String description;
}
