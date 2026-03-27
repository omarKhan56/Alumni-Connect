import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { GraduationCap, CheckCircle2, XCircle, Clock, Users, ArrowRight } from 'lucide-react'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  active: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  completed: 'bg-slate-100 text-slate-600',
}

const statusIcons = {
  pending: <Clock size={13} />,
  active: <CheckCircle2 size={13} />,
  rejected: <XCircle size={13} />,
  completed: <CheckCircle2 size={13} />,
}

function MentorshipCard({ req, isAdmin, onApprove }) {
  const isStudentView = req.student
  return (
    <div className="card animate-slide-up">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={req.student?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(req.student?.name || 'S')}&background=e0e7ff&color=4f46e5&size=40`}
            alt="" className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-slate-800 text-sm">{req.student?.name}</p>
            <p className="text-xs text-slate-400">{req.student?.dept} · Batch {req.student?.batch}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`badge flex items-center gap-1 ${statusColors[req.status]}`}>
            {statusIcons[req.status]} {req.status}
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
        <span>Mentor:</span>
        <img src={req.mentor?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(req.mentor?.name || 'M')}&background=dcfce7&color=16a34a&size=24`} alt="" className="w-5 h-5 rounded-full" />
        <span className="font-medium text-slate-700">{req.mentor?.name}</span>
      </div>

      {req.message && (
        <div className="mt-3 bg-slate-50 rounded-xl p-3">
          <p className="text-xs text-slate-500 font-medium mb-1">Message</p>
          <p className="text-sm text-slate-600 leading-relaxed">{req.message}</p>
        </div>
      )}

      {req.goals && (
        <div className="mt-2 bg-brand-50 rounded-xl p-3">
          <p className="text-xs text-brand-500 font-medium mb-1">Goals</p>
          <p className="text-sm text-brand-700 leading-relaxed">{req.goals}</p>
        </div>
      )}

      {isAdmin && req.status === 'pending' && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
          <button onClick={() => onApprove(req._id, 'active')} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-green-100 text-green-700 hover:bg-green-200 text-sm font-medium transition-colors">
            <CheckCircle2 size={14} /> Approve
          </button>
          <button onClick={() => onApprove(req._id, 'rejected')} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 text-sm font-medium transition-colors">
            <XCircle size={14} /> Reject
          </button>
        </div>
      )}

      {req.status === 'active' && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <Link to={`/messages/${req.mentor?._id || req.student?._id}`} className="btn-primary w-full justify-center py-2 text-sm">
            Open Chat <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </div>
  )
}

export default function MentorshipPage() {
  const { user } = useSelector((s) => s.auth)
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const fetchRequests = () => {
    const endpoint = user?.role === 'admin' ? '/admin/mentorships' : '/mentorship'
    api.get(endpoint).then(r => setRequests(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { fetchRequests() }, [user])

  const handleApprove = async (id, status) => {
    try {
      const { data } = await api.put(`/mentorship/${id}/approve`, { status })
      setRequests(prev => prev.map(r => r._id === id ? data : r))
      toast.success(`Mentorship ${status === 'active' ? 'approved' : 'rejected'}`)
    } catch { toast.error('Action failed') }
  }

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter)

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800">Mentorship</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {user?.role === 'student' && 'Track your mentorship requests'}
            {user?.role === 'alumni' && 'Manage incoming mentorship requests'}
            {user?.role === 'admin' && 'Approve and manage all mentorship requests'}
          </p>
        </div>
        {user?.role === 'student' && (
          <Link to="/alumni" className="btn-primary">
            <Users size={16} /> Find a Mentor
          </Link>
        )}
      </div>

      {/* Stats strip for admin */}
      {user?.role === 'admin' && (
        <div className="grid grid-cols-4 gap-3">
          {['all','pending','active','rejected'].map(s => {
            const count = s === 'all' ? requests.length : requests.filter(r => r.status === s).length
            return (
              <button key={s} onClick={() => setFilter(s)} className={`card p-3 text-center cursor-pointer hover:shadow-hover transition-all ${filter === s ? 'ring-2 ring-brand-500' : ''}`}>
                <p className="text-xl font-bold text-slate-800">{count}</p>
                <p className="text-xs text-slate-500 capitalize">{s}</p>
              </button>
            )
          })}
        </div>
      )}

      {user?.role !== 'admin' && (
        <div className="flex gap-2">
          {['all','pending','active','rejected','completed'].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filter === s ? 'bg-brand-500 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
              {s}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3].map(i => <div key={i} className="card animate-pulse h-40" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16">
          <GraduationCap size={48} className="text-slate-200 mx-auto mb-4" />
          <p className="text-slate-500 text-lg font-medium">No mentorship requests found</p>
          {user?.role === 'student' && (
            <Link to="/alumni" className="btn-primary mt-4 inline-flex">Browse Alumni to Find Mentors</Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(r => <MentorshipCard key={r._id} req={r} isAdmin={user?.role === 'admin'} onApprove={handleApprove} />)}
        </div>
      )}
    </div>
  )
}
