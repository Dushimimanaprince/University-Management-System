package com.ecommerce.models;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "history")
@AllArgsConstructor
@NoArgsConstructor
public class History {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID historyId;

    private String action;        
    private String performedBy;   
    private String role;          
    private String entity;        

    private LocalDateTime createdAt; 

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}