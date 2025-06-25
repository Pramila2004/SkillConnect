import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext.js";

export default function Navbar() {
    const { currentUser, updateUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        updateUser(null);
        toast.success("Logged out successfully!");
        navigate("/login");
    };

    return (
        <nav className="bg-[#0B1B2B] text-white shadow-md px-6 py-4 flex justify-between items-center">
            <Link to="/">
                <img
                    src="/images/logo.png"
                    alt="SkilllConnect Logo"
                    className="h-20 md:h-20 object-contain"
                />
            </Link>

            <div className="flex space-x-6 items-center">
                <Link
                    to="/"
                    className="hover:text-teal-400 transition text-sm md:text-base"
                >
                    Home
                </Link>
                <Link
                    to="/search"
                    className="hover:text-teal-400 transition text-sm md:text-base"
                >
                    Search
                </Link>
                <Link
                    to="/about"
                    className="hover:text-teal-400 transition text-sm md:text-base"
                >
                    About
                </Link>
                <Link
                    to="/contact"
                    className="hover:text-teal-400 transition text-sm md:text-base"
                >
                    Contact
                </Link>

                {!currentUser ? (
                    <>
                        <Link to="/login">
                            <button className="bg-teal-500 text-black px-4 py-2 rounded hover:bg-teal-400 transition text-sm font-semibold">
                                Login
                            </button>
                        </Link>
                        <Link to="/register">
                            <button className="bg-teal-500 text-black px-4 py-2 rounded hover:bg-teal-400 transition text-sm font-semibold">
                                Signup
                            </button>
                        </Link>
                    </>
                ) : (
                    <div className="flex items-center space-x-4">
                        <Link to="/profile">
                            <div className="flex items-center space-x-2">
                                {currentUser.avatar ? (
                                    <img
                                        src={currentUser?.avatar}
                                        alt="avatar"
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <FaUserCircle size={28} className="text-teal-400" />
                                )}
                                <span className="text-sm md:text-base font-medium">
                                    {currentUser?.username}
                                </span>
                            </div>
                        </Link>

                        {currentUser?.role === "admin" && (
                            <button
                                onClick={() => navigate("/admin")}
                                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg text-sm font-semibold"
                            >
                                🛠 Admin Panel
                            </button>
                        )}

                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 transition text-sm font-semibold"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}
