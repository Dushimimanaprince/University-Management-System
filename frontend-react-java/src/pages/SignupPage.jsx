import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";

const Signup = () => {

    const [role, setRole]= useState("STUDENT")
    const [error, setError]= useState('')
    const [departments, setDepartments]= useState([])
    const [generatedCode, setGeneratedCode]= useState('')
    const [formData, setFormData]= useState({
        firstName: '', lastName: '', email: '', phone: '', password: '',
        degree: '', departmentId: ''
    })

    useEffect(() =>{
        const fetchDepartments = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/departments');
                if (response.ok){
                    const data = await response.json();
                    setDepartments(data);
                }else{
                    setDepartments([
                        { id: '123e4567-e89b-12d3-a456-426614174000', name: 'Software Engineering' },
                        { id: '123e4567-e89b-12d3-a456-426614174001', name: 'Information Technology' }
                    ])
                }
            }catch (err){
                console.error("Could not fetch departments.",err);
            }
        };
        fetchDepartments();
    }, []);
    
    useEffect(() => {
        setFormData(prevData => {
            const newData = { ...prevData};

            if(role !== 'LECTURER') newData.degree = '';
            if (role === 'ADMIN') newData.departmentId='';
            return newData;
        });
        setError('');
    }, [role]);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let endpoint = role === 'STUDENT' ? '/api/auth/register/student':
                       role === 'LECTURER' ? '/api/auth/register/lecturer':
                                             '/api/auth/register/admin';
        
        try{
            const response = await fetch(`http://localhost:8080${endpoint}`,{
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(formData)
            });

            const data = await response.json()

            if(response.ok){
                let finalCode= '';

                if (role === 'STUDENT') finalCode = data.studentCode;
                if (role === 'LECTURER') finalCode = data.lecturerCode;
                if (role === 'ADMIN') finalCode = data.adminCode;

                setGeneratedCode(finalCode);
            }else{
                setError(data.error || "Registration Failed.");
            }
        }catch (err) {
            setError("Server Connection Error.")
        };
    };

    if(generatedCode) {
        return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 text-gray-200">
            <div className="bg-gray-900 border border-green-500/30 rounded-2xl p-8 w-full max-w-md shadow-2xl text-center">
            <div className="w-16 h-16 bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">Account Created!</h2>
            <p className="text-gray-400 mb-6">Please save your unique access code. You will need it every time you log in.</p>
            
            <div className="bg-gray-950 border border-gray-700 rounded-lg p-4 mb-8">
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Your Access Code</p>
                <p className="text-3xl font-mono text-blue-400 font-bold tracking-widest">{generatedCode}</p>
            </div>

            {/* Note: Once you set up react-router, you'll change this to a <Link> or useNavigate hook */}
            <button 
                onClick={() => window.location.reload()} 
                className="w-full bg-blue-200 text-gray-950 font-semibold rounded-lg p-3 hover:bg-blue-300 transition-colors"
            >
                Go to Login
            </button>
            </div>
        </div>
        )
    }

    return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 text-[#e5e5e5]">
        <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-8 w-full max-w-lg shadow-2xl">
        <h2 className="text-3xl font-semibold mb-6 text-white text-center">Create Account</h2>

        {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
            </div>
        )}

        <div className="mb-6 flex bg-[#0a0a0a] p-1 rounded-lg border border-[#1f1f1f]">
            {['STUDENT', 'LECTURER', 'ADMIN'].map((r) => (
                <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                        role === r
                            ? 'bg-[#1f1f1f] text-white shadow-sm'
                            : 'text-[#666666] hover:text-[#e5e5e5]'
                    }`}
                >
                    {r.charAt(0) + r.slice(1).toLowerCase()}
                </button>
            ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[#888888] mb-1">First Name</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required
                        className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#888888] mb-1">Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required
                        className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors" />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-[#888888] mb-1">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors" />
            </div>

            <div>
                <label className="block text-sm font-medium text-[#888888] mb-1">Phone Number</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} required
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors" />
            </div>

            <div>
                <label className="block text-sm font-medium text-[#888888] mb-1">Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors" />
            </div>

            {(role === 'STUDENT' || role === 'LECTURER') && (
                <div>
                    <label className="block text-sm font-medium text-[#888888] mb-1">Department</label>
                    <select name="departmentId" value={formData.departmentId} onChange={handleChange} required
                        className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors">
                        <option value="" disabled>-- Select your department --</option>
                        {departments.map((dept) => (
                            <option key={dept.depId} value={dept.depId}>{dept.depName}</option>
                        ))}
                    </select>
                </div>
            )}

            {role === 'LECTURER' && (
                <div>
                    <label className="block text-sm font-medium text-[#888888] mb-1">Academic Degree</label>
                    <input type="text" name="degree" placeholder="e.g., PhD, MSc" value={formData.degree} onChange={handleChange} required
                        className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors" />
                </div>
            )}

            <button type="submit"
                className="w-full bg-blue-900 text-[#0a0a0a] font-semibold rounded-lg p-3 hover:bg-[#e5e5e5] transition-colors mt-6">
                Register as {role.charAt(0) + role.slice(1).toLowerCase()}
            </button>
        </form>

        <p className="text-sm text-[#666666] text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-[#e5e5e5] hover:underline">
                Login
            </Link>
        </p>
    </div>
</div>
    )
}
export default Signup;