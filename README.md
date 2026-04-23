# 🎓 University Management System: Architectural Evolution

This repository showcases the evolution of a comprehensive University Management System. It tracks the progression from a **Django Monolith** to modern **Decoupled Architectures** using **Django Rest Framework (DRF)**, **Spring Boot**, and **React**.

---

## 🏗️ Project Structure & Stacks

The system is organized into three distinct implementations to demonstrate full-stack versatility:

| Stack | Backend | Frontend | Authentication |
| :--- | :--- | :--- | :--- |
| **Modern (Java)** | Spring Boot | React | JWT + Role-based Codes |
| **Modern (Python)** | Django DRF | React | JWT + Role-based Codes |
| **Legacy** | Django | HTML Templates | Session-based |

---

## 🔐 Advanced Authentication System (New)

Both the **Spring Boot** and **Django DRF** versions implement a high-security, custom authentication workflow designed for institutional integrity:

### 🎫 The "Unique Code" Strategy
To prevent unauthorized registrations, the system uses a **Random Code Generator**:
- **Student Code:** Required for student login/signup.
- **Lecturer Code:** Required for academic staff.
- **Admin Code:** Restricted to system overseers.

**Workflow:**
1. **Generation:** The system generates a unique, random alphanumeric code for every user.
2. **Double-Factor Auth:** Authentication requires the **Unique Role Code** + **Password**.
3. **JWT Integration:** Upon successful validation, a **JSON Web Token (JWT)** is issued to handle stateless authorization across the React frontend.

---

## 🚀 Features by Module

### 👨‍🎓 Student Module
- **Unique Code Auth:** Secure access via system-generated Student Codes.
- **Course Management:** Enrollment and Department assignment.
- **Academic Tracking:** Real-time grade viewing and progress monitoring.
- **Finance:** Integrated fee tracking (Connects to [Micro-Finance API](https://github.com/Dushimimanaprince/Micro-Finance-Django)).

### 👨‍🏫 Lecturer Module
- **Academic Verification:** Role restricted by Degree levels (A0, Masters, PhD).
- **Course Orchestration:** Manage curriculum and input student grades.
- **Secure Access:** Authentication via unique Lecturer Code.

### 🛡️ Admin Module
- **System Governance:** Manage Faculties, Departments, Rooms, and Users.
- **Email Validation:** Pre-approves emails for staff registration.
- **Code Management:** Oversee the generation and validation of role-specific codes.

---

## 🛠️ Tech Stack 

### **Backend(s)**
- **Java:** Spring Boot, Spring Security (JWT), Hibernate/JPA.
- **Python:** Django, Django Rest Framework (DRF), SimpleJWT.
- **Database:** PostgreSQL / SQLite.

### **Frontend**
- **React.js:** Hooks (useState, useEffect), Axios for API consumption, React Router for protected routes.
- **Styling:** CSS3 / Modern UI themes.

---

## 📂 Repository Organization

```text
University-Management-System/
├── backend-java-springboot/   # Spring Boot REST API
├── frontend-react-java/       # React UI for Spring Boot
├── backend-django-drf/        # Python/Django REST API
├── frontend-react-django/     # React UI for Django DRF
└── legacy-django-html/        # Original Django Monolith (HTML Templates)
