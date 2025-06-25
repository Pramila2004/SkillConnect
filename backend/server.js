import { Server } from 'socket.io';
import express from 'express'
import http from 'http';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // your frontend URL
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('⚡ A user connected:', socket.id);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
  });

  socket.on('newMessage', (data) => {
    io.to(data.requestId).emit('receiveMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('🚫 User disconnected:', socket.id);
  });
});

export { server }; // instead of app.listen()
