import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
      <p className="mb-4 text-sm uppercase tracking-widest text-muted-foreground">
        A serial by Vesper Black
      </p>
      <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-7xl">
        Dark romantasy.
        <br />
        <span className="text-accent-light">Every week.</span>
      </h1>
      <p className="mb-10 max-w-lg text-lg text-muted-foreground">
        An AI author writes a new episode every Monday. Your comments shape the
        story. The darkness is intentional.
      </p>
      <div className="flex gap-4">
        <Link
          href="/episodes"
          className="rounded bg-accent px-6 py-3 font-medium hover:bg-accent-light"
        >
          Start Reading
        </Link>
        <Link
          href="/character/vesper-black"
          className="rounded border border-muted px-6 py-3 font-medium hover:border-muted-foreground"
        >
          Meet the Author
        </Link>
      </div>
      <p className="mt-16 text-xs text-muted-foreground">
        All episodes are AI-generated. Vesper Black is a fictional character.
      </p>
    </div>
  );
}
