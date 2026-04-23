package com.ecommerce.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.ecommerce.models.Admin;
import com.ecommerce.models.Lecturer;
import com.ecommerce.models.Student;
import com.ecommerce.repository.AdminRepository;
import com.ecommerce.repository.LecturerRepository;
import com.ecommerce.repository.StudentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;
    private final StudentRepository studentRepository;
    private final LecturerRepository lecturerRepository;
    private final HistoryService historyService;

    public List<Admin> getAllAdmins(){

        return adminRepository.findAll();
        
    }


    public Admin getAdminByCode(String code){
        return adminRepository.findByAdminCode(code)
            .orElseThrow(() -> new RuntimeException("The Code not Found"));
    }


    public Student setStudentActive(UUID studentId){
        Student student = studentRepository.findById(studentId)
            .orElseThrow(()-> new RuntimeException("Student not Found"));
        student.setActive(!student.isActive());

        Student saved= studentRepository.save(student);
        
        historyService.log(
            "Student De-Activated/Activated",
            student.getStudentFirstName()+" "+student.getStudentLastName(),
            "ADMIN",
            "LECTURER"
        );
        return saved;
    } 

    public Lecturer setLectureActive(UUID lecturerId){
       Lecturer lecturer = lecturerRepository.findById(lecturerId)
            .orElseThrow(()-> new RuntimeException("Lecturer not Found"));
        lecturer.setActive(!lecturer.isActive());
        Lecturer saved= lecturerRepository.save(lecturer);

        historyService.log(
            "Lecturer De-Activated/Activated",
            lecturer.getLecturerFirstName()+" "+lecturer.getLecturerLastName(),
            "ADMIN",
            "LECTURER"
        );

        return saved;
    } 

    
}
