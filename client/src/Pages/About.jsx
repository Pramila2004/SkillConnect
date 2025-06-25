import React from 'react';
import { motion } from 'framer-motion';
import { FaReact, FaNodeJs, FaDatabase, FaUserFriends, FaComments, FaStar, FaTools } from 'react-icons/fa';
import { SiMongodb, SiExpress, SiTailwindcss } from 'react-icons/si';

export default function About() {
    return (
        <div className="min-h-screen bg-[#0B1B2B] text-white px-6 py-12">
            <div className="max-w-6xl mx-auto">
                {/* Title */}
                <motion.h1
                    className="text-4xl md:text-6xl font-bold text-center text-teal-400 mb-8"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    About SkillConnect 🚀
                </motion.h1>

                <motion.p
                    className="text-center max-w-3xl mx-auto text-gray-300 text-lg leading-8 mb-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                >
                    <strong className="text-white">SkillConnect</strong> is a peer-to-peer skill-exchange platform where users can create profiles, connect through learning and teaching, and grow together. Whether you want to teach what you know or learn something new, SkillConnect connects mentors and mentees effectively.
                </motion.p>

                {/* Features Section */}
                <div className="grid md:grid-cols-2 gap-8 text-center">
                    {[
                        { title: 'Explore Mentors', icon: <FaUserFriends size={40} />, color: 'text-yellow-300' },
                        { title: 'Profile & Requests System', icon: <FaUserFriends size={40} />, color: 'text-green-300' },
                        { title: 'Real-Time Chat & Discussion Rooms', icon: <FaComments size={40} />, color: 'text-blue-300' },
                        { title: 'Admin Panel (Manage Users & Stats)', icon: <FaTools size={40} />, color: 'text-red-300' },
                        { title: 'Review & Ratings for Mentors', icon: <FaStar size={40} />, color: 'text-yellow-400' }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            className={`bg-[#122437] p-6 rounded-2xl shadow-xl border border-gray-600 hover:border-teal-500 transition-all duration-300 ${item.color}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.2, duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <div className="mb-3">{item.icon}</div>
                            <h3 className="text-xl font-semibold">{item.title}</h3>
                        </motion.div>
                    ))}
                </div>

                {/* Tech Stack Section */}
                <motion.div
                    className="mt-16 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl font-bold text-teal-400 mb-4">Tech Stack 🛠</h2>
                    <div className="flex justify-center flex-wrap gap-6 text-4xl text-white mt-6">
                        <FaReact className="hover:text-teal-300 transition" title="React" />
                        <SiExpress className="hover:text-teal-300 transition" title="Express.js" />
                        <FaNodeJs className="hover:text-teal-300 transition" title="Node.js" />
                        <SiMongodb className="hover:text-teal-300 transition" title="MongoDB" />
                        <FaDatabase className="hover:text-teal-300 transition" title="Mongoose" />
                        <SiTailwindcss className="hover:text-teal-300 transition" title="Tailwind CSS" />
                    </div>
                </motion.div>

                {/* Footer Quote */}
                <motion.p
                    className="mt-20 text-center italic text-gray-400 text-lg"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    viewport={{ once: true }}
                >
                    "Alone we can do so little; together we can do so much." – <span className="text-white">Helen Keller</span>
                </motion.p>
            </div>
        </div>
    );
}
