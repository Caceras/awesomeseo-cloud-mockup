import { Plus, MoreHorizontal, Mail } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { members } from "@/lib/mock-data"

const roleColor: Record<string, string> = {
  owner: "bg-primary/15 text-primary border-primary/30",
  admin: "bg-warning/15 text-warning border-warning/30",
  editor: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  viewer: "bg-muted text-muted-foreground border-border",
}

const formatRelative = (iso: string) => {
  const d = new Date(iso)
  const diff = Date.now() - d.getTime()
  const mins = Math.round(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.round(hrs / 24)}d ago`
}

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")

const pendingInvites = [
  { email: "design@kindred.co", role: "viewer", sentAt: "2 days ago" },
  { email: "growth@halcyon.press", role: "editor", sentAt: "5 days ago" },
]

export default function TeamPage() {
  return (
    <AppShell>
      <div className="px-4 lg:px-8 py-6 lg:py-8 space-y-8">
        <PageHeader
          title="Team"
          description="Manage who has access to this workspace and what they can do."
          actions={
            <Button>
              <Plus className="size-4" />
              Invite members
            </Button>
          }
        />

        {/* Roles legend */}
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-medium mb-3">Roles</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <div className="space-y-0.5">
              <div className="font-medium text-primary">Owner</div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Full access including billing and workspace deletion.
              </p>
            </div>
            <div className="space-y-0.5">
              <div className="font-medium text-warning">Admin</div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Manage projects, members, and integrations. No billing.
              </p>
            </div>
            <div className="space-y-0.5">
              <div className="font-medium text-chart-2">Editor</div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Run crawls, apply AI fixes, comment on issues.
              </p>
            </div>
            <div className="space-y-0.5">
              <div className="font-medium text-muted-foreground">Viewer</div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Read-only — useful for clients and stakeholders.
              </p>
            </div>
          </div>
        </section>

        {/* Members table */}
        <section className="rounded-xl border border-border bg-card overflow-hidden">
          <header className="flex items-center justify-between p-5 border-b border-border">
            <div>
              <h2 className="font-medium">Members</h2>
              <p className="text-xs text-muted-foreground">
                {members.length} active · 2 pending invites
              </p>
            </div>
          </header>
          <ul className="divide-y divide-border">
            {members.map((m) => (
              <li key={m.id} className="px-5 py-4 flex items-center gap-4">
                <Avatar className="size-10">
                  <AvatarFallback className="bg-primary/15 text-primary text-xs font-semibold">
                    {initials(m.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{m.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{m.email}</div>
                </div>
                <span
                  className={`hidden md:inline-flex items-center text-[11px] uppercase tracking-wider rounded-full border px-2 py-0.5 font-medium capitalize ${roleColor[m.role]}`}
                >
                  {m.role}
                </span>
                <span className="hidden lg:block text-xs text-muted-foreground tabular w-20 text-right">
                  {formatRelative(m.lastActive)}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost" aria-label={`Manage ${m.name}`}>
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Change role…</DropdownMenuItem>
                    <DropdownMenuItem>Resend invite</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            ))}
          </ul>
        </section>

        {/* Pending invites */}
        <section className="rounded-xl border border-border bg-card overflow-hidden">
          <header className="p-5 border-b border-border">
            <h2 className="font-medium">Pending invites</h2>
          </header>
          <ul className="divide-y divide-border">
            {pendingInvites.map((inv) => (
              <li key={inv.email} className="px-5 py-4 flex items-center gap-4">
                <span className="size-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  <Mail className="size-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{inv.email}</div>
                  <div className="text-xs text-muted-foreground">Sent {inv.sentAt}</div>
                </div>
                <Badge variant="outline" className="capitalize">
                  {inv.role}
                </Badge>
                <Button size="sm" variant="outline" className="bg-transparent">
                  Resend
                </Button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  )
}
