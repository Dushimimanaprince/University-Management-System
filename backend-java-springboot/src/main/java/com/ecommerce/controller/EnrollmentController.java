package com.ecommerce.controller;

import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.service.EnrollmentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;


    @PostMapping
    public ResponseEntity<?> enrollStudent(@RequestBody Map<String, String> body) {
        try {
            var enrollment = enrollmentService.enrollStudent(
                UUID.fromString(body.get("courseId")),
                UUID.fromString(body.get("semesterId")),
                body.get("studentCode")
            );
            return ResponseEntity.ok(enrollment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    @GetMapping
    public ResponseEntity<?> getAllEnrollments() {
        return ResponseEntity.ok(enrollmentService.getAllEnrollments());
    }


    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getEnrollmentsByStudent(@PathVariable UUID studentId) {
        try {
            return ResponseEntity.ok(enrollmentService.getEnrollmentsByStudent(studentId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/student/{studentId}/active")
    public ResponseEntity<?> getActiveEnrollmentsByStudent(@PathVariable UUID studentId) {
        try {
            return ResponseEntity.ok(enrollmentService.getEnrollmentsByStudentActive(studentId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    @GetMapping("/course/{courseId}")
    public ResponseEntity<?> getEnrollmentsByCourse(@PathVariable UUID courseId) {
        try {
            return ResponseEntity.ok(enrollmentService.getEnrollmentsByCourse(courseId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEnrollment(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(enrollmentService.deleteEnrollment(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}