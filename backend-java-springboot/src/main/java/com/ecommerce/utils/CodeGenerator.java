package com.ecommerce.utils;

import java.util.Random;

public class CodeGenerator {

    public static Random random= new Random();

        public static String generateStudentCode(){
        return "STD-" + (1000 + random.nextInt(9000));
    }

    public static String generateLecturerCode(){
        return "LET-" + (1000 + random.nextInt(9000));
    }

    public static String generateAdminCode(){
        return "ADN-" + (1000 + random.nextInt(9000));
    }
    
}
