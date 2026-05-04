import { Plus, CalendarClock } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { RecentCrawlsList } from "@/components/recent-crawls-list"
import { ProjectAvatar } from "@/components/project-avatar"
import { projects } from "@/lib/mock-data"

export default function SchedulesPage() {
  return (
    <AppShell>
      <div className="px-4 lg:px-8 py-6 lg:py-8 space-y-8">
        <PageHeader
          title="Schedules & crawls"
          description="Recurring cloud crawls per project, plus the live history feed of every run — extension or cloud."
          actions={
            <Button>
              <Plus className="size-4" />
              New schedule
            </Button>
          }
        />

        {/* Schedule cards */}
        <section className="space-y-3">
          <h2 className="font-medium text-sm">Active schedules</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects
              .filter((p) => p.schedule !== "off")
              .map((p) => (
                <article
                  key={p.id}
                  className="rounded-xl border border-border bg-card p-5 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <ProjectAvatar project={p} size={36} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{p.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{p.domain}</div>
                    </div>
                    <span className="rounded-full bg-primary/15 text-primary text-[10px] uppercase tracking-wider px-2 py-0.5 font-medium capitalize">
                      {p.schedule}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="text-muted-foreground">Next run</div>
                      <div className="tabular mt-0.5">in 4h 12m</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Pages last run</div>
                      <div className="tabular mt-0.5">{p.pages.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-border">
                    <Button size="sm" variant="ghost" className="text-xs">
                      Run now
                    </Button>
                    <Button size="sm" variant="ghost" className="text-xs ml-auto">
                      <CalendarClock className="size-3.5" />
                      Edit
                    </Button>
                  </div>
                </article>
              ))}
          </div>
        </section>

        {/* History feed */}
        <section className="rounded-xl border border-border bg-card p-5 space-y-3">
          <header>
            <h2 className="font-medium">Crawl history</h2>
            <p className="text-xs text-muted-foreground">All crawls across this workspace.</p>
          </header>
          <RecentCrawlsList />
        </section>
      </div>
    </AppShell>
  )
}
