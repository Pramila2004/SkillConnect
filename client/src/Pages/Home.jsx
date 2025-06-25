import { Link } from "react-router-dom";
import { FaHandshake, FaUserGraduate, FaCodeBranch } from "react-icons/fa";

export default function Home() {
  return (
    <div className="bg-[#0B1B2B] text-white min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-20 px-4 md:px-16">
        <h1 className="text-4xl md:text-6xl font-bold text-teal-300">
          Welcome to SkilllConnect
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
          The ultimate platform where learners connect to swap, grow, and master new skills together.
        </p>
        <Link to="/register">
          <button className="mt-8 bg-teal-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-teal-300">
            Get Started
          </button>
        </Link>
      </section>

      {/* Features */}
      <section className="bg-[#122437] py-16 px-4 md:px-20 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
        <div className="space-y-4">
          <FaUserGraduate size={40} className="text-teal-400 mx-auto" />
          <h3 className="text-xl font-semibold">Learn Skill</h3>
          <p className="text-gray-400">Access a wide range of user-generated skills from tech to art to business.</p>
        </div>
        <div className="space-y-4">
          <FaCodeBranch size={40} className="text-teal-400 mx-auto" />
          <h3 className="text-xl font-semibold">Teach What You Know</h3>
          <p className="text-gray-400">Share your knowledge and gain experience while helping others succeed.</p>
        </div>
        <div className="space-y-4">
          <FaHandshake size={40} className="text-teal-400 mx-auto" />
          <h3 className="text-xl font-semibold">Skill Swapping</h3>
          <p className="text-gray-400">Offer one skill in exchange for another — a true learning community.</p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 md:px-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-teal-300 mb-6 text-center">Why SkilllConnect?</h2>
        <p className="text-gray-300 text-lg leading-relaxed">
          In a world that changes faster than ever, continuous learning is key. SkilllConnect is built to empower individuals who want to grow together. Whether you're a beginner or a professional, this platform helps you find people with complementary skills so you can teach what you know and learn what you don’t — all without the barrier of money.
        </p>
        <ul className="mt-8 space-y-3 text-gray-400 list-disc list-inside">
          <li>No cost learning through mutual exchange</li>
          <li>Real profiles with verified skills</li>
          <li>Discussion rooms & doubt forums</li>
          <li>Build your personal brand while learning</li>
        </ul>
      </section>

      {/* Call to Action */}
      <section className="text-center bg-[#0F2B3F] py-16 px-4">
        <h3 className="text-2xl md:text-3xl font-bold text-white">Ready to start your journey?</h3>
        <p className="text-gray-300 mt-2">Join SkilllConnect today and unlock your potential.</p>
        <Link to="/register">
          <button className="mt-6 bg-gradient-to-r from-teal-400 to-green-400 text-black px-6 py-3 rounded-full font-semibold hover:opacity-90">
            Join Now
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-[#081421] py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} SkilllConnect. All rights reserved.
      </footer>
    </div>
  );
}


