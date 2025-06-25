import React, { useState } from "react";
import { Link } from "react-router-dom";
import { post } from '../services/ApiEndpoint.js';
import { toast } from 'react-hot-toast';

export default function Register() {
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const request = await post('/api/auth/register', { username, email, password });
      const response = request.data;
      if (request.status === 200) {
        toast.success(response.message || 'Register successful');
        e.target.reset();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'An error occurred during register'
      );
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1B2B] text-white">
      <div className="bg-[#122437] p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="mb-6 text-center">
          <img src="images/logo.png" alt="SkilllConnect Logo" className="mx-auto h-12" />
          <h1 className="text-2xl font-bold mt-2">Create Account</h1>
          <p className="text-sm text-gray-400">Join SkilllConnect today</p>
        </div>
        <form onSubmit={handlesubmit} className="space-y-5">
          <div>
            <label className="text-sm">Name</label>
            <input
              type="text"
              placeholder="Your name"
              required
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-3 rounded-md bg-[#1C2E42] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
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
            Register
          </button>
        </form>
        <p className="text-sm text-center text-gray-400 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-teal-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
