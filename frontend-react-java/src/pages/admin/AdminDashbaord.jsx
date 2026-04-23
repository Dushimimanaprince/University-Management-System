import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';

const AdminDashboard = () => {

    const [user, setUser] = useState(null)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        students: 0,
        courses: 0,
        lecturers: 0,
        departments: 0,
    })

    const navigate = useNavigate();

    useEffect(() => {
        const code = localStorage.getItem('code')
        if (!code) { navigate("/"); return; }

        const fetchAll = async () => {
            try {
                const [adminRes, studentsRes, coursesRes, lecturersRes, departmentsRes] = await Promise.all([
                    API.get(`/admin/code/${code}`),
                    API.get(`/students`),
                    API.get(`/courses`),
                    API.get(`/lecturers`),
                    API.get(`/departments`),
                ])
                setUser(adminRes.data)
                setStats({
                    students: studentsRes.data.length,
                    courses: coursesRes.data.length,
                    lecturers: lecturersRes.data.length,
                    departments: departmentsRes.data.length,
                })
            } catch (err) {
                setError("Failed to load data")
            } finally {
                setLoading(false)
            }
        }
        fetchAll();
    }, [])

    const handleLogout = () => {
        localStorage.clear();
        navigate("/")
    }

    if (loading) return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
            <p className="text-[#888888] text-sm">Loading...</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
            </div>
        </div>
    );

    const fullName = `${user.adminFirstName} ${user.adminLastName}`
    const initials = `${user.adminFirstName[0]}${user.adminLastName[0]}`.toUpperCase();

    const statCards = [
        { label: "Students",    value: stats.students,    icon: "👨‍🎓", color: "border-blue-800 bg-blue-900/20" },
        { label: "Courses",     value: stats.courses,     icon: "📚", color: "border-purple-800 bg-purple-900/20" },
        { label: "Lecturers",   value: stats.lecturers,   icon: "👨‍🏫", color: "border-green-800 bg-green-900/20" },
        { label: "Departments", value: stats.departments, icon: "🏛️", color: "border-orange-800 bg-orange-900/20" },
    ]

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5] p-6">

            {/* Top Bar */}
            <div className="flex items-center justify-between py-5 mb-8 max-w-7xl mx-auto">
                <h1 className="text-lg font-semibold text-white tracking-tight">Admin Dashboard</h1>
                <button onClick={handleLogout}
                    className="text-sm text-[#888888] border border-[#2a2a2a] px-4 py-2 rounded-lg hover:border-red-800 hover:text-[#e5e5e5] hover:bg-red-950 transition-colors">
                    Logout
                </button>
            </div>

            {/* Main Layout */}
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 items-start">

                {/* LEFT: Admin Profile Card */}
                <div className="w-full lg:w-80 shrink-0">
                    <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-6 shadow-2xl sticky top-6">
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-20 h-20 rounded-full bg-[#1f1f1f] border border-[#2a2a2a] flex items-center justify-center text-2xl font-semibold text-white mb-3">
                                {initials}
                            </div>
                            <h3 className="text-lg font-semibold text-white text-center">{fullName}</h3>
                            <span className="text-xs text-[#666666] mt-1 bg-[#1f1f1f] px-3 py-1 rounded-full border border-[#2a2a2a]">
                                {user.adminCode}
                            </span>
                        </div>

                        <div className="flex justify-center mb-6">
                            <span className={`text-xs px-3 py-1 rounded-full border ${
                                user.active
                                    ? "bg-green-900/30 border-green-700 text-green-400"
                                    : "bg-red-900/30 border-red-700 text-red-400"}`}>
                                {user.active ? "● Active" : "● Inactive"}
                            </span>
                        </div>

                        <div className="border-t border-[#1f1f1f] mb-5" />

                        <div className="space-y-4">
                            {[
                                { label: "Email", value: user.email },
                                { label: "Phone", value: user.phone },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex flex-col gap-0.5">
                                    <span className="text-xs text-[#555555] uppercase tracking-wider">{label}</span>
                                    <span className="text-sm text-[#e5e5e5] font-medium break-all">{value}</span>
                                </div>
                            ))}
                        </div>

                        <p className="text-xs text-[#444444] text-center mt-6 pt-5 border-t border-[#1f1f1f]">
                            Last updated · {new Date(user.updatedAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* RIGHT: Stats Cards */}
                <div className="flex-1 min-w-0">
                    <h2 className="text-base font-semibold text-white mb-5">Overview</h2>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                        {statCards.map(({ label, value, icon, color }) => (
                            <div key={label}
                                className={`border rounded-2xl p-6 flex items-center gap-4 ${color}`}>
                                <div className="text-4xl">{icon}</div>
                                <div>
                                    <p className="text-3xl font-bold text-white">{value}</p>
                                    <p className="text-sm text-[#888888] mt-0.5">{label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ✅ Button below cards */}
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={() => navigate("/admin/add-course")}
                            className="flex items-center gap-2 bg-blue-900 hover:bg-blue-950 text-white text-sm font-medium px-5 py-3 rounded-xl border border-blue-700
                             hover:border-blue-600 transition-all shadow-lg shadow-blue-900/30">
                            📝Add New Course
                        </button>
                        <button
                            onClick={() => navigate("/admin/courses")}
                            className="flex items-center gap-4 bg-teal-700 hover:bg-teal-950 text-white text-sm font-medium px-5 py-3 rounded-xl border border-teal-700
                             hover:border-teal-700 transition-all shadow-lg shadow-teal-900/30">
                            🧰View Courses
                        </button>

                        <button
                            onClick={() => navigate("/admin/records")}
                            className="flex items-center gap-4 bg-purple-700 hover:bg-purple-950 text-white text-sm font-medium px-5 py-3 rounded-xl border border-purple-700
                             hover:border-purple-700 transition-all shadow-lg shadow-teal-900/30">
                            📶View Records
                        </button>

                        <button
                            onClick={() => navigate("/admin/user-set")}
                            className="flex items-center gap-4 bg-red-700 hover:bg-red-950 text-white text-sm font-medium px-5 py-3 rounded-xl border border-red-700
                             hover:border-red-700 transition-all shadow-lg shadow-teal-900/30">
                            🔌Set user On/Off
                        </button>
                        
                    </div>
                </div>

            </div>
        </div>
    )
}

export default AdminDashboard;