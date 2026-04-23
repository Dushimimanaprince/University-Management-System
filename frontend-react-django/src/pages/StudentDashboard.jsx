import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

export default function StudentDashboard() {
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [enrollments, setEnrollments] = useState([])
  const [enrollLoading, setEnrollLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("access")
    if (!token) return


    fetch(`${API}/api/student-portal/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.status === 401) { localStorage.clear(); navigate("/"); return null }
        return r.json()
      })
      .then((data) => { if (data) setStudent(data) })
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false))

    fetch(`${API}/api/enrolled/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setEnrollments(data))
      .catch(() => {})
      .finally(() => setEnrollLoading(false))
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-6 py-4">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  const initials = `${student?.first_name?.[0] ?? ""}${student?.last_name?.[0] ?? ""}`.toUpperCase()

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      {/* navbar */}
      <nav className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0121 13c0 5.523-4.477 10-10 10S1 18.523 1 13c0-.34.015-.677.04-1L7 14m5 0v7" />
            </svg>
          </div>
          <span className="text-white font-medium text-sm">Student Portal</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-zinc-400 text-sm hidden sm:block">{student?.usercode}</span>
          <button
            onClick={() => navigate("/add/course/")}
            className="h-9 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm transition-colors"
          >
            Add courses
          </button>
          <button
            onClick={handleLogout}
            className="h-8 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm transition-colors border border-zinc-700"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">
            Hello, {student?.first_name} 👋
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Here's your student overview</p>
        </div>

        {/* profile card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <span className="text-blue-400 font-semibold text-lg">{initials}</span>
            </div>
            <div>
              <h2 className="text-white font-medium text-lg">
                {student?.first_name} {student?.last_name}
              </h2>
              <p className="text-zinc-400 text-sm">{student?.department}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoRow label="Access code" value={student?.username} mono />
            <InfoRow label="Email" value={student?.email} />
            <InfoRow label="Phone" value={student?.phone} />
            <InfoRow label="Department" value={student?.department} />
          </div>
        </div>

        {/* placeholder sections */}
        {/* stats row — now with real data */}
<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
  <StatCard label="Courses"  value={enrollments.length} />
  <StatCard label="Credits"  value={enrollments.reduce((sum, e) => sum + e.credits, 0)} />
  <StatCard label="GPA"      value="—" />
  <StatCard label="Payments" value="—" />
</div>

{/* enrolled courses */}
<div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-4">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-white font-medium text-sm">Enrolled courses</h3>
    <button
      onClick={() => navigate("/add/course/")}
      className="h-7 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs transition-colors"
    >
      + Add course
    </button>
  </div>

  {enrollLoading ? (
    <div className="space-y-2">
      {[1,2,3].map((i) => (
        <div key={i} className="h-14 rounded-xl bg-zinc-800 animate-pulse" />
      ))}
    </div>
  ) : enrollments.length === 0 ? (
    <div className="text-center py-8">
      <p className="text-zinc-500 text-sm">No courses yet</p>
      <button
        onClick={() => navigate("add/course/")}
        className="mt-3 text-blue-400 hover:text-blue-300 text-sm transition-colors"
      >
        Browse available courses →
      </button>
    </div>
  ) : (
    <div className="space-y-2">
      {enrollments.map((e) => (
        <div
          key={e.id}
          className="flex items-center justify-between px-4 py-3 bg-zinc-800/50 rounded-xl"
         >    
          <div>
            <p className="text-zinc-100 text-sm font-medium">{e.course_name}</p>
            <p className="text-zinc-500 text-xs mt-0.5">
              {e.lecturer_name} · {e.course_day} at {e.course_time}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-zinc-500">{e.course_code}</span>
            <p className="text-zinc-400 text-xs mt-0.5">{e.credits} credits</p>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

      </div>
    </div>
  )
}

function InfoRow({ label, value, mono }) {
  return (
    <div className="bg-zinc-800/50 rounded-xl px-4 py-3">
      <p className="text-zinc-500 text-xs mb-1">{label}</p>
      <p className={`text-zinc-100 text-sm ${mono ? "font-mono tracking-wider" : ""}`}>
        {value || "—"}
      </p>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 text-center">
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="text-zinc-500 text-xs mt-1">{label}</p>
    </div>
  )
}

function PlaceholderCard({ title }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <h3 className="text-white font-medium text-sm mb-4">{title}</h3>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-8 rounded-lg bg-zinc-800 animate-pulse" />
        ))}
      </div>
    </div>
  )
}