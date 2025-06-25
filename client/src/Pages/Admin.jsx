import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { get, put, del } from '../services/ApiEndpoint';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AdminPanel() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (currentUser?.role !== 'admin') {
      toast.error("Unauthorized");
      navigate('/');
      return;
    }
    fetchAll();
  }, [currentUser]);

  const fetchAll = async () => {
    try {
      const u = await get('/admin/users');
      const r = await get('/admin/requests');
      const s = await get('/admin/stats');
      setUsers(u.data);
      setRequests(r.data);
      setStats(s.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load data");
    }
  };

  const handleEdit = (id) => {
  navigate(`/admin/edit/${id}`);
};


  const handleDelete = async (id) => {
    try {
      await del(`/admin/user/${id}`);
      toast.success("User deleted");
      fetchAll();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleSearch = async () => {
    try {
      const res = await get(`/admin/users/search?q=${search}`);
      setUsers(res.data);
    } catch {
      toast.error("Search failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1B2B] text-white p-6">
      <h1 className="text-3xl font-bold text-teal-400 mb-6">🛠 Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#1c2c3c] p-4 rounded-lg">👥 Users: <b>{stats.userCount}</b></div>
        <div className="bg-[#1c2c3c] p-4 rounded-lg">📚 Top Taught: <b>{stats.mostTaughtSkill}</b></div>
        <div className="bg-[#1c2c3c] p-4 rounded-lg">🎯 Top Demanded: <b>{stats.mostDemandedSkill}</b></div>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="Search user by name or skill..."
        className="bg-[#1e2e3e] border border-teal-500 text-white w-full p-2 mb-6 rounded"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {users.map((u) => (
          <div key={u._id} className="bg-[#1e2e3e] p-4 rounded-lg">
            <h3 className="text-teal-300 font-bold">{u.username}</h3>
            <p className="text-gray-400 text-sm">{u.email}</p>
            <p className="text-sm text-purple-400">Teach: {u.skillsHave?.join(', ') || 'None'}</p>
            <p className="text-sm text-yellow-400">Learn: {u.skillsWant?.join(', ') || 'None'}</p>
            <div className="flex gap-2 mt-2">
              <button className="bg-blue-500 text-black px-2 py-1 rounded" onClick={() => handleEdit(u._id)}>Edit</button>
              <button className="bg-red-500 text-black px-2 py-1 rounded" onClick={() => handleDelete(u._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">📨 Requests</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs bg-[#1c2c3c] text-gray-400 uppercase">
              <tr>
                <th className="px-4 py-2">From</th>
                <th className="px-4 py-2">To</th>
                <th className="px-4 py-2">Teach</th>
                <th className="px-4 py-2">Learn</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r._id} className="bg-[#121f2b] border-b border-gray-700">
                  <td className="px-4 py-2">{r.from?.username}</td>
                  <td className="px-4 py-2">{r.to?.username}</td>
                  <td className="px-4 py-2">{r.skillToTeach}</td>
                  <td className="px-4 py-2">{r.skillToLearn}</td>
                  <td className="px-4 py-2">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
