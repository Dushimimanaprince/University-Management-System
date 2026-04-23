package com.ecommerce.controller;

import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.models.Lecturer;
import com.ecommerce.models.Student;
import com.ecommerce.service.AdminService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping
    public ResponseEntity<?> getAdmins(){
        return ResponseEntity.ok(adminService.getAllAdmins());
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<?> getAdminByCode(@PathVariable String code){
        
        try{
            return ResponseEntity.ok(adminService.getAdminByCode(code));
        }catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("error",e.getMessage()));
        }
    }

    @PutMapping("/student-set/{studentId}")
    public ResponseEntity<?> setStudentToActive(@PathVariable UUID studentId) {
        try {
            Student updated = adminService.setStudentActive(studentId);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/lecturer-set/{lecturerId}")
    public ResponseEntity<?> setLecturerToActive(@PathVariable UUID lecturerId) {
        try {
            Lecturer updated = adminService.setLectureActive(lecturerId);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
}
