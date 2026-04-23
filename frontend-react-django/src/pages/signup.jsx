import { useState, useEffect } from "react"

const TYPES = ["student", "lecturer", "admin"]
const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

export default function Signup() {
  const [userType, setUserType] = useState("student")
  const [departments, setDepartments] = useState([])
  const [degrees, setDegrees] = useState([])
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    department: "",
    degree: "",
    password1: "",
    password2: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    fetch(`${API}/api/departments/`)
      .then((r) => r.json())
      .then((data) => setDepartments(data))
      .catch(() => setErrors((p) => ({ ...p, api: "Failed to load departments" })))
  }, [])

  useEffect(() => {
    fetch(`${API}/api/degrees/`)
      .then((r) => r.json())
      .then((data) => setDegrees(data))
      .catch(() => {})
  }, [])

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const handleTypeChange = (type) => {
    setUserType(type)
    if (type !== "lecturer") {
      setForm((prev) => ({ ...prev, degree: "" }))
      setErrors((prev) => ({ ...prev, degree: "" }))
    }
  }

  const validate = () => {
    const e = {}
    if (!form.first_name.trim()) e.first_name = "Required"
    if (!form.last_name.trim()) e.last_name = "Required"
    if (!form.email.trim() || !form.email.includes("@")) e.email = "Enter a valid email"
    if (!form.phone.trim()) e.phone = "Required"
    if (!form.department) e.department = "Select a department"
    if (userType === "lecturer" && !form.degree) e.degree = "Required for lecturers"
    if (!form.password1 || form.password1.length < 6) e.password1 = "Min 6 characters"
    if (form.password1 !== form.password2) e.password2 = "Passwords don't match"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type: userType }),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess(data.usercode)
      } else {
        const msg = Object.values(data)[0]
        setErrors({ api: typeof msg === "object" ? msg[0] : msg })
      }
    } catch {
      setErrors({ api: "Could not connect to server" })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-white text-xl font-medium mb-1">Account created</h2>
          <p className="text-zinc-400 text-sm mb-6">
            Your login code is below. Save it — you will need it to sign in.
          </p>
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-6 py-4 mb-6">
            <p className="text-green-400 text-3xl font-semibold tracking-widest">{success}</p>
          </div>
          <p className="text-zinc-500 text-xs">Use this code as your username when logging in</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8">

        <h2 className="text-white text-xl font-medium mb-1">Create account</h2>
        <p className="text-zinc-400 text-sm mb-6">Your access code will be generated automatically</p>

        {/* type selector */}
        <label className="text-zinc-500 text-xs uppercase tracking-wider mb-2 block">
          Account type
        </label>
        <div className="flex gap-2 mb-5">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => handleTypeChange(t)}
              className={`flex-1 h-9 rounded-lg text-sm font-medium transition-all ${
                userType === t
                  ? "bg-blue-600 text-white border border-blue-500"
                  : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-500 hover:text-zinc-200"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* name */}
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="First name"
            placeholder="John"
            value={form.first_name}
            onChange={(v) => set("first_name", v)}
            error={errors.first_name}
          />
          <Field
            label="Last name"
            placeholder="Doe"
            value={form.last_name}
            onChange={(v) => set("last_name", v)}
            error={errors.last_name}
          />
        </div>

        <Field
          label="Email"
          type="email"
          placeholder="john@example.com"
          value={form.email}
          onChange={(v) => set("email", v)}
          error={errors.email}
        />

        <Field
          label="Phone"
          type="tel"
          placeholder="+250 7XX XXX XXX"
          value={form.phone}
          onChange={(v) => set("phone", v)}
          error={errors.phone}
        />

        {/* department + degree */}
        <div className="grid grid-cols-2 gap-3">
          <div className="mb-4">
            <label className="text-zinc-400 text-sm block mb-1.5">Department</label>
            <select
              value={form.department}
              onChange={(e) => set("department", e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">Select...</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            {errors.department && (
              <p className="text-red-400 text-xs mt-1">{errors.department}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              className={`text-sm block mb-1.5 transition-colors ${
                userType === "lecturer" ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              Degree{" "}
              <span className="text-xs text-zinc-600">(lecturer only)</span>
            </label>
            <select
              value={form.degree}
              onChange={(e) => set("degree", e.target.value)}
              disabled={userType !== "lecturer"}
              className={`w-full h-10 px-3 rounded-lg border text-sm outline-none transition-colors ${
                userType === "lecturer"
                  ? "bg-zinc-800 border-zinc-700 text-zinc-100 focus:border-blue-500 cursor-pointer"
                  : "bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed"
              }`}
            >
              <option value="">Select...</option>
              {degrees.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.display}
                </option>
              ))}
            </select>
            {errors.degree && (
              <p className="text-red-400 text-xs mt-1">{errors.degree}</p>
            )}
          </div>
        </div>

        <div className="border-t border-zinc-800 my-5" />

        {/* passwords */}
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password1}
            onChange={(v) => set("password1", v)}
            error={errors.password1}
          />
          <Field
            label="Confirm password"
            type="password"
            placeholder="••••••••"
            value={form.password2}
            onChange={(v) => set("password2", v)}
            error={errors.password2}
          />
        </div>

        {errors.api && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5 mb-4">
            <p className="text-red-400 text-sm">{errors.api}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-10 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors mt-1"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </div>
    </div>
  )
}

function Field({ label, type = "text", placeholder, value, onChange, error }) {
  return (
    <div className="mb-4">
      <label className="text-zinc-400 text-sm block mb-1.5">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full h-10 px-3 rounded-lg bg-zinc-800 border text-zinc-100 text-sm outline-none focus:border-blue-500 transition-colors placeholder:text-zinc-600 ${
          error ? "border-red-500" : "border-zinc-700"
        }`}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}