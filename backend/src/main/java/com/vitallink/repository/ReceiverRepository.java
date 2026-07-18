package com.vitallink.repository;

import com.vitallink.model.Receiver;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface ReceiverRepository extends MongoRepository<Receiver, String> {
    Optional<Receiver> findByUserId(String userId);
}
