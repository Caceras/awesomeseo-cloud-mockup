"use client"

import Link from "next/link"
import { ArrowUpRight, Sparkles, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { EngineLogo } from "@/components/engine-logos"
import { engineMeta } from "@/lib/engine-meta"
import { aiEngineStats, type AiEngineKey } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

/**
 * Three AI-SEO signature UI elements that render BENEATH the first 1–2
 * assistant messages. They make the chat feel like a tool, not a generic
 * chatbot, by surfacing patterns from Profound / Otterly / Conductor:
 *
 *   1. SynthesizedRail — per-engine card grid with citation-rate bars
 *      and signed week-over-week deltas. Far more prominent than a
 *      plain pill row; reads like a mini-dashboard widget.
 *
 *   2. CitationShareChart — small Recharts horizontal bar chart of
 *      share-of-voice across the five tracked engines, colored with each
 *      engine's brand accent. The graph anchors the answer in concrete
 *      data and is the visual centerpiece of the flourish stack.
 *
 *   3. ActionChips — deep-link CTAs into the matching workspace tab so
 *      every answer ends in actionable next steps. Routes are picked
 *      from prompt + answer keywords for a reactive feel.
 */

/** Engines listed in citation-rate order so the rail reads "best first". */
const ENGINES: AiEngineKey[] = ["perplexity", "chatgpt", "claude", "copilot", "gemini"]

function statFor(engine: AiEngineKey) {
  return aiEngineStats.find((s) => s.engine === engine)
}

/** Renders a signed delta with up/down arrow + green/red coloring. */
function DeltaPill({ delta }: { delta: number }) {
  const pts = Math.round(delta * 100)
  const isUp = pts > 0
  const isDown = pts < 0
  const Icon = isUp ? TrendingUp : isDown ? TrendingDown : Minus
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 font-mono tabular-nums text-[10.5px] font-medium",
        isUp && "text-emerald-400",
        isDown && "text-rose-400",
        !isUp && !isDown && "text-muted-foreground",
      )}
    >
      <Icon className="size-3" aria-hidden="true" />
      {isUp ? "+" : ""}
      {pts}pt
    </span>
  )
}

export function SynthesizedRail() {
  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-background/60 shadow-sm">
      <div className="flex items-center gap-1.5 border-b border-border/50 bg-background/40 px-3 py-2 text-[10px] uppercase tracking-wider text-muted-foreground">
        <Sparkles className="size-3 text-primary" aria-hidden="true" />
        <span>Synthesized across 5 engines</span>
        <span className="ml-auto font-mono normal-case tracking-normal text-foreground/50">
          last 7 days
        </span>
      </div>
      <ul className="divide-y divide-border/40">
        {ENGINES.map((engine) => {
          const stat = statFor(engine)
          const meta = engineMeta[engine]
          if (!stat) return null
          const pct = Math.round(stat.citationRate * 100)
          return (
            <li
              key={engine}
              className="flex items-center gap-3 px-3 py-2"
              title={`${meta.name} — ${pct}% citation rate, ${stat.citationsThisWeek} citations this week`}
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-white/5">
                <EngineLogo engine={engine} size={14} />
              </span>
              <span className="flex-1 truncate text-[12px] font-medium text-foreground/90">
                {meta.name}
              </span>
              {/* Mini citation-rate bar — width is the percent itself,
                  colored with the engine's brand accent at low alpha so
                  the row feels branded without being loud. */}
              <span
                className="hidden h-1.5 w-24 shrink-0 overflow-hidden rounded-full bg-white/[0.04] sm:block"
                aria-hidden="true"
              >
                <span
                  className="block h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    background: meta.accent,
                  }}
                />
              </span>
              <span className="w-10 shrink-0 text-right font-mono tabular-nums text-[12px] text-foreground">
                {pct}%
              </span>
              <span className="w-12 shrink-0 text-right">
                <DeltaPill delta={stat.delta} />
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// `CitationShareChart` lives in `./chat-citation-share-chart` and is
// imported via `next/dynamic` from `./charts-lazy` so the recharts
// vendor chunk doesn't ship in the initial bundle that the chat bar
// pulls in on every page.

type Action = {
  label: string
  href: string
}

/**
 * Pick 2–3 deep-link actions based on keywords in the user's prompt
 * and the AI's reply. Falls back to a sensible default trio so the
 * chip row is never empty.
 */
function pickActions(projectId: string, prompt: string, answer: string): Action[] {
  const haystack = `${prompt} ${answer}`.toLowerCase()
  const actions: Action[] = []

  const has = (...keys: string[]) => keys.some((k) => haystack.includes(k))

  if (has("citation", "cited", "engine", "perplexity", "chatgpt", "claude", "gemini", "copilot", "ai overview", "geo", "aeo", "visibility")) {
    actions.push({
      label: "Open AI Visibility",
      href: `/projects/${projectId}/ai-visibility`,
    })
  }
  if (has("page", "pages", "url", "/pricing", "/enterprise", "orphan", "slow", "core web vitals", "cls", "lcp", "performance")) {
    actions.push({
      label: "View Page Inventory",
      href: `/projects/${projectId}/pages`,
    })
  }
  if (has("issue", "error", "warning", "canonical", "broken", "hreflang", "redirect", "og", "schema", "fix")) {
    actions.push({
      label: "See open Issues",
      href: `/projects/${projectId}/issues`,
    })
  }
  if (has("competitor", "share of voice", "screamingfrog", "ahrefs", "semrush", "moz")) {
    actions.push({
      label: "Compare competitors",
      href: `/projects/${projectId}/ai-visibility#competitors`,
    })
  }

  if (actions.length === 0) {
    actions.push(
      { label: "Open AI Visibility", href: `/projects/${projectId}/ai-visibility` },
      { label: "See open Issues", href: `/projects/${projectId}/issues` },
      { label: "View Page Inventory", href: `/projects/${projectId}/pages` },
    )
  }

  return actions.slice(0, 3)
}

export function ActionChips({
  projectId,
  prompt,
  answer,
}: {
  projectId: string
  prompt: string
  answer: string
}) {
  const actions = pickActions(projectId, prompt, answer)
  if (actions.length === 0) return null
  return (
    <div className="flex flex-wrap gap-1.5" aria-label="Suggested next actions">
      {actions.map((a, i) => {
        // First action gets the prominent solid treatment; the rest are
        // ghost-style outlines so the eye lands on the primary CTA first.
        const isPrimary = i === 0
        return (
          <Link
            key={a.href}
            href={a.href}
            className={cn(
              "group inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-medium transition-all",
              isPrimary
                ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md"
                : "border border-border/70 bg-background/40 text-foreground/85 hover:border-primary/40 hover:bg-primary/10 hover:text-foreground",
            )}
          >
            <span>{a.label}</span>
            <ArrowUpRight
              className={cn(
                "size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                isPrimary ? "opacity-90" : "opacity-70",
              )}
            />
          </Link>
        )
      })}
    </div>
  )
}
