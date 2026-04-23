package com.ecommerce.models;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payments {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID paymentId;

    private Float amount;
    private String status;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist(){
        this.createdAt=LocalDateTime.now();
        this.updatedAt=LocalDateTime.now();
        if(this.status == null) this.status="PENDING";
    }
    @PreUpdate
    public void preUpdate(){
        this.updatedAt=LocalDateTime.now();
        
    }

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "semester_id")
    private Semester semester;    
    
}
