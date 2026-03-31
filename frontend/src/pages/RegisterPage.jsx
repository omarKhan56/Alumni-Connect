import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from '../store/slices/authSlice'
import { GraduationCap, Eye, EyeOff } from 'lucide-react'

const DEPTS = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Chemical', 'MBA', 'Other']
const BATCHES = Array.from({ length: 15 }, (_, i) => String(new Date().getFullYear() - i))

export default function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector((s) => s.auth)

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    batch: '',
    dept: ''
  })

  const [showPw, setShowPw] = useState(false)

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await dispatch(registerUser(form))
    if (res.meta.requestStatus === 'fulfilled') navigate('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden px-4">

      {/* BACKGROUND GLOW */}
      <div className="absolute w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px] -top-40 -left-40" />
      <div className="absolute w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px] bottom-0 right-0" />

      <div className="w-full max-w-lg relative z-10">

        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg shadow-purple-500/30 mb-4">
            <GraduationCap size={30} className="text-white" />
          </div>

          <h1 className="text-3xl font-bold text-white">Join AlumniConnect</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Create your account to get started
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* ROLE SELECTOR */}
            <div className="grid grid-cols-2 gap-3">
              {['student', 'alumni'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm({ ...form, role: r })}
                  className={`py-3 rounded-xl text-sm font-medium transition-all border
                  ${form.role === r
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white border-transparent shadow-lg scale-[1.02]'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  {r === 'student' ? '🎓 Student' : '🏆 Alumni'}
                </button>
              ))}
            </div>

            {/* INPUTS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* NAME */}
              <div className="sm:col-span-2">
                <label className="text-sm text-slate-400 mb-1 block">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                />
              </div>

              {/* EMAIL */}
              <div className="sm:col-span-2">
                <label className="text-sm text-slate-400 mb-1 block">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                />
              </div>

              {/* DEPT */}
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Department</label>
                <select
                  name="dept"
                  value={form.dept}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500"
                >
                  <option value="">Select dept</option>
                  {DEPTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>

              {/* BATCH */}
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Graduation Year</label>
                <select
                  name="batch"
                  value={form.batch}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500"
                >
                  <option value="">Select year</option>
                  {BATCHES.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>

              {/* PASSWORD */}
              <div className="sm:col-span-2">
                <label className="text-sm text-slate-400 mb-1 block">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Minimum 8 characters"
                    minLength={8}
                    required
                    className="w-full px-3 py-2.5 pr-10 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition flex justify-center"
            >
              {loading
                ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : 'Create Account'}
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-400 font-semibold hover:text-purple-300">
              Sign in
            </Link>
          </div>
        </div>

        {/* BACK */}
        <p className="text-center mt-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-slate-300 transition">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}