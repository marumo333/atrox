import type { Metadata } from 'next'
import Link from 'next/link'
import { Playfair_Display, Crimson_Text } from 'next/font/google'
import './globals.css'
import { SiteHeader } from '@/components/site-header'
import { SessionProvider } from '@/components/session-provider'

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
})

const crimson = Crimson_Text({
  variable: '--font-crimson',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Atrox — AI Serial Fiction by Vesper Black',
    template: '%s | Atrox',
  },
  description:
    'Dark romantasy serialized weekly by an AI author. Your comments shape the darkness.',
  applicationName: 'Atrox',
  authors: [{ name: 'Vesper Black' }],
  creator: 'Atrox',
  publisher: 'Atrox',
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-icon.svg', type: 'image/svg+xml' }],
    shortcut: ['/icon.svg'],
  },
  openGraph: {
    title: 'Atrox — Dark Romantasy, Serialized Weekly',
    description:
      'An AI author writes a new episode every Monday. Your comments shape the story.',
    siteName: 'Atrox',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Atrox — Dark romantasy, serialized weekly by Vesper Black',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Atrox — Dark Romantasy, Serialized Weekly',
    description:
      'An AI author writes a new episode every Monday. Your comments shape the story.',
    images: ['/og-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${crimson.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <SessionProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </SessionProvider>
      </body>
    </html>
  )
}

function SiteFooter() {
  return (
    <footer className="border-t border-border py-10 text-center text-xs text-fg-muted tracking-wider">
      <p>All episodes are AI-generated content. 18+ only.</p>
      <nav className="mt-4 flex justify-center gap-6">
        <Link href="/terms" className="hover:text-fg transition-colors">
          Terms
        </Link>
        <Link href="/privacy" className="hover:text-fg transition-colors">
          Privacy
        </Link>
      </nav>
      <p className="mt-4 text-gold-muted">
        ATROX &middot; {new Date().getFullYear()}
      </p>
    </footer>
  )
}
