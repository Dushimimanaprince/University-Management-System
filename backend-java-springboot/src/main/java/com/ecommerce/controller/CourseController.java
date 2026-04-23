package com.ecommerce.controller;


import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.ecommerce.service.CourseService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @PostMapping
    public ResponseEntity<?> createCourse(@RequestBody Map<String, String> body) {
        try {
            var course = courseService.createCourse(
                body.get("courseCode"),
                body.get("courseName"),
                body.get("courseDay"),
                body.get("courseTime"),
                Integer.parseInt(body.get("credits")),
                UUID.fromString(body.get("departmentId")),
                UUID.fromString(body.get("lecturerId")),
                body.get("adminCode")
            );
            return ResponseEntity.ok(course);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }




    @GetMapping
    public ResponseEntity<?> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }



    @GetMapping("/{id}")
    public ResponseEntity<?> getCourseById(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(courseService.getCourseById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

  
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCourse(@PathVariable UUID id,
                                           @RequestBody Map<String, String> body) {
        try {
            var course = courseService.updateCourse(
                id,
                body.get("courseCode"),
                body.get("courseName"),
                body.get("courseDay"),
                body.get("courseTime"),
                Integer.parseInt(body.get("courseCredits")),
                UUID.fromString(body.get("courseDepartment")),
                UUID.fromString(body.get("courseLecturer")), 
                body.get("adminCode")
            );
            return ResponseEntity.ok(course);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(courseService.deleteCourse(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}