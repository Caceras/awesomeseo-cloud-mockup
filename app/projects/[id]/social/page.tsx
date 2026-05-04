import { notFound } from "next/navigation"
import { ImageOff, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { projectById, socialPreviews } from "@/lib/mock-data"

// One question: how does each page look when shared on social?

const statusStyles = {
  complete: "bg-success/15 text-success ring-success/30",
  partial: "bg-warning/15 text-warning ring-warning/30",
  missing: "bg-destructive/15 text-destructive ring-destructive/30",
} as const

export default async function SocialPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = projectById(id)
  if (!project) notFound()

  return (
    <div className="mx-auto max-w-5xl py-10 space-y-10">
      <header>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">
          Social previews
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          What does this site look like when it&apos;s shared?
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Each card renders the OG and Twitter tags exactly as Slack, X and LinkedIn
          would show them. Pages with missing or oversized assets are flagged.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        {socialPreviews.map((p) => (
          <article
            key={p.url}
            className="rounded-xl border border-border bg-card overflow-hidden flex flex-col"
          >
            {/* Preview image */}
            <div className="relative aspect-[1.91/1] bg-muted/30 border-b border-border flex items-center justify-center">
              {p.ogImage ? (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImageOff className="size-6" />
                  <span className="text-xs">No og:image</span>
                </div>
              )}
              <span
                className={cn(
                  "absolute top-3 right-3 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-md ring-1",
                  statusStyles[p.status],
                )}
              >
                {p.status}
              </span>
            </div>

            {/* Preview text — facebook-style card */}
            <div className="p-4 border-b border-border">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {project.domain}
              </div>
              <h3 className="mt-1 text-sm font-medium line-clamp-2 leading-snug">
                {p.title}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {p.description || (
                  <span className="italic">No description</span>
                )}
              </p>
            </div>

            {/* Issues */}
            <div className="p-4 flex-1 flex flex-col gap-3">
              <div className="font-mono text-[11px] text-muted-foreground truncate">
                {p.url}
              </div>
              {p.issues.length === 0 ? (
                <div className="text-xs text-success">All tags present and valid.</div>
              ) : (
                <ul className="space-y-1.5">
                  {p.issues.map((iss) => (
                    <li
                      key={iss}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <span className="size-1.5 rounded-full bg-warning" aria-hidden />
                      {iss}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-auto flex items-center gap-2 pt-2">
                <Button size="sm" variant="outline" className="bg-transparent">
                  <Sparkles className="size-3.5" />
                  Generate with AI
                </Button>
                <Button size="sm" variant="ghost">
                  Edit tags
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
