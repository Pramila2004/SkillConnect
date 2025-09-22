import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { get, del } from "../services/ApiEndpoint";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function AdminPanel() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (currentUser?.role !== "admin") {
      toast.error("Unauthorized");
      navigate("/");
      return;
    }
    fetchAll();
  }, [currentUser, navigate]);

  const fetchAll = async () => {
    try {
      const u = await get("/api/admin/users");
      const r = await get("/api/admin/requests");
      const s = await get("/api/admin/stats");
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
      await del(`/api/admin/user/${id}`);
      toast.success("User deleted");
      fetchAll();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleSearch = async () => {
    try {
      const res = await get(`/api/admin/users/search?q=${search}`);
      setUsers(res.data);
    } catch {
      toast.error("Search failed");
    }
  };

  // Chart data for request status distribution
const acceptedCount = requests.filter(r => r.status === "accepted").length;
const pendingCount = requests.filter(r => r.status === "pending").length;
const declinedCount = requests.filter(r => r.status === "declined").length;

const requestStatusData = [
  { name: "Accepted", value: acceptedCount },
  { name: "Pending", value: pendingCount },
  { name: "Declined", value: declinedCount },
];

  // Chart data for most taught skills
  const skillCountMap = {};
  requests.forEach((r) => {
    if (r.skillToTeach) {
      skillCountMap[r.skillToTeach] =
        (skillCountMap[r.skillToTeach] || 0) + 1;
    }
  });
  const skillsDistribution = Object.entries(skillCountMap).map(
    ([skill, count]) => ({
      skill,
      count,
    })
  );

  const COLORS = ["#00C49F", "#e72121ff", "#FFBB28", "#FF8042"]; // add more if needed


  return (
    <div className="min-h-screen bg-[#0B1B2B] text-white p-6">
      <h1 className="text-3xl font-bold text-teal-400 mb-6">
        🛠 Admin Dashboard
      </h1>

      {/* === Top Stats === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#1c2c3c] p-4 rounded-lg">
          👥 Users: <b>{stats.userCount}</b>
        </div>
        <div className="bg-[#1c2c3c] p-4 rounded-lg">
          📚 Top Taught: <b>{stats.mostTaughtSkill}</b>
        </div>
        <div className="bg-[#1c2c3c] p-4 rounded-lg">
          🎯 Top Demanded: <b>{stats.mostDemandedSkill}</b>
        </div>
      </div>

      {/* === Charts === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Pie Chart for Request Status */}
        <div className="bg-[#1c2c3c] p-4 rounded-lg flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4">
            Request Status Overview
          </h3>
          <PieChart width={350} height={300}>
            <Pie
              data={requestStatusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
              labelLine={false} // optional: cleaner labels
            >
              {requestStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Bar Chart for Skills Distribution */}
        <div className="bg-[#1c2c3c] p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Skills Distribution</h3>
          <BarChart width={400} height={300} data={skillsDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="skill" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Bar dataKey="count" fill="#00C49F" />
          </BarChart>
        </div>
      </div>

      {/* === Search === */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        placeholder="Search user by name or skill..."
        className="bg-[#1e2e3e] border border-teal-500 text-white w-full p-2 mb-6 rounded"
      />

      {/* === Users === */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {users.map((u) => (
          <div key={u._id} className="bg-[#1e2e3e] p-4 rounded-lg">
            <h3 className="text-teal-300 font-bold">{u.username}</h3>
            <p className="text-gray-400 text-sm">{u.email}</p>
            <p className="text-sm text-purple-400">
              Teach: {u.skillsHave?.join(", ") || "None"}
            </p>
            <p className="text-sm text-yellow-400">
              Learn: {u.skillsWant?.join(", ") || "None"}
            </p>
            <div className="flex gap-2 mt-2">
              <button
                className="bg-blue-500 text-black px-2 py-1 rounded"
                onClick={() => handleEdit(u._id)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-black px-2 py-1 rounded"
                onClick={() => handleDelete(u._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* === Requests Table === */}
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
                <tr
                  key={r._id}
                  className="bg-[#121f2b] border-b border-gray-700"
                >
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
