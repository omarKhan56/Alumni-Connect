import { useState } from "react"
import { User, Mail, Lock, GraduationCap, ArrowRight } from "lucide-react"

const DEPTS = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Chemical', 'MBA', 'Other']
const BATCHES = Array.from({ length: 15 }, (_, i) => String(new Date().getFullYear() - i))

export function RegisterForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    batch: "",
    dept: ""
  })

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  return (
    <div className="w-full max-w-lg p-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200">

      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-slate-800">Create Account</h2>
        <p className="text-sm text-slate-500">Join AlumniConnect</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit(form)
        }}
        className="space-y-5"
      >

        {/* ROLE */}
        <div className="flex gap-2">
          {['student', 'alumni'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setForm({ ...form, role: r })}
              className={`flex-1 py-2 rounded-xl text-sm font-medium border transition ${
                form.role === r
                  ? "bg-brand-600 text-white border-brand-600"
                  : "bg-white text-slate-600 border-slate-200"
              }`}
            >
              {r === "student" ? "🎓 Student" : "🏆 Alumni"}
            </button>
          ))}
        </div>

        {/* NAME */}
        <div className="relative">
          <User size={16} className="absolute left-3 top-3 text-slate-400" />
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Full Name"
            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-400 outline-none"
          />
        </div>

        {/* EMAIL */}
        <div className="relative">
          <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Email"
            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-400 outline-none"
          />
        </div>

        {/* DEPT + BATCH */}
        <div className="grid grid-cols-2 gap-3">
          <select
            name="dept"
            value={form.dept}
            onChange={handleChange}
            required
            className="px-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-400 outline-none"
          >
            <option value="">Department</option>
            {DEPTS.map(d => <option key={d}>{d}</option>)}
          </select>

          <select
            name="batch"
            value={form.batch}
            onChange={handleChange}
            required
            className="px-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-400 outline-none"
          >
            <option value="">Batch</option>
            {BATCHES.map(b => <option key={b}>{b}</option>)}
          </select>
        </div>

        {/* PASSWORD */}
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            minLength={8}
            required
            placeholder="Password"
            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-400 outline-none"
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-brand-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-brand-700 transition"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Create Account <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>
    </div>
  )
}