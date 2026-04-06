import Link from 'next/link'
import { AuthButton } from './auth-button'

export function SiteHeader() {
  return (
    <header className="border-b border-muted">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          ATROX
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/episodes" className="hover:text-accent-light">
            Episodes
          </Link>
          <Link
            href="/character/vesper-black"
            className="hover:text-accent-light"
          >
            Vesper Black
          </Link>
          <Link href="/pricing" className="hover:text-accent-light">
            Pricing
          </Link>
          <AuthButton />
        </div>
      </nav>
    </header>
  )
}
