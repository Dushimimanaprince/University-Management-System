package com.ecommerce.controller;

import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.service.GradeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/grades")
@RequiredArgsConstructor
public class GradeController {

    private final GradeService gradeService;

    // POST /api/grades
    // Body: { "enrollmentId": "...", "assignment": "80", "quiz": "70", "midTerm": "75", "finalExam": "85" }
    @PostMapping
    public ResponseEntity<?> addGrade(@RequestBody Map<String, String> body) {
        try {
            var grade = gradeService.addGrade(
                UUID.fromString(body.get("enrollmentId")),
                Double.parseDouble(body.get("assignment")),
                Double.parseDouble(body.get("quiz")),
                Double.parseDouble(body.get("midTerm")),
                Double.parseDouble(body.get("finalExam")),
                body.get("lecturerCode")
            );
            return ResponseEntity.ok(grade);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> updateGrade(@PathVariable UUID id,
                                          @RequestBody Map<String, String> body) {
        try {
            var grade = gradeService.updateGrade(
                id,
                Double.parseDouble(body.get("assignment")),
                Double.parseDouble(body.get("quiz")),
                Double.parseDouble(body.get("midTerm")),
                Double.parseDouble(body.get("finalExam"))
            );
            return ResponseEntity.ok(grade);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    @GetMapping
    public ResponseEntity<?> getAllGrades() {
        return ResponseEntity.ok(gradeService.getAllGrades());
    }


    @GetMapping("/enrollment/{enrollmentId}")
    public ResponseEntity<?> getGradeByEnrollment(@PathVariable UUID enrollmentId) {
        try {
            return ResponseEntity.ok(gradeService.getGradeByEnrollment(enrollmentId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}