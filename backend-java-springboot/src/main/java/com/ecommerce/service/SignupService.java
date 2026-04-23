package com.ecommerce.service;

import java.util.UUID;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.ecommerce.models.Admin;
import com.ecommerce.models.Department;
import com.ecommerce.models.Lecturer;
import com.ecommerce.models.Student;
import com.ecommerce.repository.AdminRepository;
import com.ecommerce.repository.DepartmentRepository;
import com.ecommerce.repository.EmailValidationRepository;
import com.ecommerce.repository.LecturerRepository;
import com.ecommerce.repository.StudentRepository;
import com.ecommerce.security.CodeGenerator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SignupService {

    private final StudentRepository         studentRepository;
    private final LecturerRepository        lecturerRepository;
    private final AdminRepository           adminRepository;
    private final BCryptPasswordEncoder     passwordEncoder;
    private final CodeGenerator             codeGenerator;
    private final DepartmentRepository      departmentRepository;
    private final EmailValidationRepository emailValidationRepository;
    private final HistoryService            historyService;

    public Student registerStudent(String firstName, String lastName,
                                    String email, String phone, 
                                    String password, UUID departmentId
    ){

        if (studentRepository.existsByEmail(email)){
            throw new RuntimeException("The Email address Already Exists");
        }
        if (studentRepository.existsByPhone(phone)){
            throw new RuntimeException("The Phone Number Already Exists");

        }

        Department department= departmentRepository.findById(departmentId)
            .orElseThrow(() -> new RuntimeException("Department not Found"));

        String code;
        
        do{
            code= codeGenerator.generateStudentCode();
        }while(studentRepository.existsByStudentCode(code));

        Student student= new Student();

        student.setStudentCode(code);
                student.setStudentFirstName(firstName);
        student.setStudentLastName(lastName);
        student.setEmail(email);
        student.setPhone(phone);
        student.setPassword(passwordEncoder.encode(password)); 
        student.setDepartment(department);
        student.setActive(true);

        Student saved= studentRepository.save(student);

        historyService.log(
            "New student registered: " + student.getStudentFirstName(),
            student.getStudentFirstName() + " " + student.getStudentLastName(),
            "STUDENT",
            "STUDENT"
        );

        return saved;
        
    }

    public Lecturer registerLecturer(String firstName, String lastName,
                                    String email, String phone, 
                                    String password,String degree,
                                    UUID departmentId
    ){
        if ( lecturerRepository.existsByEmail(email)){
            throw new RuntimeException("The Email Already Exists");
        }

        if ( lecturerRepository.existsByPhone(phone)){
            throw new RuntimeException("The phone number already exists");
        }

        String role= "Lecturer";
        if (emailValidationRepository.findByEmailAndRole(email, role)
                .isEmpty()){
            throw new  RuntimeException("You not Approved to Sign in this Role");
        }

        Department department= departmentRepository.findById(departmentId)
            .orElseThrow(() -> new RuntimeException("Department Not Fund"));
        
        String code;
        do{
            code= codeGenerator.generateLecturerCode();
        }while(lecturerRepository.existsByLecturerCode(code));
        
        Lecturer lecturer= new Lecturer();

        lecturer.setLecturerCode(code);
        lecturer.setLecturerFirstName(firstName);
        lecturer.setLecturerLastName(lastName);
        lecturer.setEmail(email);
        lecturer.setPhone(phone);
        lecturer.setPassword(passwordEncoder.encode(password));
        lecturer.setDegree(degree);
        lecturer.setDepartment(department);
        lecturer.setActive(true);

        Lecturer saved= lecturerRepository.save(lecturer);

        historyService.log("New Lecturer Added: "+lecturer.getLecturerFirstName(),
            
        lecturer.getLecturerFirstName()+" "+lecturer.getLecturerLastName(),
        "LECTURER",
        "LECTURER"
            );  

        return saved;

    } 

    public Admin registerAdmin(String firstName, String lastName,
                                    String email, String phone, 
                                    String password
    ){
        if ( adminRepository.existsByEmail(email)){
            throw new RuntimeException("The Email Already Exists");
        }

        if ( adminRepository.existsByPhone(phone)){
            throw new RuntimeException("The phone number already exists");
        }

        String role= "Admin";
        if (emailValidationRepository.findByEmailAndRole(email, role)
                .isEmpty()){
            throw new  RuntimeException("You not Approved to Sign in this Role");
        }
        
        String code;
        do{
            code= codeGenerator.generateAdminCode();
        }while(adminRepository.existsByAdminCode(code));
        

        Admin admin = new Admin();
        admin.setAdminCode(code);
        admin.setAdminFirstName(firstName);
        admin.setAdminLastName(lastName);
        admin.setEmail(email);
        admin.setPhone(phone);
        admin.setPassword(passwordEncoder.encode(password));
        admin.setActive(true);

        Admin saved= adminRepository.save(admin);

        historyService.log(
            "New Admin Added: "+ admin.getAdminFirstName(),
            admin.getAdminFirstName()+" "+admin.getAdminLastName(),
            "ADMIN",
            "ADMIN"
        );

        return saved;

    } 




    
}
