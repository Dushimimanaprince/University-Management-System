package com.ecommerce.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.models.Payments;
import com.ecommerce.models.Semester;
import com.ecommerce.models.Student;

public interface PaymentRepository extends JpaRepository<Payments,UUID> {
    
        boolean existsByStudentAndSemesterAndActiveTrue(Student student, Semester semester);

        Optional<Payments> findByStudentAndSemester(Student student, Semester semester);

        List<Payments> findByStatus(String status);
}
