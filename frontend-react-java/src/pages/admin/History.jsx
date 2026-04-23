import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'

const History = () => {
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError]     = useState("")

    const navigate = useNavigate()

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await API.get('/history')
                setHistory(response.data)
            } catch(err) {
                setError("Failed to load history.")
            } finally {
                setLoading(false)
            }
        }
        fetchHistory()
    }, [])

    const roleColor = (role) => {
        switch(role) {
            case "ADMIN":    return "bg-purple-900/30 border-purple-700 text-purple-400"
            case "STUDENT":  return "bg-blue-900/30 border-blue-700 text-blue-400"
            case "LECTURER": return "bg-green-900/30 border-green-700 text-green-400"
            default:         return "bg-zinc-800 border-zinc-600 text-zinc-400"
        }
    }

    const entityColor = (entity) => {
        switch(entity) {
            case "COURSE":     return "text-orange-400"
            case "ENROLLMENT": return "text-cyan-400"
            case "STUDENT":    return "text-blue-400"
            case "LECTURER":   return "text-green-400"
            case "GRADE":      return "text-teal-400"
            default:           return "text-zinc-400"
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            <p className="text-zinc-500 text-sm">Loading...</p>
        </div>
    )

    if (error) return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">

            {/* Nav */}
            <nav className="border-b border-zinc-800 px-6 py-4 flex items-center gap-3">
                <button onClick={() => navigate(-1)}
                    className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div>
                    <h1 className="text-white font-medium text-sm">Activity History</h1>
                    <p className="text-zinc-500 text-xs">{history.length} total records</p>
                </div>
            </nav>

            <div className="max-w-3xl mx-auto px-6 py-8">

                {history.length === 0 ? (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
                        <p className="text-zinc-500 text-sm">No activity recorded yet.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {history.map((item) => (
                            <div key={item.historyId}
                                className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 flex items-start justify-between gap-4 hover:border-zinc-700 transition-colors">

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white font-medium">{item.action}</p>
                                    <p className="text-xs text-zinc-500 mt-1">
                                        By <span className="text-zinc-300">{item.performedBy}</span>
                                        {" · "}  
                                        Model:<span className={entityColor(item.entity)}>  {item.entity}</span>
                                    </p>
                                </div>

                                <div className="flex flex-col items-end gap-2 shrink-0">
                                    <span className={`text-xs px-2 py-0.5 rounded-full border ${roleColor(item.role)}`}>
                                        {item.role}
                                    </span>
                                    <span className="text-xs text-zinc-600">
                                        {new Date(item.createdAt).toLocaleString("en-US", {
                                            month: "short", day: "numeric",
                                            hour: "2-digit", minute: "2-digit"
                                        })}
                                    </span>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default History