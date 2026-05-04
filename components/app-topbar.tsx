"use client"

import Link from "next/link"
import {
  Search,
  Bell,
  Plus,
  Chrome,
  CheckCircle2,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AppSidebarContent } from "@/components/app-sidebar"
import { currentUser } from "@/lib/mock-data"
import { Kbd } from "@/components/ui/kbd"

export function AppTopbar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 backdrop-blur-md px-4 lg:px-6">
      {/* Mobile menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72 bg-sidebar">
          <AppSidebarContent />
        </SheetContent>
      </Sheet>

      {/* Search */}
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder="Search projects, pages, issues…"
          // `inputMode=search` triggers the dedicated search keyboard
          // on iOS/Android (no autocomplete bar, return key is "Search").
          // `enterKeyHint=search` makes the same return-key affordance
          // explicit on Chrome/Android. Together they save the user a
          // tap on every search and feel native on mobile.
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className="pl-9 pr-16 bg-card/60 border-border h-9"
        />
        <Kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:inline-flex">
          ⌘K
        </Kbd>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Extension status pill */}
        <Link
          href="/onboarding"
          className="hidden md:inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-medium text-success hover:bg-success/15 transition-colors"
          aria-label="Chrome extension is connected"
        >
          <Chrome className="size-3.5" aria-hidden />
          Extension connected
          <CheckCircle2 className="size-3.5" aria-hidden />
        </Link>

        {/* New crawl */}
        <Button size="sm" className="hidden sm:inline-flex">
          <Plus className="size-4" />
          New crawl
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="size-5" />
              <Badge className="absolute -top-0.5 -right-0.5 size-4 p-0 flex items-center justify-center text-[10px]">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              <span className="text-xs text-muted-foreground font-normal">3 new</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <div className="text-sm">Kindred Co. crawl failed at 06:02</div>
              <div className="text-xs text-muted-foreground">2 minutes ago</div>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <div className="text-sm">12 new fixes ready in Northwind</div>
              <div className="text-xs text-muted-foreground">14 minutes ago</div>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <div className="text-sm">Aria Commerce dropped to 64 health</div>
              <div className="text-xs text-muted-foreground">1 hour ago</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Account menu">
              <Avatar className="size-8">
                {/* Real headshot when present; the AvatarFallback below
                    keeps initials as a graceful network/error fallback. */}
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                  {currentUser.name
                    .split(" ")
                    .map((p) => p[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col gap-0.5">
              <span className="text-sm">{currentUser.name}</span>
              <span className="text-xs font-normal text-muted-foreground">
                {currentUser.email}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* prefetch={false} on low-traffic destinations: these are
                hovered every time the user opens the avatar dropdown, but
                navigated to maybe 1× per session — letting Next.js prefetch
                three additional route bundles on every dropdown open is
                pure waste, especially on mobile data. */}
            <DropdownMenuItem asChild>
              <Link href="/settings" prefetch={false}>
                Account settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/billing" prefetch={false}>
                Billing
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/team" prefetch={false}>
                Team
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
