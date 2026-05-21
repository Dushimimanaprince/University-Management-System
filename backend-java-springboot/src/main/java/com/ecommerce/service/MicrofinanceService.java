package com.ecommerce.service;


import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MicrofinanceService {

    @Value("${microfinance.api.base-url}")
    private String baseUrl;

    @Value("${microfinance.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;

    private HttpHeaders headers() {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-Api-Key", apiKey);
            headers.setContentType(MediaType.APPLICATION_JSON);
            return headers;
    }
    
    public Boolean validateUser(String microfinanceUsername){

        String url= baseUrl + "/transactions/service/validate-user/?username="+ microfinanceUsername;

        try{
            restTemplate.exchange(url, HttpMethod.GET, 
                new HttpEntity<>(headers()), Map.class);

            return true;
        } catch (HttpClientErrorException.NotFound e){
            return false;
        }
    }

    public String createFeeRequest(String microfinanceUsername, float amount, String studentName) {
        String url = baseUrl + "/transactions/service/create-fee-request/";
        Map<String, Object> body = Map.of(
            "username", microfinanceUsername,
            "amount", amount,
            "student_name", studentName
        );
        ResponseEntity<Map> res = restTemplate.postForEntity(
            url, new HttpEntity<>(body, headers()), Map.class
        );
        return (String) res.getBody().get("request_id");
    }

    
    
}
