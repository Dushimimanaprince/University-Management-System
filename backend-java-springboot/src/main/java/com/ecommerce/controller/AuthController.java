package com.ecommerce.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.service.AuthService;
import com.ecommerce.service.SignupService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final SignupService signupService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String,String> body){

        try{
            String code= body.get("code");
            String password= body.get("password");

            Map<String,String> response= authService.login(code, password);
            return ResponseEntity.ok(response);
        }catch(RuntimeException e){
            return ResponseEntity.badRequest().body(
                Map.of("error",e.getMessage())
            );
        }
        
    }

    @PostMapping("register/student")
    public ResponseEntity<?> registerStudent(@RequestBody Map<String,String> body){

        try {
            var student= signupService.registerStudent(
                body.get("firstName"),
                body.get("lastName"),
                body.get("email"),
                body.get("phone"),
                body.get("password"),
                java.util.UUID.fromString(body.get("departmentId"))
                
            );
            return ResponseEntity.ok(student);

        }catch (RuntimeException e){
            return ResponseEntity.badRequest().body
                (Map.of("error",e.getMessage()));
        }
    }

    @PostMapping("/register/lecturer")
    public ResponseEntity<?> registerLecturer(@RequestBody Map<String, String> body) {
        try {
            var lecturer = signupService.registerLecturer(
                body.get("firstName"),
                body.get("lastName"),
                body.get("email"),
                body.get("phone"),
                body.get("password"),
                body.get("degree"),
                java.util.UUID.fromString(body.get("departmentId"))
            );
            return ResponseEntity.ok(lecturer);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/register/admin")
    public ResponseEntity<?> registerAdmin(@RequestBody Map<String, String> body) {
        try {
            var admin = signupService.registerAdmin(
                body.get("firstName"),
                body.get("lastName"),
                body.get("email"),
                body.get("phone"),
                body.get("password")
            );
            return ResponseEntity.ok(admin);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
}
