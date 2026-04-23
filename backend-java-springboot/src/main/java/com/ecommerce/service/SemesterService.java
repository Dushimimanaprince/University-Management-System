package com.ecommerce.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ecommerce.models.Semester;
import com.ecommerce.repository.SemesterRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SemesterService {
    
    private final SemesterRepository semesterRepository;

    public Semester addSemester(String semesterName){

        Semester semester = new Semester();

        semester.setSemesterName(semesterName);

        return semesterRepository.save(semester);
    }

    public List<Semester> getSemester(){
        return semesterRepository.findAll();
    }
}
