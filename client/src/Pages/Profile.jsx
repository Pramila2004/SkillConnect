import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaUserCircle, FaInstagram, FaLinkedin, FaGithub, FaPlus } from 'react-icons/fa';
import { post, get } from '../services/ApiEndpoint';
import toast from 'react-hot-toast';
import RequestArrivedCard from '../Components/RequestArrivedCard'
import SentRequestCard from '../Components/SentRequestCard';

export default function Profile() {
    const { currentUser } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('overview');
    const [formData, setFormData] = useState({
        username: currentUser.username || '',
        bio: currentUser.bio || '',
        linkedin: currentUser.linkedin || '',
        github: currentUser.github || '',
        instagram: currentUser.instagram || '',
        otherLinks: currentUser.otherLinks || [],
        skillsHave: currentUser.skillsHave || [],
        skillsWant: currentUser.skillsWant || [],
    });

    const [newSkillHave, setNewSkillHave] = useState('');
    const [newSkillWant, setNewSkillWant] = useState('');
    const [newLink, setNewLink] = useState('');
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);


    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await get(`/api/user/getUserInfo/${currentUser._id}`);
                if (res.status === 200) {
                    const data = res.data;
                    setFormData({
                        username: data.username || '',
                        bio: data.bio || '',
                        linkedin: data.linkedin || '',
                        github: data.github || '',
                        instagram: data.instagram || '',
                        otherLinks: data.otherLinks || [],
                        skillsHave: data.skillsHave || [],
                        skillsWant: data.skillsWant || [],
                    });
                }
            } catch (err) {
                console.error('Error fetching user profile', err);
            }
        };

        const fetchReceivedRequests = async () => {
            try {
                const res = await get(`/api/request/received/${currentUser._id}`);
                if (res.status === 200) {
                    setReceivedRequests(res.data);
                }
            } catch (err) {
                console.error('Error fetching received requests', err);
            }
        };
        const fetchSentRequests = async () => {
            try {
                const res = await get(`/api/request/sent/${currentUser._id}`);
                if (res.status === 200) {
                    setSentRequests(res.data);
                }
            } catch (err) {
                console.error('Error fetching sent requests', err);
            }
        };





        if (currentUser?._id) {
            fetchUserProfile();
            fetchReceivedRequests(); // ✅ Fetch incoming requests here
            fetchSentRequests();
        }
    }, [currentUser]);


    const handleAddSkill = (type) => {
        if (type === 'have' && newSkillHave.trim()) {
            setFormData((prev) => ({ ...prev, skillsHave: [...prev.skillsHave, newSkillHave.trim()] }));
            setNewSkillHave('');
        } else if (type === 'want' && newSkillWant.trim()) {
            setFormData((prev) => ({ ...prev, skillsWant: [...prev.skillsWant, newSkillWant.trim()] }));
            setNewSkillWant('');
        }
    };

    const handleAddLink = () => {
        if (newLink.trim()) {
            setFormData((prev) => ({ ...prev, otherLinks: [...prev.otherLinks, newLink.trim()] }));
            setNewLink('');
        }
    };

    const handleRemoveSkillHave = (idx) => {
        const updated = formData.skillsHave.filter((_, i) => i !== idx);
        setFormData({ ...formData, skillsHave: updated });
    };

    const handleRemoveSkillWant = (idx) => {
        const updated = formData.skillsWant.filter((_, i) => i !== idx);
        setFormData({ ...formData, skillsWant: updated });
    };

    const handleRemoveLink = (idx) => {
        const updated = formData.otherLinks.filter((_, i) => i !== idx);
        setFormData({ ...formData, otherLinks: updated });
    };

    const handleSave = async () => {
        try {
            const payload = {
                userId: currentUser._id,
                username: formData.username,
                bio: formData.bio,
                linkedin: formData.linkedin,
                github: formData.github,
                instagram: formData.instagram,
                otherLinks: formData.otherLinks,
                skillsHave: formData.skillsHave,
                skillsWant: formData.skillsWant,
            };

            const res = await post('/api/user/addInfo', payload);
            if (res.status === 200) {
                toast.success('Profile updated successfully!');
            } else {
                toast.error('Failed to update profile');
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong');
        }
    };

    return (
        <div className="min-h-screen bg-[#0B1B2B] py-10 px-4 text-white">
            <div className="max-w-5xl mx-auto">
                <div className="flex space-x-4 mb-6 justify-center">
                    {['overview', 'edit', 'requests', 'sent'].map((tab) => (
                        <button
                            key={tab}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition duration-300 ${activeTab === tab ? 'bg-teal-500 text-black' : 'bg-gray-800 text-white hover:bg-gray-700'
                                }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === 'overview' && 'Overview'}
                            {tab === 'edit' && 'Edit Profile'}
                            {tab === 'requests' && 'Arrived Requests'}
                            {tab === 'sent' && 'Sent Requests'}
                        </button>
                    ))}
                </div>

                <div className="bg-[#122437] p-8 rounded-2xl shadow-2xl border border-gray-600">
                    {activeTab === 'overview' && (
                        <div className="space-y-10">
                            <div className="flex flex-col items-center text-center">
                                {formData.avatar ? (
                                    <img
                                        src={formData.avatar}
                                        alt="avatar"
                                        className="w-32 h-32 rounded-full object-cover border-4 border-teal-500 shadow-xl"
                                    />
                                ) : (
                                    <FaUserCircle size={128} className="text-teal-400" />
                                )}
                                <h2 className="mt-4 text-3xl font-bold text-teal-300">{formData.username}</h2>
                                <p className="mt-2 text-gray-300 italic max-w-2xl break-words whitespace-pre-wrap">
                                    {formData.bio || 'No bio provided'}
                                </p>
                            </div>

                            <div className="flex justify-center gap-6 text-teal-400">
                                {formData.linkedin && <a href={formData.linkedin} target="_blank" rel="noreferrer"><FaLinkedin size={24} /></a>}
                                {formData.github && <a href={formData.github} target="_blank" rel="noreferrer"><FaGithub size={24} /></a>}
                                {formData.instagram && <a href={formData.instagram} target="_blank" rel="noreferrer"><FaInstagram size={24} /></a>}
                                {formData.otherLinks?.map((link, idx) => (
                                    <a key={idx} href={link} target="_blank" rel="noreferrer">🔗</a>
                                ))}
                            </div>

                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="flex flex-col items-center">
                                    <h3 className="text-xl font-semibold text-teal-400 mb-4">💼 Skills I Have</h3>
                                    <div className="flex flex-wrap justify-center gap-3">
                                        {formData.skillsHave?.map((skill, idx) => (
                                            <span key={idx} className="px-4 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-teal-600 to-green-400 text-black shadow-lg">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col items-center">
                                    <h3 className="text-xl font-semibold text-purple-400 mb-4">📚 Skills I Want to Learn</h3>
                                    <div className="flex flex-wrap justify-center gap-3">
                                        {formData.skillsWant?.map((skill, idx) => (
                                            <span key={idx} className="px-4 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-purple-600 to-pink-400 text-white shadow-lg">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'edit' && (
                        <div className="space-y-4">
                            <input name="username" value={formData.username} onChange={handleInputChange} placeholder="Username" className="w-full p-3 rounded-lg bg-gray-800 text-white border border-teal-500 focus:outline-none" />
                            <textarea name="bio" value={formData.bio} onChange={handleInputChange} placeholder="Bio" className="w-full p-3 rounded-lg bg-gray-800 text-white border border-teal-500 focus:outline-none" rows={3} />
                            <input name="linkedin" value={formData.linkedin} onChange={handleInputChange} placeholder="LinkedIn URL" className="w-full p-3 rounded-lg bg-gray-800 text-white border border-teal-500 focus:outline-none" />
                            <input name="github" value={formData.github} onChange={handleInputChange} placeholder="GitHub URL" className="w-full p-3 rounded-lg bg-gray-800 text-white border border-teal-500 focus:outline-none" />
                            <input name="instagram" value={formData.instagram} onChange={handleInputChange} placeholder="Instagram URL" className="w-full p-3 rounded-lg bg-gray-800 text-white border border-teal-500 focus:outline-none" />
                            <div className="flex gap-2">
                                <input value={newSkillHave} onChange={(e) => setNewSkillHave(e.target.value)} placeholder="Add Skill You Have" className="flex-grow p-3 rounded-lg bg-gray-800 text-white border border-teal-500" />
                                <button onClick={() => handleAddSkill('have')} className="px-4 py-2 bg-teal-500 rounded-md text-black font-bold"><FaPlus /></button>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {formData.skillsHave.map((skill, idx) => (
                                    <span key={idx} className="bg-teal-700 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                        {skill}
                                        <button onClick={() => handleRemoveSkillHave(idx)} className="text-white hover:text-red-300">×</button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input value={newSkillWant} onChange={(e) => setNewSkillWant(e.target.value)} placeholder="Add Skill You Want" className="flex-grow p-3 rounded-lg bg-gray-800 text-white border border-teal-500" />
                                <button onClick={() => handleAddSkill('want')} className="px-4 py-2 bg-teal-500 rounded-md text-black font-bold"><FaPlus /></button>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {formData.skillsWant.map((skill, idx) => (
                                    <span key={idx} className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                        {skill}
                                        <button onClick={() => handleRemoveSkillWant(idx)} className="text-white hover:text-red-300">×</button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input value={newLink} onChange={(e) => setNewLink(e.target.value)} placeholder="Add Other Social Link" className="flex-grow p-3 rounded-lg bg-gray-800 text-white border border-teal-500" />
                                <button onClick={handleAddLink} className="px-4 py-2 bg-teal-500 rounded-md text-black font-bold"><FaPlus /></button>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {formData.otherLinks.map((link, idx) => (
                                    <span key={idx} className="bg-blue-700 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                        {link}
                                        <button onClick={() => handleRemoveLink(idx)} className="text-white hover:text-red-300">×</button>
                                    </span>
                                ))}
                            </div>
                            <button onClick={handleSave} className="px-6 py-3 bg-teal-500 rounded-md text-black font-semibold hover:bg-teal-400 transition">Save Changes</button>
                        </div>
                    )}

                    {activeTab === 'requests' && (
                        <div className="text-sm text-gray-300">
                            <h3 className="text-lg font-semibold mb-4 text-teal-400">📥 Incoming Requests</h3>

                            {receivedRequests.length === 0 ? (
                                <p>No requests received yet.</p>
                            ) : (
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {receivedRequests.map((request) => (
                                        <RequestArrivedCard
                                            key={request._id}
                                            request={request}
                                            refresh={() => {
                                                // Refresh requests after status change
                                                get(`/api/request/received/${currentUser._id}`).then((res) => {
                                                    if (res.status === 200) {
                                                        setReceivedRequests(res.data);
                                                    }
                                                }).catch((err) => console.error('Error refreshing requests', err));
                                            }}
                                        />
                                    ))}


                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'sent' && (
                        <div className="text-sm text-gray-300">
                            <h3 className="text-lg font-semibold mb-3 text-teal-400">📤 Sent Requests</h3>

                            {sentRequests.length === 0 ? (
                                <p>No sent requests yet.</p>
                            ) : (
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {sentRequests.map((request) => (
                                        <SentRequestCard key={request._id} request={request} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}