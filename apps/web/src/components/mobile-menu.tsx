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

  return (
    <>
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="md:hidden flex flex-col justify-center items-center w-10 h-10 -mr-2"
      >
        <span
          className={`block h-px w-6 bg-fg transition-all duration-300 ${
            open ? 'rotate-45 translate-y-[3px]' : '-translate-y-1'
          }`}
        />
        <span
          className={`block h-px w-6 bg-fg transition-all duration-300 ${
            open ? '-rotate-45 -translate-y-px' : 'translate-y-1'
          }`}
        />
      </button>

      {open && (
        <div className="md:hidden fixed inset-0 top-[65px] z-30 bg-bg/95 backdrop-blur-md animate-fade-in">
          <nav className="flex flex-col items-center pt-16 gap-8">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`animate-fade-up stagger-${i + 1} font-display text-2xl tracking-wide text-fg-muted hover:text-gold transition-colors`}
              >
                {link.label}
              </Link>
            ))}
            <div className="animate-fade-up stagger-4 mt-4">
              <AuthButton />
            </div>
            <div className="animate-fade-up stagger-5 mt-8 flex gap-6 text-xs text-fg-muted/60 tracking-widest">
              <Link href="/terms" onClick={() => setOpen(false)}>
                Terms
              </Link>
              <Link href="/privacy" onClick={() => setOpen(false)}>
                Privacy
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
