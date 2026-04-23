package com.ecommerce.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.models.Course;
import com.ecommerce.models.Department;
import com.ecommerce.models.Lecturer;

public interface CourseRepository  extends JpaRepository<Course,UUID>{

    boolean existsByCourseCode(String courseCode);
    List<Course> findByLecturer(Lecturer lecturer);
    List<Course> findByActiveTrue();
    List<Course> findByDepartment(Department department);
    
}
