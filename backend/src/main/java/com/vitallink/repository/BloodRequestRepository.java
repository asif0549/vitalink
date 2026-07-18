package com.vitallink.repository;

import com.vitallink.model.BloodRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.geo.Point;
import java.util.List;

public interface BloodRequestRepository extends MongoRepository<BloodRequest, String> {
    List<BloodRequest> findByHospitalId(String hospitalId);
    List<BloodRequest> findByReceiverId(String receiverId);
    List<BloodRequest> findByDonorId(String donorId);
    List<BloodRequest> findByStatus(String status);
    List<BloodRequest> findByLocationNear(Point location);
}
