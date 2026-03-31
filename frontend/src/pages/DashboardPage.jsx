import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import { Users, Briefcase, CalendarDays, GraduationCap, ArrowRight } from 'lucide-react'

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
    <div className="space-y-6 animate-fade-in text-slate-200">

      {/* HERO */}
      <div className="relative p-8 rounded-2xl bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-indigo-600/20 border border-white/10 backdrop-blur-xl overflow-hidden shadow-xl">

        {/* glow blobs */}
        <div className="absolute w-72 h-72 bg-purple-500/20 blur-3xl rounded-full -top-20 -right-20" />
        <div className="absolute w-72 h-72 bg-blue-500/20 blur-3xl rounded-full bottom-0 left-0" />

        <div className="relative z-10">
          <p className="text-sm text-slate-400">{greeting()},</p>
          <h1 className="text-3xl font-bold mt-1">{user?.name} 👋</h1>

          <p className="text-sm text-slate-400 mt-1">
            {user?.role === 'alumni' && `Alumni · ${user?.dept || ''} · Batch ${user?.batch || ''}`}
            {user?.role === 'student' && `Student · ${user?.dept || ''} · Batch ${user?.batch || ''}`}
            {user?.role === 'admin' && 'Platform Administrator'}
          </p>

          <div className="flex gap-3 mt-5 flex-wrap">
            <Link to="/alumni" className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-semibold shadow-lg hover:scale-105 transition">
              Browse Alumni
            </Link>

            <Link to="/feed" className="px-4 py-2 rounded-xl border border-white/20 text-sm hover:bg-white/10 transition">
              View Feed
            </Link>
          </div>
        </div>
      </div>

      {/* ADMIN STATS */}
      {user?.role === 'admin' && stats && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'Total Users', value: stats.totalUsers, icon: Users },
            { label: 'Alumni', value: stats.totalAlumni, icon: GraduationCap },
            { label: 'Jobs Posted', value: stats.totalJobs, icon: Briefcase },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="p-5 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition group">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/30 to-blue-500/30 group-hover:scale-110 transition">
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-xl font-bold">{value}</p>
                  <p className="text-xs text-slate-400">{label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* JOBS */}
        <div className="p-5 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10">
          <div className="flex justify-between mb-5">
            <h2 className="font-bold">Latest Opportunities</h2>
            <Link to="/jobs" className="text-sm flex items-center gap-1 text-purple-400 hover:text-purple-300">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {recentJobs.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">No jobs posted.</p>
          ) : (
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <div key={job._id} className="p-3 rounded-xl hover:bg-white/10 transition cursor-pointer">
                  <p className="font-semibold text-sm">{job.title}</p>
                  <p className="text-xs text-slate-400">{job.company} · {job.location}</p>

                  <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-lg 
                    ${job.type === 'internship'
                      ? 'bg-orange-500/20 text-orange-400'
                      : 'bg-purple-500/20 text-purple-400'}`}>
                    {job.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* EVENTS */}
        <div className="p-5 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10">
          <div className="flex justify-between mb-5">
            <h2 className="font-bold">Upcoming Events</h2>
            <Link to="/events" className="text-sm flex items-center gap-1 text-purple-400 hover:text-purple-300">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">No events scheduled.</p>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event._id} className="p-3 rounded-xl hover:bg-white/10 transition">
                  <p className="font-semibold text-sm">{event.title}</p>
                  <p className="text-xs text-slate-400">{event.venue}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(event.date).toDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="p-5 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10">
        <h2 className="font-bold mb-4">Quick Actions</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { to: '/alumni', icon: Users, label: 'Find Alumni' },
            { to: '/mentorship', icon: GraduationCap, label: 'Get Mentor' },
            { to: '/jobs', icon: Briefcase, label: 'Browse Jobs' },
          ].map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 flex flex-col items-center gap-2 hover:scale-105 transition"
            >
              <Icon size={22} />
              <span className="text-xs">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}