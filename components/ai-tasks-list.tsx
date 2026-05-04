import Link from "next/link"
import {
  ListChecks,
  ImageIcon,
  FileText,
  GitPullRequest,
  ArrowRight,
} from "lucide-react"
import { aiTasks, projectById, type AiTask } from "@/lib/mock-data"
import { EngineRow, projectEngines } from "@/components/engine-logos"
import { cn } from "@/lib/utils"

const kindMeta: Record<AiTask["kind"], { label: string; Icon: React.ElementType }> = {
  "fix-list": { label: "Prioritized fixes", Icon: ListChecks },
  metadata: { label: "Metadata & social", Icon: ImageIcon },
  brief: { label: "Content brief", Icon: FileText },
  ticket: { label: "Dev tickets", Icon: GitPullRequest },
}

const statusMeta: Record<AiTask["status"], string> = {
  ready: "bg-primary/15 text-primary",
  drafting: "bg-warning/15 text-warning",
  review: "bg-chart-5/20 text-foreground/80",
  applied: "bg-success/15 text-success",
}

export function AiTasksList({ limit }: { limit?: number }) {
  const items = limit ? aiTasks.slice(0, limit) : aiTasks
  return (
    <ul className="space-y-2">
      {items.map((t) => {
        const project = projectById(t.projectId)
        const { Icon, label } = kindMeta[t.kind]
        return (
          <li key={t.id}>
            <Link
              href={`/projects/${t.projectId}/ai`}
              className="group flex items-center gap-3 rounded-lg border border-border bg-card/40 hover:bg-card hover:border-primary/40 transition-colors p-3"
            >
              <div className="size-9 shrink-0 rounded-md bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center text-primary">
                <Icon className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium truncate">{t.title}</span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium",
                      statusMeta[t.status],
                    )}
                  >
                    {t.status}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2 flex-wrap">
                  <span>{project?.name}</span>
                  <span aria-hidden>·</span>
                  <span>{label}</span>
                  <span aria-hidden>·</span>
                  <span className="tabular">{t.pagesAffected.toLocaleString()} pages</span>
                  <span aria-hidden>·</span>
                  <span>
                    Impact <span className="capitalize text-foreground/80">{t.impact}</span>
                  </span>
                  <span aria-hidden>·</span>
                  <span>Effort {t.effort}</span>
                </div>
              </div>
              {/* Which engines this insight is most relevant to —
                  lets users scan the queue by AI surface at a glance. */}
              <EngineRow
                engines={projectEngines(t.projectId).slice(0, 4)}
                size={14}
                max={4}
                ringClassName="ring-card"
                className="hidden sm:block shrink-0"
                label="AI engines this insight applies to"
              />
              <ArrowRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
