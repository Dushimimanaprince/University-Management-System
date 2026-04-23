package com.ecommerce.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.models.Course;
import com.ecommerce.models.Enrollment;
import com.ecommerce.models.Semester;
import com.ecommerce.models.Student;

public interface EnrollmentRepository extends JpaRepository<Enrollment,UUID> {


    List<Enrollment> findByStudent(Student student);

    List<Enrollment> findByCourse(Course course);
    List<Enrollment> findByStudentAndActiveTrue(Student student);
    List<Enrollment> findByStudentAndActiveFalse(Student student);

    boolean existsByStudentAndCourseAndSemester(Student student, Course course,Semester semester);

    long countByCourse(Course course);
    
}
