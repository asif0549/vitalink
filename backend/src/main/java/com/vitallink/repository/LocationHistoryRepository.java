package com.vitallink.repository;

import com.vitallink.model.LocationHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface LocationHistoryRepository extends MongoRepository<LocationHistory, String> {
    List<LocationHistory> findByDonorIdOrderByTimestampDesc(String donorId);
}
