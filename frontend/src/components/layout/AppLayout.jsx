import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import { toggleSidebar } from '../../store/slices/uiSlice'
import {
  LayoutDashboard, Newspaper, Users, Briefcase, CalendarDays,
  MessageCircle, GraduationCap, Heart, User, ShieldCheck,
  LogOut, Menu, X, Bell, ChevronRight
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/feed', icon: Newspaper, label: 'News Feed' },
  { to: '/alumni', icon: Users, label: 'Alumni Directory' },
  { to: '/jobs', icon: Briefcase, label: 'Jobs & Internships' },
  { to: '/events', icon: CalendarDays, label: 'Events' },
  { to: '/messages', icon: MessageCircle, label: 'Messages' },
  { to: '/mentorship', icon: GraduationCap, label: 'Mentorship' },
  { to: '/donations', icon: Heart, label: 'Donations' },
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
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-0 -translate-x-full'} lg:translate-x-0 ${sidebarOpen ? 'lg:w-64' : 'lg:w-20'} flex-shrink-0 bg-white border-r border-slate-100 flex flex-col transition-all duration-300 z-40 fixed lg:relative h-full overflow-hidden`}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center flex-shrink-0">
            <GraduationCap size={18} className="text-white" />
          </div>
          {sidebarOpen && (
            <span className="font-display font-bold text-brand-900 text-lg tracking-tight whitespace-nowrap">
              Alumni<span className="text-brand-500">Connect</span>
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''} ${!sidebarOpen ? 'justify-center' : ''}`
              }
            >
              <Icon size={18} className="flex-shrink-0" />
              {sidebarOpen && <span className="whitespace-nowrap">{label}</span>}
            </NavLink>
          ))}
          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''} ${!sidebarOpen ? 'justify-center' : ''}`}
            >
              <ShieldCheck size={18} className="flex-shrink-0" />
              {sidebarOpen && <span>Admin Panel</span>}
            </NavLink>
          )}
        </nav>

        {/* User mini profile */}
        <div className="px-3 py-4 border-t border-slate-100">
          <div className={`flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 cursor-pointer ${!sidebarOpen ? 'justify-center' : ''}`}>
            <img
              src={user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=6366f1&color=fff`}
              alt={user?.name}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
                <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={`w-full mt-1 flex items-center gap-3 px-3 py-2 rounded-xl text-red-500 hover:bg-red-50 transition-all text-sm font-medium ${!sidebarOpen ? 'justify-center' : ''}`}
          >
            <LogOut size={16} />
            {sidebarOpen && 'Sign out'}
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => dispatch(toggleSidebar())}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-100 px-4 lg:px-6 h-16 flex items-center justify-between flex-shrink-0 z-20">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-slate-100 relative">
              <Bell size={18} className="text-slate-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-slate-100">
              <img
                src={user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=6366f1&color=fff`}
                alt={user?.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
