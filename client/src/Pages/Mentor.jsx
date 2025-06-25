import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { get, post } from '../services/ApiEndpoint';
import { FaUserCircle, FaLinkedin, FaGithub, FaInstagram, FaStar } from 'react-icons/fa';
import { FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';


export default function Mentor() {
    const { id } = useParams();
    const { currentUser } = useContext(AuthContext);

    const [mentor, setMentor] = useState(null);
    const [selectedSkillToLearn, setSelectedSkillToLearn] = useState('');
    const [selectedSkillToTeach, setSelectedSkillToTeach] = useState('');
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [avgRating, setAvgRating] = useState(0);

    useEffect(() => {
        if (id) {
            fetchMentor();
            fetchReviews();
        }
    }, [id]);

    const fetchMentor = async () => {
        try {
            const res = await get(`/api/user/getMentor/${id}`);
            if (res.status === 200) setMentor(res.data);
        } catch (err) {
            console.error('Error fetching mentor:', err);
        }
    };

    const fetchReviews = async () => {
        try {
            const res = await get(`/api/review/${id}`);
            setReviews(res.data.reviews);
            setAvgRating(res.data.avgRating);
        } catch {
            toast.error('Error loading reviews');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSkillToLearn || !selectedSkillToTeach) {
            toast.warning('⚠️ Please select both skills.');
            return;
        }

        try {
            const payload = {
                to: mentor._id,
                from: currentUser._id,
                skillToLearn: selectedSkillToLearn,
                skillToTeach: selectedSkillToTeach,
            };

            const res = await post('/api/request/send', payload);
            if (res.status === 200) {
                toast.success('✅ Request sent successfully!');
                setSelectedSkillToLearn('');
                setSelectedSkillToTeach('');
            } else {
                toast.error('❌ Failed to send request.');
            }
        } catch (err) {
            console.error('Error sending request:', err);
            toast.error('❌ Something went wrong.');
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!rating || !comment) return toast.error('Please rate and comment');

        try {
            const res = await post('/api/review/add', {
                from: currentUser._id,
                to: mentor._id,
                rating,
                comment,
            });

            toast.success('Review submitted');
            setComment('');
            setRating(0);
            fetchReviews();
        } catch {
            toast.error('Error submitting review');
        }
    };

    if (!mentor) {
        return (
            <div className="min-h-screen bg-[#0B1B2B] flex justify-center items-center text-white">
                <p>Loading mentor profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B1B2B] text-white py-10 px-4">


            <div className="max-w-6xl mx-auto bg-[#122437] p-6 md:p-10 rounded-2xl shadow-2xl border border-gray-700 flex flex-col md:flex-row gap-8">
                {/* Left: Mentor Info */}
                <div className="w-full md:w-1/2 flex flex-col items-center text-center border-r border-gray-600 pr-6">
                    {mentor.avatar ? (
                        <img
                            src={mentor.avatar}
                            alt="avatar"
                            className="w-32 h-32 rounded-full object-cover border-4 border-teal-500 shadow"
                        />
                    ) : (
                        <FaUserCircle size={128} className="text-teal-400" />
                    )}
                    <h2 className="mt-4 text-2xl font-bold text-teal-300">{mentor.username}</h2>
                    <p className="text-gray-400 text-sm">{mentor.email}</p>
                    <div className="mt-6 text-center">

                        <div className="flex justify-center items-center space-x-1">
                            {Array.from({ length: 5 }, (_, i) => {
                                const full = i + 1 <= Math.floor(avgRating);
                                const half = !full && i + 0.5 <= avgRating;
                                return (
                                    <span key={i} className="text-yellow-400">
                                        {full ? <FaStar size={22} /> : half ? <FaStarHalfAlt size={22} /> : <FaRegStar size={22} />}
                                    </span>
                                );
                            })}
                        </div>
                    </div>

                    
                    {mentor.bio && <p className="mt-2 text-gray-300 italic">{mentor.bio}</p>}

                    <div className="flex justify-center gap-5 text-teal-400 mt-4">
                        {mentor.linkedin && (
                            <a href={mentor.linkedin} target="_blank" rel="noreferrer">
                                <FaLinkedin size={20} />
                            </a>
                        )}
                        {mentor.github && (
                            <a href={mentor.github} target="_blank" rel="noreferrer">
                                <FaGithub size={20} />
                            </a>
                        )}
                        {mentor.instagram && (
                            <a href={mentor.instagram} target="_blank" rel="noreferrer">
                                <FaInstagram size={20} />
                            </a>
                        )}
                    </div>

                    <div className="mt-6 w-full">
                        <h3 className="text-teal-400 font-semibold mb-2">💼 Skills They Can Teach</h3>
                        <div className="flex flex-wrap justify-center gap-2">
                            {mentor.skillsHave?.map((skill, idx) => (
                                <span
                                    key={idx}
                                    className="bg-gradient-to-r from-teal-600 to-green-400 text-black px-3 py-1 rounded-full text-xs font-medium shadow"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 w-full">
                        <h3 className="text-purple-400 font-semibold mb-2">📚 Skills They Want to Learn</h3>
                        <div className="flex flex-wrap justify-center gap-2">
                            {mentor.skillsWant?.map((skill, idx) => (
                                <span
                                    key={idx}
                                    className="bg-gradient-to-r from-purple-600 to-pink-400 text-white px-3 py-1 rounded-full text-xs font-medium shadow"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Request Form */}
                <div className="w-full md:w-1/2">
                    <h3 className="text-xl font-semibold text-teal-300 mb-6 text-center">📩 Send Skill Swap Request</h3>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="text-sm block mb-1">Skill to Learn from Mentor</label>
                            <select
                                value={selectedSkillToLearn}
                                onChange={(e) => setSelectedSkillToLearn(e.target.value)}
                                className="w-full bg-[#0B1B2B] text-white border border-teal-500 rounded px-4 py-2"
                            >
                                <option value="">-- Choose Skill --</option>
                                {mentor.skillsHave?.map((skill, idx) => (
                                    <option key={idx} value={skill}>{skill}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm block mb-1">Skill You Can Teach</label>
                            <select
                                value={selectedSkillToTeach}
                                onChange={(e) => setSelectedSkillToTeach(e.target.value)}
                                className="w-full bg-[#0B1B2B] text-white border border-teal-500 rounded px-4 py-2"
                            >
                                <option value="">-- Choose Skill --</option>
                                {currentUser.skillsHave?.map((skill, idx) => (
                                    <option key={idx} value={skill}>{skill}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-teal-500 to-green-400 text-black font-semibold py-2 rounded-full shadow hover:scale-105 transition"
                        >
                            Send Request
                        </button>
                    </form>
                </div>
            </div>

            {/* Review Form */}
            <div className="mt-10">
                <h3 className="text-xl text-teal-300 font-semibold mb-4">📝 Leave a Review</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="flex justify-center">
                        {[...Array(5)].map((_, i) => {
                            const starValue = i + 1;
                            return (
                                <label key={i}>
                                    <input
                                        type="radio"
                                        name="rating"
                                        value={starValue}
                                        className="hidden"
                                        onClick={() => setRating(starValue)}
                                    />
                                    <FaStar
                                        size={30}
                                        className={`cursor-pointer transition ${starValue <= (hover || rating) ? 'text-yellow-400' : 'text-gray-400'}`}
                                        onMouseEnter={() => setHover(starValue)}
                                        onMouseLeave={() => setHover(0)}
                                    />
                                </label>
                            );
                        })}
                    </div>
                    <textarea
                        rows="3"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write your review..."
                        className="w-full bg-[#0B1B2B] border border-teal-500 rounded px-4 py-2 text-white"
                    />
                    <button type="submit" className="w-full bg-teal-500 text-black py-2 rounded font-semibold">
                        Submit Review
                    </button>
                </form>
            </div>

            {/* Review List */}
            <div className="mt-10">
                <h3 className="text-xl font-semibold text-teal-300 mb-4">🗣 Reviews</h3>
                {reviews.length === 0 ? (
                    <p className="text-gray-400">No reviews yet.</p>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((r, idx) => (
                            <div key={idx} className="bg-[#1c2c3c] p-4 rounded-lg">
                                <div className="flex justify-between">
                                    <h4 className="text-teal-400 font-bold">{r.from.username}</h4>
                                    <p className="text-yellow-400">{'⭐'.repeat(r.rating)}</p>
                                </div>
                                <p className="text-gray-300 mt-1">{r.comment}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
