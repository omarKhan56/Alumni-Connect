import { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfile } from '../store/slices/authSlice'
import toast from 'react-hot-toast'

// ✅ SAFE ICONS ONLY
import {
  Camera,
  Plus,
  X,
  Save,
  MapPin,
  Briefcase,
  Building,
  Globe
} from 'lucide-react'

const DEPTS = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Chemical', 'MBA', 'Other']

export default function ProfilePage() {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    currentRole: user?.currentRole || '',
    currentCompany: user?.currentCompany || '',
    linkedin: user?.linkedin || '',
    github: user?.github || '',
    dept: user?.dept || '',
    batch: user?.batch || '',
    isVisible: user?.isVisible ?? true,
  })
  const [skills, setSkills] = useState(user?.skills || [])
  const [skillInput, setSkillInput] = useState('')
  const [preview, setPreview] = useState(user?.profilePic || null)
  const [imageFile, setImageFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef()

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm({ ...form, [e.target.name]: val })
  }

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const addSkill = (e) => {
    e.preventDefault()
    if (!skillInput.trim() || skills.includes(skillInput.trim())) return
    setSkills([...skills, skillInput.trim()])
    setSkillInput('')
  }

  const removeSkill = (s) => setSkills(skills.filter(sk => sk !== s))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      fd.append('skills', JSON.stringify(skills))
      if (imageFile) fd.append('profilePic', imageFile)
      await dispatch(updateProfile(fd))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">
      <h1 className="font-display text-2xl font-bold text-slate-800">Edit Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Avatar */}
        <div className="card flex items-center gap-5">
          <div className="relative flex-shrink-0">
            <img
              src={preview || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=6366f1&color=fff&size=80`}
              alt=""
              className="w-20 h-20 rounded-2xl object-cover"
            />
            <button
              type="button"
              onClick={() => fileRef.current.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-brand-500 rounded-full flex items-center justify-center hover:bg-brand-600 transition-colors shadow-md"
            >
              <Camera size={13} className="text-white" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
          </div>
          <div>
            <p className="font-semibold text-slate-800">{user?.name}</p>
            <p className="text-sm text-slate-400 capitalize">{user?.role} · {user?.dept} · {user?.batch}</p>
            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input type="checkbox" name="isVisible" checked={form.isVisible} onChange={handleChange} className="w-4 h-4 accent-brand-600 rounded" />
              <span className="text-sm text-slate-600">Visible in alumni directory</span>
            </label>
          </div>
        </div>

        {/* Basic info */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Basic Info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="input" required />
            </div>
            <div>
              <label className="label">Location</label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input name="location" value={form.location} onChange={handleChange} className="input pl-9" placeholder="City, Country" />
              </div>
            </div>
            <div>
              <label className="label">Department</label>
              <select name="dept" value={form.dept} onChange={handleChange} className="input">
                <option value="">Select…</option>
                {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Graduation Year</label>
              <input name="batch" value={form.batch} onChange={handleChange} className="input" placeholder="e.g. 2022" />
            </div>
          </div>
          <div>
            <label className="label">Bio</label>
            <textarea name="bio" value={form.bio} onChange={handleChange} className="input resize-none min-h-[90px]" placeholder="Tell people about yourself…" />
          </div>
        </div>

        {/* Career */}
        {user?.role === 'alumni' && (
          <div className="card space-y-4">
            <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Career</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Current Role</label>
                <div className="relative">
                  <Briefcase size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input name="currentRole" value={form.currentRole} onChange={handleChange} className="input pl-9" placeholder="e.g. Software Engineer" />
                </div>
              </div>
              <div>
                <label className="label">Company</label>
                <div className="relative">
                  <Building size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input name="currentCompany" value={form.currentCompany} onChange={handleChange} className="input pl-9" placeholder="e.g. Google" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Skills */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map(s => (
              <span key={s} className="flex items-center gap-1 badge bg-brand-50 text-brand-700 px-3 py-1">
                {s}
                <button type="button" onClick={() => removeSkill(s)} className="hover:text-red-500 transition-colors">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <form onSubmit={addSkill} className="flex gap-2">
            <input value={skillInput} onChange={e => setSkillInput(e.target.value)} className="input flex-1" placeholder="Add a skill and press Enter" />
            <button type="submit" className="btn-primary px-3">
              <Plus size={16} />
            </button>
          </form>
        </div>

        {/* Social Links */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Social Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">LinkedIn</label>
              <div className="relative">
                <Globe size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input name="linkedin" value={form.linkedin} onChange={handleChange} className="input pl-9" placeholder="https://linkedin.com/in/…" />
              </div>
            </div>
            <div>
              <label className="label">GitHub</label>
              <div className="relative">
                <Globe size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input name="github" value={form.github} onChange={handleChange} className="input pl-9" placeholder="https://github.com/…" />
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary w-full justify-center py-3" disabled={saving}>
          {saving
            ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <><Save size={16} /> Save Changes</>}
        </button>
      </form>
    </div>
  )
}