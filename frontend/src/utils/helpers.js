import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns'

/** Format a date relative to now — with smart fallback */
export function timeAgo(date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

/** Smart chat timestamp: Today → "HH:mm", Yesterday → "Yesterday", else → "DD/MM/YY" */
export function chatTime(date) {
  const d = new Date(date)
  if (isToday(d)) return format(d, 'HH:mm')
  if (isYesterday(d)) return 'Yesterday'
  return format(d, 'dd/MM/yy')
}

/** Truncate long strings */
export function truncate(str, n = 120) {
  if (!str) return ''
  return str.length > n ? str.slice(0, n) + '…' : str
}

/** Convert file to base64 (for previews) */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/** Format currency in Indian locale */
export function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount)
}

/** Role badge color helper */
export function roleBadgeClass(role) {
  const map = {
    alumni: 'bg-brand-100 text-brand-700',
    student: 'bg-slate-100 text-slate-600',
    admin: 'bg-red-100 text-red-700',
  }
  return map[role] || map.student
}

/** Build a UI-Avatars URL */
export function avatarUrl(name, { background = '6366f1', color = 'fff', size = 80 } = {}) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&background=${background}&color=${color}&size=${size}`
}
