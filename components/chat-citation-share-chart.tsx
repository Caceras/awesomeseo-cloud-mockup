"use client"

import { BarChart3 } from "lucide-react"
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"
import { engineMeta } from "@/lib/engine-meta"
import { aiEngineStats, type AiEngineKey } from "@/lib/mock-data"

/**
 * Recharts-based share-of-voice chart for the AI flourishes stack.
 *
 * Lives in its own file so {@link components/charts-lazy.tsx} can
 * `next/dynamic`-import it without dragging react-markdown or the rest
 * of the flourishes module into the lazy chunk. Recharts is ~80KB gz
 * and d3 sub-packages add a bit more — splitting it out keeps the
 * initial chat bar bundle lean.
 */

const ENGINES: AiEngineKey[] = [
  "perplexity",
  "chatgpt",
  "claude",
  "copilot",
  "gemini",
]

function statFor(engine: AiEngineKey) {
  return aiEngineStats.find((s) => s.engine === engine)
}

export function CitationShareChart() {
  // Sort by share-of-voice so the chart reads top-down "best to worst".
  const data = ENGINES.map((engine) => {
    const stat = statFor(engine)
    const meta = engineMeta[engine]
    return {
      engine,
      name: meta.name,
      // Display in percent so the axis labels read naturally.
      sov: stat ? Math.round(stat.shareOfVoice * 100) : 0,
      accent: meta.accent,
    }
  }).sort((a, b) => b.sov - a.sov)

  const max = Math.max(...data.map((d) => d.sov), 30)

  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-background/60 shadow-sm">
      <div className="flex items-center gap-1.5 border-b border-border/50 bg-background/40 px-3 py-2 text-[10px] uppercase tracking-wider text-muted-foreground">
        <BarChart3 className="size-3 text-primary" aria-hidden="true" />
        <span>Share of voice by engine</span>
        <span className="ml-auto font-mono normal-case tracking-normal text-foreground/50">
          % of citations
        </span>
      </div>
      <div className="px-2 py-2">
        {/* Fixed height — five rows × ~22px each. ResponsiveContainer
            handles width inside the constrained chat bubble. */}
        <ResponsiveContainer width="100%" height={140}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 36, left: 0, bottom: 4 }}
            barCategoryGap={6}
          >
            <XAxis type="number" hide domain={[0, max]} />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              // Tighter on mobile so the bar area stays usable inside a
              // ~260px chat bubble; recharts measures container width
              // before laying axes out, so a fixed value is fine here.
              width={64}
              tick={{
                fill: "hsl(var(--muted-foreground))",
                fontSize: 11,
              }}
            />
            <Bar
              dataKey="sov"
              radius={[3, 3, 3, 3]}
              // Bar label on the right so users can read the value
              // without a tooltip.
              label={{
                position: "right",
                fill: "hsl(var(--foreground))",
                fontSize: 11,
                fontFamily: "var(--font-mono)",
                formatter: (v: number) => `${v}%`,
              }}
            >
              {data.map((d) => (
                <Cell key={d.engine} fill={d.accent} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
