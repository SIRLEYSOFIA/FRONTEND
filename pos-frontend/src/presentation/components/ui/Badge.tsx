type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral' | 'info'

interface BadgeProps {
  label: string
  variant?: BadgeVariant
}

export function Badge({ label, variant = 'neutral' }: BadgeProps) {
  return <span className={`badge badge-${variant}`}>{label}</span>
}
