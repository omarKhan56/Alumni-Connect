import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loadUser } from './store/slices/authSlice'

// Layout
import AppLayout from './components/layout/AppLayout'

// Auth pages
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import LandingPage from './pages/LandingPage'

// App pages
import DashboardPage from './pages/DashboardPage'
import FeedPage from './pages/FeedPage'
import AlumniDirectoryPage from './pages/AlumniDirectoryPage'
import AlumniProfilePage from './pages/AlumniProfilePage'
import JobsPage from './pages/JobsPage'
import EventsPage from './pages/EventsPage'
import MessagesPage from './pages/MessagesPage'
import MentorshipPage from './pages/MentorshipPage'
import DonationsPage from './pages/DonationsPage'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'
import NotFoundPage from './pages/NotFoundPage'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token } = useSelector((s) => s.auth)
  if (!token) return <Navigate to="/login" replace />
  if (allowedRoles && user && !allowedRoles.includes(user.role))
    return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  const dispatch = useDispatch()
  const { token, initialized } = useSelector((s) => s.auth)

useEffect(() => {
  if (token) {
    dispatch(loadUser())
  }
}, [dispatch, token])

  if (token && !initialized)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading AlumniConnect…</p>
        </div>
      </div>
    )

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* Protected app routes */}
      <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="feed" element={<FeedPage />} />
        <Route path="alumni" element={<AlumniDirectoryPage />} />
        <Route path="alumni/:id" element={<AlumniProfilePage />} />
        <Route path="jobs" element={<JobsPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="messages/:userId" element={<MessagesPage />} />
        <Route path="mentorship" element={<MentorshipPage />} />
        <Route path="donations" element={<DonationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminPage /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
