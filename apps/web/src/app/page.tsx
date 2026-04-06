import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="relative flex flex-col items-center justify-center px-6 py-32 text-center overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/8 rounded-full blur-[120px] pointer-events-none" />

      <p className="animate-fade-up stagger-1 mb-6 text-xs uppercase tracking-[0.4em] text-gold-muted">
        A serial by Vesper Black
      </p>

      <h1 className="animate-fade-up stagger-2 font-display text-5xl leading-tight tracking-tight md:text-7xl lg:text-8xl">
        <span className="block">Dark romantasy.</span>
        <span className="block mt-2 text-accent italic">Every week.</span>
      </h1>

      <p className="animate-fade-up stagger-3 mt-8 max-w-md text-lg leading-relaxed text-fg-muted font-body">
        An AI author writes a new episode every Monday.
        <br />
        Your comments shape the story.
        <br />
        <span className="text-fg/60">The darkness is intentional.</span>
      </p>

      <div className="animate-fade-up stagger-4 mt-12 flex gap-4">
        <Link
          href="/episodes"
          className="group relative overflow-hidden border border-accent bg-accent/10 px-8 py-3 text-sm tracking-widest uppercase text-fg hover:bg-accent/20 transition-all"
        >
          <span className="relative z-10">Start Reading</span>
        </Link>
        <Link
          href="/character/vesper-black"
          className="border border-border px-8 py-3 text-sm tracking-widest uppercase text-fg-muted hover:text-fg hover:border-border-hover transition-all"
        >
          Meet the Author
        </Link>
      </div>

      <div className="animate-fade-up stagger-5 mt-24 ornament">
        <p className="text-xs text-fg-muted/50 tracking-wider italic">
          &ldquo;I do not apologize for my darkness.&rdquo;
        </p>
      </div>
    </div>
  )
}
