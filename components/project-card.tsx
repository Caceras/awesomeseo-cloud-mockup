import Link from "next/link"
import { ExternalLink } from "lucide-react"
import type { Project } from "@/lib/mock-data"
import { EngineRow, projectEngines } from "@/components/engine-logos"
import { ProjectAvatar } from "@/components/project-avatar"
import { cn } from "@/lib/utils"

export function ProjectCard({ project }: { project: Project }) {
  const healthColor =
    project.health >= 80 ? "text-success" : project.health >= 60 ? "text-warning" : "text-destructive"

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group relative flex flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
    >
      <div className="flex items-start gap-3">
        <ProjectAvatar project={project} size={40} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-medium truncate">{project.name}</h3>
            <ExternalLink className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-xs text-muted-foreground truncate">{project.domain}</p>
        </div>
        <div className="text-right">
          <div className={cn("text-2xl font-semibold tabular leading-none", healthColor)}>
            {project.health}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
            health
          </div>
        </div>
      </div>

      {/* Health bar */}
      <div className="h-1 rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full",
            project.health >= 80
              ? "bg-success"
              : project.health >= 60
                ? "bg-warning"
                : "bg-destructive",
          )}
          style={{ width: `${project.health}%` }}
        />
      </div>

      {/* Tracked AI engines — communicates that visibility is monitored
          across all major answer surfaces, not just Google. */}
      <div className="flex items-center gap-2.5 pt-0.5">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Tracked
        </span>
        <EngineRow
          engines={projectEngines(project.id)}
          size={16}
          max={5}
          ringClassName="ring-card"
          label="AI engines tracked for this project"
        />
      </div>
    </Link>
  )
}
