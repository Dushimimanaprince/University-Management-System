import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const PaymentHistory = () =>{

    const [payments, setPayments]         = useState([]);
    const [error, setError]               = useState("");
    const [loading, setLoading]           = useState(true);

    const navigate= useNavigate()

    useEffect (() => {

        const role = localStorage.getItem("role")
        if (role !=="ADMIN"){
            navigate("/login")
        }

        const fetchPayments = async ()=>{

            try{
                const response= await API.get(`/payments/admin/all`)
                setPayments(response.data)
            }catch(err){
                setError(err.response?.data?.error ?? "Failed to Load Payments")
            }finally{
                setLoading(false)
            }
        }
        fetchPayments()


    },[])


    if (loading) return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-[#e5e5e5]">
            Loading...
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-red-400">
            {error}
        </div>
    );


    return(
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

            <nav className="border-b border-zinc-800 px-6 py-4 flex items-center gap-3">
                <button onClick={() => navigate("/admin")}
                    className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div>
                    <h1 className="text-white font-medium text-sm">All Payments</h1>
                    <p className="text-zinc-500 text-xs">Tuition Fee Payments</p>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-8 space-y-20">

                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">🏦</span>
                        <h2 className="text-white font-semibold text-sm">Payments</h2>
                        <span className="text-xs text-zinc-500 bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded-full">
                            {payments.length}
                        </span>
                    </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                                <th className="text-left px-6 py-4">Student Code</th>
                                <th className="text-left px-6 py-4">Full Name</th>
                                <th className="text-left px-6 py-4">Semester</th>
                                <th className="text-left px-6 py-4">Amount</th>
                                <th className="text-left px-6 py-4">Request ID</th>
                                <th className="text-left px-6 py-4">Status</th>
                                <th className="text-left px-6 py-4">Active</th>
                                <th className="text-left px-6 py-4">Created At</th>
                                <th className="text-left px-6 py-4">Updated At</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {payments.map(payment => (
                                <tr key={payment.paymentId} className="hover:bg-zinc-800/50 transition-colors">
                                    <td className="px-6 py-4 text-yellow-400">{payment.student.studentCode}</td>
                                    <td className="px-6 py-4 text-green-450">{payment.student.studentFirstName} {payment.student.studentLastName}</td>
                                    <td className="px-6 py-4 text-purple-900">{payment.semester.semesterName}</td>

                                    <td className="px-6 py-4 text-green-400 font-medium">
                                        $ {Number(payment.amount).toLocaleString("en-US", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </td>
                                    <td className="px-6 py-4 text-zinc-400">{payment.requestId}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-3 py-1 rounded-full border ${
                                            payment.status === "PENDING"  ? "bg-yellow-900/30 border-yellow-700 text-yellow-400" :
                                            payment.status === "PAID"     ? "bg-green-900/30 border-green-700 text-green-400" :
                                            payment.status === "DECLINED" ? "bg-red-900/30 border-red-700 text-red-400" :
                                            "bg-zinc-800 border-zinc-700 text-zinc-400"
                                        }`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-3 py-1 rounded-full border ${
                                            payment.active
                                                ? "bg-blue-900/30 border-blue-700 text-blue-400"
                                                : "bg-zinc-800 border-zinc-700 text-zinc-500"
                                        }`}>
                                            {payment.active ? "ACTIVE" : "INACTIVE"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-500 text-xs">
                                        {new Date(payment.createdAt).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-teal-500 text-xs">
                                        {new Date(payment.updatedAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )

}


export default PaymentHistory