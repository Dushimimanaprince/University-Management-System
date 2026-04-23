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

import com.ecommerce.service.LecturerService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/lecturers")
@RequiredArgsConstructor
public class LecturerController {

    private final LecturerService lecturerService;


    @GetMapping
    public ResponseEntity<?> getAllLecturers() {
        return ResponseEntity.ok(lecturerService.getAllLecturers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getLecturerById(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(lecturerService.getLecturerById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<?> getLecturerByCode(@PathVariable String code) {
        try {
            return ResponseEntity.ok(lecturerService.getLecturerByCode(code));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateLecturer(@PathVariable UUID id,
                                             @RequestBody Map<String, String> body) {
        try {
            var lecturer = lecturerService.updateLecturer(
                id,
                body.get("firstName"),
                body.get("lastName"),
                body.get("email"),
                body.get("phone"),
                body.get("degree")
            );
            return ResponseEntity.ok(lecturer);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLecturer(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(lecturerService.deleteLecturer(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}