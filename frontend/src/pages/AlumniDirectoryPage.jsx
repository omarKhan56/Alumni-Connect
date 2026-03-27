import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../utils/api'
import { Search, MapPin, Briefcase, Filter, MessageCircle, GraduationCap } from 'lucide-react'

const DEPTS = ['All', 'Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Chemical', 'MBA', 'Other']
const BATCHES = ['All', ...Array.from({ length: 15 }, (_, i) => String(new Date().getFullYear() - i))]

function AlumniCard({ alumni, currentUser }) {
  return (
    <div className="card hover:shadow-hover transition-all duration-300 group">
      <div className="flex items-start gap-4">
        <img
          src={alumni.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(alumni.name)}&background=6366f1&color=fff&size=80`}
          alt={alumni.name}
          className="w-14 h-14 rounded-2xl object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-800 truncate group-hover:text-brand-700 transition-colors">{alumni.name}</h3>
          {alumni.currentRole && <p className="text-sm text-slate-500 truncate">{alumni.currentRole}{alumni.currentCompany ? ` @ ${alumni.currentCompany}` : ''}</p>}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {alumni.batch && <span className="badge bg-brand-50 text-brand-600 text-xs">{alumni.batch}</span>}
            {alumni.dept && <span className="badge bg-slate-100 text-slate-600 text-xs">{alumni.dept}</span>}
          </div>
        </div>
      </div>
      {alumni.bio && <p className="text-xs text-slate-500 mt-3 line-clamp-2 leading-relaxed">{alumni.bio}</p>}
      {alumni.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {alumni.skills.slice(0, 4).map(s => (
            <span key={s} className="badge bg-purple-50 text-purple-700 text-xs">{s}</span>
          ))}
          {alumni.skills.length > 4 && <span className="badge bg-slate-100 text-slate-500 text-xs">+{alumni.skills.length - 4}</span>}
        </div>
      )}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
        <Link to={`/alumni/${alumni._id}`} className="btn-secondary flex-1 justify-center py-2 text-sm">
          View Profile
        </Link>
        {currentUser?.role !== 'alumni' && (
          <Link to={`/messages/${alumni._id}`} className="btn-ghost p-2 rounded-xl border border-slate-200">
            <MessageCircle size={16} />
          </Link>
        )}
      </div>
    </div>
  )
}

export default function AlumniDirectoryPage() {
  const { user } = useSelector((s) => s.auth)
  const [alumni, setAlumni] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [dept, setDept] = useState('All')
  const [batch, setBatch] = useState('All')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchAlumni = async (p = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: p, limit: 12 })
      if (search) params.append('search', search)
      if (dept !== 'All') params.append('dept', dept)
      if (batch !== 'All') params.append('batch', batch)
      const { data } = await api.get(`/users/alumni?${params}`)
      setAlumni(data.alumni)
      setTotalPages(data.pages)
      setTotal(data.total)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAlumni(page) }, [page])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchAlumni(1)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800">Alumni Directory</h1>
          <p className="text-slate-500 text-sm mt-0.5">{total} alumni found</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              className="input pl-10" placeholder="Search by name…"
            />
          </div>
          <select value={dept} onChange={(e) => setDept(e.target.value)} className="input sm:w-44">
            {DEPTS.map(d => <option key={d} value={d}>{d === 'All' ? 'All Depts' : d}</option>)}
          </select>
          <select value={batch} onChange={(e) => setBatch(e.target.value)} className="input sm:w-36">
            {BATCHES.map(b => <option key={b} value={b}>{b === 'All' ? 'All Batches' : b}</option>)}
          </select>
          <button type="submit" className="btn-primary">Search</button>
        </form>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="flex gap-3 mb-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-200" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-3 bg-slate-200 rounded w-3/4" />
                  <div className="h-2.5 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
              <div className="h-2.5 bg-slate-200 rounded mb-2" />
              <div className="h-2.5 bg-slate-200 rounded w-5/6" />
            </div>
          ))}
        </div>
      ) : alumni.length === 0 ? (
        <div className="card text-center py-16">
          <GraduationCap size={48} className="text-slate-200 mx-auto mb-4" />
          <p className="text-slate-500 text-lg font-medium">No alumni found</p>
          <p className="text-slate-400 text-sm mt-1">Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {alumni.map(a => <AlumniCard key={a._id} alumni={a} currentUser={user} />)}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary py-2 px-4 disabled:opacity-40">Prev</button>
          <span className="text-sm text-slate-500 px-2">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-secondary py-2 px-4 disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  )
}
