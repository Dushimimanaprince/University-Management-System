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
@Table(name="lecturers")
@NoArgsConstructor
@AllArgsConstructor
public class Lecturer {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID lecturerId;

    @Column(unique=true , nullable = false)
    private String lecturerCode;

    @Column(nullable = false)
    private String lecturerFirstName;

    @Column(nullable = false)
    private String lecturerLastName;

    @Column(unique = true ,nullable = false)
    private String email;

    @Column(unique = true ,nullable = false)
    private String phone;

    @Column(nullable = false)
    private String degree;

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
