package com.ecommerce.service;

import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.ecommerce.models.Payments;
import com.ecommerce.repository.PaymentRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentStatusPoller {

    private final MicrofinanceService microfinanceService;
    private final PaymentRepository paymentRepository;


    @Scheduled(fixedDelay = 10000)
    public void pollPendingPayments(){


        List<Payments> pendingPayments = paymentRepository.findByStatus("PENDING");

        for(Payments payment : pendingPayments){

            if (payment.getRequestId()== null) continue;

            String status= microfinanceService.checkRequestStatus(payment.getRequestId());

            if(status == null) continue;

            if (status.equalsIgnoreCase("paid")){
                payment.setStatus("PAID");
                payment.setActive(false);
                paymentRepository.save(payment);
                log.info("Payment {} marked as PAID", payment.getPaymentId());
            }else if(status.equalsIgnoreCase("declined")){
                payment.setStatus("DECLINED");
                payment.setActive(false);
                paymentRepository.save(payment);
                log.info("Payment {} marked as DECLINED", payment.getPaymentId());
            }
        }

    }
    
}
