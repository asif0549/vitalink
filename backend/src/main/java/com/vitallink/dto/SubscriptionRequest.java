package com.vitallink.dto;

import lombok.Data;

@Data
public class SubscriptionRequest {
    private String planName; // BASIC, PREMIUM, ENTERPRISE
}
