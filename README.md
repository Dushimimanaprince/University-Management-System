# 🎓 University-Management-System  
A powerful and modern University Management System built with **Django**, designed to handle Students, Lecturers, Admins, Courses, Enrollment, Grades, Finance, Authentication, and more.

---

## 🚀 Features

### 👨‍🎓 Student Module
- 📌 Student Registration & Login  
- 🏫 Department Assignment  
- 📝 Course Enrollment  
- 📊 View Grades  
- 💰 Finance & Fees Tracking  

### 👨‍🏫 Lecturer Module
- 🔐 Secure Login  
- 🎓 Degree-level verification (A0 / Masters / PhD)  
- 📚 Manage Courses & Student Grades  

### 🛡️ Admin Module
- 🧑‍💼 Manage Students, Lecturers, and Departments  
- 🔑 Create & Validate Emails via EmailValidation table  
- 🏢 Manage Faculties & Rooms  
- ⚙️ Control overall system structure  

---

## 🏗️ System Architecture

### 🗂️ Models Included
- 👤 `User` (Django Auth)
- 🎓 `Student`
- 🧑‍🏫 `Lecturer`
- 🛡️ `Admin`
- 🏛️ `Faculty`
- 🏬 `Department`
- 📘 `Course`
- 📝 `Enrollment`
- ⭐ `Grade`
- ✉️ `EmailValidation`
- 💸 `Finance`
- 🚪 `Room`

---

## 📸 Screenshots (Optional)
_Add screenshots of UI here if available_

---

## 🧰 Tech Stack

| Technology | Description |
|-----------|-------------|
| 🐍 Python | Backend language |
| 🌐 Django | Main web framework |
| 🗄️ SQLite / PostgreSQL | Database |
| 🎨 HTML, CSS, JS | Frontend |
| 🔐 Django Auth | Authentication system |

---

## ⚙️ Installation

```bash
git clone https://github.com/yourusername/University-Management-System.git
cd University-Management-System
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

---

## 🧪 Running the Project
```bash
python manage.py runserver
```
App runs on:
```
http://127.0.0.1:8000/
```

---

## 👥 Roles in the System

### 🎓 Student
- Registers only with Student role  
- Must select Department  
- Cannot set degree  

### 👨‍🏫 Lecturer
- Must be pre-validated via EmailValidation  
- Must select Degree (A0, Masters, PhD)  

### 🛡️ Admin
- Creates, manages, approves all data  

---

## 🔒 Email Validation Workflow

✔ Admin adds lecturer/admin email  
✔ User signs up  
✔ System checks if email exists in EmailValidation  
✔ Assigns correct role  

---

## 🆕 February 2026 Enhancements

- Integrated a dedicated micro-finance REST API for payments
- Improved transaction handling and error feedback
- Added atomic wallet updates and finance status tracking
- Fixed redirect + POST issues with Django settings

---

## 🤝 Contributing

Pull requests are welcome!  
Please open an issue first to discuss what you would like to change.

---

## 📄 License
This project is under the **MIT License**.

---

## ⭐ Support the Project

If you like this project, don't forget to **star the repository** 🌟

---

## 👤 Author
**Dushimimana Prince**
🇷🇼 Rwanda  
Backend Developer | Django | Python
