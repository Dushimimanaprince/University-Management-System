package com.ecommerce.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.ecommerce.models.Department;
import com.ecommerce.repository.DepartmentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public Department createDepartment(String name) {
        Department department = new Department();
        department.setDepName(name);
        return departmentRepository.save(department);
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Department getDepartmentById(UUID id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));
    }

    public Department updateDepartment(UUID id, String name) {
        Department department = getDepartmentById(id);
        department.setDepName(name);
        return departmentRepository.save(department);
    }

    public void deleteDepartment(UUID id) {
        departmentRepository.deleteById(id);
    }
}