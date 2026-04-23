import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'

const Timetable = () => {

    const [enrolledCourses, setEnrolledCourses] = useState([])
    const [loading, setLoading]                 = useState(true)
    const [error, setError]                     = useState("")

    const navigate = useNavigate()

    const days  = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    const times = ["08:30-11:00", "11:30-14:00", "14:30-17:00", "18:00-21:00"]

    useEffect(() => {
        const fetchEnrolled = async () => {
            try {
                const code      = localStorage.getItem("code")
                const studentRes = await API.get(`/students/code/${code}`)
                const enrollRes  = await API.get(`/enrollments/student/${studentRes.data.studentId}`)
                setEnrolledCourses(enrollRes.data)
            } catch(err) {
                setError("Failed to load timetable.")
            } finally {
                setLoading(false)
            }
        }
        fetchEnrolled()
    }, [])


    const getCourse = (day, time) => {
        return enrolledCourses.find(enrollment => {
            const course = enrollment.course ?? enrollment
            return course.courseDay === day && course.courseTime === time
        })
    }

    if (loading) return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            <p className="text-zinc-500 text-sm">Loading...</p>
        </div>
    )

    if (error) return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">

            {/* Nav */}
            <nav className="border-b border-zinc-800 px-6 py-4 flex items-center gap-3">
                <button onClick={() => navigate(-1)}
                    className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div>
                    <h1 className="text-white font-medium text-sm">My Timetable</h1>
                    <p className="text-zinc-500 text-xs">{enrolledCourses.length} enrolled courses</p>
                </div>
            </nav>

            <div className="px-6 py-8 overflow-x-auto">
                <table className="w-full min-w-175 border-collapse">

                    {/* ── HEADER ROW — Days ── */}
                    <thead>
                        <tr>
                            {/* empty top-left corner */}
                            <th className="w-32 p-3 text-left text-xs text-zinc-500 uppercase tracking-wider border-b border-r border-zinc-800">
                                Time / Day
                            </th>
                            {days.map(day => (
                                <th key={day}
                                    className="p-3 text-center text-xs text-zinc-400 uppercase tracking-wider border-b border-r border-zinc-800 last:border-r-0">
                                    {day}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* ── BODY ROWS — Times ── */}
                    <tbody>
                        {times.map(time => (
                            <tr key={time} className="hover:bg-zinc-900/50 transition-colors">

                                {/* Time label */}
                                <td className="p-3 text-xs text-zinc-500 font-mono border-b border-r border-zinc-800 whitespace-nowrap">
                                    {time}
                                </td>

                                {/* Day cells */}
                                {days.map(day => {
                                    const enrollment = getCourse(day, time)
                                    const course     = enrollment?.course ?? enrollment

                                    return (
                                        <td key={day}
                                            className="p-2 border-b border-r border-zinc-800 last:border-r-0 text-center">
                                            {enrollment ? (
                                                <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg px-3 py-2">
                                                    <p className="text-xs text-white font-medium">
                                                        {course.courseName}
                                                    </p>
                                                    <p className="text-xs text-zinc-400 mt-0.5">
                                                        {course.courseCode}
                                                    </p>
                                                    {course.lecturer && (
                                                        <p className="text-xs text-blue-400 mt-0.5">
                                                            {course.lecturer.lecturerFirstName} {course.lecturer.lecturerLastName}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-zinc-700 text-xs">—</span>
                                            )}
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Timetable