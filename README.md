# 🎓🤝 SkillConnect  

> **Empowering peer learning through seamless skill swapping!**  

---

## 📖 Overview  
**SkillConnect** is a full-stack web platform designed to enable **peer-to-peer skill exchange**. Users can showcase skills they can teach, discover what they want to learn, and connect with others through asynchronous requests and real-time chat. The platform ensures **privacy, scalability, and performance** by offering features like mentor reviews, admin controls, **rate limiting for login security**, and **Redis-based caching** for optimized queries.  

---

## ✨ Features  
- 🔍 **Mentor Search & Discovery** – Find mentors by skills and interests using smart filters.  
- 🔁 **Skill Swap Requests** – Send and receive requests to learn or teach skills.  
- 💬 **Real-time Chat** – Communicate instantly with accepted connections using **Socket.IO**.  
- 👤 **User Profile Management** – View, edit, and showcase teachable and learnable skills.  
- ⭐ **Review & Rating System** – Leave feedback and rate mentors after sessions.  
- 🛠️ **Admin Dashboard** – Manage users, monitor requests, and analyze top taught/demanded skills.  
- ⚡ **Redis Caching** – Speeds up frequently accessed data like users, requests, and analytics.  
- 🔒 **Rate Limiting** – Protects login route from brute-force attacks and ensures fair API usage.  

---

## 🛠️ Technologies Used  
- **Frontend:** React, Tailwind CSS  
- **Backend:** Node.js, Express.js, MongoDB  
- **Real-Time:** Socket.IO for live chat  
- **Authentication & Security:** JWT, Cookies, Express-Rate-Limit  
- **Performance Optimization:** Redis (caching & invalidation)  
- **Deployment:** Render (Frontend & Backend), MongoDB Atlas  

---

## 🚀 Getting Started

### 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Pramila2004/SkillConnect.git
   cd SkillConnect

2. **Install dependencies**
   ```bash
   npm install

3. **Setup .env file with the following variables:**
   ```bash
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   REDIS_URL=your_redis_connection_url

   
1. **Run the development server**
   ```bash
   npm run dev


