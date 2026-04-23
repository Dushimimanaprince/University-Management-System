package com.ecommerce.controller;

import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.service.StudentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping
    public ResponseEntity<?> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getStudentById(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(studentService.getStudentById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<?> getStudentByCode(@PathVariable String code) {
        try {
            return ResponseEntity.ok(studentService.getStudentByCode(code));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable UUID id,
                                            @RequestBody Map<String, String> body) {
        try {
            var student = studentService.updateStudent(
                id,
                body.get("firstName"),
                body.get("lastName"),
                body.get("email"),
                body.get("phone")
            );
            return ResponseEntity.ok(student);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

   
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(studentService.deleteStudent(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}