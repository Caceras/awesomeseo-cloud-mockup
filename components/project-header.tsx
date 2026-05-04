"use client"

import Link from "next/link"
import { ChevronRight, Globe2, Play, Search, MoreHorizontal } from "lucide-react"
import type { Project } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AwesomeLogo } from "@/components/awesome-logo"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Big-brand project header — mirrors the extension's identity row:
// large gradient mark, bold project name, tagline subtitle, and a
// Starting URL input on the right for one-click re-crawls.

export function ProjectHeader({ project }: { project: Project }) {
  return (
    <div className="space-y-5">
      <nav
        className="text-xs text-muted-foreground flex items-center gap-1.5"
        aria-label="Breadcrumb"
      >
        <Link href="/projects" className="hover:text-foreground">
          Projects
        </Link>
        <ChevronRight className="size-3" />
        <span className="text-foreground">{project.name}</span>
      </nav>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <AwesomeLogo size={56} className="rounded-2xl shadow-sm" />
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight truncate">
              {project.name}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5 inline-flex items-center gap-1.5">
              <Globe2 className="size-3.5 shrink-0" />
              <span className="truncate">
                {project.domain} — premium crawl workspace for technical, social,
                and content SEO
              </span>
            </p>
          </div>
        </div>

        {/* Mobile: input fills the row, buttons sit below.
            Tablet+: input stays compact and sits next to the actions. */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:flex-wrap lg:shrink-0">
          <div className="relative w-full sm:flex-1 sm:min-w-56 lg:w-72 lg:flex-none">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
              aria-hidden
            />
            <Input
              type="url"
              defaultValue={`https://${project.domain}`}
              placeholder="Starting URL"
              aria-label="Starting URL"
              className="pl-9 bg-background/60 border-border h-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button size="default" className="flex-1 sm:flex-none">
              <Play className="size-4" />
              Run crawl
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-transparent size-10 shrink-0"
                  aria-label="More project actions"
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Open in extension</DropdownMenuItem>
                <DropdownMenuItem>Share read-only link</DropdownMenuItem>
                <DropdownMenuItem>Export latest crawl</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  Delete project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}
