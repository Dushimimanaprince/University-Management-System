import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

// ── Grade Modal ────────────────────────────────────────────────────────────────
function GradeModal({ student, courseId, onClose, onSaved }) {
  const [form, setForm]     = useState({ assignment: "", quiz: "", midterm: "", final_exam: "" })
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState("")

  const fields = [
    { key: "assignment", label: "Assignment", max: 20 },
    { key: "quiz",       label: "Quiz",       max: 10 },
    { key: "midterm",    label: "Midterm",     max: 30 },
    { key: "final_exam", label: "Final Exam",  max: 40 },
  ]

  const total = fields.reduce((sum, f) => sum + (parseFloat(form[f.key]) || 0), 0)

  async function handleSubmit() {
    setSaving(true)
    setError("")
    try {
      const token = localStorage.getItem("access")
      const res = await fetch(
        `${API}/api/course/${courseId}/students/${student.student_id}/grade/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            assignment: parseFloat(form.assignment),
            quiz:       parseFloat(form.quiz),
            midterm:    parseFloat(form.midterm),
            final_exam: parseFloat(form.final_exam),
          }),
        }
      )
      const data = await res.json()
      if (!res.ok) {
        // surface first validation error from DRF
        const msg = Object.values(data).flat().join(" ")
        setError(msg || "Failed to save grade")
      } else {
        onSaved(data)
      }
    } catch {
      setError("Network error")
    } finally {
      setSaving(false)
    }
  }

  return (
    // backdrop
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6">

        {/* header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-white font-semibold">Add / Edit Grade</h2>
            <p className="text-zinc-400 text-xs mt-0.5">
              {student.student_fname} {student.student_lname}
              <span className="ml-2 font-mono text-blue-400">{student.student_code}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 transition-colors"
          >✕</button>
        </div>

        {/* fields */}
        <div className="space-y-3">
          {fields.map(({ key, label, max }) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-zinc-400 text-xs">{label}</label>
                <span className="text-zinc-600 text-xs">max {max}</span>
              </div>
              <input
                type="number"
                min={0}
                max={max}
                step={0.5}
                value={form[key]}
                onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                placeholder={`0 – ${max}`}
                className="w-full h-9 px-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm outline-none focus:border-blue-500 transition-colors placeholder:text-zinc-600"
              />
            </div>
          ))}
        </div>

        {/* total */}
        <div className="mt-4 flex items-center justify-between px-4 py-3 bg-zinc-800/50 rounded-xl">
          <span className="text-zinc-400 text-sm">Total score</span>
          <span className={`text-lg font-semibold ${total >= 60 ? "text-green-400" : "text-red-400"}`}>
            {total.toFixed(1)} / 100
          </span>
        </div>

        {error && (
          <p className="mt-3 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {/* actions */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className="flex-1 h-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 h-9 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium transition-colors"
          >
            {saving ? "Saving…" : "Save Grade"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function CourseStudents() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [data, setData]           = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState("")
  const [search, setSearch]       = useState("")
  const [selected, setSelected]   = useState(null)   // student to grade
  const [savedMsg, setSavedMsg]   = useState("")

  useEffect(() => {
    const token = localStorage.getItem("access")
    if (!token) { navigate("/"); return }

    fetch(`${API}/api/course/${id}/students/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.status === 401) { localStorage.clear(); navigate("/"); return null }
        if (r.status === 404) { setError("Course not found or not assigned to you"); return null }
        return r.json()
      })
      .then((d) => { if (d) setData(d) })
      .catch(() => setError("Failed to load students"))
      .finally(() => setLoading(false))
  }, [id])

  function handleGradeSaved(result) {
    setSelected(null)
    setSavedMsg(`Grade saved! Score: ${result.score}`)
    setTimeout(() => setSavedMsg(""), 3000)
  }

  const filtered = data?.students?.filter((s) => {
    const q = search.toLowerCase()
    return (
      s.student_code.toLowerCase().includes(q) ||
      s.student_fname.toLowerCase().includes(q) ||
      s.student_lname.toLowerCase().includes(q)
    )
  }) ?? []

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-6 py-4 text-center">
        <p className="text-red-400 mb-3">{error}</p>
        <button onClick={() => navigate(-1)} className="text-zinc-400 hover:text-zinc-200 text-sm">← Go back</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      {/* modal */}
      {selected && (
        <GradeModal
          student={selected}
          courseId={id}
          onClose={() => setSelected(null)}
          onSaved={handleGradeSaved}
        />
      )}

      {/* success toast */}
      {savedMsg && (
        <div className="fixed top-4 right-4 z-40 bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-xl">
          ✓ {savedMsg}
        </div>
      )}

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
          <h1 className="text-white font-medium text-sm">{data?.course_name}</h1>
          <p className="text-zinc-500 text-xs">{data?.course_code}</p>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          <StatCard label="Course"   value={data?.course_code} mono />
          <StatCard label="Students" value={data?.total_students} />
          <StatCard label="Enrolled" value={data?.total_students > 0 ? "Active" : "Empty"} />
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-medium text-sm">Enrolled students</h2>
            <div className="relative">
              <svg className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-9 pr-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm outline-none focus:border-blue-500 transition-colors placeholder:text-zinc-600 w-48"
              />
            </div>
          </div>

          {data?.total_students === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-500 text-sm">No students enrolled yet</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-zinc-500 text-sm">No students match "{search}"</p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* header */}
              <div className="grid grid-cols-12 px-4 pb-2 border-b border-zinc-800">
                <span className="col-span-1 text-zinc-500 text-xs">#</span>
                <span className="col-span-3 text-zinc-500 text-xs">Code</span>
                <span className="col-span-4 text-zinc-500 text-xs">Name</span>
                <span className="col-span-2 text-zinc-500 text-xs text-right">Enrolled</span>
                <span className="col-span-2 text-zinc-500 text-xs text-right">Grade</span>
              </div>

              {/* rows — clicking opens the modal */}
              {filtered.map((student, index) => (
                <div
                  key={student.id}
                  onClick={() => setSelected(student)}
                  className="grid grid-cols-12 px-4 py-3 bg-zinc-800/40 hover:bg-zinc-800/80 rounded-xl transition-colors items-center cursor-pointer group"
                >
                  <span className="col-span-1 text-zinc-600 text-sm">{index + 1}</span>
                  <span className="col-span-3 text-xs font-mono text-blue-400">{student.student_code}</span>
                  <span className="col-span-4 text-zinc-100 text-sm">
                    {student.student_fname} {student.student_lname}
                  </span>
                  <span className="col-span-2 text-zinc-500 text-xs text-right">
                    {new Date(student.enrolled_at).toLocaleDateString()}
                  </span>
                  <span className="col-span-2 text-right">
                    <span className="text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      + Grade →
                    </span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, mono }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 text-center">
      <p className={`text-2xl font-semibold text-white ${mono ? "font-mono text-lg" : ""}`}>{value}</p>
      <p className="text-zinc-500 text-xs mt-1">{label}</p>
    </div>
  )
}