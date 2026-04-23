import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

export default function LecturerDashboard() {
  const navigate = useNavigate()
  const [lecturer, setLecturer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [courses, setCourses] = useState([])
  const [courseLoading, setCourseLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("access")
    if (!token) { navigate("/"); return }

    fetch(`${API}/api/lecturer-portal/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.status === 401) { localStorage.clear(); navigate("/"); return null }
        return r.json()
      })
      .then((data) => { if (data) setLecturer(data) })
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false))

    fetch(`${API}/api/lecturer/courses/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setCourses(data))
      .catch(() => setError("Failed to load courses"))
      .finally(() => setCourseLoading(false))
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    navigate("/")
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

  const initials = `${lecturer?.first_name?.[0] ?? ""}${lecturer?.last_name?.[0] ?? ""}`.toUpperCase()
  const degreeColors = {
    Bachelors: "bg-teal-500/10 text-teal-400 border-teal-500/30",
    Masters:   "bg-purple-500/10 text-purple-400 border-purple-500/30",
    PhD:       "bg-amber-500/10 text-amber-400 border-amber-500/30",
  }
  const degreeStyle = degreeColors[lecturer?.degree] ?? "bg-zinc-700 text-zinc-300 border-zinc-600"

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      <nav className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0121 13c0 5.523-4.477 10-10 10S1 18.523 1 13c0-.34.015-.677.04-1L7 14m5 0v7" />
            </svg>
          </div>
          <span className="text-white font-medium text-sm">Lecturer Portal</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-zinc-400 text-sm hidden sm:block">{lecturer?.usercode}</span>
          <button
            onClick={handleLogout}
            className="h-8 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm transition-colors border border-zinc-700"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">Hello, {lecturer?.first_name} 👋</h1>
          <p className="text-zinc-400 text-sm mt-1">Here's your lecturer overview</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                <span className="text-blue-400 font-semibold text-lg">{initials}</span>
              </div>
              <div>
                <h2 className="text-white font-medium text-lg">{lecturer?.first_name} {lecturer?.last_name}</h2>
                <p className="text-zinc-400 text-sm">{lecturer?.department}</p>
              </div>
            </div>
            <span className={`text-xs font-medium px-3 py-1 rounded-full border ${degreeStyle}`}>
              {lecturer?.degree}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoRow label="Access code" value={lecturer?.usercode} mono />
            <InfoRow label="Email"       value={lecturer?.email} />
            <InfoRow label="Phone"       value={lecturer?.phone} />
            <InfoRow label="Department"  value={lecturer?.department} />
            <InfoRow label="Degree"      value={lecturer?.degree} />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <StatCard label="Courses"        value={courses.length} />
          <StatCard label="Students"       value="—" />
          <StatCard label="This week"      value="—" />
          <StatCard label="Pending grades" value="—" />
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium text-sm">Assigned courses</h3>
            <p className="text-zinc-500 text-xs">Click a course to see enrolled students</p>
          </div>

          {courseLoading ? (
            <div className="space-y-2">
              {[1,2,3].map((i) => (
                <div key={i} className="h-14 rounded-xl bg-zinc-800 animate-pulse" />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-zinc-500 text-sm">No courses assigned yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {courses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => navigate(`/course/${course.id}/students`)}
                  className="flex items-center justify-between px-4 py-3 bg-zinc-800/50 hover:bg-zinc-700/50 rounded-xl cursor-pointer transition-colors group"
                >
                  <div>
                    <p className="text-zinc-100 text-sm font-medium group-hover:text-white transition-colors">
                      {course.course_name}
                    </p>
                    <p className="text-zinc-500 text-xs mt-0.5">
                      {course.course_day_display} · {course.course_time_display}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs font-mono text-zinc-500">{course.course_code}</span>
                      <p className="text-zinc-400 text-xs mt-0.5">{course.credits} credits</p>
                    </div>
                    <svg className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
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