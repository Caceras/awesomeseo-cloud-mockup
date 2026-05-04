import { notFound } from "next/navigation"
import { AppShell } from "@/components/app-shell"
import { ProjectHeader } from "@/components/project-header"
import { ProjectTabs } from "@/components/project-tabs"
import { projectById } from "@/lib/mock-data"

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = projectById(id)
  if (!project) notFound()

  return (
    <AppShell
      chatContext={{
        domain: project.domain,
        niche: "technical, content and AI-visibility SEO",
        suggestions: [
          "Summarise what changed since the last crawl",
          `Which pages on ${project.domain} are losing AI citations?`,
          "Show pages with the worst Core Web Vitals",
          "What should I fix first to move my health score?",
        ],
      }}
    >
      {/* Sticky identity + tabs */}
      <div className="sticky top-0 z-20 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="px-4 lg:px-8 pt-5 space-y-4">
          <ProjectHeader project={project} />
          <ProjectTabs projectId={id} />
        </div>
      </div>

      {/* Each tab manages its own max-width + vertical rhythm. */}
      <div className="px-4 lg:px-8">{children}</div>
    </AppShell>
  )
}
