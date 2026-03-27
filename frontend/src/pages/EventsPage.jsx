import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { CalendarDays, MapPin, Users, Plus, X, Check } from 'lucide-react'

function EventCard({ event, currentUser, onRSVP }) {
  const isRegistered = event.registrations?.includes(currentUser?._id)
  const isPast = new Date(event.date) < new Date()
  const dateObj = new Date(event.date)

  return (
    <div className="card hover:shadow-hover transition-all duration-300 animate-slide-up">
      <div className="flex gap-4">
        {/* Date block */}
        <div className="flex-shrink-0 text-center w-14">
          <div className="bg-brand-600 text-white rounded-xl p-2">
            <p className="text-xs font-bold uppercase leading-none">{dateObj.toLocaleString('default', { month: 'short' })}</p>
            <p className="text-2xl font-bold leading-tight">{dateObj.getDate()}</p>
          </div>
          <p className="text-xs text-slate-400 mt-1">{dateObj.getFullYear()}</p>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-slate-800 leading-snug">{event.title}</h3>
            {isPast && <span className="badge bg-slate-100 text-slate-400 flex-shrink-0 text-xs">Past</span>}
          </div>
          <p className="text-sm text-slate-500 mt-1 line-clamp-2">{event.description}</p>

          <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-500">
            <span className="flex items-center gap-1"><MapPin size={11} />{event.venue}</span>
            <span className="flex items-center gap-1"><Users size={11} />{event.registrations?.length || 0} going</span>
            <span className="flex items-center gap-1">🕐 {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          <div className="mt-4">
            {!isPast && (
              <button
                onClick={() => onRSVP(event._id)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${isRegistered ? 'bg-green-100 text-green-700 hover:bg-red-50 hover:text-red-600' : 'bg-brand-100 text-brand-700 hover:bg-brand-200'}`}
              >
                {isRegistered ? <><Check size={13} /> Going</> : '+ RSVP'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function CreateEventModal({ onClose, onCreate }) {
  const [form, setForm] = useState({ title: '', description: '', date: '', venue: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onCreate(form)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-7 w-full max-w-md shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-bold text-slate-800">Create Event</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Event Title *</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input" required />
          </div>
          <div>
            <label className="label">Description *</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input min-h-[80px] resize-none" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Date & Time *</label>
              <input type="datetime-local" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="input" required />
            </div>
            <div>
              <label className="label">Venue *</label>
              <input value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} className="input" placeholder="Location or Online" required />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" className="btn-primary flex-1 justify-center" disabled={loading}>
              {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function EventsPage() {
  const { user } = useSelector((s) => s.auth)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState('upcoming')

  useEffect(() => {
    api.get('/events').then(r => setEvents(r.data)).finally(() => setLoading(false))
  }, [])

  const handleRSVP = async (eventId) => {
    try {
      const { data } = await api.post(`/events/${eventId}/rsvp`)
      setEvents(prev => prev.map(e => {
        if (e._id !== eventId) return e
        const regs = [...(e.registrations || [])]
        if (data.registered) regs.push(user._id)
        else regs.splice(regs.indexOf(user._id), 1)
        return { ...e, registrations: regs }
      }))
      toast.success(data.registered ? "You're going!" : 'RSVP cancelled')
    } catch { toast.error('Failed to RSVP') }
  }

  const handleCreate = async (form) => {
    const { data } = await api.post('/events', form)
    setEvents(prev => [data, ...prev])
    toast.success('Event created!')
  }

  const filteredEvents = events.filter(e => {
    const past = new Date(e.date) < new Date()
    return filter === 'upcoming' ? !past : past
  })

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800">Events</h1>
          <p className="text-slate-500 text-sm mt-0.5">{filteredEvents.length} {filter} events</p>
        </div>
        {user?.role === 'admin' && (
          <button onClick={() => setShowModal(true)} className="btn-primary"><Plus size={16} /> Create Event</button>
        )}
      </div>

      <div className="flex gap-2">
        {['upcoming', 'past'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filter === f ? 'bg-brand-500 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'}`}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3].map(i => <div key={i} className="card animate-pulse h-36" />)}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="card text-center py-16">
          <CalendarDays size={48} className="text-slate-200 mx-auto mb-4" />
          <p className="text-slate-500 text-lg font-medium">No {filter} events</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvents.map(e => <EventCard key={e._id} event={e} currentUser={user} onRSVP={handleRSVP} />)}
        </div>
      )}

      {showModal && <CreateEventModal onClose={() => setShowModal(false)} onCreate={handleCreate} />}
    </div>
  )
}
