package com.ecommerce.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.models.Department;

public interface DepartmentRepository extends JpaRepository<Department,UUID>{
    boolean existsByDepName(String depName);
    Optional<Department> findByDepName(String depName);
}
