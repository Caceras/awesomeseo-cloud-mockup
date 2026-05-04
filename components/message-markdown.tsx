"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"

/**
 * Tight markdown renderer for assistant chat messages.
 *
 * Goals:
 * - Match the chat bubble's typographic scale exactly so prose flows
 *   into the surrounding UI without visual stutter.
 * - Support the GFM subset (tables, task lists, strikethrough, autolink)
 *   because that's what AI models output by default.
 * - Stream-safe: react-markdown re-renders gracefully as text streams in
 *   from the AI SDK, so we don't need a separate streaming pipeline.
 *
 * Styling lives entirely on the inline component overrides — no global
 * `.prose` class — to keep the chat bubble visually self-contained and
 * impossible to style-collide with the rest of the app.
 */
export function MessageMarkdown({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  return (
    <div
      className={cn(
        // The space-y-2 is the *only* vertical-rhythm rule. Each block
        // element below gets its own margin-free treatment so this single
        // gap controls everything.
        "space-y-2 text-sm leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Paragraphs — plain inheritance, just kill default margins.
          p: ({ children }) => <p className="m-0">{children}</p>,

          // Headings — scaled to *just* stand out inside a 13px chat bubble.
          // We don't use h1/h2 visual weights because they'd dominate the bar.
          h1: ({ children }) => (
            <h3 className="text-[15px] font-semibold tracking-tight text-foreground">
              {children}
            </h3>
          ),
          h2: ({ children }) => (
            <h4 className="text-[14px] font-semibold tracking-tight text-foreground">
              {children}
            </h4>
          ),
          h3: ({ children }) => (
            <h5 className="text-[13px] font-semibold tracking-tight text-foreground">
              {children}
            </h5>
          ),
          h4: ({ children }) => (
            <h6 className="text-[13px] font-semibold tracking-tight text-foreground">
              {children}
            </h6>
          ),

          // Lists — compact, with primary-tinted markers.
          ul: ({ children }) => (
            <ul className="ml-4 list-disc space-y-1 marker:text-primary/70">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="ml-4 list-decimal space-y-1 marker:text-primary/70 marker:font-mono marker:text-[12px]">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="pl-1">{children}</li>,

          // Inline emphasis.
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-foreground/90">{children}</em>
          ),

          // Inline code — soft pill, primary tint.
          code: ({ className: codeClassName, children, ...props }) => {
            // react-markdown 9 differentiates inline vs block by the
            // presence of a `language-*` className on block code.
            const isBlock = /language-/.test(codeClassName ?? "")
            if (isBlock) {
              return (
                <code
                  className={cn(
                    "block w-full whitespace-pre-wrap break-words rounded-md bg-background/60 p-2.5 font-mono text-[12px] leading-relaxed text-foreground/90 ring-1 ring-inset ring-border/60",
                    codeClassName,
                  )}
                  {...props}
                >
                  {children}
                </code>
              )
            }
            return (
              <code
                className="rounded-[4px] bg-primary/10 px-1 py-0.5 font-mono text-[12px] text-primary"
                {...props}
              >
                {children}
              </code>
            )
          },
          // Block code wrapper — react-markdown wraps `<code class="language-*">`
          // in `<pre>` automatically; we collapse the wrapper margin.
          pre: ({ children }) => (
            <pre className="m-0 overflow-x-auto">{children}</pre>
          ),

          // Links — primary, underlined on hover, open externally if absolute.
          a: ({ href, children }) => {
            const external = href?.startsWith("http")
            return (
              <a
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="font-medium text-primary underline decoration-primary/40 underline-offset-2 transition-colors hover:decoration-primary"
              >
                {children}
              </a>
            )
          },

          // Blockquote — left border in primary, mild indent.
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-primary/40 pl-3 text-foreground/85">
              {children}
            </blockquote>
          ),

          // Horizontal rule — soft divider.
          hr: () => <hr className="my-1 border-border/50" />,

          // Tables — overflow-safe, tight cell padding so they fit the bar.
          table: ({ children }) => (
            <div className="overflow-x-auto rounded-md ring-1 ring-inset ring-border/60">
              <table className="w-full border-collapse text-[12px]">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-background/50 text-[11px] uppercase tracking-wider text-muted-foreground">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-2 py-1.5 text-left font-medium">{children}</th>
          ),
          td: ({ children }) => (
            <td className="border-t border-border/40 px-2 py-1.5 align-top">
              {children}
            </td>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  )
}
