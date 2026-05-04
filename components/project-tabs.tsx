"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

// Frame-indicator tabs that mirror the extension exactly: the active
// tab is wrapped with a pink top + side border and rounded top corners,
// merging visually into the content below. Inactive tabs sit on the
// shared baseline rule.

export function ProjectTabs({ projectId }: { projectId: string }) {
  const pathname = usePathname()
  const tabs = [
    { href: `/projects/${projectId}`, label: "Dashboard", exact: true },
    { href: `/projects/${projectId}/inventory`, label: "Page Inventory" },
    { href: `/projects/${projectId}/issues`, label: "Issues" },
    { href: `/projects/${projectId}/performance`, label: "Performance" },
    { href: `/projects/${projectId}/social`, label: "Social" },
    { href: `/projects/${projectId}/schema`, label: "Schema" },
    { href: `/projects/${projectId}/topics`, label: "Topics" },
    { href: `/projects/${projectId}/search`, label: "Google" },
    { href: `/projects/${projectId}/ai-visibility`, label: "AI Visibility" },
    { href: `/projects/${projectId}/graph`, label: "Link Graph" },
    { href: `/projects/${projectId}/ai`, label: "AI Insights" },
    { href: `/projects/${projectId}/export`, label: "Export" },
    { href: `/projects/${projectId}/settings`, label: "Settings" },
  ]

  return (
    <div className="relative">
      {/* Shared baseline rule that the active tab visually breaks */}
      <div
        className="absolute left-0 right-0 bottom-0 h-px bg-border pointer-events-none"
        aria-hidden
      />
      <nav
        className="relative flex gap-1 overflow-x-auto scrollbar-thin pt-1"
        aria-label="Project sections"
      >
        {tabs.map((t) => {
          const active = t.exact
            ? pathname === t.href
            : pathname === t.href || pathname.startsWith(t.href + "/")
          return (
            <Link
              key={t.href}
              href={t.href}
              className={cn(
                "relative shrink-0 px-4 py-2.5 text-sm font-medium whitespace-nowrap rounded-t-lg transition-colors",
                active
                  ? "text-foreground border-t border-l border-r border-primary/70 bg-card"
                  : "text-muted-foreground hover:text-foreground border-t border-l border-r border-transparent",
              )}
              aria-current={active ? "page" : undefined}
            >
              {t.label}
              {active && (
                // Cover the baseline rule under the active tab so the frame
                // visually merges into the content below.
                <span
                  className="absolute -bottom-px left-0 right-0 h-px bg-card"
                  aria-hidden
                />
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
