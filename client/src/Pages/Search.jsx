import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { get } from '../services/ApiEndpoint';
import Card from '../Components/Card';

export default function Search() {
  const { currentUser } = useContext(AuthContext);
  const [mentors, setMentors] = useState([]);
  const [query, setQuery] = useState('');

  const fetchMentors = async () => {
    try {
      const res = await get(`/api/user/explore/${currentUser._id}?q=${query}`);
      if (res.status === 200) {
        setMentors(res.data);
      }
    } catch (error) {
      console.error('Error fetching mentors:', error);
    }
  };

  useEffect(() => {
    if (currentUser?._id) {
      fetchMentors();
    }
  }, [currentUser, query]);

  return (
    <div className="min-h-screen bg-[#0B1B2B] py-10 px-6 text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-teal-400 mb-6">Explore Mentors</h1>

        <div className="flex justify-center mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or skill..."
            className="w-full max-w-md px-4 py-2 rounded-lg bg-gray-800 border border-teal-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {mentors.map((user) => (
            <Card key={user._id} user={user} />
          ))}
          {mentors.length === 0 && (
            <p className="col-span-full text-center text-gray-400">
              No matching mentors found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
