import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../utils/api'
import toast from 'react-hot-toast'

// ✅ SAFE ICONS ONLY
import {
  MapPin,
  Briefcase,
  MessageCircle,
  GraduationCap,
  ArrowLeft,
  Send,
  Globe,
  User
} from "lucide-react";

export default function AlumniProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector((s) => s.auth)
  const [alumni, setAlumni] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showMentorModal, setShowMentorModal] = useState(false)
  const [mentorForm, setMentorForm] = useState({ message: '', goals: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get(`/users/${id}`)
      .then(r => setAlumni(r.data))
      .catch(() => navigate('/alumni'))
      .finally(() => setLoading(false))
  }, [id])

  const handleMentorRequest = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/mentorship/request', { mentorId: id, ...mentorForm })
      toast.success('Mentorship request sent!')
      setShowMentorModal(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Request failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!alumni) return null

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <button onClick={() => navigate(-1)} className="btn-ghost mb-4 -ml-2">
        <ArrowLeft size={16} /> Back
      </button>

      {/* Hero */}
      <div className="card mb-5">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <img
            src={alumni.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(alumni.name)}&background=6366f1&color=fff&size=120`}
            alt={alumni.name}
            className="w-24 h-24 rounded-2xl object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <h1 className="font-display text-2xl font-bold text-slate-800">{alumni.name}</h1>
                {alumni.currentRole && (
                  <p className="text-slate-600 mt-0.5">
                    {alumni.currentRole}
                    {alumni.currentCompany ? ` at ${alumni.currentCompany}` : ''}
                  </p>
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                {user?._id !== id && (
                  <Link to={`/messages/${id}`} className="btn-secondary py-2 text-sm">
                    <MessageCircle size={15} /> Message
                  </Link>
                )}
                {user?.role === 'student' && (
                  <button onClick={() => setShowMentorModal(true)} className="btn-primary py-2 text-sm">
                    <GraduationCap size={15} /> Request Mentorship
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-3 text-sm text-slate-500">
              {alumni.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={13} /> {alumni.location}
                </span>
              )}
              {alumni.batch && (
                <span className="flex items-center gap-1">
                  <GraduationCap size={13} /> Batch {alumni.batch}
                </span>
              )}
              {alumni.dept && (
                <span className="flex items-center gap-1">
                  <Briefcase size={13} /> {alumni.dept}
                </span>
              )}
            </div>

            {/* ✅ Social Links FIXED */}
            <div className="flex gap-3 mt-3">
              {alumni.linkedin && (
                <a href={alumni.linkedin} target="_blank" rel="noreferrer"
                   className="text-blue-600 hover:text-blue-700">
                  <Globe size={18} />
                </a>
              )}
              {alumni.github && (
                <a href={alumni.github} target="_blank" rel="noreferrer"
                   className="text-slate-600 hover:text-slate-800">
                  <User size={18} />
                </a>
              )}
            </div>
          </div>
        </div>

        {alumni.bio && (
          <div className="mt-5 pt-5 border-t border-slate-100">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
              About
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">{alumni.bio}</p>
          </div>
        )}

        {alumni.skills?.length > 0 && (
          <div className="mt-5 pt-5 border-t border-slate-100">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {alumni.skills.map(s => (
                <span key={s} className="badge bg-brand-50 text-brand-700 px-3 py-1">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mentorship Modal */}
      {showMentorModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-7 w-full max-w-md shadow-2xl animate-slide-up">
            <h2 className="font-display text-xl font-bold text-slate-800 mb-1">
              Request Mentorship
            </h2>
            <p className="text-sm text-slate-500 mb-5">
              Send a mentorship request to <strong>{alumni.name}</strong>
            </p>

            <form onSubmit={handleMentorRequest} className="space-y-4">
              <div>
                <label className="label">Introduce yourself</label>
                <textarea
                  value={mentorForm.message}
                  onChange={e => setMentorForm({ ...mentorForm, message: e.target.value })}
                  className="input min-h-[90px]"
                  required
                />
              </div>

              <div>
                <label className="label">Your goals</label>
                <textarea
                  value={mentorForm.goals}
                  onChange={e => setMentorForm({ ...mentorForm, goals: e.target.value })}
                  className="input min-h-[70px]"
                />
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setShowMentorModal(false)}
                        className="btn-secondary flex-1">
                  Cancel
                </button>

                <button type="submit" className="btn-primary flex-1" disabled={submitting}>
                  {submitting
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <><Send size={14} /> Send</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}