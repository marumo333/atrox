'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AuthButton } from './auth-button'

const NAV_LINKS = [
  { href: '/episodes', label: 'Episodes' },
  { href: '/character/vesper-black', label: 'The Author' },
  { href: '/pricing', label: 'Subscribe' },
] as const

export function MobileMenu() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Close menu on Escape key
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
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

      {open && (
        <div className="md:hidden fixed inset-0 top-[65px] z-30 bg-bg animate-fade-in overflow-y-auto">
          <nav className="flex flex-col items-stretch px-6 pt-12 pb-12">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`animate-fade-up stagger-${i + 1} font-display text-3xl tracking-wide text-fg hover:text-gold border-b border-border py-6 transition-colors`}
              >
                {link.label}
              </Link>
            ))}
            <div className="animate-fade-up stagger-4 mt-10 flex justify-center">
              <AuthButton />
            </div>
            <div className="animate-fade-up stagger-5 mt-12 flex justify-center gap-8 text-xs text-fg-muted tracking-widest uppercase">
              <Link
                href="/terms"
                onClick={() => setOpen(false)}
                className="hover:text-fg transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                onClick={() => setOpen(false)}
                className="hover:text-fg transition-colors"
              >
                Privacy
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
