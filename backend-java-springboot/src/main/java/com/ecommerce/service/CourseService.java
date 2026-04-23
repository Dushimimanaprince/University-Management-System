package com.ecommerce.service;

import java.util.List;
import java.util.UUID;


import org.springframework.stereotype.Service;

import com.ecommerce.models.Admin;
import com.ecommerce.models.Course;
import com.ecommerce.models.Department;
import com.ecommerce.models.Lecturer;
import com.ecommerce.repository.AdminRepository;
import com.ecommerce.repository.CourseRepository;
import com.ecommerce.repository.DepartmentRepository;
import com.ecommerce.repository.LecturerRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final DepartmentRepository departmentRepository;
    private final LecturerRepository lecturerRepository;
    private final HistoryService historyService;
    private final AdminRepository adminRepository;

    // Create course - Admin only
    public Course createCourse(String courseCode, String courseName,
                                String courseDay, String courseTime,
                                Integer credits, UUID departmentId, UUID lecturerId,
                                String adminCode) {

        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        Lecturer lecturer = lecturerRepository.findById(lecturerId)
                .orElseThrow(() -> new RuntimeException("Lecturer not found"));

        Admin admin =adminRepository.findByAdminCode(adminCode)
            .orElseThrow(() -> new RuntimeException("No admin Found"));

        Course course = new Course();
        course.setCourseCode(courseCode);
        course.setCourseName(courseName);
        course.setCourseDay(courseDay);
        course.setCourseTime(courseTime);
        course.setCredits(credits);
        course.setDepartment(department);
        course.setLecturer(lecturer);
        course.setActive(true);

        Course saved= courseRepository.save(course);

        historyService.log(
            "New Course Added: "+ course.getCourseName(),
            admin.getAdminFirstName()+" "+admin.getAdminLastName(),
            "ADMIN",
            "COURSE"
        );
    

        return saved;
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course getCourseById(UUID id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
    }

    public Course updateCourse(UUID id,String courseCode, String courseName,
                                String courseDay, String courseTime, Integer credits,
                                UUID departmentId, UUID lecturerId, String adminCode) {

        Department dept = departmentRepository.findById(departmentId)
        .orElseThrow(() -> new RuntimeException("Department not found"));

        Lecturer lecturer = lecturerRepository.findById(lecturerId)
        .orElseThrow(() -> new RuntimeException("Lecturer not found"));

        Admin admin =adminRepository.findByAdminCode(adminCode)
            .orElseThrow(() -> new RuntimeException("No admin Found"));

        Course course = getCourseById(id);
        course.setCourseCode(courseCode);
        course.setCourseName(courseName);
        course.setCourseDay(courseDay);
        course.setCourseTime(courseTime);
        course.setCredits(credits);
        course.setDepartment(dept);
        course.setLecturer(lecturer);

        Course saved= courseRepository.save(course);

        historyService.log(
            "Course Updated: "+ course.getCourseName(),
            admin.getAdminFirstName()+" "+admin.getAdminLastName(),
            "ADMIN",
            "COURSE"
        );

        return saved;
    }

    public Course deleteCourse(UUID id) {
        Course course = getCourseById(id);
        course.setActive(false);
        return courseRepository.save(course);
    }
}