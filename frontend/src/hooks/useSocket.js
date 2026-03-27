import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { initSocket, disconnectSocket } from '../utils/socket'

export function useSocket() {
  const { token } = useSelector((s) => s.auth)
  const socketRef = useRef(null)
  const [connected, setConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState([])

  useEffect(() => {
    if (!token) return

    const socket = initSocket(token)
    socketRef.current = socket

    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))
    socket.on('onlineUsers', (users) => setOnlineUsers(users))

    return () => {
      disconnectSocket()
      setConnected(false)
    }
  }, [token])

  const emit = (event, data) => {
    socketRef.current?.emit(event, data)
  }

  const on = (event, handler) => {
    socketRef.current?.on(event, handler)
    return () => socketRef.current?.off(event, handler)
  }

  return { socket: socketRef.current, connected, onlineUsers, emit, on }
}
