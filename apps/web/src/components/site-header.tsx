'use client'

import Link from 'next/link'
import { useState } from 'react'
import { AuthButton } from './auth-button'
import { HamburgerButton, MobileMenuSection } from './mobile-menu'

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="border-b border-border backdrop-blur-sm bg-bg/80 sticky top-0 z-40">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="font-display text-xl tracking-[0.2em] text-gold hover:text-gold-muted transition-colors"
        >
          ATROX
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8 text-sm tracking-wide">
          <Link
            href="/episodes"
            className="text-fg-muted hover:text-fg transition-colors"
          >
            Episodes
          </Link>
          <Link
            href="/character/vesper-black"
            className="text-fg-muted hover:text-fg transition-colors"
          >
            The Author
          </Link>
          <Link
            href="/pricing"
            className="text-fg-muted hover:text-fg transition-colors"
          >
            Subscribe
          </Link>
          <AuthButton />
        </div>

        {/* Mobile hamburger */}
        <HamburgerButton
          open={menuOpen}
          onToggle={() => setMenuOpen(!menuOpen)}
        />
      </nav>

      {/* Mobile menu section — below the nav, inside sticky header */}
      <MobileMenuSection open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  )
}
