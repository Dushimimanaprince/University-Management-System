package com.ecommerce.models;
import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name="students")
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID studentId;

    @Column(unique=true , nullable = false)
    private String studentCode;

    @Column(nullable = false)
    private String studentFirstName;

    @Column(nullable = false)
    private String studentLastName;

    @Column(unique = true ,nullable = false)
    private String email;

    @Column(unique = true ,nullable = false)
    private String phone;

    @Column(nullable = false)   
    private String password;

    private boolean active;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;
    
}
