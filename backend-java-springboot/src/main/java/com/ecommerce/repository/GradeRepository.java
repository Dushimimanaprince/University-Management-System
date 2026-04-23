package com.ecommerce.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.models.Enrollment;
import com.ecommerce.models.Grade;
import com.ecommerce.models.Student;

public interface GradeRepository  extends JpaRepository<Grade,UUID> {

    List<Grade> findByEnrollment_Student(Student student);
    boolean existsByEnrollment(Enrollment enrollment);
    Optional<Grade> findByEnrollment(Enrollment enrollment);
    
}
