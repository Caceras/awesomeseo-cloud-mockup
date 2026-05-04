import { Maximize2, Filter } from "lucide-react"
import { LazyLinkGraph } from "@/components/link-graph-lazy"
import { Button } from "@/components/ui/button"

// One question: how does internal linking flow on this site?

export default function GraphPage() {
  return (
    <div className="py-10 space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Link graph
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            How does internal linking flow?
          </h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Each node is a page sized by inbound links. Clusters become hubs;
            disconnected nodes are orphans. Click any node to inspect its links.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-transparent">
            <Filter className="size-4" /> Filters
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent">
            <Maximize2 className="size-4" /> Fullscreen
          </Button>
        </div>
      </header>

      {/* Inline summary as a strip, not card grid */}
      <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm border-y border-border py-4">
        <Stat label="Internal links" value="3,182" />
        <Stat label="Avg outbound / page" value="14" />
        <Stat label="Orphan pages" value="8" tone="warn" />
        <Stat label="Broken targets" value="2" tone="bad" />
      </div>

      <LazyLinkGraph />
    </div>
  )
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone?: "warn" | "bad"
}) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div
        className={
          "mt-0.5 text-xl font-semibold tabular " +
          (tone === "bad"
            ? "text-destructive"
            : tone === "warn"
              ? "text-warning"
              : "")
        }
      >
        {value}
      </div>
    </div>
  )
}
