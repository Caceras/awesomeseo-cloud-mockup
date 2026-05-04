import { Sparkles, Filter } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { AiTasksList } from "@/components/ai-tasks-list"
import { Button } from "@/components/ui/button"

export default function GlobalAiPage() {
  return (
    <AppShell>
      <div className="px-4 lg:px-8 py-6 lg:py-8 space-y-6">
        <PageHeader
          title="AI insights"
          eyebrow={
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-primary" />
              Across all projects
            </span>
          }
          description="Drafts, ranked fixes, and developer tickets generated from your crawls. Review, tweak, and ship."
          actions={
            <>
              <Button variant="outline" className="bg-transparent">
                <Filter className="size-4" /> Filters
              </Button>
              <Button>
                <Sparkles className="size-4" />
                Run on all projects
              </Button>
            </>
          }
        />

        {/* Status tabs */}
        <div className="flex flex-wrap gap-2 text-xs border-b border-border pb-3">
          {["All", "Ready", "Drafting", "In review", "Applied"].map((s, i) => (
            <button
              key={s}
              className={`rounded-full border px-3 py-1.5 transition-colors ${
                i === 0
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <AiTasksList />
      </div>
    </AppShell>
  )
}
