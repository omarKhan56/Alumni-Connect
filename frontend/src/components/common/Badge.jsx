const variants = {
  brand:   'bg-brand-100 text-brand-700',
  green:   'bg-green-100 text-green-700',
  yellow:  'bg-yellow-100 text-yellow-700',
  red:     'bg-red-100 text-red-700',
  orange:  'bg-orange-100 text-orange-700',
  purple:  'bg-purple-100 text-purple-700',
  slate:   'bg-slate-100 text-slate-600',
  pink:    'bg-pink-100 text-pink-700',
}

export default function Badge({ children, variant = 'brand', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant] || variants.slate} ${className}`}>
      {children}
    </span>
  )
}
