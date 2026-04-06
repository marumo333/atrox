import Link from 'next/link'

const TIERS = [
  {
    name: 'Free',
    price: '$0',
    accent: false,
    features: [
      'Read all archived episodes',
      'Mobile-first reading experience',
      'Public comments',
    ],
    cta: 'Start Reading',
    href: '/episodes',
  },
  {
    name: 'Pro',
    price: '$8',
    accent: true,
    features: [
      'Early access — 3 days before free',
      'Story requests and voting',
      'Message Vesper Black',
      'Pro badge on comments',
    ],
    cta: 'Upgrade to Pro',
    href: '/login',
  },
  {
    name: 'Premium',
    price: '$24',
    accent: false,
    features: [
      'Everything in Pro',
      'Create your own character',
      'Private weekly episodes',
      'Style and genre customization',
      'Persistent character memory',
    ],
    cta: 'Go Premium',
    href: '/login',
  },
] as const

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <header className="text-center mb-16 animate-fade-up">
        <p className="text-xs uppercase tracking-[0.3em] text-gold-muted mb-3">
          Subscribe
        </p>
        <h1 className="font-display text-4xl tracking-tight">
          Support the story
        </h1>
        <p className="mt-3 text-fg-muted">Shape the darkness.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((tier, i) => (
          <TierCard key={tier.name} tier={tier} index={i} />
        ))}
      </div>
    </div>
  )
}

function TierCard({
  tier,
  index,
}: {
  tier: (typeof TIERS)[number]
  index: number
}) {
  return (
    <div
      className={`animate-fade-up stagger-${index + 1} flex flex-col border p-8 ${
        tier.accent
          ? 'border-accent bg-accent/5 relative'
          : 'border-border bg-bg-elevated'
      }`}
    >
      {tier.accent && (
        <span className="absolute -top-3 left-8 bg-accent px-3 py-0.5 text-[10px] uppercase tracking-widest text-fg">
          Most Popular
        </span>
      )}
      <h2 className="font-display text-xl">{tier.name}</h2>
      <p className="mt-2">
        <span className="font-display text-3xl">{tier.price}</span>
        {tier.price !== '$0' && (
          <span className="text-sm text-fg-muted">/mo</span>
        )}
      </p>

      <ul className="mt-8 flex-1 space-y-3 text-sm">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-fg-muted">
            <span className="text-gold-muted mt-0.5">—</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <Link
        href={tier.href}
        className={`mt-8 block text-center py-3 text-xs uppercase tracking-widest transition-all ${
          tier.accent
            ? 'bg-accent text-fg hover:bg-accent-hover'
            : 'border border-border text-fg-muted hover:text-fg hover:border-border-hover'
        }`}
      >
        {tier.cta}
      </Link>
    </div>
  )
}
