package com.vitallink.repository;

import com.vitallink.model.Hospital;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.geo.Point;
import java.util.List;
import java.util.Optional;

public interface HospitalRepository extends MongoRepository<Hospital, String> {
    Optional<Hospital> findByUserId(String userId);
    List<Hospital> findByLocationNear(Point location);
}
