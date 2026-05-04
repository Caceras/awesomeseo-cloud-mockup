import { ListChecks, ImageIcon, FileText, GitPullRequest, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// One question: which AI workflow should I run next?

const opportunities = [
  {
    icon: ListChecks,
    title: "Prioritize the pages that matter",
    description:
      "Combine issues, page type, main keyword, and competitor context into a ranked fix list.",
    cta: "Generate fix list",
    impact: "high",
  },
  {
    icon: ImageIcon,
    title: "Generate metadata and social creative",
    description:
      "Use titles, descriptions, OG/Twitter image gaps, and page intent to draft branded snippets and image concepts.",
    cta: "Draft metadata",
    impact: "high",
  },
  {
    icon: FileText,
    title: "Create content and internal-link briefs",
    description:
      "Turn thin content, heading structure, topic clusters, and orphan pages into editor-ready recommendations.",
    cta: "Open brief studio",
    impact: "medium",
  },
  {
    icon: GitPullRequest,
    title: "Make developer tickets",
    description:
      "Translate canonical, schema, performance, render-blocking and redirect patterns into grouped implementation tasks.",
    cta: "Create tickets",
    impact: "medium",
  },
] as const

const impactStyles = {
  high: "bg-primary/15 text-primary ring-primary/30",
  medium: "bg-muted text-muted-foreground ring-border",
} as const

export default function AiInsightsPage() {
  return (
    <div className="mx-auto max-w-5xl py-10 space-y-10">
      <header>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">
          AI insights
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Which workflow should I run next?
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Each workflow turns the latest crawl into editor- or developer-ready
          output. Outputs queue under your runs and stay searchable forever.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {opportunities.map((o) => (
          <article
            key={o.title}
            className="group rounded-xl border border-border bg-card p-6 hover:border-primary/40 transition-colors flex flex-col gap-4"
          >
            <div className="flex items-start justify-between">
              <span className="size-10 rounded-lg bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center text-primary">
                <o.icon className="size-5" />
              </span>
              <span
                className={`text-[10px] uppercase tracking-wider rounded-md px-1.5 py-0.5 ring-1 ${impactStyles[o.impact]}`}
              >
                {o.impact} impact
              </span>
            </div>
            <div>
              <h3 className="font-medium">{o.title}</h3>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed text-pretty">
                {o.description}
              </p>
            </div>
            <div className="mt-auto">
              <Button size="sm" variant="outline" className="bg-transparent">
                {o.cta}
                <ArrowRight className="size-3.5" />
              </Button>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
