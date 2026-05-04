"use client"

import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

/**
 * Lazy entry point for the interactive node graph.
 *
 * `link-graph.tsx` pulls in `d3-force` (~30KB gzipped) plus a heavy
 * useReducer / pointer-event surface that's only valuable on this one
 * page. We code-split it so:
 *
 *   - Every other route ships ~30KB less JS.
 *   - The graph SSR renders nothing (it needs measured pixel sizes
 *     anyway), so we skip wasted server-render work and avoid the
 *     "flash of unstyled server graph" on hydration.
 *
 * The fallback is sized to match the real card so layout doesn't shift
 * when the chunk arrives (CLS = 0).
 */
export const LazyLinkGraph = dynamic(
  () => import("./link-graph").then((m) => ({ default: m.LinkGraph })),
  {
    ssr: false,
    loading: () => (
      <div
        className="relative h-[640px] w-full overflow-hidden rounded-2xl border border-border bg-card"
        role="status"
        aria-label="Loading link graph"
      >
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
        </div>
      </div>
    ),
  },
)
