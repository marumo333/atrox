'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { AuthButton } from './auth-button'

const NAV_LINKS = [
  { href: '/episodes', label: 'Episodes' },
  { href: '/character/vesper-black', label: 'The Author' },
  { href: '/pricing', label: 'Subscribe' },
] as const

export function HamburgerButton({
  open,
  onToggle,
}: {
  open: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
      aria-controls="mobile-menu-section"
      onClick={onToggle}
      className="md:hidden relative flex h-11 w-11 items-center justify-center -mr-2 border border-gold/30 rounded hover:border-gold/60 hover:bg-gold/5 transition-colors"
    >
      <span
        className={`absolute block h-[2.5px] w-6 bg-gold rounded-full transition-all duration-300 ${
          open ? 'rotate-45' : '-translate-y-[7px]'
        }`}
      />
      <span
        className={`absolute block h-[2.5px] w-6 bg-gold rounded-full transition-all duration-200 ${
          open ? 'opacity-0 scale-0' : 'opacity-100'
        }`}
      />
      <span
        className={`absolute block h-[2.5px] w-6 bg-gold rounded-full transition-all duration-300 ${
          open ? '-rotate-45' : 'translate-y-[7px]'
        }`}
      />
    </button>
  )
}

export function MobileMenuSection({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  // Close menu on Escape key
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <section
      id="mobile-menu-section"
      aria-hidden={!open}
      className={`md:hidden bg-bg-elevated border-b border-gold/20 overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
        open ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <nav className="mx-auto max-w-5xl px-6 py-6">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="block font-display text-2xl text-fg hover:text-gold border-b border-border py-5 transition-colors"
          >
            {link.label}
          </Link>
        ))}
        <div className="mt-8 flex justify-center">
          <AuthButton />
        </div>
        <div className="mt-8 flex justify-center gap-8 text-xs text-fg-muted tracking-widest uppercase">
          <Link
            href="/terms"
            onClick={onClose}
            className="hover:text-fg transition-colors"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            onClick={onClose}
            className="hover:text-fg transition-colors"
          >
            Privacy
          </Link>
        </div>
      </nav>
    </section>
  )
}
