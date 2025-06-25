import React from 'react';
import { FaLinkedin, FaGithub, FaInstagram, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Card({ user }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/mentor/${user._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-[#122437] rounded-xl p-6 shadow-lg border border-gray-700 flex flex-col items-center text-center transition hover:shadow-teal-500/20 hover:cursor-pointer"
    >
      {/* Avatar */}
      {user.avatar ? (
        <img
          src={user.avatar}
          alt="avatar"
          className="w-24 h-24 rounded-full object-cover border-2 border-teal-500 mb-4"
        />
      ) : (
        <FaUserCircle size={96} className="text-teal-400 mb-4" />
      )}

      {/* Username & Email */}
      <h2 className="text-xl font-semibold text-teal-300">{user.username}</h2>
      <p className="text-sm text-gray-400 mt-1">{user.email}</p>

      {/* Social Icons */}
      <div className="flex justify-center gap-4 mt-3 text-teal-400">
        {user.linkedin && (
          <a href={user.linkedin} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
            <FaLinkedin size={20} />
          </a>
        )}
        {user.github && (
          <a href={user.github} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
            <FaGithub size={20} />
          </a>
        )}
        {user.instagram && (
          <a href={user.instagram} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
            <FaInstagram size={20} />
          </a>
        )}
      </div>

      {/* Skills */}
      <div className="mt-6 w-full">
        <h3 className="text-teal-400 font-semibold mb-2 text-sm">🧠 Skills They Can Teach</h3>
        <div className="flex flex-wrap justify-center gap-2">
          {user.skillsHave?.map((skill, idx) => (
            <span
              key={idx}
              className="bg-gradient-to-r from-teal-600 to-green-400 text-black px-3 py-1 rounded-full text-xs font-medium shadow"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
