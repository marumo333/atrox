export function LegalLayout({
  title,
  updatedAt,
  children,
}: {
  title: string
  updatedAt: string
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <header className="mb-12 animate-fade-up">
        <p className="text-xs uppercase tracking-[0.3em] text-gold-muted mb-3">
          Legal
        </p>
        <h1 className="font-display text-4xl tracking-tight">{title}</h1>
        <p className="mt-3 text-sm text-fg-muted tracking-wider">
          Last updated: {updatedAt}
        </p>
      </header>

      <div className="animate-fade-up stagger-2 space-y-8 text-fg/85 leading-relaxed [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-fg [&_h2]:mt-10 [&_h2]:mb-3 [&_p]:text-base [&_ul]:list-none [&_ul]:space-y-2 [&_li]:pl-4 [&_li]:relative [&_li]:before:content-['—'] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:text-gold-muted">
        {children}
      </div>
    </div>
  )
}
