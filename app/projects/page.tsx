import { Plus, Search } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { projects } from "@/lib/mock-data"

export default function ProjectsIndex() {
  return (
    <AppShell>
      <div className="px-4 lg:px-8 py-6 lg:py-8 space-y-6">
        <PageHeader
          title="Projects"
          description="One project per site. Each project tracks crawl history, AI work, and team activity."
          actions={
            <Button>
              <Plus className="size-4" />
              New project
            </Button>
          }
        />

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search projects…"
              className="pl-9 h-9 bg-card/60 border-border"
            />
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {["All", "Healthy", "Needs attention", "Failing", "Daily", "Weekly"].map((c, i) => (
              <button
                key={c}
                className={`rounded-full border px-3 py-1.5 transition-colors ${
                  i === 0
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>
    </AppShell>
  )
}
