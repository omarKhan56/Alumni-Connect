import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../store/slices/authSlice'
import { SmokeyBackground } from '../components/ui/LoginUI'
import { RegisterForm } from '../components/ui/RegisterUI'

export default function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector((s) => s.auth)

  const handleRegister = async (form) => {
    const res = await dispatch(registerUser(form))
    if (res.meta.requestStatus === 'fulfilled') {
      navigate('/login')
    }
  }

  return (
    <div className="relative min-h-screen bg-slate-50 overflow-hidden">

      {/* SAME BACKGROUND AS LOGIN */}
      <SmokeyBackground color="#60a5fa" />

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="flex flex-col items-center gap-4">

          <RegisterForm onSubmit={handleRegister} loading={loading} />

          <p className="text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-600 font-semibold">
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}