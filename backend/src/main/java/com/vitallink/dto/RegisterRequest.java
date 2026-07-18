package com.vitallink.dto;

import lombok.Data;
import java.util.List;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String name;
    private String role; // DONOR, RECEIVER, HOSPITAL, ADMIN
    private String contactNumber;
    private String city;
    private String state;
    
    // Donor specific
    private Integer age;
    private String bloodGroup;
    
    // Hospital specific
    private String address;
    private List<String> availableBloodTypes;
    
    // GPS coordinates (for Donor & Hospital)
    private Double latitude;
    private Double longitude;
}
