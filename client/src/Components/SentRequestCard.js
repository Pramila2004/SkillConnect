import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

export default function SentRequestCard({ request }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/mentor/${request.to._id}`);
    };

    const statusColors = {
        accepted: 'bg-green-900 border-green-400',
        declined: 'bg-red-900 border-red-400',
        pending: 'bg-yellow-900 border-yellow-400'
    };

    const bgClass = statusColors[request.status] || 'bg-gray-800 border-gray-600';

    return (
        <div className={`p-5 rounded-2xl border shadow-md ${bgClass}`}>
            <div onClick={handleClick} className="flex items-center gap-4 mb-4 cursor-pointer">
                {request.to.avatar ? (
                    <img
                        src={request.to.avatar}
                        alt="avatar"
                        className="w-14 h-14 rounded-full object-cover border-2 border-teal-400"
                    />
                ) : (
                    <FaUserCircle size={56} className="text-teal-400" />
                )}
                <div>
                    <h3 className="text-teal-300 font-semibold text-xl">{request.to.username}</h3>
                    <p className="text-sm text-gray-400">{request.to.email}</p>
                </div>
            </div>

            <div className="p-4 rounded-lg text-sm space-y-2 bg-[#1e2e3e]">
                <p><span className="text-teal-400 font-medium">Skill You Want:</span> <span className="text-white font-semibold">{request.skillToLearn}</span></p>
                <p><span className="text-purple-400 font-medium">Skill You Offer:</span> <span className="text-white font-semibold">{request.skillToTeach}</span></p>
                <p className="text-xs text-gray-300 mt-1">
                    Status: <span className="font-semibold capitalize">{request.status}</span>
                </p>
            </div>
            <button
                onClick={() => navigate(`/chat/${request._id}`)}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#0f172a] text-teal-300 border border-teal-600 hover:bg-teal-500 hover:text-black hover:shadow-lg transition-all duration-200"
            >
                <span className="text-lg">💬</span>
                <span className="font-semibold">Open Chat</span>
            </button>



        </div>
    );
}
