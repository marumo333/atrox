'use client'

export function Field({
  id,
  label,
  type,
  value,
  onChange,
  minLength,
}: {
  id: string
  label: string
  type: string
  value: string
  onChange: (v: string) => void
  minLength?: number
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs tracking-widest text-fg-muted uppercase mb-2"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        minLength={minLength}
        className="w-full border border-border bg-bg-elevated px-4 py-3 text-fg placeholder:text-fg-muted/40 focus:border-gold/40 focus:outline-none transition-colors"
      />
    </div>
  )
}
