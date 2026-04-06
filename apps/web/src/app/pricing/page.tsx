import Link from "next/link";

const TIERS = [
  {
    name: "Free",
    price: "$0",
    features: [
      "Read all archived episodes",
      "Mobile-first reading experience",
      "Public comments",
    ],
    cta: "Start Reading",
    href: "/episodes",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$8/mo",
    features: [
      "Early access (3 days before free)",
      "Story requests and voting",
      "Message Vesper Black",
      "Pro badge on comments",
    ],
    cta: "Upgrade to Pro",
    href: "/login",
    highlight: true,
  },
  {
    name: "Premium",
    price: "$24/mo",
    features: [
      "Everything in Pro",
      "Create your own character",
      "Private weekly episodes",
      "Style and genre customization",
      "Persistent character memory",
    ],
    cta: "Go Premium",
    href: "/login",
    highlight: false,
  },
] as const;

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-2 text-center text-3xl font-bold">Pricing</h1>
      <p className="mb-12 text-center text-muted-foreground">
        Support the story. Shape the darkness.
      </p>
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((tier) => (
          <TierCard key={tier.name} tier={tier} />
        ))}
      </div>
    </div>
  );
}

function TierCard({
  tier,
}: {
  tier: (typeof TIERS)[number];
}) {
  return (
    <div
      className={`rounded border p-6 ${
        tier.highlight
          ? "border-accent-light bg-accent/10"
          : "border-muted"
      }`}
    >
      <h2 className="text-xl font-bold">{tier.name}</h2>
      <p className="mt-1 text-2xl font-bold">{tier.price}</p>
      <ul className="mt-6 space-y-2 text-sm">
        {tier.features.map((f) => (
          <li key={f} className="text-muted-foreground">
            — {f}
          </li>
        ))}
      </ul>
      <Link
        href={tier.href}
        className={`mt-6 block rounded px-4 py-2 text-center text-sm font-medium ${
          tier.highlight
            ? "bg-accent hover:bg-accent-light"
            : "border border-muted hover:border-muted-foreground"
        }`}
      >
        {tier.cta}
      </Link>
    </div>
  );
}
