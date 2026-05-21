package com.ecommerce.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.ecommerce.models.Enrollment;
import com.ecommerce.models.Payments;
import com.ecommerce.models.Semester;
import com.ecommerce.models.Student;
import com.ecommerce.repository.EnrollmentRepository;
import com.ecommerce.repository.PaymentRepository;
import com.ecommerce.repository.SemesterRepository;
import com.ecommerce.repository.StudentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final StudentRepository studentRepository;
    private final SemesterRepository semesterRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final MicrofinanceService microfinanceService;


    private static final float Fee_Per_Credit= 700f;

    public Payments initiateFeePayments(String studentCode, UUID semesterId, String microfinanceUsername){

        Student student = studentRepository.findByStudentCode(studentCode)
            .orElseThrow(()-> new RuntimeException("Student Not Found"));

        Semester semester= semesterRepository.findById(semesterId)
            .orElseThrow(()-> new RuntimeException("Semester not Found"));

        if (paymentRepository.existsByStudentAndSemesterAndActiveTrue(student, semester)){
            throw new RuntimeException("You already have an Active fee payment for this Payment");
        }
        
        List<Enrollment> enrollments=  enrollmentRepository.findByStudentAndSemesterAndActiveTrue(student, semester);

        if (enrollments.isEmpty()){
            throw new RuntimeException("No Active Enrollments for this Semester");
        }

        int totalCredits= enrollments.stream()
            .mapToInt(e-> e.getCourse().getCredits())
            .sum();
        
        float totalFee= Fee_Per_Credit * totalCredits;

        if(!microfinanceService.validateUser(microfinanceUsername)){
            throw new RuntimeException("Micro-Finance Username not Found, Please Try Again");
        }

        String studentName= student.getStudentFirstName() +" "+ student.getStudentLastName();
        String requestId= microfinanceService.createFeeRequest(microfinanceUsername, totalFee, studentName);

        Payments payments= new Payments();

        payments.setSemester(semester);
        payments.setStudent(student);
        payments.setAmount(totalFee);
        payments.setActive(true);
        payments.setStatus("PENDING");
        payments.setRequestId(UUID.fromString(requestId));

        return paymentRepository.save(payments);

    }

    public Payments getMyPayment(String studentCode, UUID semesterId) {

        Student student = studentRepository.findByStudentCode(studentCode)
            .orElseThrow(() -> new RuntimeException("Student not found"));

        Semester semester = semesterRepository.findById(semesterId)
            .orElseThrow(() -> new RuntimeException("Semester not found"));

        return paymentRepository.findByStudentAndSemester(student, semester)
            .orElseThrow(() -> new RuntimeException("No payment found for this semester"));
    }

}