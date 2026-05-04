import { Plus, Copy, Trash2, Chrome, CheckCircle2, KeyRound } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { apiKeys, currentUser } from "@/lib/mock-data"

const notificationPrefs = [
  {
    label: "Crawl finished",
    description: "Email when any cloud crawl completes successfully.",
    on: true,
  },
  {
    label: "Crawl failed",
    description: "Email and Slack ping when a crawl errors out.",
    on: true,
  },
  {
    label: "Health drop > 5 points",
    description: "Get notified when a project's health drops sharply.",
    on: true,
  },
  {
    label: "AI fix ready for review",
    description: "When an AI workflow finishes drafting and is ready to ship.",
    on: false,
  },
  {
    label: "Weekly digest",
    description: "Monday morning summary of all projects.",
    on: true,
  },
]

export default function AccountSettings() {
  return (
    <AppShell>
      <div className="px-4 lg:px-8 py-6 lg:py-8 space-y-8 max-w-3xl">
        <PageHeader
          title="Account settings"
          description="Personal profile, integrations, API keys, and notification preferences."
        />

        {/* Profile */}
        <section className="rounded-xl border border-border bg-card p-6 space-y-5">
          <header>
            <h2 className="font-medium">Profile</h2>
            <p className="text-xs text-muted-foreground">
              Visible to your teammates and on shared client links.
            </p>
          </header>
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback className="bg-primary/20 text-primary text-lg font-semibold">
                {currentUser.name
                  .split(" ")
                  .map((p) => p[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="bg-transparent">
                Upload photo
              </Button>
              <Button variant="ghost" size="sm">
                Remove
              </Button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" defaultValue={currentUser.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={currentUser.email} />
            </div>
          </div>
        </section>

        {/* Extension */}
        <section className="rounded-xl border border-border bg-card p-6 space-y-4">
          <header>
            <h2 className="font-medium">Chrome extension</h2>
            <p className="text-xs text-muted-foreground">
              Pair the extension to sync local crawls with this workspace.
            </p>
          </header>
          <div className="flex items-center gap-4 rounded-lg border border-success/30 bg-success/5 p-4">
            <span className="size-10 rounded-md bg-success/15 text-success flex items-center justify-center">
              <Chrome className="size-5" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium flex items-center gap-2">
                Connected as {currentUser.name}
                <CheckCircle2 className="size-4 text-success" />
              </div>
              <div className="text-xs text-muted-foreground">
                v1.4.2 · last sync 4 minutes ago · 3 devices
              </div>
            </div>
            <Button variant="outline" size="sm" className="bg-transparent">
              Manage devices
            </Button>
          </div>
        </section>

        {/* API keys */}
        <section className="rounded-xl border border-border bg-card overflow-hidden">
          <header className="flex items-center justify-between p-5 border-b border-border">
            <div>
              <h2 className="font-medium flex items-center gap-2">
                <KeyRound className="size-4" />
                API keys
              </h2>
              <p className="text-xs text-muted-foreground">
                Programmatic access to crawls, issues, and AI workflows.
              </p>
            </div>
            <Button size="sm">
              <Plus className="size-4" />
              New key
            </Button>
          </header>
          <ul className="divide-y divide-border">
            {apiKeys.map((k) => (
              <li key={k.id} className="px-5 py-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{k.name}</div>
                  <div className="text-xs text-muted-foreground font-mono mt-0.5">{k.preview}</div>
                </div>
                <div className="hidden sm:block text-xs text-muted-foreground tabular">
                  Last used{" "}
                  {k.lastUsedAt
                    ? new Date(k.lastUsedAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })
                    : "—"}
                </div>
                <Button size="icon" variant="ghost" aria-label="Copy key">
                  <Copy className="size-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Revoke key"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
        </section>

        {/* Notifications */}
        <section className="rounded-xl border border-border bg-card p-6 space-y-4">
          <header>
            <h2 className="font-medium">Notifications</h2>
            <p className="text-xs text-muted-foreground">
              Per-event preferences. Configure delivery channels on the integrations page.
            </p>
          </header>
          <ul className="divide-y divide-border -mx-2">
            {notificationPrefs.map((p) => (
              <li key={p.label} className="flex items-center gap-4 px-2 py-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{p.label}</div>
                  <div className="text-xs text-muted-foreground">{p.description}</div>
                </div>
                <Switch defaultChecked={p.on} />
              </li>
            ))}
          </ul>
        </section>

        {/* Sign out / delete */}
        <section className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 space-y-3">
          <header>
            <h2 className="font-medium text-destructive">Delete account</h2>
            <p className="text-xs text-muted-foreground">
              This permanently removes your profile, API keys, and all owned workspaces.
            </p>
          </header>
          <Button variant="destructive">Delete my account</Button>
        </section>
      </div>
    </AppShell>
  )
}
