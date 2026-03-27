export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="card text-center py-16 animate-fade-in">
      {Icon && <Icon size={48} className="text-slate-200 mx-auto mb-4" />}
      <p className="text-slate-600 text-lg font-medium">{title}</p>
      {description && <p className="text-slate-400 text-sm mt-1">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
