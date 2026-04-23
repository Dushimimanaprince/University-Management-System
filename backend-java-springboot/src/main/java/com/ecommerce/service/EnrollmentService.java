package com.ecommerce.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.ecommerce.models.Course;
import com.ecommerce.models.Enrollment;
import com.ecommerce.models.Semester;
import com.ecommerce.models.Student;
import com.ecommerce.repository.CourseRepository;
import com.ecommerce.repository.EnrollmentRepository;
import com.ecommerce.repository.SemesterRepository;
import com.ecommerce.repository.StudentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository  enrollmentRepository;
    private final StudentRepository     studentRepository;
    private final CourseRepository      courseRepository;
    private final SemesterRepository    semesterRepository;
    private final HistoryService        historyService;

    public Enrollment enrollStudent(UUID courseId,UUID semesterId, String studentCode) {

        Semester semester= semesterRepository.findById(semesterId)
            .orElseThrow(() -> new RuntimeException("Semester Not Found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        Student student= studentRepository.findByStudentCode(studentCode)
            .orElseThrow(()-> new RuntimeException("Student not Found with Such code"));


        if (enrollmentRepository.existsByStudentAndCourseAndSemester(student, course,semester)) {
            throw new RuntimeException("Student is already enrolled in this course in This Semester");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setSemester(semester);
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setActive(true);

        Enrollment saved= enrollmentRepository.save(enrollment);

        historyService.log(
            "Student Enrolled in Course: "+course.getCourseName(),
            student.getStudentFirstName()+" "+student.getStudentLastName(),
            "STUDENT",
            "ENROLLMENT"
        );

        return saved;
    }

    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }



    public List<Enrollment> getEnrollmentsByStudent(UUID studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return enrollmentRepository.findByStudent(student);
    }

    public List<Enrollment> getEnrollmentsByStudentActive(UUID studentId){
        Student student= studentRepository.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Student not Found"));
        return enrollmentRepository.findByStudentAndActiveTrue(student);
    }


    public List<Enrollment> getEnrollmentsByCourse(UUID courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return enrollmentRepository.findByCourse(course);
    }


    public Enrollment deleteEnrollment(UUID id) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
        enrollment.setActive(false);
        return enrollmentRepository.save(enrollment);
    }
}