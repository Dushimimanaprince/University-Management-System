package com.ecommerce.repository;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ecommerce.models.History;

public interface HistoryRepository extends JpaRepository<History,UUID> {

    
}