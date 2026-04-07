import Link from 'next/link'
import { AuthButton } from './auth-button'
import { MobileMenu } from './mobile-menu'

export function SiteHeader() {
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
        <MobileMenu />
      </nav>
    </header>
  )
}
