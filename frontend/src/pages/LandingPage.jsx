import { Link } from 'react-router-dom'
import { GraduationCap, Users, Briefcase, MessageCircle, Shield, ArrowRight, Star } from 'lucide-react'

const features = [
  { icon: Users, title: 'Alumni Directory', desc: 'Browse and connect with thousands of graduates across industries and generations.' },
  { icon: Briefcase, title: 'Jobs & Internships', desc: 'Alumni post exclusive opportunities. Students apply directly through the platform.' },
  { icon: MessageCircle, title: 'Real-Time Messaging', desc: 'Instant one-on-one chats powered by WebSocket for zero-latency conversations.' },
  { icon: GraduationCap, title: 'Mentorship Program', desc: 'Request mentors, get matched, and accelerate your career with expert guidance.' },
  { icon: Shield, title: 'Secure & Private', desc: 'JWT authentication, bcrypt hashing, and role-based access keep your data safe.' },
  { icon: Star, title: 'Events & Fundraising', desc: 'RSVP to alumni events and contribute to institutional causes you care about.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-950 via-brand-900 to-slate-900 text-white">
      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
            <GraduationCap size={18} className="text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">Alumni<span className="text-brand-300">Connect</span></span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors">Sign in</Link>
          <Link to="/register" className="px-4 py-2 bg-white text-brand-900 text-sm font-semibold rounded-xl hover:bg-brand-50 transition-colors">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm text-brand-200 mb-8 border border-white/10">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse-slow" />
          Now live — Built on MERN Stack
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Where Graduates<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-accent-400">Stay Connected</span>
        </h1>
        <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          A professional-grade alumni platform for networking, mentorship, job discovery, and institutional engagement — all in one place.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/register" className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-500 hover:bg-brand-400 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-brand-500/30">
            Join as Alumni or Student <ArrowRight size={16} />
          </Link>
          <Link to="/login" className="px-7 py-3.5 text-white/80 hover:text-white font-medium border border-white/20 rounded-xl hover:border-white/40 transition-all">
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">Everything you need</h2>
          <p className="text-white/50">A unified platform replacing fragmented WhatsApp groups and email chains.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group">
              <div className="w-11 h-11 rounded-xl bg-brand-500/20 flex items-center justify-center mb-4 group-hover:bg-brand-500/30 transition-colors">
                <Icon size={20} className="text-brand-300" />
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-white/30 text-sm">
        <p>© 2024 AlumniConnect · Built with MERN Stack · Omar, Parth, Advait, Bhumi</p>
      </footer>
    </div>
  )
}
