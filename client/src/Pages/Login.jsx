import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { post } from '../services/ApiEndpoint.js';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const request = await post('/api/auth/login', { email, password }, {
        withCredentials: true, // ✅ send cookies
      });
      const response = request.data;

      if (request.status === 200) {
        updateUser(response.user); // ✅ save user in context & localStorage
        toast.success(response.message || 'Login successful');
        navigate('/');
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'An error occurred during login'
      );
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1B2B] text-white">
      <div className="bg-[#122437] p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="mb-6 text-center">
          <img src="images/logo.png" alt="SkilllConnect Logo" className="mx-auto h-16 md:h-20" />
          <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
          <p className="text-sm text-gray-400">Login to SkilllConnect</p>
        </div>
        <form onSubmit={handlesubmit} className="space-y-5">
          <div>
            <label className="text-sm">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 rounded-md bg-[#1C2E42] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          <div>
            <label className="text-sm">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-3 rounded-md bg-[#1C2E42] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-teal-400 to-green-400 text-black py-3 rounded-md font-semibold hover:opacity-90 transition">
            Login
          </button>
        </form>
        <p className="text-sm text-center text-gray-400 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-teal-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
