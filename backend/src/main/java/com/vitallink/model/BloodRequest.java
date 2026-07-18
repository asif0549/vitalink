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

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "blood_requests")
public class BloodRequest {
    @Id
    private String id;
    
    private String patientName;
    private String bloodGroup;
    private String urgency; // LOW, MEDIUM, HIGH, EMERGENCY
    
    @Indexed
    private String hospitalId;
    
    @Indexed
    private String receiverId;
    
    @Indexed
    private String donorId; // matched donor
    
    private String status; // PENDING, ACCEPTED, CONFIRMED, COMPLETED, CANCELLED
    private LocalDateTime requestedAt;
    
    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
    private GeoJsonPoint location;
}
