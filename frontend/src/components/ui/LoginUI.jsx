import { useEffect, useRef, useState } from "react"
import { User, Lock, ArrowRight } from "lucide-react"

export function SmokeyBackground({ color = "#6366f1" }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    let animationFrameId

    const render = () => {
      const w = canvas.width = canvas.offsetWidth
      const h = canvas.height = canvas.offsetHeight

      ctx.clearRect(0, 0, w, h)

      const gradient = ctx.createRadialGradient(
        w / 2,
        h / 2,
        50,
        w / 2,
        h / 2,
        300
      )

      gradient.addColorStop(0, color)
      gradient.addColorStop(1, "#ffffff")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, w, h)

      animationFrameId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animationFrameId)
  }, [color])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}

export function LoginForm({ onSubmit, loading }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div className="w-full max-w-sm p-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200">
      
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-slate-800">Welcome Back</h2>
        <p className="text-sm text-slate-500">Sign in to continue</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit({ email, password })
        }}
        className="space-y-6"
      >
        {/* Email */}
        <div className="relative">
          <User size={16} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-400 outline-none"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-400 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-brand-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-brand-700 transition"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Sign In <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>
    </div>
  )
}