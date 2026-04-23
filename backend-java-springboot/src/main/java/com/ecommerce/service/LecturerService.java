package com.ecommerce.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.ecommerce.models.Lecturer;
import com.ecommerce.repository.LecturerRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LecturerService {

    private final LecturerRepository lecturerRepository;

    public List<Lecturer> getAllLecturers() {
        return lecturerRepository.findAll();
    }

    public Lecturer getLecturerById(UUID id) {
        return lecturerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lecturer not found"));
    }

    public Lecturer getLecturerByCode(String code) {
        return lecturerRepository.findByLecturerCode(code)
                .orElseThrow(() -> new RuntimeException("Lecturer not found"));
    }

    public Lecturer updateLecturer(UUID id, String firstName, String lastName,
                                    String email, String phone, String degree) {

        Lecturer lecturer = getLecturerById(id);
        lecturer.setLecturerFirstName(firstName);
        lecturer.setLecturerLastName(lastName);
        lecturer.setEmail(email);
        lecturer.setPhone(phone);
        lecturer.setDegree(degree);

        return lecturerRepository.save(lecturer);
    }

    public Lecturer deleteLecturer(UUID id) {
        Lecturer lecturer = getLecturerById(id);
        lecturer.setActive(false);
        return lecturerRepository.save(lecturer);
    }
}