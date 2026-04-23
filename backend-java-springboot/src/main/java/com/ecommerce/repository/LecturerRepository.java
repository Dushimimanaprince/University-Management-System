package com.ecommerce.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.models.Department;
import com.ecommerce.models.Lecturer;

public interface LecturerRepository extends JpaRepository<Lecturer,UUID>{

    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    boolean existsByLecturerCode(String lecturerCode);
    Optional<Lecturer> findByLecturerCode(String lecturerCode);
    List<Lecturer> findByDepartment(Department department);
   
}
