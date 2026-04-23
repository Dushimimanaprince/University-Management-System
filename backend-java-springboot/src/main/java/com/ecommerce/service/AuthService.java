package com.ecommerce.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.ecommerce.repository.AdminRepository;
import com.ecommerce.repository.LecturerRepository;
import com.ecommerce.repository.StudentRepository;
import com.ecommerce.security.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final StudentRepository     studentRepository;
    private final LecturerRepository    lecturerRepository;
    private final AdminRepository       adminRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil               jwtUtil;

    public Map<String,String> login(String code, String password ){
        Map<String,String> response= new HashMap<>();

        if (code.startsWith("STD-")){

            var student= studentRepository.findByStudentCode(code)
                .orElseThrow(() -> new RuntimeException("Student code Not Found"));
            
            if(!student.isActive()){
                throw new RuntimeException("Your Account Been Deactivated");
            }

            if (!passwordEncoder.matches(password, student.getPassword())){
                throw new RuntimeException("Wrong Password");
            }

            String token=  jwtUtil.generateToken(code, "STUDENT");
            response.put("token", token);
            response.put("role", "STUDENT");
            response.put ("name", student.getStudentFirstName());
            response.put("code", code);
        }else if (code.startsWith("LET-")){

            var lecturer= lecturerRepository.findByLecturerCode(code)
                .orElseThrow(() -> new RuntimeException("Lecturer Code Not Found"));

            if(!lecturer.isActive()){
                throw new RuntimeException("Your Account Been Deactivated");
            }

            if (!passwordEncoder.matches(password, lecturer.getPassword())){
                throw new RuntimeException("Wrong password");
            }

            String token= jwtUtil.generateToken(code, "LECTURER");
            response.put("token", token);
            response.put("role", "LECTURER");
            response.put("name",lecturer.getLecturerFirstName());
            response.put("code", code);

        } else if (code.startsWith("ADM-")) {

            var admin = adminRepository.findByAdminCode(code)
                    .orElseThrow(() -> new RuntimeException("Admin not found"));

            if(!admin.isActive()){
                throw new RuntimeException("Your Account Been Deactivated");
            }

            if (!passwordEncoder.matches(password, admin.getPassword())) {
                throw new RuntimeException("Wrong password");
            }

            String token = jwtUtil.generateToken(code, "ADMIN");
            response.put("token", token);
            response.put("role", "ADMIN");
            response.put("name", admin.getAdminFirstName());
            response.put("code", code);

        } else {
            throw new RuntimeException("Invalid Code format");
        }

        return response;
    } 
    
}
