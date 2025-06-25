import React, { useEffect, useState } from 'react';
import { get, put } from '../services/ApiEndpoint';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AdminEditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    get(`/admin/user/${id}`).then((res) => setUser(res.data)).catch(() => toast.error('Failed to load user'));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await put(`/admin/user/${id}`, user);
      toast.success('User updated');
      navigate('/admin'); // change this to actual admin dashboard path
    } catch {
      toast.error('Update failed');
    }
  };

  if (!user) return <p className="text-white p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-[#0B1B2B] text-white p-6">
      <h2 className="text-2xl font-bold mb-4 text-teal-400">✏️ Edit User Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <input className="w-full p-2 rounded bg-[#1c2c3c]" placeholder="Username" value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} />
        <input className="w-full p-2 rounded bg-[#1c2c3c]" placeholder="Email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
        <textarea className="w-full p-2 rounded bg-[#1c2c3c]" placeholder="Bio" value={user.bio} onChange={(e) => setUser({ ...user, bio: e.target.value })} />
        <input className="w-full p-2 rounded bg-[#1c2c3c]" placeholder="LinkedIn" value={user.linkedin} onChange={(e) => setUser({ ...user, linkedin: e.target.value })} />
        <input className="w-full p-2 rounded bg-[#1c2c3c]" placeholder="GitHub" value={user.github} onChange={(e) => setUser({ ...user, github: e.target.value })} />
        <input className="w-full p-2 rounded bg-[#1c2c3c]" placeholder="Instagram" value={user.instagram} onChange={(e) => setUser({ ...user, instagram: e.target.value })} />
        <input className="w-full p-2 rounded bg-[#1c2c3c]" placeholder="Skills Have (comma separated)" value={user.skillsHave?.join(',')} onChange={(e) => setUser({ ...user, skillsHave: e.target.value.split(',') })} />
        <input className="w-full p-2 rounded bg-[#1c2c3c]" placeholder="Skills Want (comma separated)" value={user.skillsWant?.join(',')} onChange={(e) => setUser({ ...user, skillsWant: e.target.value.split(',') })} />
        <button type="submit" className="px-4 py-2 bg-green-500 rounded hover:bg-green-600 text-black font-semibold">Save Changes</button>
      </form>
    </div>
  );
}
