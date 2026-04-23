package com.ecommerce.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.models.Semester;

@Repository
public interface SemesterRepository extends JpaRepository<Semester,UUID> {

    
}
