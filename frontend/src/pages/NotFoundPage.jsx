import { Link } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-950 to-slate-900 flex items-center justify-center p-4 text-center">
      <div>
        <div className="font-display text-[8rem] font-bold text-white/10 leading-none select-none">404</div>
        <GraduationCap size={48} className="text-brand-400 mx-auto -mt-4 mb-6" />
        <h1 className="font-display text-3xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-white/50 mb-8">The page you're looking for doesn't exist or was moved.</p>
        <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
      </div>
    </div>
  )
}
