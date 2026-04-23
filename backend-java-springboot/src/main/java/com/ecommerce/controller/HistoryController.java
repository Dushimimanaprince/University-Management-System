package com.ecommerce.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.service.HistoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/history")
@RequiredArgsConstructor
public class HistoryController {

    private final HistoryService historyService;

    @GetMapping
    public ResponseEntity<?> getHistory(){
        return ResponseEntity.ok(historyService.getAllHistory());
    }
    
}
