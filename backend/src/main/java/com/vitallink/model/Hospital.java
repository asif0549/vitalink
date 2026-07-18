package com.vitallink.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "hospitals")
public class Hospital {
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String userId;
    
    private String name;
    private String city;
    private String state;
    private String address;
    private String contactNumber;
    private boolean isSubscribed;
    private String subscriptionPlan; // BASIC, PREMIUM, ENTERPRISE
    private LocalDateTime subscriptionExpiry;
    private double walletBalance;
    private List<String> availableBloodTypes;
    
    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
    private GeoJsonPoint location;
}
