package com.ecommerce.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.models.EmailValidation;

public interface EmailValidationRepository extends JpaRepository<EmailValidation,UUID> {

    Optional<EmailValidation> findByEmail(String email);
    Optional<EmailValidation> findByEmailAndRole(String email,String role);
    

    
} 
