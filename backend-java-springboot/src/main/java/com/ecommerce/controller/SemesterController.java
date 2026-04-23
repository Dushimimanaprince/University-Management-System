package com.ecommerce.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.models.Semester;
import com.ecommerce.service.SemesterService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/semesters")
@RequiredArgsConstructor
public class SemesterController {

    private final SemesterService semesterService;

    @PostMapping
    public ResponseEntity<?> addSemester(@RequestBody Map<String,String> body){
        try{
            var semester= semesterService.addSemester(
                body.get("semesterName")
            );
            return ResponseEntity.ok(semester);
        }catch (RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("error",e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?>getAllSemester(){
        return ResponseEntity.ok(semesterService.getSemester());
    }

    @PostMapping("add")
    public Semester addSemester(@RequestBody Semester semester){

        return semesterService.addSemester(semester.getSemesterName());

    }
    
}
