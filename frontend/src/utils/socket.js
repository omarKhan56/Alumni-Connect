import { io } from 'socket.io-client'

let socket = null

export const initSocket = (token) => {
  // Disconnect existing socket
  if (socket) {
    socket.disconnect()
    socket = null
  }

  // ❌ Prevent connection without token
  if (!token) {
    console.warn("❌ No token provided for socket connection")
    return null
  }

  socket = io('http://localhost:5000', {
    auth: {
      token: token, // ✅ important
    },
    transports: ['websocket'], // keep websocket only
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  })

  // ✅ Debug logs (VERY useful)
  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket.id)
  })

  socket.on('connect_error', (err) => {
    console.error('❌ Socket connection error:', err.message)
  })

  socket.on('disconnect', (reason) => {
    console.warn('⚠️ Socket disconnected:', reason)
  })

  return socket
}

export const getSocket = () => socket

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
    console.log('🔌 Socket manually disconnected')
  }
}