// App.jsx  ← clean, no useState needed here
import { Routes, Route } from "react-router-dom"
import Signup from "./pages/signup"
import Login from "./pages/login"
import StudentDashboard from "./pages/StudentDashboard"
import LecturerDashboard from "./pages/lecturerDashboard"
import RegisterCourse from "./pages/registercourse"
import AddCourse from "./pages/addCourse"
import CourseStudents from "./pages/CourseStudent"
import AdminPanel from "./pages/admin"
import AdminStudents from "./pages/studentDetails"
import Adminlecturers from "./pages/lecturerdetails"

function App() {
  return (
    <Routes>
      <Route path="signup/" element={<Signup />} />
      <Route path="login/" element={<Login />} />
      <Route path="/" element={<Login />} />
      <Route path="student-dashboard/" element={<StudentDashboard />} />
      <Route path="lecturer-dashboard/" element={<LecturerDashboard />} />
      <Route path="register-course/" element={<RegisterCourse />} />
      <Route path="course/:id/students/" element={<CourseStudents />} />
      <Route path="Admin-Dashboard" element={<AdminPanel />} />
      <Route path="admin/students" element={<AdminStudents />} />
      <Route path="admin/lecturers" element={<Adminlecturers />} />
    </Routes>
  )
}

export default App