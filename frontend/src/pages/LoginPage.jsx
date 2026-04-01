import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser } from '../store/slices/authSlice'
import { SmokeyBackground, LoginForm } from '../components/ui/LoginUI'

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector((s) => s.auth)

  const handleLogin = async (form) => {
    const res = await dispatch(loginUser(form))
    if (res.meta.requestStatus === 'fulfilled') {
      navigate('/dashboard')
    }
  }

  return (
    <div className="relative min-h-screen bg-slate-50 overflow-hidden">

      {/* Background */}
      <SmokeyBackground color="#818cf8" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center absolute top-10">
          <h1 className="text-xl font-semibold text-slate-600">
            AlumniConnect
          </h1>
        </div>

        <div className="flex flex-col items-center gap-4">
          <LoginForm onSubmit={handleLogin} loading={loading} />

          <p className="text-sm text-slate-500">
            Don’t have an account?{" "}
            <Link to="/register" className="text-brand-600 font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}