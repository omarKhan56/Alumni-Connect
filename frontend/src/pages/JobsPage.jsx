import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'
import { Briefcase, MapPin, ExternalLink, Plus, X, Search, Building } from 'lucide-react'

const JOB_TYPES = ['full-time', 'internship', 'part-time', 'contract']

function JobCard({ job, currentUser, onDelete }) {
  const typeColors = {
    'full-time': 'bg-purple-500/20 text-purple-400',
    'internship': 'bg-orange-500/20 text-orange-400',
    'part-time': 'bg-blue-500/20 text-blue-400',
    'contract': 'bg-green-500/20 text-green-400',
  }

  return (
    <div className="p-5 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition">

      <div className="flex justify-between">
        <div className="flex gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
            <Building size={18} className="text-slate-400" />
          </div>

          <div>
            <h3 className="font-semibold">{job.title}</h3>
            <p className="text-sm text-slate-400">{job.company}</p>
          </div>
        </div>

        <span className={`px-2 py-1 text-xs rounded-lg capitalize ${typeColors[job.type]}`}>
          {job.type}
        </span>
      </div>

      <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-400">
        <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
        {job.salary && <span>💰 {job.salary}</span>}
        {job.deadline && <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>}
      </div>

      <p className="text-sm text-slate-300 mt-3 line-clamp-3">{job.description}</p>

      <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/10">
        <span className="text-xs text-slate-500">
          by {job.postedBy?.name} · {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
        </span>

        <div className="flex gap-2">
          {(currentUser?._id === job.postedBy?._id || currentUser?.role === 'admin') && (
            <button onClick={() => onDelete(job._id)} className="text-xs text-red-400 hover:text-red-300">
              Remove
            </button>
          )}

          {job.applyLink && (
            <a href={job.applyLink} target="_blank" rel="noreferrer"
              className="px-3 py-1.5 text-xs rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center gap-1">
              Apply <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function PostJobModal({ onClose, onPost }) {
  const [form, setForm] = useState({
    title: '', company: '', location: '', type: 'full-time',
    description: '', applyLink: '', salary: '', deadline: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onPost(form)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">

      <div className="w-full max-w-lg p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">

        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-bold">Post a Job</h2>
          <button onClick={onClose}><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input placeholder="Job Title" required
            onChange={e => setForm({ ...form, title: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10" />

          <input placeholder="Company" required
            onChange={e => setForm({ ...form, company: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10" />

          <input placeholder="Location" required
            onChange={e => setForm({ ...form, location: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10" />

          <select
            onChange={e => setForm({ ...form, type: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10">
            {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>

          <textarea placeholder="Description" required
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10" />

          <input placeholder="Apply Link"
            onChange={e => setForm({ ...form, applyLink: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10" />

          <div className="flex gap-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2 rounded-xl border border-white/10">
              Cancel
            </button>

            <button type="submit" disabled={loading}
              className="flex-1 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function JobsPage() {
  const { user } = useSelector((s) => s.auth)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [showModal, setShowModal] = useState(false)

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (typeFilter) params.append('type', typeFilter)
      const { data } = await api.get(`/jobs?${params}`)
      setJobs(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchJobs() }, [typeFilter])

  const handlePost = async (form) => {
    const { data } = await api.post('/jobs', form)
    setJobs(prev => [data, ...prev])
    toast.success('Job posted!')
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/jobs/${id}`)
      setJobs(prev => prev.filter(j => j._id !== id))
      toast.success('Job removed')
    } catch { toast.error('Failed to remove') }
  }

  return (
    <div className="space-y-6 text-slate-200">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Jobs & Internships</h1>
          <p className="text-sm text-slate-400">{jobs.length} opportunities</p>
        </div>

        {(user?.role === 'alumni' || user?.role === 'admin') && (
          <button onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center gap-2">
            <Plus size={16} /> Post Job
          </button>
        )}
      </div>

      {/* SEARCH */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchJobs()}
            placeholder="Search jobs..."
            className="w-full pl-10 px-3 py-2 rounded-xl bg-white/5 border border-white/10"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {['', ...JOB_TYPES].map(t => (
            <button key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-2 rounded-xl text-sm capitalize border
              ${typeFilter === t
                  ? 'bg-purple-500 text-white border-purple-500'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}>
              {t || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* JOBS */}
      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          No jobs found
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map(j => (
            <JobCard key={j._id} job={j} currentUser={user} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {showModal && <PostJobModal onClose={() => setShowModal(false)} onPost={handlePost} />}
    </div>
  )
}