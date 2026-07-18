package com.vitallink.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "receivers")
public class Receiver {
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String userId;
    
    private String name;
    private String city;
    private String state;
    private String contactNumber;
}
