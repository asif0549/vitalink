package com.vitallink;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class VitalLinkApplication {
    public static void main(String[] args) {
        SpringApplication.run(VitalLinkApplication.class, args);
    }
}
