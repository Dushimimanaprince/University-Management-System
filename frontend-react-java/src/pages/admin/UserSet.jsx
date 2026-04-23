import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'

const UserSet = () => {

    const [students, setStudents]   = useState([])
    const [lecturers, setLecturers] = useState([])
    const [loading, setLoading]     = useState(true)
    const [error, setError]         = useState("")

    const navigate = useNavigate()

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [studentsRes, lecturersRes] = await Promise.all([
                    API.get('/students'),
                    API.get('/lecturers'),
                ])
                setStudents(studentsRes.data)
                setLecturers(lecturersRes.data)
            } catch(err) {
                setError("Failed to load data.")
            } finally {
                setLoading(false)
            }
        }
        fetchAll()
    }, [])

    const handleToggleStudent = async (studentId) => {
        try {
            const response = await API.put(`/admin/student-set/${studentId}`)
            setStudents(prev =>
                prev.map(s => s.studentId === studentId ? response.data : s)
            )
        } catch(err) {
            setError("Failed to update student status.")
        }
    }

    const handleToggleLecturer = async (lecturerId) => {
        try {
            const response = await API.put(`/admin/lecturer-set/${lecturerId}`)

            setLecturers(prev =>
                prev.map(l => l.lecturerId === lecturerId ? response.data : l)
            )
        } catch(err) {
            setError("Failed to update lecturer status.")
        }
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
                    <h1 className="text-white font-medium text-sm">User Management</h1>
                    <p className="text-zinc-500 text-xs">Toggle users active or inactive</p>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-8 space-y-10">

                {/* ── STUDENTS ── */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg">👨‍🎓</span>
                        <h2 className="text-white font-semibold text-sm">Students</h2>
                        <span className="text-xs text-zinc-500 bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded-full">
                            {students.length}
                        </span>
                    </div>

                    <div className="space-y-2">
                        {students.map(student => (
                            <div key={student.studentId}
                                className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 flex items-center justify-between gap-4 hover:border-zinc-700 transition-colors">

                                {/* Info */}
                                <div>
                                    <p className="text-sm text-white font-medium">
                                        {student.studentFirstName} {student.studentLastName}
                                    </p>
                                    <p className="text-xs text-zinc-500 mt-0.5">
                                        {student.studentCode} · {student.email}
                                    </p>
                                </div>

                                {/* Toggle button */}
                                <button
                                    onClick={() => handleToggleStudent(student.studentId)}
                                    className={`text-xs px-4 py-1.5 rounded-full border transition-all ${
                                        student.active
                                            ? "bg-green-900/30 border-green-700 text-green-400 hover:bg-red-900/30 hover:border-red-700 hover:text-red-400"
                                            : "bg-red-900/30 border-red-700 text-red-400 hover:bg-green-900/30 hover:border-green-700 hover:text-green-400"
                                    }`}>
                                    {student.active ? "● Active" : "● Inactive"}
                                </button>

                            </div>
                        ))}
                    </div>
                </div>

                {/* ── LECTURERS ── */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg">👨‍🏫</span>
                        <h2 className="text-white font-semibold text-sm">Lecturers</h2>
                        <span className="text-xs text-zinc-500 bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded-full">
                            {lecturers.length}
                        </span>
                    </div>

                    <div className="space-y-2">
                        {lecturers.map(lecturer => (
                            <div key={lecturer.lecturerId}
                                className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 flex items-center justify-between gap-4 hover:border-zinc-700 transition-colors">

                                {/* Info */}
                                <div>
                                    <p className="text-sm text-white font-medium">
                                        {lecturer.lecturerFirstName} {lecturer.lecturerLastName}
                                    </p>
                                    <p className="text-xs text-zinc-500 mt-0.5">
                                        {lecturer.lecturerCode} · {lecturer.email}
                                    </p>
                                </div>

                                {/* Toggle button */}
                                <button
                                    onClick={() => handleToggleLecturer(lecturer.lecturerId)}
                                    className={`text-xs px-4 py-1.5 rounded-full border transition-all ${
                                        lecturer.active
                                            ? "bg-green-900/30 border-green-700 text-green-400 hover:bg-red-900/30 hover:border-red-700 hover:text-red-400"
                                            : "bg-red-900/30 border-red-700 text-red-400 hover:bg-green-900/30 hover:border-green-700 hover:text-green-400"
                                    }`}>
                                    {lecturer.active ? "● Active" : "● Inactive"}
                                </button>

                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default UserSet