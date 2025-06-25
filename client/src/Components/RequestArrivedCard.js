import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { patch } from '../services/ApiEndpoint';
import toast from 'react-hot-toast';

export default function RequestArrivedCard({ request, refresh }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/mentor/${request.from._id}`);
    };

    const handleStatusChange = async (newStatus) => {
        try {
            const res = await patch(`/api/request/update/${request._id}`, { status: newStatus });

            // Ensure the response indicates success
            if (res.status === 200) {
                toast.success(`Request marked as ${newStatus}`);
                if (refresh) refresh(); // call refresh if it exists
            } else {
                throw new Error('Failed to update status');
            }
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || err.message || 'Something went wrong.');
        }
    };


    const statusColor = {
        accepted: 'text-green-400',
        declined: 'text-red-400',
        pending: 'text-yellow-300'
    };

    return (
        <div className="bg-[#1c2c3c] p-5 rounded-2xl border border-gray-700 shadow-md transition hover:shadow-lg hover:border-teal-500">
            <div onClick={handleClick} className="flex items-center gap-4 mb-4 cursor-pointer">
                {request.from.avatar ? (
                    <img
                        src={request.from.avatar}
                        alt="avatar"
                        className="w-14 h-14 rounded-full object-cover border-2 border-teal-400"
                    />
                ) : (
                    <FaUserCircle size={56} className="text-teal-400" />
                )}
                <div>
                    <h3 className="text-teal-300 font-semibold text-xl">{request.from.username}</h3>
                    <p className="text-sm text-gray-400">{request.from.email}</p>
                </div>
            </div>

            <div className="bg-[#243545] p-4 rounded-lg text-sm space-y-2 mb-4">
                <p><span className="text-teal-400 font-medium">Wants to Learn:</span> <span className="text-white font-semibold">{request.skillToLearn}</span></p>
                <p><span className="text-purple-400 font-medium">Can Teach:</span> <span className="text-white font-semibold">{request.skillToTeach}</span></p>
                <p className="text-xs mt-1">
                    Current Status: <span className={`font-semibold ${statusColor[request.status]}`}>{request.status}</span>
                </p>
            </div>

            <div className="flex justify-between gap-2 text-sm">
                <button onClick={() => handleStatusChange('accepted')} className="flex-1 bg-green-500 hover:bg-green-600 text-black font-bold py-2 rounded-lg">Accept</button>
                <button onClick={() => handleStatusChange('declined')} className="flex-1 bg-red-500 hover:bg-red-600 text-black font-bold py-2 rounded-lg">Decline</button>
                <button onClick={() => handleStatusChange('pending')} className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 rounded-lg">Pending</button>
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
