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
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name="enrollments", uniqueConstraints = 
    @UniqueConstraint(columnNames = {"student_id","course_id"})
)
@NoArgsConstructor
@AllArgsConstructor
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID enrollmentId;

    @ManyToOne
    @JoinColumn(name = "semester_id")
    private Semester semester;

    @ManyToOne
    @JoinColumn(name="course_id")
    private Course course;

    @ManyToOne
    @JoinColumn(name="student_id")
    private Student student;
    private Boolean active;
    


    private LocalDateTime created_at;
    private LocalDateTime update_at;

    @PrePersist
    public void prePersist(){
        this.created_at= LocalDateTime.now();
        this.update_at= LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate(){
        this.update_at= LocalDateTime.now();
    }


    
}
