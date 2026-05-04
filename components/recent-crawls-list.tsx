import Link from "next/link"
import { Chrome, Cloud, CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react"
import { recentCrawls, projectById } from "@/lib/mock-data"
import { ProjectAvatar } from "@/components/project-avatar"
import { cn } from "@/lib/utils"

const formatTime = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

const statusMeta: Record<string, { label: string; cls: string; Icon: React.ElementType }> = {
  success: {
    label: "Success",
    cls: "bg-success/15 text-success",
    Icon: CheckCircle2,
  },
  failed: {
    label: "Failed",
    cls: "bg-destructive/15 text-destructive",
    Icon: XCircle,
  },
  queued: {
    label: "Queued",
    cls: "bg-muted text-muted-foreground",
    Icon: Clock,
  },
  running: {
    label: "Running",
    cls: "bg-primary/15 text-primary",
    Icon: Loader2,
  },
}

export function RecentCrawlsList() {
  return (
    <ul className="divide-y divide-border">
      {recentCrawls.map((c) => {
        const project = projectById(c.projectId)
        const meta = statusMeta[c.status]
        const Icon = meta.Icon
        const Source = c.source === "extension" ? Chrome : Cloud
        return (
          <li key={c.id}>
            <Link
              href={`/projects/${c.projectId}`}
              className="flex items-center gap-3 py-3 hover:bg-card/60 -mx-2 px-2 rounded-md transition-colors"
            >
              {project ? (
                <ProjectAvatar project={project} size={32} />
              ) : (
                // Defensive: a crawl with a deleted project should still
                // render a placeholder so the row layout stays aligned.
                <span
                  aria-hidden
                  className="size-8 shrink-0 rounded-md bg-muted ring-1 ring-inset ring-border/60"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{project?.name}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                  <Source className="size-3" aria-hidden />
                  <span>{c.source === "extension" ? "Chrome extension" : "Cloud crawler"}</span>
                  <span>·</span>
                  <span>{formatTime(c.startedAt)}</span>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-xs tabular text-muted-foreground">
                <div className="text-right">
                  <div className="text-foreground">{c.pagesCrawled.toLocaleString()}</div>
                  <div className="text-[10px] uppercase tracking-wider">pages</div>
                </div>
                <div className="text-right">
                  <div className={c.errors > 0 ? "text-destructive" : "text-foreground"}>{c.errors}</div>
                  <div className="text-[10px] uppercase tracking-wider">errors</div>
                </div>
              </div>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                  meta.cls,
                )}
              >
                <Icon className={cn("size-3", c.status === "running" && "animate-spin")} />
                {meta.label}
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
