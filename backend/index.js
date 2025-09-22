import express from 'express';
import cookieParser from 'cookie-parser';
import DBConnection from './database/db_connection.js';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import requestRoutes from './routes/request.js';
import messageRoutes from './routes/messageRoutes.js';
import adminRoutes from './routes/admin.js';
import reviewRoutes from './routes/review.js';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

// Wrap app in HTTP server for Socket.IO
const server = http.createServer(app);

// Rate limiter for login route
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // max 5 login attempts per 15 minutes
  message: {
    status: 429,
    message: "Too many login attempts, please try again after 15 minutes.",
  },
});

// Database connection
DBConnection();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS config
const allowedOrigins = [
  'http://localhost:3000',
  'https://skillconnect-frontend.onrender.com'
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
}));

// Apply rate limiter only on login route
app.use('/api/auth/login', loginLimiter);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/request', requestRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/review', reviewRoutes);

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

io.on('connection', (socket) => {
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room ${roomId}`);
  });

  socket.on('newMessage', (data) => {
    io.to(data.requestId).emit('receiveMessage', data);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
