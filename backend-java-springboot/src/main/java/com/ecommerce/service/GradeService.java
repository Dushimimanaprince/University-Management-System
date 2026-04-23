package com.ecommerce.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.ecommerce.models.Enrollment;
import com.ecommerce.models.Grade;
import com.ecommerce.models.Lecturer;
import com.ecommerce.repository.EnrollmentRepository;
import com.ecommerce.repository.GradeRepository;
import com.ecommerce.repository.LecturerRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GradeService {

    private final GradeRepository       gradeRepository;
    private final EnrollmentRepository  enrollmentRepository;
    private final LecturerRepository    lecturerRepository;
    private final HistoryService        historyService;


    public Grade addGrade(UUID enrollmentId, Double assignment,
                           Double quiz, Double midTerm, Double finalExam,
                            String lecturerCode) {

        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
        
        Lecturer lecturer= lecturerRepository.findByLecturerCode(lecturerCode)
                .orElseThrow(()-> new RuntimeException("No Lecturer found with Such Code"));


        if (gradeRepository.existsByEnrollment(enrollment)) {
            throw new RuntimeException("Grade already exists for this enrollment");
        }

        if (assignment < 0 || assignment > 20) {
            throw new RuntimeException("Assignment grade must be between 0 and 20");
        }
        if (quiz < 0 || quiz > 10) {
            throw new RuntimeException("Quiz grade must be between 0 and 10");
        }
        if (midTerm < 0 || midTerm > 30) {
            throw new RuntimeException("Mid Term grade must be between 0 and 30");
        }
        if (finalExam < 0 || finalExam > 40) {
            throw new RuntimeException("Final Exam grade must be between 0 and 40");
        }

        Grade grade = new Grade();
        grade.setEnrollment(enrollment);
        grade.setAssignment(assignment);
        grade.setQuiz(quiz);
        grade.setMidTerm(midTerm);
        grade.setFinalExam(finalExam);        

        gradeRepository.save(grade);

        enrollment.setActive(false);
        enrollmentRepository.save(enrollment);

        historyService.log(
            "Grade Submited",
            lecturer.getLecturerFirstName()+" "+lecturer.getLecturerLastName(),
            "LECTURER",
            "GRADE"
        );
        
        return grade;
    }

    public Grade updateGrade(UUID gradeId, Double assignment,
                              Double quiz, Double midTerm, Double finalExam) {

        Grade grade = gradeRepository.findById(gradeId)
                .orElseThrow(() -> new RuntimeException("Grade not found"));

        grade.setAssignment(assignment);
        grade.setQuiz(quiz);
        grade.setMidTerm(midTerm);
        grade.setFinalExam(finalExam);

        return gradeRepository.save(grade);
    }

    public List<Grade> getAllGrades() {
        return gradeRepository.findAll();
    }


    public Grade getGradeByEnrollment(UUID enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
        return gradeRepository.findByEnrollment(enrollment)
                .orElseThrow(() -> new RuntimeException("Grade not found"));
    }
}