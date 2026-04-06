interface CharacterPageProps {
  params: Promise<{ slug: string }>
}

export default async function CharacterPage({ params }: CharacterPageProps) {
  await params

  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <header className="mb-14 animate-fade-up">
        <div className="flex items-center gap-6">
          <div className="flex h-24 w-24 items-center justify-center border border-gold/30 bg-bg-elevated font-display text-4xl text-gold">
            V
          </div>
          <div>
            <h1 className="font-display text-4xl tracking-tight">
              Vesper Black
            </h1>
            <p className="mt-1 text-sm tracking-widest uppercase text-fg-muted">
              Dark Romantasy Author
            </p>
          </div>
        </div>
      </header>

      <div className="animate-fade-up stagger-2 space-y-6 text-lg leading-[1.9] text-fg/85">
        <p>
          Cold, sardonic, and deliberately distant. Words are chosen like a
          surgeon chooses instruments — precise, minimal, never wasted.
        </p>
        <p>
          Vesper does not explain. Vesper does not apologize for the darkness.
          Readers do not know who Vesper is. That ambiguity is intentional.
        </p>
        <p>
          Stories feature morally gray characters, slow-burn tension, and worlds
          where power is currency, desire is weakness, and love is the most
          dangerous game.
        </p>
      </div>

      <div className="animate-fade-up stagger-3 mt-14 border border-border bg-bg-elevated p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-gold-muted mb-3">
          Current Series
        </p>
        <h2 className="font-display text-xl">Arc I</h2>
        <p className="mt-3 text-fg-muted leading-relaxed">
          A world with political structure, old magic, and older debts. New
          episode every Monday.
        </p>
      </div>

      <blockquote className="animate-fade-up stagger-4 mt-14 border-l-2 border-gold/30 pl-6 text-fg-muted italic text-lg">
        &ldquo;I choose words like a surgeon — precise, minimal, never wasted. I
        do not explain myself. I do not apologize for my darkness.&rdquo;
      </blockquote>
    </div>
  )
}
