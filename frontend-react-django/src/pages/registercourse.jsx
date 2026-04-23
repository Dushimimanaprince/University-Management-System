import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

const TIME_CHOICES = [
  { value: "08:30", label: "8:30 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "14:30", label: "2:30 PM" },
  { value: "18:30", label: "6:30 PM" },
]

const DAY_CHOICES = [
  { value: "Mon", label: "Monday" },
  { value: "Tue", label: "Tuesday" },
  { value: "Wed", label: "Wednesday" },
  { value: "Thu", label: "Thursday" },
  { value: "Fri", label: "Friday" },
]

export default function RegisterCourse() {
  const navigate = useNavigate()
  const [lecturers, setLecturers] = useState([])
  const [departments, setDepartments] = useState([])
  const [form, setForm] = useState({
    course_code: "",
    course_name: "",
    course_time: "",
    course_day: "",
    credits: "",
    lecturer: "",
    department: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("access")
    if (!token) {
      navigate("/")
      return
    }

    // fetch lecturers
    fetch(`${API}/api/lecturers/`)
      .then((r) => r.json())
      .then((data) => setLecturers(data))
      .catch(() => setErrors((p) => ({ ...p, api: "Failed to load lecturers" })))

    // fetch departments
    fetch(`${API}/api/departments/`)
      .then((r) => r.json())
      .then((data) => setDepartments(data))
      .catch(() => setErrors((p) => ({ ...p, api: "Failed to load departments" })))
  }, [])

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const validate = () => {
    const e = {}
    if (!form.course_code.trim()) e.course_code = "Required"
    if (!form.course_name.trim()) e.course_name = "Required"
    if (!form.course_time) e.course_time = "Select a time"
    if (!form.course_day) e.course_day = "Select a day"
    if (!form.credits || isNaN(form.credits) || Number(form.credits) < 1)
      e.credits = "Enter a valid number of credits"
    if (!form.lecturer) e.lecturer = "Select a lecturer"
    if (!form.department) e.department = "Select a department"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)

    const token = localStorage.getItem("access")
    try {
      const res = await fetch(`${API}/api/register/course/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, credits: Number(form.credits) }),
      })
      const data = await res.json()

      if (res.ok) {
        setSuccess(data)
      } else {
        const msg = data.error || Object.values(data)[0]
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
          <h2 className="text-white text-xl font-medium mb-1">Course registered</h2>
          <p className="text-zinc-400 text-sm mb-6">The course has been created successfully</p>
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-6 py-4 mb-6 text-left space-y-2">
            <InfoRow label="Course code" value={success.course_code} mono />
            <InfoRow label="Course name" value={success.course_name} />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setSuccess(null)}
              className="flex-1 h-10 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm border border-zinc-700 transition-colors"
            >
              Add another
            </button>
            <button
              onClick={() => navigate(-1)}
              className="flex-1 h-10 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm transition-colors"
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl p-8">

        {/* header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 className="text-white text-xl font-medium">Register course</h2>
            <p className="text-zinc-400 text-sm">Fill in the course details below</p>
          </div>
        </div>

        {/* course code + name */}
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Course code"
            placeholder="CS101"
            value={form.course_code}
            onChange={(v) => set("course_code", v.toUpperCase())}
            error={errors.course_code}
          />
          <Field
            label="Course name"
            placeholder="Data Structures"
            value={form.course_name}
            onChange={(v) => set("course_name", v)}
            error={errors.course_name}
          />
        </div>

        {/* department */}
        <div className="mb-4">
          <label className="text-zinc-400 text-sm block mb-1.5">Department</label>
          <select
            value={form.department}
            onChange={(e) => set("department", e.target.value)}
            className="w-full h-10 px-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm outline-none focus:border-blue-500 transition-colors"
          >
            <option value="">Select department...</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          {errors.department && <p className="text-red-400 text-xs mt-1">{errors.department}</p>}
        </div>

        {/* lecturer */}
        <div className="mb-4">
          <label className="text-zinc-400 text-sm block mb-1.5">Lecturer</label>
          <select
            value={form.lecturer}
            onChange={(e) => set("lecturer", e.target.value)}
            className="w-full h-10 px-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm outline-none focus:border-blue-500 transition-colors"
          >
            <option value="">Select lecturer...</option>
            {lecturers.map((l) => (
              <option key={l.usercode} value={l.usercode}>
                {l.name} — {l.department} ({l.degree})
              </option>
            ))}
          </select>
          {errors.lecturer && <p className="text-red-400 text-xs mt-1">{errors.lecturer}</p>}
        </div>

        {/* day + time */}
        <div className="grid grid-cols-2 gap-3">
          <div className="mb-4">
            <label className="text-zinc-400 text-sm block mb-1.5">Day</label>
            <select
              value={form.course_day}
              onChange={(e) => set("course_day", e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">Select day...</option>
              {DAY_CHOICES.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
            {errors.course_day && <p className="text-red-400 text-xs mt-1">{errors.course_day}</p>}
          </div>

          <div className="mb-4">
            <label className="text-zinc-400 text-sm block mb-1.5">Time</label>
            <select
              value={form.course_time}
              onChange={(e) => set("course_time", e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">Select time...</option>
              {TIME_CHOICES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            {errors.course_time && <p className="text-red-400 text-xs mt-1">{errors.course_time}</p>}
          </div>
        </div>

        {/* credits */}
        <Field
          label="Credits"
          type="number"
          placeholder="3"
          value={form.credits}
          onChange={(v) => set("credits", v)}
          error={errors.credits}
        />

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
          {loading ? "Registering..." : "Register course"}
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

function InfoRow({ label, value, mono }) {
  return (
    <div>
      <p className="text-zinc-500 text-xs mb-0.5">{label}</p>
      <p className={`text-zinc-100 text-sm ${mono ? "font-mono tracking-wider" : ""}`}>
        {value || "—"}
      </p>
    </div>
  )
}