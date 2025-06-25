import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { get, post } from '../services/ApiEndpoint';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

export default function ChatRoom() {
    const { currentUser } = useContext(AuthContext);
    const { requestId } = useParams();

    const [messages, setMessages] = useState([]);
    const [newMsg, setNewMsg] = useState('');
    const [receiverId, setReceiverId] = useState(null);
    const endRef = useRef();
    const socketRef = useRef(null);

    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io('https://skillconnect-sxnq.onrender.com' || 'http://localhost:4000', {
                withCredentials: true,
            });
        }

        const socket = socketRef.current;

        const fetchChatData = async () => {
            try {
                const msgRes = await get(`/api/messages/thread/${requestId}`);
                if (msgRes.status === 200) setMessages(msgRes.data);

                const reqRes = await get(`/api/messages/${requestId}`);
                if (reqRes.status === 200) {
                    const r = reqRes.data;
                    const otherUser = r.from._id === currentUser._id ? r.to._id : r.from._id;
                    setReceiverId(otherUser);
                }
            } catch (err) {
                console.error('Error fetching chat:', err);
            }
        };

        if (currentUser && requestId) {
            fetchChatData();
            socket.emit('joinRoom', requestId);
        }

        const handleReceiveMessage = (msg) => {
            const senderId = typeof msg.from === 'string' ? msg.from : msg.from?._id;
            if (senderId !== currentUser._id) {
                setMessages((prev) => [...prev, msg]);
            }
        };

        socket.on('receiveMessage', handleReceiveMessage);

        return () => {
            socket.off('receiveMessage', handleReceiveMessage);
            socket.emit('leaveRoom', requestId); // optional
        };
    }, [currentUser, requestId]);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!newMsg.trim() || !receiverId) return;

        const payload = {
            from: currentUser._id,
            to: receiverId,
            content: newMsg,
            requestId,
        };

        try {
            const res = await post('/api/messages/send', payload);
            if (res.status === 200) {
                const message = res.data;
                setMessages((prev) => [...prev, message]);
                socketRef.current?.emit('newMessage', message);
                setNewMsg('');
            }
        } catch (err) {
            console.error('Send Message Error:', err);
            toast.error(err?.response?.data?.message || 'Message failed to send');
        }
    };

    const isMyMessage = (msg) => {
        const senderId = typeof msg.from === 'string' ? msg.from : msg.from?._id;
        return senderId === currentUser._id;
    };

    return (
        <div className="min-h-screen bg-[#0B1B2B] p-6 text-white">
            <div className="max-w-3xl mx-auto bg-[#1a2a3a] p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-teal-400">💬 Chat Room</h2>

                <div className="h-[400px] overflow-y-auto space-y-3 bg-[#0f1c2b] p-4 rounded-md">
                    {messages.map((msg, idx) => (
                        <div
                            key={msg._id || idx}
                            className={`max-w-xs px-4 py-2 rounded-lg ${isMyMessage(msg)
                                    ? 'bg-teal-500 ml-auto text-black'
                                    : 'bg-gray-700 text-white'
                                }`}
                        >
                            <p className="text-sm">{msg.content}</p>
                            <p className="text-xs text-right mt-1">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                            </p>
                        </div>
                    ))}
                    <div ref={endRef}></div>
                </div>

                <div className="flex mt-4 gap-2">
                    <input
                        value={newMsg}
                        onChange={(e) => setNewMsg(e.target.value)}
                        className="flex-grow p-2 rounded-lg bg-gray-800 border border-teal-500"
                        placeholder="Type your message..."
                    />
                    <button
                        onClick={handleSend}
                        className="px-4 py-2 bg-teal-500 text-black rounded-md font-semibold"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
