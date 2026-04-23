package com.ecommerce.models;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "email_validation")
@NoArgsConstructor
@AllArgsConstructor
public class EmailValidation {

    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    private UUID validId;

    private String email;

    private String role;
    
}
