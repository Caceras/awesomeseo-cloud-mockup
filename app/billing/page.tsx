import { Check, Download, ChevronRight, Sparkles } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UsagePanel } from "@/components/usage-panel"
import { currentUser } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 19,
    description: "For freelancers and side projects.",
    features: ["1 project", "5,000 pages / month", "Weekly cloud crawls", "200 AI credits", "1 seat"],
    cta: "Switch to Starter",
    current: false,
  },
  {
    id: "growth",
    name: "Growth",
    price: 79,
    description: "For agencies and growing teams.",
    features: [
      "10 projects",
      "25,000 pages / month",
      "Daily cloud crawls",
      "2,000 AI credits",
      "10 seats",
      "Read-only client share links",
    ],
    cta: "Current plan",
    current: true,
    badge: "Most popular",
  },
  {
    id: "scale",
    name: "Scale",
    price: 249,
    description: "For SEO teams operating at scale.",
    features: [
      "Unlimited projects",
      "250,000 pages / month",
      "Hourly cloud crawls",
      "Unlimited AI credits",
      "Unlimited seats",
      "SAML SSO + audit log",
      "Priority support",
    ],
    cta: "Upgrade to Scale",
    current: false,
  },
]

const invoices = [
  { id: "INV-2026-05", date: "May 1, 2026", amount: 79, status: "Paid" },
  { id: "INV-2026-04", date: "Apr 1, 2026", amount: 79, status: "Paid" },
  { id: "INV-2026-03", date: "Mar 1, 2026", amount: 79, status: "Paid" },
  { id: "INV-2026-02", date: "Feb 1, 2026", amount: 79, status: "Paid" },
]

export default function BillingPage() {
  return (
    <AppShell>
      <div className="px-4 lg:px-8 py-6 lg:py-8 space-y-8">
        <PageHeader
          title="Billing & subscription"
          description="Manage your plan, monitor usage, and download invoices. Annual billing saves 20%."
        />

        {/* Current plan summary + usage */}
        <section className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-6 relative overflow-hidden">
            <div className="absolute -right-16 -top-20 size-56 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
            <div className="relative flex flex-col sm:flex-row sm:items-end gap-4 sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
                  <Sparkles className="size-3.5 text-primary" />
                  Current plan
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <h2 className="text-3xl font-semibold tracking-tight">Growth</h2>
                  <span className="text-muted-foreground">$79 / mo</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1.5 max-w-md leading-relaxed">
                  Renews on June 1, 2026 · billed monthly to •••• 4242
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" className="bg-transparent">
                  Switch to annual
                </Button>
                <Button>Upgrade plan</Button>
              </div>
            </div>
          </div>
          <UsagePanel />
        </section>

        {/* Plans grid */}
        <section className="space-y-4">
          <header>
            <h2 className="text-lg font-medium">Plans</h2>
            <p className="text-xs text-muted-foreground">All plans include the Chrome extension.</p>
          </header>
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((p) => (
              <article
                key={p.id}
                className={cn(
                  "rounded-xl border p-6 flex flex-col bg-card",
                  p.current ? "border-primary/40 ring-1 ring-primary/20" : "border-border",
                )}
              >
                <header className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-medium">{p.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.description}</p>
                  </div>
                  {p.badge ? <Badge>{p.badge}</Badge> : null}
                </header>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-semibold tabular tracking-tight">${p.price}</span>
                  <span className="text-sm text-muted-foreground">/ mo</span>
                </div>
                <ul className="space-y-2 mt-5 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="text-sm flex items-start gap-2">
                      <Check className="size-4 text-success shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-6 w-full"
                  variant={p.current ? "outline" : "default"}
                  disabled={p.current}
                >
                  {p.cta}
                </Button>
              </article>
            ))}
          </div>
        </section>

        {/* Payment method */}
        <section className="rounded-xl border border-border bg-card p-6">
          <header className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-medium">Payment method</h2>
              <p className="text-xs text-muted-foreground">Used for monthly renewals.</p>
            </div>
            <Button variant="outline" size="sm" className="bg-transparent">
              Update
            </Button>
          </header>
          <div className="flex items-center gap-3">
            <span className="size-10 rounded-md bg-gradient-to-br from-primary/30 to-primary/10 ring-1 ring-primary/20 flex items-center justify-center text-xs font-semibold tracking-wider">
              VISA
            </span>
            <div>
              <div className="text-sm">Visa ending in 4242</div>
              <div className="text-xs text-muted-foreground">Expires 09 / 2028 · {currentUser.name}</div>
            </div>
          </div>
        </section>

        {/* Invoices */}
        <section className="rounded-xl border border-border bg-card">
          <header className="flex items-center justify-between p-5 border-b border-border">
            <div>
              <h2 className="font-medium">Invoice history</h2>
              <p className="text-xs text-muted-foreground">Last 12 months.</p>
            </div>
            <Button variant="ghost" size="sm">
              View all
              <ChevronRight className="size-3.5" />
            </Button>
          </header>
          <ul className="divide-y divide-border">
            {invoices.map((inv) => (
              <li key={inv.id} className="p-4 px-5 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-mono">{inv.id}</div>
                  <div className="text-xs text-muted-foreground">{inv.date}</div>
                </div>
                <div className="text-sm tabular">${inv.amount.toFixed(2)}</div>
                <span className="text-xs rounded-full bg-success/15 text-success px-2 py-0.5">
                  {inv.status}
                </span>
                <Button size="icon" variant="ghost" aria-label="Download invoice">
                  <Download className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  )
}
