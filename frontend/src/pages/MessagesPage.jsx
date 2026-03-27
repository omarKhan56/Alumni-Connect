import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../utils/api'
import { initSocket, getSocket } from '../utils/socket'
import { formatDistanceToNow, format } from 'date-fns'
import { Send, Search, MessageCircle, ArrowLeft } from 'lucide-react'

function ConversationItem({ user: contact, isActive, onClick, onlineUsers }) {
  const isOnline = onlineUsers?.includes(contact._id)
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left ${isActive ? 'bg-brand-50 border-r-2 border-brand-500' : ''}`}
    >
      <div className="relative flex-shrink-0">
        <img
          src={contact.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=6366f1&color=fff&size=40`}
          alt={contact.name} className="w-10 h-10 rounded-full object-cover"
        />
        {isOnline && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-800 text-sm truncate">{contact.name}</p>
        <p className="text-xs text-slate-400 capitalize">{contact.role}</p>
      </div>
    </button>
  )
}

function MessageBubble({ msg, isOwn }) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`max-w-[72%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isOwn ? 'bg-brand-600 text-white rounded-br-md' : 'bg-white border border-slate-100 text-slate-800 rounded-bl-md shadow-sm'}`}>
        <p>{msg.content}</p>
        <p className={`text-xs mt-1 ${isOwn ? 'text-brand-200' : 'text-slate-400'}`}>
          {format(new Date(msg.createdAt), 'HH:mm')}
          {isOwn && <span className="ml-1">{msg.read ? '✓✓' : '✓'}</span>}
        </p>
      </div>
    </div>
  )
}

export default function MessagesPage() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { user, token } = useSelector((s) => s.auth)
  const [conversations, setConversations] = useState([])
  const [activeUser, setActiveUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [onlineUsers, setOnlineUsers] = useState([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  const bottomRef = useRef(null)
  const socketRef = useRef(null)

  // Init socket
  useEffect(() => {
    if (token) {
      socketRef.current = initSocket(token)
      socketRef.current.on('receiveMessage', (msg) => {
        setMessages(prev => [...prev, msg])
      })
      socketRef.current.on('messageSent', (msg) => {
        setMessages(prev => [...prev, msg])
      })
      socketRef.current.on('onlineUsers', (users) => setOnlineUsers(users))
    }
    return () => { if (socketRef.current) socketRef.current.disconnect() }
  }, [token])

  // Load conversations
  useEffect(() => {
    api.get('/messages/conversations').then(r => setConversations(r.data)).catch(() => {})
  }, [])

  // Load messages for userId param
  useEffect(() => {
    if (userId) {
      api.get(`/users/${userId}`).then(r => setActiveUser(r.data)).catch(() => {})
      loadMessages(userId)
    }
  }, [userId])

  const loadMessages = async (uid) => {
    setLoadingMessages(true)
    try {
      const { data } = await api.get(`/messages/${uid}`)
      setMessages(data)
    } finally {
      setLoadingMessages(false)
    }
  }

  const openConversation = (contact) => {
    setActiveUser(contact)
    setMessages([])
    navigate(`/messages/${contact._id}`)
    loadMessages(contact._id)
    // Add to conversations if not already there
    if (!conversations.find(c => c._id === contact._id)) {
      setConversations(prev => [contact, ...prev])
    }
  }

  const sendMessage = (e) => {
    e.preventDefault()
    if (!input.trim() || !activeUser) return
    const socket = getSocket()
    if (socket) {
      socket.emit('sendMessage', { to: activeUser._id, content: input.trim() })
    } else {
      // Fallback to REST
      api.post('/messages', { to: activeUser._id, content: input.trim() })
        .then(r => setMessages(prev => [...prev, r.data]))
    }
    setInput('')
  }

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  return (
    <div className="h-[calc(100vh-8rem)] flex rounded-2xl overflow-hidden border border-slate-100 shadow-card bg-white animate-fade-in">
      {/* Sidebar */}
      <div className={`${activeUser ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-72 border-r border-slate-100 flex-shrink-0`}>
        <div className="px-4 py-4 border-b border-slate-100">
          <h2 className="font-display text-lg font-bold text-slate-800">Messages</h2>
        </div>
        {conversations.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <MessageCircle size={40} className="text-slate-200 mb-3" />
            <p className="text-slate-400 text-sm">No conversations yet.<br />Browse the alumni directory to start chatting.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {conversations.map(c => (
              <ConversationItem key={c._id} user={c} isActive={activeUser?._id === c._id} onClick={() => openConversation(c)} onlineUsers={onlineUsers} />
            ))}
          </div>
        )}
      </div>

      {/* Chat area */}
      {!activeUser ? (
        <div className="hidden md:flex flex-1 items-center justify-center flex-col text-center p-8">
          <MessageCircle size={56} className="text-slate-200 mb-4" />
          <h3 className="font-display text-xl font-semibold text-slate-400">Select a conversation</h3>
          <p className="text-slate-300 text-sm mt-1">Or start a new one from the Alumni Directory</p>
        </div>
      ) : (
        <div className={`${activeUser ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
          {/* Chat header */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
            <button onClick={() => { setActiveUser(null); navigate('/messages') }} className="md:hidden p-1.5 hover:bg-slate-100 rounded-lg">
              <ArrowLeft size={18} />
            </button>
            <div className="relative">
              <img
                src={activeUser.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeUser.name)}&background=6366f1&color=fff&size=36`}
                alt="" className="w-9 h-9 rounded-full object-cover"
              />
              {onlineUsers.includes(activeUser._id) && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">{activeUser.name}</p>
              <p className="text-xs text-slate-400">
                {onlineUsers.includes(activeUser._id) ? <span className="text-green-500">● Online</span> : 'Offline'}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 bg-slate-50">
            {loadingMessages ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-slate-400 text-sm">No messages yet. Say hello!</p>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <MessageBubble key={i} msg={msg} isOwn={msg.sender === user._id || msg.sender?._id === user._id} />
                ))}
                <div ref={bottomRef} />
              </>
            )}
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="flex items-center gap-3 px-4 py-3 border-t border-slate-100 bg-white">
            <input
              value={input} onChange={e => setInput(e.target.value)}
              className="input flex-1 py-2.5 text-sm"
              placeholder="Type a message…"
            />
            <button type="submit" disabled={!input.trim()} className="p-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl transition-colors disabled:opacity-40">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
