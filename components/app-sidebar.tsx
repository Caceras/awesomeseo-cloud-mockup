"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FolderKanban,
  Sparkles,
  CalendarClock,
  Users,
  CreditCard,
  Settings2,
  LifeBuoy,
  ChevronsUpDown,
  Plus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { AwesomeLogo } from "@/components/awesome-logo"
import { ResearchCarousel } from "@/components/research-carousel"
import { ProjectAvatar } from "@/components/project-avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { currentUser, projects } from "@/lib/mock-data"

const primaryNav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/ai", label: "AI Insights", icon: Sparkles },
  { href: "/schedules", label: "Schedules", icon: CalendarClock },
]

const workspaceNav = [
  { href: "/team", label: "Team", icon: Users },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings2 },
]

/**
 * Inner sidebar content. Always visible — used both in the lg+ AppSidebar
 * wrapper and inside the mobile Sheet drawer so the drawer is never empty.
 */
export function AppSidebarContent() {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/")

  return (
    <div className="flex h-full w-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Workspace switcher */}
      <div className="px-3 pt-4 pb-3 border-b border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="w-full flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-sidebar-accent transition-colors text-left"
              aria-label="Switch workspace"
            >
              <AwesomeLogo size={36} className="rounded-lg" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{currentUser.workspace}</div>
                <div className="text-xs text-muted-foreground capitalize">
                  {currentUser.plan} plan
                </div>
              </div>
              <ChevronsUpDown className="size-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-60">
            <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
            <DropdownMenuItem>Northwind Studio</DropdownMenuItem>
            <DropdownMenuItem>Aria Commerce</DropdownMenuItem>
            <DropdownMenuItem>Personal</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Plus className="size-4" /> New workspace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {primaryNav.map(({ href, label, icon: Icon, exact }) => (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive(href, exact)
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="size-4" aria-hidden />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Pinned projects */}
        <div className="mt-6">
          <div className="px-3 mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Pinned projects
          </div>
          <ul className="space-y-0.5">
            {projects.slice(0, 4).map((p) => (
              <li key={p.id}>
                <Link
                  href={`/projects/${p.id}`}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive(`/projects/${p.id}`)
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <ProjectAvatar project={p} size={20} />
                  <span className="flex-1 truncate">{p.name}</span>
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      p.health >= 80
                        ? "bg-success"
                        : p.health >= 60
                          ? "bg-warning"
                          : "bg-destructive",
                    )}
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <div className="px-3 mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Workspace
          </div>
          <ul className="space-y-0.5">
            {workspaceNav.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  // Workspace nav items (Team, Billing, Settings) are
                  // visited rarely compared to Dashboard / Projects /
                  // AI Insights / Schedules — skip the speculative
                  // prefetch so we don't pay 3 extra route-bundle
                  // downloads on every first sidebar render.
                  prefetch={false}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive(href)
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                  <span>{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3 space-y-2">
        <Link
          href="/onboarding"
          // Onboarding is a one-time visit per user — never prefetch.
          prefetch={false}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent transition-colors"
        >
          <LifeBuoy className="size-4" aria-hidden />
          <span>Onboarding & docs</span>
        </Link>
        {/* Two industry research cards rotating on a timer — replaces
            the generic upgrade-plan card with on-brand context for an
            AI-visibility product. The carousel pauses on hover and is
            fully static under prefers-reduced-motion. */}
        <ResearchCarousel />
      </div>
    </div>
  )
}

/**
 * Desktop wrapper for the sidebar. Hides itself on screens < lg; the mobile
 * Sheet in AppTopbar renders <AppSidebarContent /> directly so it stays
 * visible inside the drawer.
 */
export function AppSidebar() {
  return (
    <aside className="hidden lg:flex w-64 shrink-0 border-r border-sidebar-border">
      <AppSidebarContent />
    </aside>
  )
}
