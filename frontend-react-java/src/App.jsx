import { BrowserRouter,Routes,Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/LoginPage"
import Signup from "./pages/SignupPage"

import Dashboard from "./pages/student/StudentDashboard";
import AdminDashbaord from "./pages/admin/AdminDashbaord";
import AddCourse from "./pages/admin/AddCourse";
import Courses from "./pages/admin/Courses";
import History from "./pages/admin/History";
import UserSet from "./pages/admin/UserSet";
import Timetable from "./pages/student/Timetable";



function App() {
  return (
    <BrowserRouter>

      <Routes>
      
        <Route path="/" element={<Navigate to="/login" />}/>
        <Route path="/login" element={<Login />} />
        
        <Route path="/signup" element={<Signup />} />
        <Route path="/student" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashbaord />} />
        <Route path="/admin/add-course" element={<AddCourse />} />
        <Route path="/admin/courses" element={<Courses />} />
        <Route path="/admin/records" element={<History />} />
        <Route path="/admin/user-set" element={<UserSet />} />
        <Route path="/student/timetable" element={<Timetable />} />

        

      </Routes>

    </BrowserRouter>
  )
}

export default App