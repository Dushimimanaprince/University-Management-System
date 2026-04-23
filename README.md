# 🎓 University Management System: Architectural Evolution

> A comprehensive, production-ready University Management System showcasing the evolution from a **Django Monolith** to modern **Decoupled Architectures**. This repository demonstrates full-stack versatility across multiple technology stacks with enterprise-grade security and scalability.

[![Repository Status](https://img.shields.io/badge/status-active-brightgreen.svg)](https://github.com/Dushimimanaprince/University-Management-System)
[![JavaScript](https://img.shields.io/badge/JavaScript-53%25-F7DF1E.svg?logo=javascript)](https://github.com/Dushimimanaprince/University-Management-System)
[![Python](https://img.shields.io/badge/Python-25%25-3776AB.svg?logo=python)](https://github.com/Dushimimanaprince/University-Management-System)
[![Java](https://img.shields.io/badge/Java-22%25-007396.svg?logo=java)](https://github.com/Dushimimanaprince/University-Management-System)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 📋 Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Security](#security)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

---

## 🎯 Overview

This project demonstrates an **enterprise-level University Management System** with three distinct architectural implementations:

| 🔹 Implementation | Purpose | Use Case |
|:---|:---|:---|
| **Modern (Java/Spring Boot)** | Production-ready, scalable REST API | Large institutional deployments |
| **Modern (Python/Django DRF)** | Rapid development, data-rich operations | Mid-sized institutions |
| **Legacy (Django Monolith)** | Educational reference, session-based auth | Historical maintenance |

Each implementation maintains full feature parity while demonstrating different architectural paradigms and technology choices.

---

## 🏗️ Architecture

### Architectural Progression

```
┌─────────────────────────────────────────────────────────────┐
│           MONOLITHIC ARCHITECTURE (Legacy)                  │
│   Django + HTML Templates + Session-Based Auth              │
│         (Single deployable unit)                             │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│        DECOUPLED ARCHITECTURE (Modern)                       │
│                                                              │
│  ┌─────────────────────────┐    ┌──────────────────────┐  │
│  │   Backend (REST API)    │    │   Frontend (React)   │  │
│  │  - Django DRF / Spring  │◄──►│   - Responsive UI    │  │
│  │  - JWT Authentication  │    │   - Dynamic Updates  │  │
│  │  - Database Operations │    │   - Protected Routes │  │
│  └─────────────────────────┘    └──────────────────────┘  │
│                                                              │
│  ◄─────────────── STATELESS API COMMUNICATION ─────────────►│
└─────────────────────────────────────────────────────────────┘
```

### Implementation Comparison

| Aspect | Spring Boot | Django DRF | Django Legacy |
|:---|:---|:---|:---|
| **Startup Time** | ~2-3s | ~1-2s | ~1-2s |
| **Throughput** | Very High | High | Medium |
| **Scalability** | Horizontal | Horizontal | Vertical |
| **Learning Curve** | Moderate | Gentle | Steep (Legacy) |
| **Community Support** | Excellent | Excellent | Good |
| **Production Ready** | ✅ Yes | ✅ Yes | ⚠️ Limited |

---

## 📂 Project Structure & Organization

```
University-Management-System/
│
├── 📁 backend-java-springboot/          # Spring Boot REST API
│   ├── src/
│   │   ├── main/java/com/university/
│   │   │   ├── controllers/             # REST endpoints
│   │   │   ├── services/                # Business logic
│   │   │   ├── entities/                # JPA entities
│   │   │   ├── repositories/            # Data access layer
│   │   │   ├── security/                # JWT & Role-based config
│   │   │   └── utils/                   # Helper utilities
│   │   └── resources/
│   │       └── application.properties
│   └── pom.xml                          # Maven dependencies
│
├── 📁 frontend-react-java/              # React UI for Spring Boot
│   ├── src/
│   │   ├── components/                  # React components
│   │   ├── pages/                       # Page components
│   │   ├── services/                    # API client services
│   │   ├── context/                     # React Context (Auth, etc.)
│   │   ├── hooks/                       # Custom hooks
│   │   ├── utils/                       # Utility functions
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── 📁 backend-django-drf/               # Python/Django REST API
│   ├── university/
│   │   ├── settings.py                  # Django configuration
│   │   ├── urls.py                      # URL routing
│   │   └── wsgi.py
��   ├── apps/
│   │   ├── students/
│   │   │   ├── models.py                # Student models
│   │   │   ├── views.py                 # API views
│   │   │   ├── serializers.py           # DRF serializers
│   │   │   └── urls.py
│   │   ├── lecturers/                   # Similar structure
│   │   ├── courses/                     # Similar structure
│   │   ├── departments/                 # Similar structure
│   │   └── authentication/              # Auth app
│   ├── manage.py
│   └── requirements.txt
│
├── 📁 frontend-react-django/            # React UI for Django DRF
│   └── [Similar structure to frontend-react-java]
│
├── 📁 legacy-django-html/               # Original Django Monolith
│   ├── django_project/
│   ├── templates/                       # HTML templates
│   ├── static/                          # CSS, JS, images
│   └── manage.py
│
├── 📁 backend/                          # Shared utilities (if any)
├── 📁 University/                       # Additional resources
│
├── README.md                            # This file
├── .gitattributes
└── manage.py                            # Root-level management

```

---

## 🔐 Advanced Authentication System

### 🎫 The "Unique Code" Strategy (Dual-Factor Authentication)

To prevent unauthorized registrations and ensure institutional integrity, the system implements a **Random Code Generator** with role-specific access control:

#### Code Types:
- **🎓 Student Code:** Required for student registration and login
- **👨‍🏫 Lecturer Code:** Required for academic staff access
- **🔑 Admin Code:** Restricted to system administrators

#### Authentication Workflow:

```
1. CODE GENERATION
   └─ System generates unique, random alphanumeric code for each user role
   
2. REGISTRATION/LOGIN
   ├─ User submits: [Role Code] + [Username] + [Password]
   └─ System validates code existence and type
   
3. VERIFICATION
   ├─ Code matches user role requirements
   ├─ Password hashed comparison (bcrypt/Argon2)
   └─ Rate limiting & brute-force protection
   
4. JWT ISSUANCE
   ├─ Upon success: JWT token generated
   ├─ Token contains: user_id, role, permissions
   ├─ Expiration: configurable (default: 24 hours)
   └─ Refresh token support for extended sessions
   
5. STATELESS AUTHORIZATION
   └─ JWT sent in Authorization header for all requests
      (No server-side session storage required)
```

#### Security Features:
- ✅ Role-based access control (RBAC)
- ✅ JWT stateless authentication
- ✅ Double-factor verification (Code + Password)
- ✅ Password hashing (bcrypt/Argon2)
- ✅ Rate limiting on login attempts
- ✅ CORS configuration for frontend integration
- ✅ HTTPS/TLS support
- ✅ SQL injection prevention (ORM usage)

---

## 🚀 Features by Module

### 👨‍🎓 Student Module

#### Core Features:
- **🔐 Unique Code Authentication:** Secure access via system-generated Student Codes
- **📚 Course Management:** 
  - Browse available courses by department
  - Enroll in courses with capacity limits
  - Drop courses before deadlines
  - Track course status (Enrolled, Completed, Failed)
- **📊 Academic Tracking:**
  - Real-time grade viewing and GPA calculation
  - Progress monitoring per semester
  - Transcript generation
  - Academic standing alerts
- **💰 Finance Integration:**
  - Fee tracking and payment history
  - Integration with [Micro-Finance API](https://github.com/Dushimimanaprince/Micro-Finance-Django)
  - Payment reminders
  - Scholarship information

#### API Endpoints:
- `GET /api/students/profile/` - Student profile
- `POST /api/students/courses/enroll/` - Enroll in course
- `GET /api/students/grades/` - View grades
- `GET /api/students/fees/` - View fees status

---

### 👨‍🏫 Lecturer Module

#### Core Features:
- **🎓 Academic Verification:** Role restricted by Degree levels:
  - **A0 Level:** Undergraduate courses
  - **Masters:** Master's level courses
  - **PhD:** Advanced research courses
- **📝 Course Orchestration:**
  - Design course curriculum
  - Input and manage student grades
  - Track attendance
  - Create assessments and assignments
- **🔒 Secure Access:** Authentication via unique Lecturer Code with role-based permissions
- **📋 Grade Management:**
  - Bulk grade uploads
  - Grade distribution analytics
  - Late submission handling

#### API Endpoints:
- `GET /api/lecturers/courses/` - List assigned courses
- `POST /api/lecturers/grades/` - Submit grades
- `GET /api/lecturers/students/` - View enrolled students
- `POST /api/lecturers/attendance/` - Record attendance

---

### 🛡️ Admin Module

#### Core Features:
- **🏢 System Governance:**
  - Manage Faculties (Science, Engineering, Arts, etc.)
  - Manage Departments (Computer Science, Physics, etc.)
  - Manage Buildings and Rooms (capacity, resources)
  - User management (activation, deactivation)
- **📧 Email Validation:**
  - Pre-approve emails for staff registration
  - Send bulk notifications
  - Email templates for notifications
- **🔑 Code Management:**
  - Generate role-specific codes in bulk
  - Track code usage and expiration
  - Revoke compromised codes
  - Monitor code distribution
- **📊 Analytics & Reporting:**
  - System-wide enrollment statistics
  - Financial reports
  - Performance metrics
  - Audit logs

#### API Endpoints:
- `GET /api/admin/faculties/` - List faculties
- `POST /api/admin/codes/generate/` - Generate codes
- `GET /api/admin/users/` - Manage users
- `GET /api/admin/analytics/` - System analytics

---

## 🛠️ Tech Stack

### Backend Implementations

#### **Java - Spring Boot Stack**
```
Framework:        Spring Boot 3.x
ORM:              Hibernate/JPA
Security:         Spring Security + JWT (jjwt)
Validation:       Jakarta Bean Validation
Database:         PostgreSQL (Primary) / H2 (Testing)
Build Tool:       Maven
Testing:          JUnit 5, Mockito
Logging:          SLF4J with Logback
```

#### **Python - Django DRF Stack**
```
Framework:        Django 4.x / 5.x
REST API:         Django Rest Framework (DRF)
Authentication:   djangorestframework-simplejwt
ORM:              Django ORM
Validation:       Django Validators + DRF Serializers
Database:         PostgreSQL (Primary) / SQLite (Development)
Task Queue:       Celery (optional)
Testing:          pytest, pytest-django
Logging:          Python logging module
```

#### **Database**
- **PostgreSQL:** Production-grade relational database
- **SQLite:** Development and testing

### Frontend Implementation

#### **React.js Stack**
```
Library:          React 18.x
Build Tool:       Vite (Modern replacement for CRA)
Routing:          React Router v6
State Management: React Context API + useState hooks
HTTP Client:      Axios
Styling:          CSS3 / Tailwind CSS / Material-UI
Form Handling:    React Hook Form / Formik
Testing:          Vitest, React Testing Library
```

---

## 📊 Database Schema Highlights

### Core Entities:

```
┌─────────────────┐
│      User       │
├─────────────────┤
│ id (PK)         │
│ username        │
│ email           │
│ password_hash   │
│ role            │
│ code            │
│ created_at      │
└─────────────────┘
        │
        ├──────────────┬──────────────┬──────────────┐
        │              │              │              │
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│    Student      │ │    Lecturer     │ │     Admin       │
├─────────────────┤ ├─────────────────┤ ├─────────────────┤
│ id (PK, FK)     │ │ id (PK, FK)     │ │ id (PK, FK)     │
│ user_id         │ │ user_id         │ │ user_id         │
│ department_id   │ │ department_id   │ │ permissions     │
│ enrollment_year │ │ degree_level    │ │ created_at      │
└─────────────────┘ └─────────────────┘ └─────────────────┘

┌──────────────────┐       ┌──────────────────┐
│   Department     │       │     Faculty      │
├──────────────────┤       ├──────────────────┤
│ id (PK)          │   ┌──│ id (PK)          │
│ name             │   │  │ name             │
│ faculty_id (FK)  │───┘  │ building_id (FK) │
│ head_id (FK)     │      └──────────────────┘
└──────────────────┘

┌──────────────────┐       ┌──────────────────┐
│     Course       │       │     Grade        │
├──────────────────┤       ├──────────────────┤
│ id (PK)          │   ┌──│ id (PK)          │
│ code             │   │  │ student_id (FK)  │
│ title            │   │  │ course_id (FK)   │
│ department_id    │   │  │ score            │
│ lecturer_id (FK) │   │  │ grade_letter     │
│ credits          │   │  │ semester         │
│ capacity         │───┘  └──────────────────┘
└──────────────────┘
```

---

## 🚀 Installation & Setup

### Prerequisites
- Git
- Node.js 18+ (for Frontend)
- Python 3.9+ (for Django)
- Java 17+ (for Spring Boot)
- PostgreSQL 12+ (optional, SQLite for development)

### Spring Boot Backend Setup

```bash
cd backend-java-springboot

# Build with Maven
mvn clean install

# Run application
mvn spring-boot:run

# Server runs on http://localhost:8080
```

### Django Backend Setup

```bash
cd backend-django-drf

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver

# Server runs on http://localhost:8000
```

### React Frontend Setup (for Django)

```bash
cd frontend-react-django

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8000" > .env

# Start development server
npm run dev

# Frontend runs on http://localhost:5173
```

### React Frontend Setup (for Spring Boot)

```bash
cd frontend-react-java

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8080" > .env

# Start development server
npm run dev

# Frontend runs on http://localhost:5173
```

---

## 📚 API Documentation

### Authentication Endpoints

#### Register Student
```http
POST /api/auth/register/
Content-Type: application/json

{
  "username": "student_001",
  "email": "student@university.edu",
  "password": "SecurePass123!",
  "code": "STU-XXXXX-XXXXX"
}

Response: 201 Created
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "student_001",
    "role": "student"
  }
}
```

#### Login
```http
POST /api/auth/login/
Content-Type: application/json

{
  "username": "student_001",
  "code": "STU-XXXXX-XXXXX",
  "password": "SecurePass123!"
}

Response: 200 OK
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

## 🧪 Testing

### Django Tests
```bash
cd backend-django-drf

# Run all tests
pytest

# Run specific test module
pytest apps/students/tests.py

# With coverage
pytest --cov=apps
```

### Spring Boot Tests
```bash
cd backend-java-springboot

# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=StudentControllerTest
```

### Frontend Tests
```bash
cd frontend-react-django

# Run tests
npm run test

# Watch mode
npm run test:watch
```

---

## 📖 Documentation

For detailed documentation, see:
- **[Backend Django DRF](./backend-django-drf/README.md)** - API documentation
- **[Backend Spring Boot](./backend-java-springboot/README.md)** - Configuration & setup
- **[Frontend React](./frontend-react-django/README.md)** - Component documentation

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Standards
- Follow PEP 8 (Python) / Google Java Style Guide
- Write tests for new features
- Update documentation
- Use meaningful commit messages

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👤 Author

**Dushimimanaprince**
- GitHub: [@Dushimimanaprince](https://github.com/Dushimimanaprince)
- Related Project: [Micro-Finance API](https://github.com/Dushimimanaprince/Micro-Finance-Django)

---

## 🙏 Acknowledgments

- Django & Django Rest Framework community
- Spring Boot community
- React.js community
- PostgreSQL documentation

---

## 📞 Support

For issues, questions, or suggestions, please:
- Open a GitHub Issue
- Check existing issues first
- Provide detailed error messages and steps to reproduce

---

**Last Updated:** April 23, 2026  
**Status:** Active Development ✅
