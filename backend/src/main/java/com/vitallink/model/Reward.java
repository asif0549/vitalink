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
@Document(collection = "rewards")
public class Reward {
    @Id
    private String id;
    
    @Indexed
    private String donorId;
    
    private String level; // BRONZE, SILVER, GOLD, LEGEND
    private String badgeName; // Bronze Hero, Silver Hero, Gold Hero, Life Saver Legend
    private LocalDateTime createdAt;
}
