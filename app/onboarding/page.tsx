import Link from "next/link"
import { Chrome, Globe, Sparkles, Users, CheckCircle2, ArrowRight, Triangle, Play } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { currentUser } from "@/lib/mock-data"

const steps = [
  {
    n: 1,
    title: "Install the Chrome extension",
    description:
      "AwesomeSEO works two ways — local crawls in your browser via the extension, and scaled cloud crawls from this dashboard. Install the extension once, sign in, and the two stay in sync.",
    Icon: Chrome,
    state: "done" as const,
  },
  {
    n: 2,
    title: "Connect your first site",
    description:
      "Add a starting URL or paste an existing sitemap. We'll discover the rest. You can always change scope later in project settings.",
    Icon: Globe,
    state: "current" as const,
  },
  {
    n: 3,
    title: "Run your first crawl",
    description:
      "Use the active tab from the extension, or kick off a cloud crawl that runs while you sleep. The first crawl is free.",
    Icon: Play,
    state: "todo" as const,
  },
  {
    n: 4,
    title: "Invite your team",
    description:
      "Owners, admins, editors, and viewers — assign per project so contractors and clients only see what they need.",
    Icon: Users,
    state: "todo" as const,
  },
  {
    n: 5,
    title: "Turn on AI workflows",
    description:
      "Prioritized fix lists, metadata generation, content briefs, and developer tickets — driven by your latest crawl and your brand voice.",
    Icon: Sparkles,
    state: "todo" as const,
  },
]

export default function OnboardingPage() {
  const completed = steps.filter((s) => s.state === "done").length
  const pct = Math.round((completed / steps.length) * 100)
  return (
    <AppShell>
      <div className="px-4 lg:px-8 py-8 lg:py-12">
        <div className="mx-auto max-w-3xl space-y-8">
          {/* Hero */}
          <header className="text-center space-y-3">
            <div className="mx-auto size-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground">
              <Triangle className="size-6 fill-current" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
              Welcome to AwesomeSEO Cloud
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed text-pretty">
              Five quick steps to a production-grade SEO workflow. Each takes under a minute and you
              can pause anywhere — your progress is saved.
            </p>
            <div className="max-w-sm mx-auto pt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                <span>
                  {completed} of {steps.length} complete
                </span>
                <span className="tabular">{pct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </header>

          {/* Steps */}
          <ol className="space-y-3">
            {steps.map((s) => (
              <li
                key={s.n}
                className={`rounded-xl border p-5 transition-colors ${
                  s.state === "current"
                    ? "border-primary/40 bg-card ring-1 ring-primary/20"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`size-10 shrink-0 rounded-lg flex items-center justify-center ${
                      s.state === "done"
                        ? "bg-success/15 text-success"
                        : s.state === "current"
                          ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {s.state === "done" ? <CheckCircle2 className="size-5" /> : <s.Icon className="size-5" />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="font-medium">
                        <span className="text-muted-foreground tabular mr-2">0{s.n}</span>
                        {s.title}
                      </h2>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed text-pretty">
                      {s.description}
                    </p>

                    {s.state === "current" ? (
                      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] items-end">
                        <div className="space-y-2">
                          <Label htmlFor="start-url">Starting URL or domain</Label>
                          <Input id="start-url" placeholder="https://example.com" />
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" className="bg-transparent">
                            Use active tab
                          </Button>
                          <Button>
                            Connect
                            <ArrowRight className="size-4" />
                          </Button>
                        </div>
                      </div>
                    ) : null}

                    {s.state === "done" ? (
                      <div className="mt-3 inline-flex items-center gap-2 text-xs text-success">
                        <CheckCircle2 className="size-3.5" />
                        Extension v1.4.2 connected as {currentUser.name}
                      </div>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button variant="ghost" asChild>
              <Link href="/">Skip for now</Link>
            </Button>
            <Button asChild>
              <Link href="/">
                Go to dashboard
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
