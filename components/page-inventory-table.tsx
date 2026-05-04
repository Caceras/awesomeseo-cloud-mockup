import { cn } from "@/lib/utils"
import type { PageRow } from "@/lib/mock-data"
import { Checkbox } from "@/components/ui/checkbox"

const StatusPill = ({ status }: { status: number }) => {
  const cls =
    status >= 200 && status < 300
      ? "text-success"
      : status >= 300 && status < 400
        ? "text-warning"
        : "text-destructive"
  return <span className={cn("tabular font-mono text-xs", cls)}>{status}</span>
}

const Pill = ({
  state,
  good,
  warn,
}: {
  state: string
  good: string[]
  warn: string[]
}) => {
  const tone = good.includes(state)
    ? "border-success/30 text-success bg-success/10"
    : warn.includes(state)
      ? "border-warning/30 text-warning bg-warning/10"
      : "border-destructive/30 text-destructive bg-destructive/10"
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize",
        tone,
      )}
    >
      {state}
    </span>
  )
}

const Lcp = ({ v }: { v: number }) => {
  const cls = v <= 2.5 ? "text-success" : v <= 4 ? "text-warning" : "text-destructive"
  return <span className={cn("tabular font-mono text-xs", cls)}>{v.toFixed(1)}s</span>
}

export function PageInventoryTable({ rows }: { rows: PageRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
          <tr className="text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
              <th className="text-left px-4 py-3 font-medium w-8">
                <Checkbox aria-label="Select all" />
              </th>
              <th className="text-left px-4 py-3 font-medium min-w-72">URL</th>
              <th className="text-left px-3 py-3 font-medium">Status</th>
              <th className="text-right px-3 py-3 font-medium">Words</th>
              <th className="text-right px-3 py-3 font-medium">Flesch</th>
              <th className="text-right px-3 py-3 font-medium">LCP</th>
              <th className="text-right px-3 py-3 font-medium">Issues</th>
              <th className="text-left px-3 py-3 font-medium">Topic</th>
              <th className="text-left px-3 py-3 font-medium">Indexable</th>
              <th className="text-left px-3 py-3 font-medium">Title</th>
              <th className="text-left px-3 py-3 font-medium">Meta</th>
              <th className="text-left px-3 py-3 font-medium">Canonical</th>
              <th className="text-right px-3 py-3 font-medium">H1</th>
              <th className="text-right px-3 py-3 font-medium">H2</th>
              <th className="text-left px-3 py-3 font-medium">Lang</th>
              <th className="text-right px-3 py-3 font-medium">Hreflang</th>
              <th className="text-left px-4 py-3 font-medium">Schema</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.url}
                className="border-t border-border hover:bg-card/60 transition-colors"
              >
                <td className="px-4 py-3">
                  <Checkbox aria-label={`Select ${r.url}`} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-0.5 max-w-md">
                    <span className="text-foreground font-mono text-xs truncate">{r.url}</span>
                    {r.url !== r.finalUrl ? (
                      <span className="text-[10px] text-muted-foreground font-mono truncate">
                        → {r.finalUrl}
                      </span>
                    ) : null}
                  </div>
                </td>
                <td className="px-3 py-3">
                  <StatusPill status={r.status} />
                </td>
                <td className="px-3 py-3 text-right tabular text-muted-foreground">{r.words}</td>
                <td className="px-3 py-3 text-right tabular text-muted-foreground">
                  {r.flesch || "—"}
                </td>
                <td className="px-3 py-3 text-right">
                  <Lcp v={r.lcp} />
                </td>
                <td className="px-3 py-3 text-right">
                  {r.issues > 0 ? (
                    <span className="inline-flex items-center justify-center min-w-6 rounded-full bg-destructive/15 text-destructive text-xs px-1.5 py-0.5 tabular font-medium">
                      {r.issues}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-xs tabular">0</span>
                  )}
                </td>
                <td className="px-3 py-3 text-muted-foreground text-xs">{r.topic}</td>
                <td className="px-3 py-3">
                  {r.indexable ? (
                    <Pill state="indexable" good={["indexable"]} warn={[]} />
                  ) : (
                    <Pill state="blocked" good={[]} warn={[]} />
                  )}
                </td>
                <td className="px-3 py-3">
                  <Pill state={r.title} good={["ok"]} warn={["long"]} />
                </td>
                <td className="px-3 py-3">
                  <Pill state={r.meta} good={["ok"]} warn={["long"]} />
                </td>
                <td className="px-3 py-3">
                  <Pill state={r.canonical} good={["set", "self"]} warn={[]} />
                </td>
                <td className="px-3 py-3 text-right tabular">
                  <span className={r.h1 === 1 ? "text-success" : "text-destructive"}>{r.h1}</span>
                </td>
                <td className="px-3 py-3 text-right tabular text-muted-foreground">{r.h2}</td>
                <td className="px-3 py-3 text-muted-foreground font-mono text-xs">{r.lang}</td>
                <td className="px-3 py-3 text-right tabular text-muted-foreground">{r.hreflang}</td>
                <td className="px-4 py-3">
                  <Pill state={r.schema} good={["rich"]} warn={["basic"]} />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}
