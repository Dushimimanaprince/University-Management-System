import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

export default function AddCourse() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const token = localStorage.getItem("access")

  useEffect(() => {
    if (!token) { navigate("/login"); return }

    fetch(`${API}/api/courses/`)
      .then((r) => r.json())
      .then((data) => setCourses(data))
      .catch(() => setError("Failed to load courses"))
      .finally(() => setLoading(false))
      
  }, [])

  const handleSelect = (course) => {
    setSelected(course)   // auto fills details
    setSuccess("")
    setError("")
  }

  const handleEnroll = async () => {
    if (!selected) return
    setEnrolling(true)
    setError("")
    setSuccess("")

    try {
      const res = await fetch(`${API}/api/courses/${selected.id}/enroll/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()

      if (res.ok) {
        setSuccess(`Successfully enrolled in ${selected.course_name}`)
        setSelected(null)
      } else {
        setError(data.error || "Enrollment failed")
      }
    } catch {
      setError("Could not connect to server")
    } finally {
      setEnrolling(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      {/* navbar */}
      <nav className="border-b border-zinc-800 px-6 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 flex items-center justify-center transition-colors"
        >
          <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-white font-medium text-sm">Course Enrollment</h1>
          <p className="text-zinc-500 text-xs">Click a course to see details then enroll</p>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* left — course list */}
        <div>
          <h2 className="text-zinc-400 text-xs uppercase tracking-wider mb-3">
            Available courses
          </h2>

          {loading ? (
            <div className="space-y-2">
              {[1,2,3,4].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-zinc-800 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => handleSelect(course)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                    selected?.id === course.id
                      ? "bg-blue-600/10 border-blue-500/50 text-white"
                      : "bg-zinc-900 border-zinc-800 hover:border-zinc-600 text-zinc-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{course.course_name}</span>
                    <span className="text-xs font-mono text-zinc-500">{course.course_code}</span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {course.department_name} · {course.credits} credits
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* right — course details (auto filled on click) */}
        <div>
          <h2 className="text-zinc-400 text-xs uppercase tracking-wider mb-3">
            Course details
          </h2>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            {!selected ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-zinc-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <p className="text-zinc-500 text-sm">Select a course to see details</p>
              </div>
            ) : (
              <div>
                {/* course header */}
                <div className="mb-5">
                  <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md">
                    {selected.course_code}
                  </span>
                  <h3 className="text-white font-medium text-lg mt-2">
                    {selected.course_name}
                  </h3>
                </div>

                {/* details grid */}
                <div className="space-y-3 mb-6">
                  <DetailRow label="Department"  value={selected.department_name} />
                  <DetailRow label="Lecturer"    value={selected.lecturer_name} />
                  <DetailRow label="Day"         value={selected.course_day_display} />
                  <DetailRow label="Time"        value={selected.course_time_display} />
                  <DetailRow label="Credits"     value={`${selected.credits} credits`} />
                </div>

                {/* feedback */}
                {success && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2.5 mb-4">
                    <p className="text-green-400 text-sm">{success}</p>
                  </div>
                )}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5 mb-4">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full h-10 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
                >
                  {enrolling ? "Enrolling..." : "Enroll in this course"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-zinc-800">
      <span className="text-zinc-500 text-sm">{label}</span>
      <span className="text-zinc-100 text-sm">{value || "—"}</span>
    </div>
  )
}