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
@Document(collection = "donations")
public class Donation {
    @Id
    private String id;
    
    @Indexed
    private String requestId;
    
    @Indexed
    private String donorId;
    
    @Indexed
    private String hospitalId;
    
    private LocalDateTime donatedAt;
    private String status; // COMPLETED
}
