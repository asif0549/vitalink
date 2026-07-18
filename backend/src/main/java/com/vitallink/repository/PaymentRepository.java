package com.vitallink.repository;

import com.vitallink.model.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface PaymentRepository extends MongoRepository<Payment, String> {
    List<Payment> findByHospitalId(String hospitalId);
}
