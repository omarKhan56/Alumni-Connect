import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'
import { Briefcase, MapPin, ExternalLink, Plus, X, Search, Building } from 'lucide-react'

const JOB_TYPES = ['full-time', 'internship', 'part-time', 'contract']

function JobCard({ job, currentUser, onDelete }) {
  const typeColors = {
    'full-time': 'bg-brand-100 text-brand-700',
    'internship': 'bg-orange-100 text-orange-700',
    'part-time': 'bg-purple-100 text-purple-700',
    'contract': 'bg-green-100 text-green-700',
  }
  return (
    <div className="card hover:shadow-hover transition-all duration-300 animate-slide-up">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
            <Building size={20} className="text-slate-500" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">{job.title}</h3>
            <p className="text-sm text-slate-500">{job.company}</p>
          </div>
        </div>
        <span className={`badge ${typeColors[job.type] || 'bg-slate-100 text-slate-600'} flex-shrink-0 capitalize`}>{job.type}</span>
      </div>

      <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-500">
        <span className="flex items-center gap-1"><MapPin size={11} />{job.location}</span>
        {job.salary && <span className="flex items-center gap-1">💰 {job.salary}</span>}
        {job.deadline && <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>}
      </div>

      <p className="text-sm text-slate-600 mt-3 line-clamp-3 leading-relaxed">{job.description}</p>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <img
            src={job.postedBy?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.postedBy?.name || 'A')}&background=e0e7ff&color=4f46e5&size=24`}
            alt="" className="w-5 h-5 rounded-full object-cover"
          />
          <span className="text-xs text-slate-400">by {job.postedBy?.name}</span>
          <span className="text-xs text-slate-300">· {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
        </div>
        <div className="flex items-center gap-2">
          {(currentUser?._id === job.postedBy?._id || currentUser?.role === 'admin') && (
            <button onClick={() => onDelete(job._id)} className="text-xs text-red-400 hover:text-red-600 transition-colors">Remove</button>
          )}
          {job.applyLink && (
            <a href={job.applyLink} target="_blank" rel="noreferrer" className="btn-primary py-1.5 text-xs">
              Apply <ExternalLink size={11} />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function PostJobModal({ onClose, onPost }) {
  const [form, setForm] = useState({ title: '', company: '', location: '', type: 'full-time', description: '', requirements: '', applyLink: '', salary: '', deadline: '' })
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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-7 w-full max-w-lg shadow-2xl animate-slide-up my-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-bold text-slate-800">Post a Job / Internship</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="label">Job Title *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input" placeholder="e.g. Frontend Developer" required />
            </div>
            <div>
              <label className="label">Company *</label>
              <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="input" placeholder="Company name" required />
            </div>
            <div>
              <label className="label">Location *</label>
              <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="input" placeholder="City / Remote" required />
            </div>
            <div>
              <label className="label">Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="input">
                {JOB_TYPES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Salary / Stipend</label>
              <input value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} className="input" placeholder="e.g. ₹15,000/mo" />
            </div>
            <div className="col-span-2">
              <label className="label">Description *</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input min-h-[90px] resize-none" required />
            </div>
            <div className="col-span-2">
              <label className="label">Apply Link</label>
              <input type="url" value={form.applyLink} onChange={e => setForm({ ...form, applyLink: e.target.value })} className="input" placeholder="https://…" />
            </div>
            <div>
              <label className="label">Deadline</label>
              <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} className="input" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" className="btn-primary flex-1 justify-center" disabled={loading}>
              {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Post Job'}
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
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800">Jobs & Internships</h1>
          <p className="text-slate-500 text-sm mt-0.5">{jobs.length} opportunities available</p>
        </div>
        {(user?.role === 'alumni' || user?.role === 'admin') && (
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus size={16} /> Post Job
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchJobs()} className="input pl-10" placeholder="Search jobs or companies…" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['', ...JOB_TYPES].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all capitalize ${typeFilter === t ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>
              {t || 'All'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="card animate-pulse h-40" />)}
        </div>
      ) : jobs.length === 0 ? (
        <div className="card text-center py-16">
          <Briefcase size={48} className="text-slate-200 mx-auto mb-4" />
          <p className="text-slate-500 text-lg font-medium">No jobs found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map(j => <JobCard key={j._id} job={j} currentUser={user} onDelete={handleDelete} />)}
        </div>
      )}

      {showModal && <PostJobModal onClose={() => setShowModal(false)} onPost={handlePost} />}
    </div>
  )
}
