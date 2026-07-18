package com.vitallink.repository;

import com.vitallink.model.Donor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.geo.Point;
import org.springframework.data.geo.Distance;
import java.util.List;
import java.util.Optional;

public interface DonorRepository extends MongoRepository<Donor, String> {
    Optional<Donor> findByUserId(String userId);
    List<Donor> findByIsAvailableTrue();
    List<Donor> findByLocationNearAndIsAvailableTrue(Point location, Distance distance);
    List<Donor> findByLocationNear(Point location);
}
