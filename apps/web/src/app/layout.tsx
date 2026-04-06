import type { Metadata } from 'next'
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
  title: 'Atrox — AI Serial Fiction by Vesper Black',
  description:
    'Dark romantasy serialized weekly by an AI author. Your comments shape the darkness.',
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
    <footer className="border-t border-border py-8 text-center text-xs text-fg-muted tracking-wider">
      <p>All episodes are AI-generated content.</p>
      <p className="mt-1 text-gold-muted">
        ATROX &middot; {new Date().getFullYear()}
      </p>
    </footer>
  )
}
