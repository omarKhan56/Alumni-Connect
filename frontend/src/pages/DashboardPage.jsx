import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import { Users, Briefcase, CalendarDays, GraduationCap, ArrowRight, TrendingUp, Heart } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useSelector((s) => s.auth)
  const [stats, setStats] = useState(null)
  const [recentJobs, setRecentJobs] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])

  useEffect(() => {
    if (user?.role === 'admin') {
      api.get('/admin/analytics').then(r => setStats(r.data)).catch(() => {})
    }
    api.get('/jobs').then(r => setRecentJobs(r.data.slice(0, 3))).catch(() => {})
    api.get('/events').then(r => setUpcomingEvents(r.data.slice(0, 3))).catch(() => {})
  }, [user])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero greeting */}
      <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-7 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute right-10 bottom-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative z-10">
          <p className="text-brand-200 text-sm font-medium mb-1">{greeting()},</p>
          <h1 className="font-display text-3xl font-bold mb-2">{user?.name} 👋</h1>
          <p className="text-brand-200 text-sm">
            {user?.role === 'alumni' && `Alumni · ${user?.dept || ''} · Batch ${user?.batch || ''}`}
            {user?.role === 'student' && `Student · ${user?.dept || ''} · Batch ${user?.batch || ''}`}
            {user?.role === 'admin' && 'Platform Administrator'}
          </p>
          <div className="flex gap-3 mt-5 flex-wrap">
            <Link to="/alumni" className="inline-flex items-center gap-2 px-4 py-2 bg-white text-brand-700 rounded-xl text-sm font-semibold hover:bg-brand-50 transition-colors">
              <Users size={14} /> Browse Alumni
            </Link>
            <Link to="/feed" className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-xl text-sm font-medium hover:bg-white/20 transition-colors">
              View Feed
            </Link>
          </div>
        </div>
      </div>

      {/* Admin stats */}
      {user?.role === 'admin' && stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'brand' },
            { label: 'Alumni', value: stats.totalAlumni, icon: GraduationCap, color: 'violet' },
            { label: 'Jobs Posted', value: stats.totalJobs, icon: Briefcase, color: 'orange' },
            { label: 'Donations (₹)', value: `₹${(stats.totalDonationsAmount || 0).toLocaleString()}`, icon: Heart, color: 'pink' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl bg-${color === 'brand' ? 'brand' : color}-100 flex items-center justify-center flex-shrink-0`}>
                <Icon size={20} className={`text-${color === 'brand' ? 'brand' : color}-600`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-bold text-slate-800">Latest Opportunities</h2>
            <Link to="/jobs" className="text-sm text-brand-600 font-medium flex items-center gap-1 hover:text-brand-700">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {recentJobs.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-6">No jobs posted yet.</p>
          ) : (
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <div key={job._id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center flex-shrink-0">
                    <Briefcase size={16} className="text-brand-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">{job.title}</p>
                    <p className="text-xs text-slate-500">{job.company} · {job.location}</p>
                    <span className={`badge mt-1 ${job.type === 'internship' ? 'bg-orange-100 text-orange-700' : 'bg-brand-100 text-brand-700'}`}>
                      {job.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-bold text-slate-800">Upcoming Events</h2>
            <Link to="/events" className="text-sm text-brand-600 font-medium flex items-center gap-1 hover:text-brand-700">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {upcomingEvents.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-6">No events scheduled.</p>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event._id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0 text-center">
                    <div>
                      <p className="text-xs font-bold text-green-700 leading-none">{new Date(event.date).toLocaleString('default', { month: 'short' }).toUpperCase()}</p>
                      <p className="text-sm font-bold text-green-700">{new Date(event.date).getDate()}</p>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">{event.title}</p>
                    <p className="text-xs text-slate-500 truncate">{event.venue}</p>
                    <p className="text-xs text-slate-400">{event.registrations?.length || 0} registered</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="card">
        <h2 className="font-display text-lg font-bold text-slate-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { to: '/alumni', icon: Users, label: 'Find Alumni', color: 'bg-brand-50 text-brand-600' },
            { to: '/mentorship', icon: GraduationCap, label: 'Get a Mentor', color: 'bg-purple-50 text-purple-600' },
            { to: '/jobs', icon: Briefcase, label: 'Browse Jobs', color: 'bg-orange-50 text-orange-600' },
            { to: '/donations', icon: Heart, label: 'Donate', color: 'bg-pink-50 text-pink-600' },
          ].map(({ to, icon: Icon, label, color }) => (
            <Link key={to} to={to} className={`flex flex-col items-center gap-2 p-4 rounded-xl ${color} hover:opacity-90 transition-all`}>
              <Icon size={22} />
              <span className="text-xs font-semibold">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
