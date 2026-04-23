import { useState } from "react"
import { useNavigate } from "react-router-dom"

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ usercode: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleSubmit = async () => {
    if (!form.usercode.trim() || !form.password) {
      setError("Both fields are required")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API}/api/signin/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (res.ok) {
        localStorage.setItem("access", data.access)
        localStorage.setItem("refresh", data.refresh)
        localStorage.setItem("type", data.type)
        localStorage.setItem("usercode", data.usercode)

        if (data.type === "student") navigate("/student-dashboard")
        else if (data.type === "lecturer") navigate("/lecturer-dashboard")
        else if (data.type === "admin") navigate("/admin-dashboard")
      } else {
        setError(data.error || "Login failed")
      }
    } catch {
      setError("Could not connect to server")
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === "Enter") handleSubmit()
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* logo / title */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0121 13c0 5.523-4.477 10-10 10S1 18.523 1 13c0-.34.015-.677.04-1L7 14m5 0v7" />
            </svg>
          </div>
          <h1 className="text-white text-2xl font-semibold">Welcome back</h1>
          <p className="text-zinc-400 text-sm mt-1">Sign in with your access code</p>
        </div>

        {/* card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

          <div className="mb-4">
            <label className="text-zinc-400 text-sm block mb-1.5">Access code</label>
            <input
              type="text"
              placeholder="STU-27555"
              value={form.usercode}
              onChange={(e) => set("usercode", e.target.value.toUpperCase())}
              onKeyDown={handleKey}
              className="w-full h-10 px-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm outline-none focus:border-blue-500 transition-colors placeholder:text-zinc-600 tracking-wider"
            />
          </div>

          <div className="mb-5">
            <label className="text-zinc-400 text-sm block mb-1.5">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              onKeyDown={handleKey}
              className="w-full h-10 px-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm outline-none focus:border-blue-500 transition-colors placeholder:text-zinc-600"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5 mb-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full h-10 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="text-center text-zinc-500 text-sm mt-4">
            No account?{" "}
            <a href="/signup" className="text-blue-400 hover:text-blue-300 transition-colors">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}