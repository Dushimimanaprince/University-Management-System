package com.ecommerce.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.models.EmailValidation;
import com.ecommerce.repository.EmailValidationRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/email-validations")
@RequiredArgsConstructor
public class EmailValidationController {

    private final EmailValidationRepository emailValidationRepository;

    // GET all approved emails
    @GetMapping
    public ResponseEntity<List<EmailValidation>> getAll() {
        return ResponseEntity.ok(emailValidationRepository.findAll());
    }

    // POST approve an email
    @PostMapping
    public ResponseEntity<?> approveEmail(@RequestBody Map<String, String> body) {
        try {
            // Check if already approved
            String email = body.get("email");
            String role  = body.get("role");

            if (emailValidationRepository.findByEmailAndRole(email, role).isPresent()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Email already approved for " + role));
            }

            EmailValidation ev = new EmailValidation();
            ev.setEmail(email);
            ev.setRole(role);
            emailValidationRepository.save(ev);

            return ResponseEntity.ok(Map.of("message", "Email approved for " + role));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }
}