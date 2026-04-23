package com.ecommerce.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.ecommerce.models.Student;
import com.ecommerce.repository.StudentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;

    public List<Student> getAllStudents(){
        return studentRepository.findAll();
    }

        public Student getStudentById(UUID id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    public Student getStudentByCode(String code) {
        return studentRepository.findByStudentCode(code)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    public Student updateStudent(UUID id, String firstName, String lastName,
                                  String email, String phone) {

        Student student = getStudentById(id);
        student.setStudentFirstName(firstName);
        student.setStudentLastName(lastName);
        student.setEmail(email);
        student.setPhone(phone);

        return studentRepository.save(student);
    }    

    public Student deleteStudent(UUID id) {
        
        Student student =getStudentById(id);
        student.setActive(false);
        return studentRepository.save(student);
    }
    
}
