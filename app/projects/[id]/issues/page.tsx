import { notFound } from "next/navigation"
import {
  AlertCircle,
  AlertTriangle,
  Info,
  ChevronRight,
  Sparkles,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { projectIssues, projectById, type Issue } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const sevMeta: Record<
  Issue["severity"],
  { label: string; cls: string; Icon: React.ElementType }
> = {
  critical: { label: "Critical", cls: "text-destructive bg-destructive/15", Icon: AlertCircle },
  warning: { label: "Warning", cls: "text-warning bg-warning/15", Icon: AlertTriangle },
  notice: { label: "Notice", cls: "text-muted-foreground bg-muted", Icon: Info },
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" })

export default async function IssuesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = projectById(id)
  if (!project) notFound()
  const issues = projectIssues(id)

  const counts = issues.reduce(
    (acc, i) => {
      acc[i.severity]++
      return acc
    },
    { critical: 0, warning: 0, notice: 0 } as Record<Issue["severity"], number>,
  )

  return (
    <div className="mx-auto max-w-5xl py-10 space-y-8">
      <header className="max-w-3xl">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">
          Issues
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          What&apos;s broken, ranked by impact?
        </h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Grouped by severity. Snooze, fix manually, or hand off to AI for a
          generated patch.
        </p>
      </header>

      {/* Severity summary */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="text-xs text-muted-foreground">
          {issues.length} open issues across {project.pages.toLocaleString()} pages
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 bg-destructive/15 text-destructive">
            <AlertCircle className="size-3.5" /> {counts.critical} critical
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 bg-warning/15 text-warning">
            <AlertTriangle className="size-3.5" /> {counts.warning} warnings
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 bg-muted text-muted-foreground">
            <Info className="size-3.5" /> {counts.notice} notices
          </span>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 text-xs">
        {["All", "Indexing", "Performance", "Content", "Schema", "Links", "Mobile"].map((c, i) => (
          <button
            key={c}
            className={cn(
              "rounded-full border px-3 py-1.5 transition-colors",
              i === 0
                ? "border-primary bg-primary/15 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* List */}
      <ul className="rounded-xl border border-border bg-card divide-y divide-border">
        {issues.map((i) => {
          const meta = sevMeta[i.severity]
          const Icon = meta.Icon
          return (
            <li key={i.id} className="p-5 hover:bg-card/60 transition-colors group">
              <div className="flex items-start gap-4">
                <span
                  className={cn(
                    "size-9 shrink-0 rounded-lg flex items-center justify-center",
                    meta.cls,
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium text-balance">{i.title}</h3>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium",
                        meta.cls,
                      )}
                    >
                      {meta.label}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider rounded-md px-1.5 py-0.5 bg-muted text-muted-foreground">
                      {i.category}
                    </span>
                    {i.status === "snoozed" ? (
                      <span className="text-[10px] uppercase tracking-wider rounded-md px-1.5 py-0.5 bg-chart-5/20 text-foreground/70">
                        Snoozed
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed text-pretty">
                    {i.description}
                  </p>
                  <div className="text-xs text-muted-foreground mt-3 flex items-center gap-3 flex-wrap">
                    <span className="inline-flex items-center gap-1">
                      <FileText className="size-3" />
                      <span className="tabular">{i.pagesAffected}</span> page
                      {i.pagesAffected === 1 ? "" : "s"} affected
                    </span>
                    <span aria-hidden>·</span>
                    <span>First seen {formatDate(i.firstSeen)}</span>
                  </div>
                </div>
                <div className="hidden md:flex flex-col items-end gap-2 shrink-0">
                  <Button size="sm" variant="outline" className="bg-transparent">
                    <Sparkles className="size-4" />
                    AI fix
                  </Button>
                  <Button size="sm" variant="ghost" className="text-muted-foreground">
                    Open
                    <ChevronRight className="size-3.5" />
                  </Button>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
