import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

/**
 * Renders episode body as styled markdown. Uses custom component
 * mapping to apply Atrox's Gothic Literary aesthetic:
 * - First paragraph gets a drop cap
 * - Horizontal rules become gold ornaments
 * - Italic text uses the display font
 */
export function EpisodeBody({ body }: { body: string }) {
  let paragraphIndex = 0

  return (
    <div className="space-y-6 text-lg leading-[1.9] text-fg/90">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => {
            const isFirst = paragraphIndex === 0
            paragraphIndex++
            return (
              <p
                className={
                  isFirst
                    ? 'first-letter:text-5xl first-letter:font-display first-letter:text-gold first-letter:float-left first-letter:mr-2 first-letter:mt-1'
                    : ''
                }
              >
                {children}
              </p>
            )
          },
          hr: () => (
            <hr className="my-10 border-0 text-center text-gold-muted before:content-['◆_◆_◆] before:tracking-[0.5em]" />
          ),
          em: ({ children }) => <em className="italic text-fg">{children}</em>,
          strong: ({ children }) => (
            <strong className="font-semibold text-fg">{children}</strong>
          ),
          h1: ({ children }) => (
            <h1 className="font-display text-3xl mt-10 mb-4">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-display text-2xl mt-8 mb-3">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-display text-xl mt-6 mb-3 text-gold-muted">
              {children}
            </h3>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-gold/30 pl-6 italic text-fg-muted my-6">
              {children}
            </blockquote>
          ),
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  )
}
