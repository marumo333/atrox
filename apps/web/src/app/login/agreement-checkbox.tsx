'use client'

import Link from 'next/link'

export function AgreementCheckbox({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-start gap-3 text-xs text-fg-muted leading-relaxed cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        required
        className="mt-0.5 h-4 w-4 shrink-0 accent-accent cursor-pointer"
      />
      <span>
        I am 18 or older and agree to the{' '}
        <Link
          href="/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold hover:text-gold-muted underline underline-offset-2"
        >
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link
          href="/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold hover:text-gold-muted underline underline-offset-2"
        >
          Privacy Policy
        </Link>
        . EU/UK consumers acknowledge that immediate access to digital content
        waives the 14-day right of withdrawal.
      </span>
    </label>
  )
}
