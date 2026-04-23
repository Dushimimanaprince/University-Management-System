import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"


function DeleteModal({ lecturer, onClose, onConfirm, deleting }) {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm p-6">
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h2 className="text-white font-semibold text-center mb-1">Delete lecturer</h2>
        <p className="text-zinc-400 text-sm text-center mb-6">
          Are you sure you want to delete{" "}
          <span className="text-white">{lecturer.first_name} {lecturer.last_name}</span>?
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 h-9 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-sm font-medium transition-colors"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Edit Modal ────────────────────────────────────────────────────────────────
function EditModal({ lecturer, onClose, onSaved }) {
  const [form, setForm] = useState({
    email:      lecturer.email,
    first_name: lecturer.first_name,
    last_name:  lecturer.last_name,
    phone:      lecturer.phone,
    degree:      lecturer.degree,
    department: lecturer.department,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState("")

  const fields = [
    { key: "first_name", label: "First name",  type: "text" },
    { key: "last_name",  label: "Last name",   type: "text" },
    { key: "email",      label: "Email",       type: "email" },
    { key: "phone",      label: "Phone",       type: "text" },
    { key: "degree",      label: "Degree",       type: "text" },
    { key: "department", label: "Department",  type: "text" },
  ]

  async function handleSubmit() {
    setSaving(true)
    setError("")
    try {
      const token = localStorage.getItem("access")
      const res = await fetch(`${API}/api/admin/lecturers/${lecturer.id}/update/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(Object.values(data).flat().join(" ") || "Failed to update Lecturer")
      } else {
        onSaved()
      }
    } catch {
      setError("Network error")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-white font-semibold">Edit lecturer</h2>
            <p className="text-zinc-500 text-xs mt-0.5 font-mono">{lecturer.username}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 transition-colors"
          >✕</button>
        </div>

        <div className="space-y-3">
          {fields.map(({ key, label, type }) => (
            <div key={key}>
              <label className="text-zinc-400 text-xs mb-1 block">{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                className="w-full h-9 px-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          ))}
        </div>

        {error && (
          <p className="mt-3 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

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
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── lecturer Detail Modal ──────────────────────────────────────────────────────
function DetailModal({ lecturer, onClose, onEdit, onDelete }) {
  const rows = [
    { label: "Username",   value: lecturer.username,   mono: true },
    { label: "Email",      value: lecturer.email },
    { label: "Phone",      value: lecturer.phone },
    { label: "Degree",      value: lecturer.degree },
    { label: "Department", value: lecturer.department },
  ]

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm p-6">
        {/* header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold">lecturer Details</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 transition-colors"
          >✕</button>
        </div>

        {/* avatar + name */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-semibold text-base flex-shrink-0">
            {lecturer.first_name?.[0]}{lecturer.last_name?.[0]}
          </div>
          <div>
            <p className="text-white font-medium">{lecturer.first_name} {lecturer.last_name}</p>
            <p className="text-zinc-500 text-xs">{lecturer.department}</p>
          </div>
        </div>

        {/* info rows */}
        <div className="bg-zinc-800/40 rounded-xl divide-y divide-zinc-800 mb-5">
          {rows.map(({ label, value, mono }) => (
            <div key={label} className="flex items-center justify-between px-4 py-3">
              <span className="text-zinc-500 text-xs">{label}</span>
              <span className={`text-sm text-zinc-100 ${mono ? "font-mono text-blue-400 text-xs" : ""}`}>
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* actions */}
        <div className="flex gap-3">
          <button
            onClick={onDelete}
            className="flex-1 h-9 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm border border-red-500/20 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={onEdit}
            className="flex-1 h-9 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Adminlecturers() {
  const navigate = useNavigate()
  const [lecturers, setlecturers] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState("")
  const [search, setSearch]     = useState("")
  const [selected, setSelected] = useState(null)   // lecturer for detail
  const [editing, setEditing]   = useState(null)   // lecturer for edit modal
  const [deleting, setDeleting] = useState(null)   // lecturer for delete modal
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [toast, setToast]       = useState("")

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(""), 3000)
  }

  function loadlecturers() {
    const token = localStorage.getItem("access")
    if (!token) { navigate("/"); return }

    fetch(`${API}/api/admin/lecturers/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.status === 401) { localStorage.clear(); navigate("/"); return null }
        if (r.status === 403) { navigate("/"); return null }
        return r.json()
      })
      .then((d) => { if (d) setlecturers(d) })
      .catch(() => setError("Failed to load lecturers"))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadlecturers() }, [])

  async function handleDelete() {
    setDeleteLoading(true)
    try {
      const token = localStorage.getItem("access")
      const res = await fetch(`${API}/api/admin/lecturers/${deleting.id}/delete/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setlecturers((prev) => prev.filter((s) => s.id !== deleting.id))
        setDeleting(null)
        setSelected(null)
        showToast("lecturer deleted successfully")
      }
    } catch {
      setDeleteLoading(false)
    } finally {
      setDeleteLoading(false)
    }
  }

  function handleSaved() {
    setEditing(null)
    setSelected(null)
    showToast("lecturer updated successfully")
    loadlecturers()
  }

  const filtered = lecturers.filter((s) => {
    const q = search.toLowerCase()
    return (
      s.username.toLowerCase().includes(q) ||
      s.first_name.toLowerCase().includes(q) ||
      s.last_name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.degree.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q)
    )
  })

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

      {/* modals */}
      {selected && !editing && !deleting && (
        <DetailModal
          lecturer={selected}
          onClose={() => setSelected(null)}
          onEdit={() => setEditing(selected)}
          onDelete={() => setDeleting(selected)}
        />
      )}
      {editing && (
        <EditModal
          lecturer={editing}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
        />
      )}
      {deleting && (
        <DeleteModal
          lecturer={deleting}
          deleting={deleteLoading}
          onClose={() => setDeleting(null)}
          onConfirm={handleDelete}
        />
      )}

      {/* toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-40 bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-xl">
          ✓ {toast}
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
          <h1 className="text-white font-medium text-sm">lecturers</h1>
          <p className="text-zinc-500 text-xs">{lecturers.length} total</p>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* search */}
        <div className="relative mb-6">
          <svg className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, username, email or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm outline-none focus:border-blue-500 transition-colors placeholder:text-zinc-600"
          />
        </div>

        {/* table */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-medium text-sm">All lecturers</h2>
            <span className="text-zinc-500 text-xs">{filtered.length} results</span>
          </div>

          {lecturers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-500 text-sm">No lecturers found</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-zinc-500 text-sm">No lecturers match "{search}"</p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* header */}
              <div className="grid grid-cols-12 px-4 pb-2 border-b border-zinc-800">
                <span className="col-span-1 text-zinc-500 text-xs">#</span>
                <span className="col-span-3 text-zinc-500 text-xs">Username</span>
                <span className="col-span-4 text-zinc-500 text-xs">Name</span>
                <span className="col-span-4 text-zinc-500 text-xs">Department</span>
              </div>

              {/* rows */}
              {filtered.map((lecturer, index) => (
                <div
                  key={lecturer.id}
                  onClick={() => setSelected(lecturer)}
                  className="grid grid-cols-12 px-4 py-3 bg-zinc-800/40 hover:bg-zinc-800/70 rounded-xl transition-colors items-center cursor-pointer group"
                >
                  <span className="col-span-1 text-zinc-600 text-sm">{index + 1}</span>
                  <span className="col-span-3 text-xs font-mono text-blue-400">{lecturer.username}</span>
                  <span className="col-span-4 text-zinc-100 text-sm">
                    {lecturer.first_name} {lecturer.last_name}
                  </span>
                  <div className="col-span-4 flex items-center justify-between">
                    <span className="text-zinc-500 text-xs">{lecturer.department}</span>
                    <span className="text-xs text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity pr-1">
                      View →
                    </span>
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