import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [allCourses, setAllCourses] = useState([]);        // all courses for dropdown
  const [enrolledCourses, setEnrolledCourses] = useState([]); // student's enrolled courses
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [department, setDepartments] = useState([]);
  const [lecturer, setLecturers] = useState([]);
  const [semesters, setSemesters] = useState([]);

  const [editForm, setEditForm] = useState({
    courseName: "", courseCode: "", courseDay: "",
    courseTime: "", courseCredits: "", courseDepartment: "", courseLecturer: "",
  });

  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [enrollForm, setEnrollForm] = useState({
    courseId: "", semesterId: "",
  });
  const [enrollError, setEnrollError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const code = localStorage.getItem("code");
    if (!code) { navigate("/login"); return; }

    const fetchAll = async () => {
      try {
        const [studentRes, coursesRes, depsRes, lecturersRes, semestersRes] = await Promise.all([
          API.get(`/students/code/${code}`),
          API.get(`/courses`),
          API.get(`/departments`),
          API.get(`/lecturers`),
          API.get(`/semesters`),
        ]);
        setStudent(studentRes.data);
        setAllCourses(coursesRes.data);
        setDepartments(depsRes.data);
        setLecturers(lecturersRes.data);
        setSemesters(semestersRes.data);

        // fetch enrolled courses for this student
        const enrollRes = await API.get(`/enrollments/student/${studentRes.data.studentId}`);
        setEnrolledCourses(enrollRes.data);
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  // ── ENROLL ──
  const handleEnrollCourseSelect = (e) => {
    const courseId = e.target.value;
    const course = allCourses.find(c => c.courseId === courseId);
    setEnrollForm(prev => ({ ...prev, courseId }));
  };

  const handleEnrollSubmit = async () => {
    if (!enrollForm.courseId || !enrollForm.semesterId) {
      setError("Please select a course and semester."); return;
    }
      
    try {
      await API.post(`/enrollments`, {
        studentId: student.studentId,
        courseId: enrollForm.courseId,
        semesterId: enrollForm.semesterId,
        studentCode: localStorage.getItem("code")
      });
      // refresh enrolled courses
      const enrollRes = await API.get(`/enrollments/student/${student.studentId}`);
      setEnrolledCourses(enrollRes.data);
      setEnrollModalOpen(false);
      setEnrollForm({ courseId: "", semesterId: "" });
    } catch (err) {      
      const message = err.response?.data?.error 
        || err.response?.data?.message
        || "Failed to enroll.";
        
      setEnrollError(message);
        }
  };


  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };


  // ── DELETE (unenroll) ──
  const handleDelete = async (courseId) => {
    const confirmed = window.confirm("Remove this course from your enrollments?");
    if (!confirmed) return;
    try {
      await API.delete(`/enrollments/student/${student.studentId}/course/${courseId}`);
      setEnrolledCourses(prev => prev.filter(c => c.courseId !== courseId));
    } catch (err) { setError("Failed to remove enrollment."); }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <p className="text-[#888888] text-sm">Loading...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">{error}</div>
    </div>
  );

  const fullName = `${student.studentFirstName} ${student.studentLastName}`;
  const initials = `${student.studentFirstName[0]}${student.studentLastName[0]}`.toUpperCase();
  const joinedDate = new Date(student.createdAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  // course selected in enroll modal (for preview)
  const selectedCoursePreview = allCourses.find(c => c.courseId === enrollForm.courseId);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5] p-6">
      
      {/* ── ENROLL MODAL ── */}
      {enrollModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setEnrollModalOpen(false)}>
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 w-full max-w-md shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-white mb-5">Enroll in a Course</h3>

            {/* Course Select */}
            <div className="mb-4">
              <label className="text-xs text-[#555555] uppercase tracking-wider block mb-1.5">Select Course</label>
              <select value={enrollForm.courseId} onChange={handleEnrollCourseSelect}
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#555555] transition-colors">
                <option value="">-- Choose a course --</option>
                {allCourses.map(c => (
                  <option key={c.courseId} value={c.courseId}>
                    {c.courseCode} — {c.courseName}
                  </option>
                ))}
              </select>
            </div>

            {/* Auto-filled preview */}
            {selectedCoursePreview && (
              <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-4 mb-4 space-y-2">
                {[
                  { label: "Course Name", value: selectedCoursePreview.courseName },
                  { label: "Code",        value: selectedCoursePreview.courseCode },
                  { label: "Day",         value: selectedCoursePreview.courseDay },
                  { label: "Time",        value: selectedCoursePreview.courseTime },
                  { label: "Credits",     value: selectedCoursePreview.credits },
                  { label: "Department",  value: selectedCoursePreview.department?.depName },
                  { label: "Lecturer",    value: selectedCoursePreview.lecturer
                      ? `${selectedCoursePreview.lecturer.lecturerFirstName} ${selectedCoursePreview.lecturer.lecturerLastName}`
                      : null },
                ].filter(f => f.value).map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-[#555555]">{label}</span>
                    <span className="text-white font-medium">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Semester Select */}
            <div className="mb-6">
              <label className="text-xs text-[#555555] uppercase tracking-wider block mb-1.5">Semester</label>
              <select value={enrollForm.semesterId}
                onChange={e => setEnrollForm(prev => ({ ...prev, semesterId: e.target.value }))}
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#555555] transition-colors">
                <option value="">-- Choose a semester --</option>
                {semesters.map(s => (
                  <option key={s.semesterId} value={s.semesterId}>{s.semesterName}</option>
                ))}
              </select>
            </div>

            {enrollError && (
                  <p style={{ color: "red", fontSize: "12px", marginBottom: "12px" }}>
                    {enrollError}
                  </p>
                )}

            <div className="flex gap-3">
              <button onClick={() => setEnrollModalOpen(false)}
                className="flex-1 text-sm text-[#888888] border border-[#2a2a2a] px-4 py-2 rounded-lg hover:border-[#555555] hover:text-white transition-colors">
                Cancel
              </button>
              <button onClick={handleEnrollSubmit}
                className="flex-1 text-sm text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors">
                Enroll
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8 max-w-7xl mx-auto">
        <h1 className="text-lg font-semibold text-white tracking-tight">Student Dashboard</h1>
        <button onClick={() => setEnrollModalOpen(true)}
          className="text-sm text-white border bg-blue-900 px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
          Enroll in Course
        </button>
        <button onClick={handleLogout}
          className="text-sm text-[#888888] border border-[#2a2a2a] px-4 py-2 rounded-lg hover:border-[#555555] hover:text-[#e5e5e5] transition-colors">
          Logout
        </button>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 items-start">

        {/* LEFT: Student Profile Card */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-6 shadow-2xl sticky top-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-full bg-[#1f1f1f] border border-[#2a2a2a] flex items-center justify-center text-2xl font-semibold text-white mb-3">
                {initials}
              </div>
              <h3 className="text-lg font-semibold text-white text-center">{fullName}</h3>
              <span className="text-xs text-[#666666] mt-1 bg-[#1f1f1f] px-3 py-1 rounded-full border border-[#2a2a2a]">
                {student.studentCode}
              </span>
            </div>
            <div className="flex justify-center mb-6">
              <span className={`text-xs px-3 py-1 rounded-full border ${
                student.active ? "bg-green-900/30 border-green-700 text-green-400"
                               : "bg-red-900/30 border-red-700 text-red-400"}`}>
                {student.active ? "● Active" : "● Inactive"}
              </span>
            </div>
            <div className="border-t border-[#1f1f1f] mb-5" />
            <div className="space-y-4">
              {[
                { label: "Email",      value: student.email },
                { label: "Phone",      value: student.phone },
                { label: "Department", value: student.department?.depName ?? "—" },
                { label: "Joined",     value: joinedDate },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-xs text-[#555555] uppercase tracking-wider">{label}</span>
                  <span className="text-sm text-[#e5e5e5] font-medium break-all">{value}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-[#444444] text-center mt-6 pt-5 border-t border-[#1f1f1f]">
              Last updated · {new Date(student.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* RIGHT: Enrolled Courses */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-white">Enrolled Courses</h2>
              <p className="text-xs text-[#555555] mt-0.5">{enrolledCourses.length} enrolled</p>
            </div>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl px-6 py-16 text-center">
              <p className="text-sm text-[#555555]">No enrolled courses yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {enrolledCourses.map((enrollment) => {
                // handle both direct course object or nested enrollment.course
                const course = enrollment.course ?? enrollment;
                return (
                  <div key={course.courseId}
                    className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-5 flex flex-col justify-between hover:border-[#2a2a2a] transition-colors">
                    <div className="mb-5">
                      {course.courseCode && (
                        <span className="inline-block text-xs text-[#555555] bg-[#0a0a0a] border border-[#1f1f1f] px-2 py-0.5 rounded-md mb-3">
                          {course.courseCode}
                        </span>
                      )}
                      <h4 className="text-sm font-semibold text-white leading-snug">{course.courseName}</h4>
                      {course.department && (
                        <p className="text-xs text-[#666666] mt-1.5">{course.department.depName}</p>
                      )}
                      {course.courseDay && (
                        <p className="text-xs text-[#555555] mt-2">{course.courseDay} · {course.courseTime}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleDelete(course.courseId)}
                        className="flex-1 text-xs text-[#888888] border border-[#2a2a2a] px-3 py-2 rounded-lg hover:border-red-700 hover:text-red-400 hover:bg-red-900/10 transition-all">
                        Unenroll
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;