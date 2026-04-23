import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";


const Login = () => {
  const [credentials, setCredentials] = useState({ code: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (error) setError('');
  }, [credentials.code, credentials.password]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/auth/login', credentials);
      const data = response.data;

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('name', data.name);
      localStorage.setItem('code', data.code);

      if (data.role === "STUDENT") navigate('/student');
      if (data.role === "LECTURER") navigate('/lecturer');
      if (data.role === "ADMIN") navigate('/admin');

    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Server Connection Error.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 text-[#e5e5e5]">
      <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-semibold mb-6 text-white text-center">Sign In</h2>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#888888] mb-1">Access Code</label>
            <input
              type="text"
              name="code"
              placeholder="e.g., STD-1234"
              value={credentials.code}
              onChange={handleChange}
              required
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] placeholder-[#444444] focus:outline-none focus:border-[#555555] focus:ring-1 focus:ring-[#555555] transition-colors uppercase"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#888888] mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={credentials.password}
              onChange={handleChange}
              required
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] placeholder-[#444444] focus:outline-none focus:border-[#555555] focus:ring-1 focus:ring-[#555555] transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white text-[#0a0a0a] font-semibold rounded-lg p-3 hover:bg-[#e5e5e5] transition-colors mt-4"
          >
            Secure Login
          </button>
        </form>
          <p className="text-sm text-[#666666] text-center mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#e5e5e5] hover:underline">
                Signup
            </Link>
          </p>
      </div>
    </div>
  );
};

export default Login;