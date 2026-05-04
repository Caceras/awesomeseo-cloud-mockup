import {
  FileSpreadsheet,
  FileJson,
  FileCode2,
  Share2,
  Mail,
  Webhook,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const formats = [
  {
    icon: FileSpreadsheet,
    name: "CSV / Excel",
    description: "Page inventory and issues, ready for filtering in Sheets or Excel.",
    rows: "1,284 rows",
    cta: "Download .csv",
  },
  {
    icon: FileJson,
    name: "JSON",
    description: "Full crawl payload — every metric the extension captures, with stable schema.",
    rows: "1,284 records",
    cta: "Download .json",
  },
  {
    icon: FileCode2,
    name: "JSON-LD bundle",
    description: "Schema.org payloads suggested per page. Drop into your CMS or test in Rich Results.",
    rows: "318 entries",
    cta: "Download .jsonld",
  },
]

const integrations = [
  {
    icon: Mail,
    name: "Email weekly digest",
    description: "Top fixes, week-over-week health, and AI summaries delivered to your team.",
    enabled: true,
  },
  {
    icon: Webhook,
    name: "Webhook on crawl finish",
    description: "POST a JSON payload to your URL after every cloud crawl.",
    enabled: false,
  },
  {
    icon: Share2,
    name: "Share read-only client link",
    description: "Public URL with optional password — useful for client reporting.",
    enabled: true,
  },
]

export default function ExportPage() {
  return (
    <div className="mx-auto max-w-5xl py-10 space-y-10">
      <header className="max-w-3xl">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">
          Export &amp; share
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          How do I get my data out?
        </h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Take the latest crawl out of AwesomeSEO into your stack — or share a
          read-only view with stakeholders.
        </p>
      </header>

      {/* Download formats */}
      <section className="grid gap-4 md:grid-cols-3">
        {formats.map((f) => (
          <article
            key={f.name}
            className="rounded-xl border border-border bg-card p-5 flex flex-col"
          >
            <span className="size-10 rounded-lg bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center text-primary">
              <f.icon className="size-5" />
            </span>
            <h3 className="font-medium mt-4">{f.name}</h3>
            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed flex-1 text-pretty">
              {f.description}
            </p>
            <div className="text-xs text-muted-foreground tabular mt-3">{f.rows}</div>
            <Button size="sm" variant="outline" className="bg-transparent mt-3 w-fit">
              {f.cta}
              <ArrowRight className="size-3.5" />
            </Button>
          </article>
        ))}
      </section>

      {/* Integrations */}
      <section className="space-y-3">
        <h3 className="font-medium">Automated delivery</h3>
        <ul className="rounded-xl border border-border bg-card divide-y divide-border">
          {integrations.map((i) => (
            <li key={i.name} className="p-5 flex items-center gap-4">
              <span className="size-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                <i.icon className="size-4" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-sm">{i.name}</h4>
                  {i.enabled ? (
                    <span className="rounded-full bg-success/15 text-success text-[10px] uppercase tracking-wider px-1.5 py-0.5 font-medium">
                      Enabled
                    </span>
                  ) : null}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {i.description}
                </p>
              </div>
              <Button size="sm" variant="outline" className="bg-transparent">
                {i.enabled ? "Configure" : "Enable"}
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
