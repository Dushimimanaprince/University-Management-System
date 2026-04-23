package com.ecommerce.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ecommerce.models.History;
import com.ecommerce.repository.HistoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HistoryService {

    private final HistoryRepository historyRepository;


    public void log(String action, String perfomedBy, String role, String entity){
        History history= new History();

        history.setAction(action);
        history.setPerformedBy(perfomedBy);
        history.setRole(role);
        history.setEntity(entity);

        historyRepository.save(history);
    }

    public List<History> getAllHistory(){
        return historyRepository.findAll();
    }
    
}
