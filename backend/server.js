const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const eventRoutes = require('./routes/eventRoutes');
const jobRoutes = require('./routes/jobRoutes');
const mentorshipRoutes = require('./routes/mentorshipRoutes');
const messageRoutes = require('./routes/messageRoutes');
const adminRoutes = require('./routes/adminRoutes');

const Message = require('./models/Message');

// DB CONNECT
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log(err));

const app = express();
const server = http.createServer(app);

// MIDDLEWARE
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/mentorship', mentorshipRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);

// SOCKET.IO
const io = new Server(server, {
  cors: { origin: '*' }
});

const onlineUsers = new Map();

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Auth error"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch {
    next(new Error("Auth error"));
  }
});

io.on('connection', socket => {
  onlineUsers.set(socket.userId, socket.id);

  socket.on('sendMessage', async ({ to, content }) => {
    const msg = await Message.create({
      sender: socket.userId,
      receiver: to,
      content
    });

    const receiverSocket = onlineUsers.get(to);

    if (receiverSocket) {
      io.to(receiverSocket).emit('receiveMessage', msg);
    }
  });

  socket.on('disconnect', () => {
    onlineUsers.delete(socket.userId);
  });
});

// TEST ROUTE
app.get('/', (req, res) => res.send("API Running"));

// START SERVER
server.listen(5000, () => console.log("Server running"));