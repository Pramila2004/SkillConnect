import express from 'express';
import cookieParser from 'cookie-parser';
import DBConnection from './database/db_connection.js';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import requestRoutes from './routes/request.js';
import messageRoutes from './routes/messageRoutes.js';
import adminRoutes from './routes/admin.js'
import reviewRoutes from './routes/review.js';
import http from 'http'; // ✅ Required for socket
import { Server } from 'socket.io'; // ✅ Socket.IO server
import path from 'path'; // ✅ for __dirname fix in ES modules
import { fileURLToPath } from 'url'; // ✅

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Wrap app in HTTP server
const server = http.createServer(app);

// ✅ Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? 'https://your-frontend-domain.com'
      : 'http://localhost:3000',
    credentials: true,
  },
});

// ✅ Global Socket.IO logic
io.on('connection', (socket) => {
  console.log(`📡 User connected: ${socket.id}`);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`🟢 User joined room ${roomId}`);
  });

  socket.on('newMessage', (data) => {
    io.to(data.requestId).emit('receiveMessage', data);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.id}`);
  });
});

// Database connection
DBConnection();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://your-frontend.com'
    : 'http://localhost:3000',
  credentials: true,
}));


// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/request', requestRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/review', reviewRoutes);


// Serve React static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// ✅ Start socket-powered HTTP server
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
