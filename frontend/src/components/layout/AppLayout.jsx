import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import { toggleSidebar } from '../../store/slices/uiSlice'
import {
  LayoutDashboard, Newspaper, Users, Briefcase, CalendarDays,
  MessageCircle, GraduationCap, User, ShieldCheck,
  LogOut, Menu, Bell
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/feed', icon: Newspaper, label: 'News Feed' },
  { to: '/alumni', icon: Users, label: 'Alumni Directory' },
  { to: '/jobs', icon: Briefcase, label: 'Jobs & Internships' },
  { to: '/events', icon: CalendarDays, label: 'Events' },
  { to: '/messages', icon: MessageCircle, label: 'Messages' },
  { to: '/mentorship', icon: GraduationCap, label: 'Mentorship' },
  { to: '/profile', icon: User, label: 'My Profile' },
]

export default function AppLayout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((s) => s.auth)
  const { sidebarOpen } = useSelector((s) => s.ui)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden">
      
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-0 -translate-x-full'} lg:translate-x-0 ${sidebarOpen ? 'lg:w-64' : 'lg:w-20'} flex-shrink-0 
        bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col 
        transition-all duration-300 z-40 fixed lg:relative h-full overflow-hidden`}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <GraduationCap size={18} className="text-white" />
          </div>
          {sidebarOpen && (
            <span className="font-bold text-lg tracking-tight">
              Alumni<span className="text-purple-400">Connect</span>
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white shadow-inner' 
                  : 'hover:bg-white/10 text-slate-400 hover:text-white'}
                ${!sidebarOpen ? 'justify-center' : ''}`
              }
            >
              <Icon size={18} />
              {sidebarOpen && <span>{label}</span>}
            </NavLink>
          ))}

          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-white' 
                  : 'hover:bg-white/10 text-slate-400 hover:text-white'}
                ${!sidebarOpen ? 'justify-center' : ''}`
              }
            >
              <ShieldCheck size={18} />
              {sidebarOpen && <span>Admin Panel</span>}
            </NavLink>
          )}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-white/10">
          <div className={`flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition ${!sidebarOpen ? 'justify-center' : ''}`}>
            <img
              src={user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=6366f1&color=fff`}
              alt={user?.name}
              className="w-9 h-9 rounded-full border border-white/20"
            />
            {sidebarOpen && (
              <div>
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className={`w-full mt-2 flex items-center gap-3 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition ${!sidebarOpen ? 'justify-center' : ''}`}
          >
            <LogOut size={16} />
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => dispatch(toggleSidebar())}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Topbar */}
        <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 px-4 lg:px-6 h-16 flex items-center justify-between">
          
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 rounded-lg hover:bg-white/10 transition"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-4">
            
            {/* Notification */}
            <button className="p-2 rounded-lg hover:bg-white/10 relative transition">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            </button>

            {/* Profile */}
            <div className="flex items-center gap-3">
              <img
                src={user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=6366f1&color=fff`}
                alt={user?.name}
                className="w-9 h-9 rounded-full border border-white/20"
              />
              <div className="hidden sm:block">
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}