package com.vitallink.repository;

import com.vitallink.model.Donation;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface DonationRepository extends MongoRepository<Donation, String> {
    List<Donation> findByDonorId(String donorId);
    List<Donation> findByHospitalId(String hospitalId);
}
