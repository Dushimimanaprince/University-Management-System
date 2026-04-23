package com.ecommerce.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.models.Department;
import com.ecommerce.models.Student;

public interface StudentRepository extends JpaRepository<Student,UUID>{

    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    boolean existsByStudentCode(String studentCode);
    Optional<Student> findByStudentCode(String studentCode);
    List<Student> findByDepartment(Department department);
    Optional<Student> findByActive(boolean active);
   
}
