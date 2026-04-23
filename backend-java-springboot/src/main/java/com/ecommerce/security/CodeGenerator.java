package com.ecommerce.security;

import java.util.Random;

import org.springframework.stereotype.Component;

@Component
public class CodeGenerator {

    private final Random random= new Random();


    public int randomNumber(){
        return 1000 + random.nextInt(9000);
    }

    public String generateStudentCode(){
        return "STD-"+randomNumber();
    }
    
    public String generateLecturerCode(){
        return "LET-"+randomNumber();
    }
    public String generateAdminCode(){
        return "ADM-"+randomNumber();
    }
}
