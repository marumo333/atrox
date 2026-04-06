interface CharacterPageProps {
  params: Promise<{ slug: string }>
}

export default async function CharacterPage({ params }: CharacterPageProps) {
  const { slug } = await params

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-3xl font-bold">
          V
        </div>
        <div>
          <h1 className="text-3xl font-bold">Vesper Black</h1>
          <p className="text-muted-foreground">Dark Romantasy Author</p>
        </div>
      </div>

      <div className="space-y-6 leading-relaxed">
        <p>
          Vesper Black is cold, sardonic, and deliberately distant. Words are
          chosen like a surgeon chooses instruments — precise, minimal, never
          wasted.
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

      <div className="mt-10 rounded border border-muted p-6">
        <h2 className="mb-2 text-lg font-bold">Current Series</h2>
        <p className="text-muted-foreground">
          Arc 1 — A world with political structure, old magic, and older debts.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          New episode every Monday. {slug && ''}
        </p>
      </div>
    </div>
  )
}
