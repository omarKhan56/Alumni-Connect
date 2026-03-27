// VerifyEmailPage.jsx
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../utils/api'
import { CheckCircle2, XCircle, GraduationCap } from 'lucide-react'

export function VerifyEmailPage() {
  const { token } = useParams()
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    api.get(`/auth/verifyemail/${token}`)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [token])

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-950 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl">
        {status === 'loading' && <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />}
        {status === 'success' && <>
          <CheckCircle2 size={52} className="text-green-500 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-slate-800 mb-2">Email Verified!</h2>
          <p className="text-slate-500 mb-6">Your account is now active. You can sign in.</p>
          <Link to="/login" className="btn-primary">Go to Login</Link>
        </>}
        {status === 'error' && <>
          <XCircle size={52} className="text-red-500 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-slate-800 mb-2">Link Expired</h2>
          <p className="text-slate-500 mb-6">This verification link is invalid or has expired.</p>
          <Link to="/register" className="btn-primary">Register Again</Link>
        </>}
      </div>
    </div>
  )
}

export default VerifyEmailPage
