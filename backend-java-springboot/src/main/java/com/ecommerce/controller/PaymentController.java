package com.ecommerce.controller;

import java.security.Principal;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.models.Payments;
import com.ecommerce.service.PaymentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;


    @PostMapping("/pay")
    public ResponseEntity<?> pay(
                                    @RequestParam UUID semeseterId,
                                    @RequestParam String microfinanceUsername,
                                    Principal principal
    ){

        try{
            Payments payment = paymentService.initiateFeePayments(
                                principal.getName(),
                                semeseterId,
                                microfinanceUsername   
            );

            return ResponseEntity.ok(Map.of(
                "message","Fee payment request sent. Please approve it in the Microfinance app.",
                "amount", payment.getAmount(),
                "status", payment.getStatus()
            ));
        }catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }

    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyPayment(
            @RequestParam UUID semesterId,
            Principal principal) {
        try {
            Payments payment = paymentService.getMyPayment(principal.getName(), semesterId);
            return ResponseEntity.ok(Map.of(
                "amount", payment.getAmount(),
                "status", payment.getStatus(),
                "createdAt", payment.getCreatedAt()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    
}
