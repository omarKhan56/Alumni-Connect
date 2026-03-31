import { useEffect, useState } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Users, Briefcase, CalendarDays, GraduationCap, ShieldCheck, Trash2 } from 'lucide-react'

const ROLES = ['student', 'alumni', 'admin']
const PIE_COLORS = ['#6366f1', '#fb923c', '#22c55e']

export default function AdminPage() {
  const [analytics, setAnalytics] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('overview')
  const [search, setSearch] = useState('')

  useEffect(() => {
    Promise.all([api.get('/admin/analytics'), api.get('/admin/users')])
      .then(([a, u]) => { setAnalytics(a.data); setUsers(u.data) })
      .finally(() => setLoading(false))
  }, [])

  const handleRoleChange = async (userId, role) => {
    try {
      const { data } = await api.put(`/admin/users/${userId}/role`, { role })
      setUsers(prev => prev.map(u => u._id === userId ? data : u))
      toast.success('Role updated')
    } catch { toast.error('Failed to update role') }
  }

  const handleDelete = async (userId, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return
    try {
      await api.delete(`/admin/users/${userId}`)
      setUsers(prev => prev.filter(u => u._id !== userId))
      toast.success('User deleted')
    } catch { toast.error('Failed to delete user') }
  }

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const pieData = analytics ? [
    { name: 'Students', value: analytics.totalStudents },
    { name: 'Alumni', value: analytics.totalAlumni },
    { name: 'Admins', value: analytics.totalUsers - analytics.totalAlumni - analytics.totalStudents },
  ] : []

  const barData = analytics ? [
    { name: 'Users', count: analytics.totalUsers },
    { name: 'Posts', count: analytics.totalPosts },
    { name: 'Events', count: analytics.totalEvents },
    { name: 'Jobs', count: analytics.totalJobs },
  ] : []

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
          <ShieldCheck size={20} className="text-brand-600" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800">Admin Panel</h1>
          <p className="text-slate-500 text-sm">Platform management and analytics</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-0">
        {['overview', 'users', 'activity'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 transition-all -mb-px ${tab === t ? 'border-brand-500 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div className="space-y-5">
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Total Users', value: analytics?.totalUsers, icon: Users, color: 'brand' },
              { label: 'Alumni', value: analytics?.totalAlumni, icon: GraduationCap, color: 'purple' },
              { label: 'Pending Mentorships', value: analytics?.pendingMentorships, icon: GraduationCap, color: 'yellow' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="card">
                <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center ${
                  color === 'brand' ? 'bg-brand-100' : color === 'purple' ? 'bg-purple-100' : 'bg-yellow-100'
                }`}>
                  <Icon size={18} className={`${
                    color === 'brand' ? 'text-brand-600' : color === 'purple' ? 'text-purple-600' : 'text-yellow-600'
                  }`} />
                </div>
                <p className="text-2xl font-bold text-slate-800">{value ?? '—'}</p>
                <p className="text-xs text-slate-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="card">
              <h3 className="font-semibold text-slate-700 mb-4">Platform Overview</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h3 className="font-semibold text-slate-700 mb-4">User Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent signups */}
          <div className="card">
            <h3 className="font-semibold text-slate-700 mb-4">Recent Signups</h3>
            <div className="space-y-3">
              {analytics?.recentUsers?.map(u => (
                <div key={u._id} className="flex items-center gap-3">
                  <img src={u.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=e0e7ff&color=4f46e5&size=32`} alt="" className="w-8 h-8 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">{u.name}</p>
                    <p className="text-xs text-slate-400">{u.email}</p>
                  </div>
                  <span className={`badge capitalize text-xs ${u.role === 'alumni' ? 'bg-brand-100 text-brand-700' : u.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>{u.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users tab */}
      {tab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              className="input flex-1" placeholder="Search users by name or email…"
            />
            <span className="text-sm text-slate-500 whitespace-nowrap">{filteredUsers.length} users</span>
          </div>

          <div className="card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-slate-50">
                  {filteredUsers.map(u => (
                    <tr key={u._id}>
                      <td className="px-4 py-3">{u.name}</td>
                      <td className="px-4 py-3">{u.email}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleDelete(u._id, u.name)}>
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}