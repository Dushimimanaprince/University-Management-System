import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'

const Courses = () => {
    const [courses, setCourses]         = useState([])
    const [lecturers, setLecturers]     = useState([])
    const [departments, setDepartments] = useState([])
    const [loading, setLoading]         = useState(true)
    const [error, setError]             = useState("")
    const [selected, setSelected]       = useState(null)
    const [editForm, setEditForm]       = useState({
        courseCode:'', courseName:'', courseDepartment:'',
        courseDay:'', courseTime:'', courseCredits:'', courseLecturer:''
    })

    const navigate = useNavigate()

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [courseRes, lecturerRes, deptRes] = await Promise.all([
                    API.get('/courses'),
                    API.get('/lecturers'),
                    API.get('/departments'),
                ])
                setCourses(courseRes.data)
                setLecturers(lecturerRes.data)
                setDepartments(deptRes.data)
            } catch(err) {
                setError("Failed to Load Data")
            } finally {
                setLoading(false)
            }
        }
        fetchAll()
    }, [])

    const handleSelected = (course) => {
        setSelected(course)
        setEditForm({
            courseCode:       course.courseCode             ?? '',
            courseName:       course.courseName             ?? '',
            courseDay:        course.courseDay              ?? '',
            courseTime:       course.courseTime             ?? '',
            courseCredits:    course.credits                ?? '',
            courseDepartment: course.department?.depId      ?? '',
            courseLecturer:   course.lecturer?.lecturerId   ?? ''
        })
    }

    const handleFormChange = (e) => {
        const { name, value } = e.target
        setEditForm(prev => ({ ...prev, [name]: value }))
    }

    const handleEditSave = async () => {
        try {
            const response = await API.put(`/courses/${selected.courseId}`,
                { ...editForm, adminCode: localStorage.getItem("code") })
            
            setCourses(prev =>
                prev.map(c => c.courseId === selected.courseId ? response.data : c)
            )
            
            setSelected(null)
        } catch(err) {
            setError(err.response?.data?.error ?? "Failed to edit course.")
        }
    }

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this course?")
        if (!confirmed) return
        try {
            await API.delete(`/courses/${selected.courseId}`)
            navigate('/admin')
        } catch(err) {
            setError(err.response?.data?.error ?? "Failed to delete course.")
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
            <p className="text-[#888888] text-sm">Loading...</p>
        </div>
    )

    if (error) return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">

            <nav className="border-b border-zinc-800 px-6 py-4 flex items-center gap-3">
                <button onClick={() => navigate(-1)}
                    className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div>
                    <h1 className="text-white font-medium text-sm">Course Details</h1>
                    <p className="text-zinc-500 text-xs">Click a course to see details and edit them</p>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                    <h2 className="text-zinc-400 text-xs uppercase tracking-wider mb-3">Available Courses</h2>
                    <div className="space-y-2">
                        {courses.map((course) => (
                            <button
                                key={course.courseId}
                                onClick={() => handleSelected(course)}
                                className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                                    selected?.courseId === course.courseId
                                        ? "bg-blue-600/10 border-blue-500/50 text-white"
                                        : "bg-zinc-900 border-zinc-800 hover:border-zinc-600 text-zinc-300"
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-sm">{course.courseName}</span>
                                    <span className="text-xs font-mono text-zinc-500">{course.courseCode}</span>
                                </div>
                                <p className="text-xs text-zinc-500 mt-0.5">
                                    {course.department?.depName} · {course.credits} credits
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-zinc-400 text-xs uppercase tracking-wider mb-3">
                        {selected ? "Edit Course" : "Course Details"}
                    </h2>

                    {!selected ? (
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
                            <p className="text-zinc-500 text-sm">Select a course to edit</p>
                        </div>
                    ) : (
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">

                            <div>
                                <label className="text-xs text-zinc-500 uppercase tracking-wider block mb-1">Course Code</label>
                                <input name="courseCode" value={editForm.courseCode} onChange={handleFormChange}
                                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors"/>
                            </div>

                            <div>
                                <label className="text-xs text-zinc-500 uppercase tracking-wider block mb-1">Course Name</label>
                                <input name="courseName" value={editForm.courseName} onChange={handleFormChange}
                                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors"/>
                            </div>

                            <div>
                                <label className="text-xs text-zinc-500 uppercase tracking-wider block mb-1">Credits</label>
                                <input name="courseCredits" value={editForm.courseCredits} onChange={handleFormChange}
                                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors"/>
                            </div>

                            <div>
                                <label className="text-xs text-zinc-500 uppercase tracking-wider block mb-1">Department</label>
                                <select name="courseDepartment" value={editForm.courseDepartment} onChange={handleFormChange}
                                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors">
                                    <option value="">Select Department</option>
                                    {departments.map(d => (
                                        <option key={d.depId} value={d.depId}>{d.depName}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs text-zinc-500 uppercase tracking-wider block mb-1">Lecturer</label>
                                <select name="courseLecturer" value={editForm.courseLecturer} onChange={handleFormChange}
                                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors">
                                    <option value="">Select Lecturer</option>
                                    {lecturers.map(l => (
                                        <option key={l.lecturerId} value={l.lecturerId}>
                                            {l.lecturerFirstName} {l.lecturerLastName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs text-zinc-500 uppercase tracking-wider block mb-1">Day</label>
                                <select name="courseDay" value={editForm.courseDay} onChange={handleFormChange}
                                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors">
                                    <option value="">Select Day</option>
                                    {["Monday","Tuesday","Wednesday","Thursday","Friday"].map(day => (
                                        <option key={day} value={day}>{day}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs text-zinc-500 uppercase tracking-wider block mb-1">Time</label>
                                <select name="courseTime" value={editForm.courseTime} onChange={handleFormChange}
                                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors">
                                    <option value="">Select Time</option>
                                    {["08:30-11:00","11:30-14:00","14:30-17:00","18:00-21:00"].map(time => (
                                        <option key={time} value={time}>{time}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button onClick={() => setSelected(null)}
                                    className="flex-1 text-sm text-zinc-400 border border-zinc-700 px-4 py-2 rounded-lg hover:border-zinc-500 hover:text-white transition-colors">
                                    Cancel
                                </button>
                                <button onClick={handleDelete}
                                    className="flex-1 text-sm text-red-400 border border-red-900 px-4 py-2 rounded-lg hover:bg-red-900/20 transition-colors">
                                    Delete
                                </button>
                                <button onClick={handleEditSave}
                                    className="flex-1 text-sm text-white bg-blue-700 px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                                    Save
                                </button>
                            </div>

                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default Courses;