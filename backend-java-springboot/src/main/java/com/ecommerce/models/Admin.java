package com.ecommerce.models;
import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name="admins")
@NoArgsConstructor
@AllArgsConstructor
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID adminId;

    @Column(unique=true , nullable = false)
    private String adminCode;

    @Column(nullable = false)
    private String adminFirstName;

    @Column(nullable = false)
    private String adminLastName;

    @Column(unique = true ,nullable = false)
    private String email;

    @Column(unique = true ,nullable = false)
    private String phone;

    private boolean active;

    @Column(nullable = false)   
    private String password;
    

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
}
