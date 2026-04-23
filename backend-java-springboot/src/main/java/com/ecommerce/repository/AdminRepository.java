package com.ecommerce.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ecommerce.models.Admin;


public interface AdminRepository extends JpaRepository<Admin,UUID>{

    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    boolean existsByAdminCode(String adminCode);
    Optional<Admin> findByAdminCode(String adminCode);  
   
}
