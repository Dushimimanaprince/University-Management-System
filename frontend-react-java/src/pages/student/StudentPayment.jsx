import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const StudentPayment = () => {

    const [payments, setPayments]         = useState([]);
    const [semesters, setSemesters]       = useState([]);
    const [error, setError]               = useState("");
    const [loading, setLoading]           = useState(true);
    const [showModal, setShowModal]       = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentError, setPaymentError] = useState("");
    const [success, setSuccess]           = useState("");
    const [preview, setPreview]           = useState(null);
    const [previewError, setPreviewError] = useState("");
    const [formData, setFormData]         = useState({ semesterId: "", microfinanceUsername: "" });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [paymentsRes, semestersRes] = await Promise.all([
                    API.get("/payments"),
                    API.get("/semesters"),
                ]);
                setPayments(paymentsRes.data);
                setSemesters(semestersRes.data);
            } catch (err) {
                setError(err.response?.data?.error ?? "Failed to Load Payments");
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const handleSemesterChange = async (e) => {
        const id = e.target.value;
        setFormData(prev => ({ ...prev, semesterId: id }));
        setPreview(null);
        setPreviewError("");

        if (!id) return;

        try {
            const res = await API.get(`/payments/preview?semesterId=${id}`);
            setPreview(res.data);
        } catch (err) {
            setPreviewError(err.response?.data?.error ?? "Could not calculate fee");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPaymentLoading(true);
        setPaymentError("");
        setSuccess("");

        try {
            const res = await API.post(
                `/payments/pay?semesterId=${formData.semesterId}&microfinanceUsername=${formData.microfinanceUsername}`
            );
            setSuccess(res.data.message);
            setFormData({ semesterId: "", microfinanceUsername: "" });
            setPreview(null);

            const updated = await API.get("/payments");
            setPayments(updated.data);
        } catch (err) {
            setPaymentError(err.response?.data?.error ?? "Payment request failed");
        } finally {
            setPaymentLoading(false);
        }
    };

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

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">

            <nav className="border-b border-zinc-800 px-6 py-4 flex items-center gap-3">
                <button onClick={() => navigate("/student")}
                    className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div>
                    <h1 className="text-white font-medium text-sm">My Payments</h1>
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
                    <button onClick={() => setShowModal(true)}
                        className="text-xs px-4 py-2 bg-blue-900 border border-blue-700 text-blue-300 rounded-lg hover:bg-blue-800 transition-all">
                        + Pay Fees
                    </button>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                                <th className="text-left px-6 py-4">Amount</th>
                                <th className="text-left px-6 py-4">Status</th>
                                <th className="text-left px-6 py-4">Active</th>
                                <th className="text-left px-6 py-4">Created At</th>
                                <th className="text-left px-6 py-4">Updated At</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {payments.map(payment => (
                                <tr key={payment.paymentId} className="hover:bg-zinc-800/50 transition-colors">
                                    <td className="px-6 py-4 text-green-400 font-medium">
                                        $ {Number(payment.amount).toLocaleString("en-US", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </td>
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
                                        {new Date(payment.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-teal-500 text-xs">
                                        {new Date(payment.updatedAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-1 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-8 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-white">Pay Tuition Fee</h2>
                            <button onClick={() => setShowModal(false)}
                                className="text-[#888888] hover:text-white text-xl">❌</button>
                        </div>

                        {paymentError && (
                            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm">
                                {paymentError}
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded-lg mb-4 text-sm">
                                {success}
                            </div>
                        )}

                        <form className="space-y-4" onSubmit={handleSubmit}>

                            <div>
                                <label className="block text-sm font-medium text-[#888888] mb-1">Semester</label>
                                <select name="semesterId" value={formData.semesterId}
                                    onChange={handleSemesterChange}
                                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors"
                                    required>
                                    <option value="">-- Choose a semester --</option>
                                    {semesters.map(s => (
                                        <option key={s.semesterId} value={s.semesterId}>
                                            {s.semesterName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {previewError && (
                                <p className="text-red-400 text-xs">{previewError}</p>
                            )}

                            {preview && (
                                <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 space-y-1">
                                    <p className="text-xs text-zinc-400">Total Credits: <span className="text-white font-medium">{preview.totalCredits}</span></p>
                                    <p className="text-xs text-zinc-400">Fee per Credit: <span className="text-white font-medium">700 RWF</span></p>
                                    <p className="text-sm text-zinc-300 pt-1 border-t border-zinc-700">
                                        Total Due: <span className="text-green-400 font-semibold">
                                            {Number(preview.totalFee).toLocaleString("en-US", { minimumFractionDigits: 2 })} RWF
                                        </span>
                                    </p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-[#888888] mb-1">Microfinance Username</label>
                                <input type="text" name="microfinanceUsername" value={formData.microfinanceUsername}
                                    onChange={e => setFormData(prev => ({ ...prev, microfinanceUsername: e.target.value }))}
                                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors"
                                    required />
                            </div>

                            <button type="submit" disabled={paymentLoading || !preview}
                                className="w-full bg-blue-900 text-white font-semibold rounded-lg p-3 hover:bg-blue-800 transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                {paymentLoading ? "Sending Request..." : `Pay ${preview ? Number(preview.totalFee).toLocaleString("en-US") + " RWF" : ""}`}
                            </button>

                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentPayment;