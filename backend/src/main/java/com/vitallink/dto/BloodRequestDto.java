package com.vitallink.dto;

import lombok.Data;

@Data
public class BloodRequestDto {
    private String patientName;
    private String bloodGroup;
    private String urgency; // LOW, MEDIUM, HIGH, EMERGENCY
    private String hospitalId;
    private double latitude;
    private double longitude;
}
