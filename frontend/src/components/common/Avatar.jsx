export default function Avatar({ src, name, size = 'md', className = '' }) {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-lg',
    '2xl': 'w-28 h-28 text-xl',
  }
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&background=6366f1&color=fff&size=80`

  return (
    <img
      src={src || fallback}
      alt={name || 'Avatar'}
      className={`${sizes[size]} rounded-full object-cover flex-shrink-0 ${className}`}
      onError={(e) => { e.target.src = fallback }}
    />
  )
}
