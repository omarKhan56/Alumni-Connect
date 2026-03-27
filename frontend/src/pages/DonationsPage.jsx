import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Heart, TrendingUp, Users, Sparkles } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const CAUSES = ['General Fund', 'Scholarship Fund', 'Infrastructure', 'Research Grant', 'Sports Facilities', 'Library']
const AMOUNTS = [500, 1000, 2500, 5000, 10000]

function DonationForm({ onDonate }) {
  const [amount, setAmount] = useState('')
  const [cause, setCause] = useState('General Fund')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [custom, setCustom] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!amount || Number(amount) < 1) return toast.error('Enter a valid amount')
    setLoading(true)
    try {
      await onDonate({ amount: Number(amount), cause, message })
      setAmount('')
      setMessage('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-9 h-9 rounded-xl bg-pink-100 flex items-center justify-center">
          <Heart size={18} className="text-pink-600" />
        </div>
        <h2 className="font-display text-lg font-bold text-slate-800">Make a Donation</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Cause</label>
          <select value={cause} onChange={e => setCause(e.target.value)} className="input">
            {CAUSES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="label">Amount (₹)</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {AMOUNTS.map(a => (
              <button
                key={a} type="button"
                onClick={() => { setAmount(String(a)); setCustom(false) }}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-all ${!custom && Number(amount) === a ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'}`}
              >
                ₹{a.toLocaleString()}
              </button>
            ))}
            <button
              type="button"
              onClick={() => { setCustom(true); setAmount('') }}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-all ${custom ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'}`}
            >
              Custom
            </button>
          </div>
          {custom && (
            <input
              type="number" value={amount} onChange={e => setAmount(e.target.value)}
              className="input" placeholder="Enter amount in ₹" min="1" required
            />
          )}
        </div>

        <div>
          <label className="label">Message (optional)</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} className="input resize-none min-h-[70px]" placeholder="Leave a message with your donation…" />
        </div>

        <button type="submit" className="btn-primary w-full justify-center py-3" disabled={loading || !amount}>
          {loading
            ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <><Heart size={16} /> Donate {amount ? `₹${Number(amount).toLocaleString()}` : ''}</>
          }
        </button>
      </form>
    </div>
  )
}

export default function DonationsPage() {
  const { user } = useSelector((s) => s.auth)
  const [allDonations, setAllDonations] = useState([])
  const [myDonations, setMyDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('donate')

  useEffect(() => {
    Promise.all([
      api.get('/donations/all'),
      api.get('/donations/history'),
    ]).then(([all, my]) => {
      setAllDonations(all.data)
      setMyDonations(my.data)
    }).finally(() => setLoading(false))
  }, [])

  const totalRaised = allDonations.reduce((s, d) => s + d.amount, 0)
  const totalDonors = new Set(allDonations.map(d => d.donor?._id)).size

  const handleDonate = async (form) => {
    try {
      const { data } = await api.post('/donations', form)
      setAllDonations(prev => [{ ...data, donor: user }, ...prev])
      setMyDonations(prev => [data, ...prev])
      toast.success(`Thank you for your donation of ₹${form.amount.toLocaleString()}! 🙏`)
    } catch {
      toast.error('Donation failed. Please try again.')
    }
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="font-display text-2xl font-bold text-slate-800">Donations & Fundraising</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="font-display text-2xl font-bold text-brand-600">₹{totalRaised.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">Total Raised</p>
        </div>
        <div className="card text-center">
          <p className="font-display text-2xl font-bold text-green-600">{totalDonors}</p>
          <p className="text-xs text-slate-500 mt-1">Donors</p>
        </div>
        <div className="card text-center">
          <p className="font-display text-2xl font-bold text-purple-600">{allDonations.length}</p>
          <p className="text-xs text-slate-500 mt-1">Donations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Donate form */}
        <div className="lg:col-span-2">
          <DonationForm onDonate={handleDonate} />
        </div>

        {/* Leaderboard / history */}
        <div className="lg:col-span-3">
          <div className="flex gap-2 mb-4">
            {['donate', 'leaderboard', 'my-history'].map(t => (
              <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${tab === t ? 'bg-brand-500 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                {t.replace('-', ' ')}
              </button>
            ))}
          </div>

          {tab === 'leaderboard' && (
            <div className="card">
              <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-brand-500" /> Recent Donors</h3>
              {loading ? (
                <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="animate-pulse h-10 bg-slate-100 rounded-xl" />)}</div>
              ) : allDonations.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-6">No donations yet. Be the first!</p>
              ) : (
                <div className="space-y-3">
                  {allDonations.slice(0, 10).map((d, i) => (
                    <div key={d._id} className="flex items-center gap-3">
                      <span className="w-6 text-xs text-slate-400 text-center font-bold">{i + 1}</span>
                      <img
                        src={d.donor?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(d.donor?.name || 'D')}&background=fce7f3&color=be185d&size=32`}
                        alt="" className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">{d.donor?.name}</p>
                        <p className="text-xs text-slate-400">{d.cause}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-brand-600">₹{d.amount.toLocaleString()}</p>
                        <p className="text-xs text-slate-400">{formatDistanceToNow(new Date(d.createdAt), { addSuffix: true })}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'my-history' && (
            <div className="card">
              <h3 className="font-semibold text-slate-700 mb-4">My Donation History</h3>
              {myDonations.length === 0 ? (
                <div className="text-center py-8">
                  <Sparkles size={36} className="text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">You haven't donated yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {myDonations.map(d => (
                    <div key={d._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                      <div>
                        <p className="text-sm font-medium text-slate-700">{d.cause}</p>
                        {d.message && <p className="text-xs text-slate-400 italic mt-0.5">"{d.message}"</p>}
                        <p className="text-xs text-slate-400">{formatDistanceToNow(new Date(d.createdAt), { addSuffix: true })}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-brand-600">₹{d.amount.toLocaleString()}</p>
                        <span className="badge bg-green-100 text-green-700 text-xs">{d.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'donate' && (
            <div className="card">
              <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2"><Heart size={16} className="text-pink-500" /> Why Donate?</h3>
              <div className="space-y-3">
                {[
                  { icon: '🎓', title: 'Scholarship Fund', desc: 'Help underprivileged students pursue higher education.' },
                  { icon: '🏗️', title: 'Infrastructure', desc: 'Fund labs, classrooms, and campus improvements.' },
                  { icon: '🔬', title: 'Research Grants', desc: 'Support cutting-edge research by faculty and students.' },
                ].map(item => (
                  <div key={item.title} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="font-medium text-slate-700 text-sm">{item.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
