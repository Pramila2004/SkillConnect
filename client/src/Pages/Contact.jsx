import React from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Contact() {
    return (
        <div className="min-h-screen bg-[#0B1B2B] text-white px-6 py-12">
            <div className="max-w-3xl mx-auto text-center">
                <motion.h1
                    className="text-4xl md:text-5xl font-bold text-teal-400 mb-6"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Contact Us 📬
                </motion.h1>

                <motion.p
                    className="text-gray-300 mb-10 text-lg leading-7"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    We'd love to hear from you! Reach out through any of the channels below.
                </motion.p>

                <div className="space-y-6 text-left text-lg">
                    <motion.div
                        className="flex items-center gap-4 bg-[#122437] p-4 rounded-xl border border-gray-600 hover:border-teal-400 transition"
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        viewport={{ once: true }}
                    >
                        <FaEnvelope className="text-teal-300 text-2xl" />
                        <span className="text-gray-200">nkolhepramila@gmail.com</span>
                    </motion.div>

                    <motion.div
                        className="flex items-center gap-4 bg-[#122437] p-4 rounded-xl border border-gray-600 hover:border-teal-400 transition"
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        viewport={{ once: true }}
                    >
                        <FaPhone className="text-teal-300 text-2xl" />
                        <span className="text-gray-200">+91 98765 43210</span>
                    </motion.div>

                    <motion.div
                        className="flex items-center gap-4 bg-[#122437] p-4 rounded-xl border border-gray-600 hover:border-teal-400 transition"
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.4 }}
                        viewport={{ once: true }}
                    >
                        <FaMapMarkerAlt className="text-teal-300 text-2xl" />
                        <span className="text-gray-200">Pune, Maharashtra, India</span>
                    </motion.div>

                    <motion.div
                        className="flex items-center gap-4 bg-[#122437] p-4 rounded-xl border border-gray-600 hover:border-teal-400 transition"
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6, duration: 0.4 }}
                        viewport={{ once: true }}
                    >
                        <FaGithub className="text-teal-300 text-2xl" />
                        <a href="https://github.com/Pramila2004" target="_blank" rel="noreferrer" className="text-gray-200 hover:underline">
                            https://github.com/Pramila2004
                        </a>
                    </motion.div>

                    <motion.div
                        className="flex items-center gap-4 bg-[#122437] p-4 rounded-xl border border-gray-600 hover:border-teal-400 transition"
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8, duration: 0.4 }}
                        viewport={{ once: true }}
                    >
                        <FaLinkedin className="text-teal-300 text-2xl" />
                        <a href="hhttps://www.linkedin.com/in/pramila-kolhe-91740228a/" target="_blank" rel="noreferrer" className="text-gray-200 hover:underline">
                            https://www.linkedin.com/in/pramila-kolhe-91740228a/
                        </a>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
