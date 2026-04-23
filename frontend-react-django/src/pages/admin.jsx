import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

export default function AdminPanel() {
  const navigate = useNavigate()
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("access")
    if (!token) { navigate("/"); return }

    fetch(`${API}/api/admin/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.status === 401) { localStorage.clear(); navigate("/"); return null }
        if (r.status === 403) { navigate("/"); return null }
        return r.json()
      })
      .then((d) => { if (d) setAdmin(d) })
      .catch(() => setError("Failed to load admin data"))
      .finally(() => setLoading(false))
  }, [])

  const initials = admin
    ? (admin.first_name?.[0] || "") + (admin.last_name?.[0] || "")
    : "AD"

  const navCards = [
    {
      id: "students",
      label: "Students",
      desc: "Manage student accounts",
      path: "/admin/students",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
    },
    {
      id: "lecturers",
      label: "Lecturers",
      desc: "Manage lecturer accounts",
      path: "/admin/lecturers",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0112 21a12.083 12.083 0 01-6.16-10.422L12 14z" />
        </svg>
      ),
    },
    {
      id: "courses",
      label: "Courses",
      desc: "Manage course catalog",
      path: "/admin/courses",
      color: "text-green-400",
      bg: "bg-green-500/10",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      id: "enrollments",
      label: "Enrollments",
      desc: "Track course enrollments",
      path: "/admin/enrollments",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      id: "grades",
      label: "Grades",
      desc: "Review student grades",
      path: "/admin/grades",
      color: "text-red-400",
      bg: "bg-red-500/10",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      ),
    },
    {
      id: "payments",
      label: "Payments",
      desc: "Monitor fee payments",
      path: "/admin/payments",
      color: "text-teal-400",
      bg: "bg-teal-500/10",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
  ]

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-6 py-4 text-center">
        <p className="text-red-400 mb-3">{error}</p>
        <button onClick={() => navigate("/")} className="text-zinc-400 hover:text-zinc-200 text-sm">← Go back</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      {/* navbar */}
      <nav className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
          <span className="text-white font-medium text-sm">Admin Panel</span>
        </div>
        <button
          onClick={() => { localStorage.clear(); navigate("/") }}
          className="text-zinc-500 hover:text-zinc-300 text-xs transition-colors"
        >
          Sign out
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* profile card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-500/15 border border-blue-500/20 flex items-center justify-center text-blue-400 font-semibold text-lg flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-white font-semibold text-base">
                {admin?.first_name} {admin?.last_name}
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Admin
              </span>
            </div>
            <p className="text-zinc-500 text-xs mt-1 truncate">
              {admin?.usercode} · {admin?.department} · {admin?.email}
            </p>
          </div>
        </div>

        {/* section label */}
        <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest mb-4">
          Management
        </p>

        {/* nav grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {navCards.map((card) => (
            <button
              key={card.id}
              onClick={() => navigate(card.path)}
              className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-2xl p-5 text-left transition-colors group"
            >
              <div className={`w-9 h-9 rounded-xl ${card.bg} ${card.color} flex items-center justify-center mb-4`}>
                {card.icon}
              </div>
              <p className="text-white text-sm font-medium mb-1">{card.label}</p>
              <p className="text-zinc-500 text-xs">{card.desc}</p>
              <p className={`text-xs mt-3 ${card.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                View all →
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
