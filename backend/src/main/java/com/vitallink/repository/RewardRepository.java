package com.vitallink.repository;

import com.vitallink.model.Reward;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface RewardRepository extends MongoRepository<Reward, String> {
    List<Reward> findByDonorId(String donorId);
}
