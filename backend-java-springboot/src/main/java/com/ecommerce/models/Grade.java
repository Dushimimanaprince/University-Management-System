package com.ecommerce.models;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;

import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "grades")
@AllArgsConstructor
@NoArgsConstructor
public class Grade {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID gradeId;

    @OneToOne
    @JoinColumn(name = "enrollment_id")
    private Enrollment enrollment;

    private Double assignment;
    private Double quiz;
    private Double midTerm;
    private Double finalExam;
    private Double score;

    private Boolean isPassed;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        computeGrade();  
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
        computeGrade();  
    }

    
    private void computeGrade() {
        if (assignment != null && quiz != null && midTerm != null && finalExam != null) {
            this.score = (assignment  + quiz  + midTerm  + finalExam );
            this.isPassed = this.score >= 50.0;
           
        }
    }
    
}
