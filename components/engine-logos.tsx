/**
 * Brand marks for the search & answer engines tracked across the SaaS.
 *
 * Performance notes:
 *   - All raster brand marks use `next/image` so they get AVIF/WebP
 *     optimisation, lazy loading by default, and explicit dimensions
 *     to avoid layout shift.
 *   - Each component is wrapped in `React.memo` because they appear in
 *     long lists (project cards, dashboard rows, AI insights queue,
 *     citations tables) where the parent re-renders on unrelated state.
 *   - `projectEngines()` results are cached so identical project IDs
 *     return the same array reference, which lets `EngineRow` short-
 *     circuit its work in `React.memo` consumers.
 *
 * No `"use client"` directive: this module is shared between server
 * components (e.g. the dashboard renders `<EngineRow>` server-side and
 * also calls `projectEngines()` directly in RSC) and client trees. Both
 * `React.memo` and `next/image` work in shared modules — memo simply
 * has no observable effect during the server render pass.
 */

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

type LogoProps = {
  size?: number
  className?: string
  title?: string
}

function Wrap({
  size = 20,
  className,
  title,
  children,
}: LogoProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  )
}

/**
 * Standard size used to request the optimiser. We always request the
 * larger of the rendered size or 32px so retina screens stay crisp without
 * shipping huge originals. The CDN cache makes the cost negligible.
 */
function optimisedSize(size: number) {
  return Math.max(32, Math.round(size * 2))
}

export const GoogleLogo = React.memo(function GoogleLogo(props: LogoProps) {
  return (
    <Wrap {...props} title={props.title ?? "Google"}>
      <path
        fill="#4285F4"
        d="M22 12.2c0-.7-.06-1.36-.18-2H12v3.78h5.62a4.8 4.8 0 0 1-2.08 3.16v2.62h3.36C20.86 18.06 22 15.4 22 12.2Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.62-2.44l-3.36-2.62c-.93.62-2.12.99-3.26.99-2.5 0-4.62-1.69-5.38-3.96H3.18v2.49A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC04"
        d="M6.62 13.97a6 6 0 0 1 0-3.94V7.54H3.18a10 10 0 0 0 0 8.92l3.44-2.49Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.08c1.47 0 2.79.51 3.83 1.5l2.87-2.87C16.96 3.16 14.7 2.25 12 2.25A10 10 0 0 0 3.18 7.54l3.44 2.49C7.38 7.77 9.5 6.08 12 6.08Z"
      />
    </Wrap>
  )
})

export const ChatGPTLogo = React.memo(function ChatGPTLogo({
  size = 20,
  className,
  title,
}: LogoProps) {
  // Authentic OpenAI knot mark on a white circular tile so the monochrome
  // glyph stays legible against the workspace's dark surfaces.
  const radius = Math.max(2, size * 0.22)
  const inner = Math.round(size * 0.78)
  const opt = optimisedSize(inner)
  return (
    <span
      className={cn("inline-flex items-center justify-center shrink-0", className)}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: "#ffffff",
      }}
    >
      <Image
        src="/openai.png"
        alt={title ?? "ChatGPT"}
        width={opt}
        height={opt}
        sizes={`${inner}px`}
        style={{ width: inner, height: inner, display: "block" }}
      />
    </span>
  )
})

export const ClaudeLogo = React.memo(function ClaudeLogo({
  size = 20,
  className,
  title,
}: LogoProps) {
  const opt = optimisedSize(size)
  return (
    <span
      className={cn("inline-flex shrink-0 overflow-hidden", className)}
      style={{
        width: size,
        height: size,
        borderRadius: Math.max(2, size * 0.22),
      }}
    >
      <Image
        src="/claude.jpeg"
        alt={title ?? "Claude"}
        width={opt}
        height={opt}
        sizes={`${size}px`}
        style={{ width: size, height: size, display: "block" }}
      />
    </span>
  )
})

export const PerplexityLogo = React.memo(function PerplexityLogo({
  size = 20,
  className,
  title,
}: LogoProps) {
  const opt = optimisedSize(size)
  return (
    <span
      className={cn("inline-flex shrink-0 overflow-hidden", className)}
      style={{
        width: size,
        height: size,
        borderRadius: Math.max(2, size * 0.22),
      }}
    >
      <Image
        src="/perplexity.jpg"
        alt={title ?? "Perplexity"}
        width={opt}
        height={opt}
        sizes={`${size}px`}
        style={{ width: size, height: size, display: "block" }}
      />
    </span>
  )
})

export const GeminiLogo = React.memo(function GeminiLogo({
  size = 20,
  className,
  title,
}: LogoProps) {
  const opt = optimisedSize(size)
  return (
    <Image
      src="/gemini.png"
      alt={title ?? "Gemini"}
      width={opt}
      height={opt}
      sizes={`${size}px`}
      className={cn("shrink-0", className)}
      style={{ width: size, height: size }}
    />
  )
})

export const CopilotLogo = React.memo(function CopilotLogo({
  size = 20,
  className,
  title,
}: LogoProps) {
  const opt = optimisedSize(size)
  return (
    <Image
      src="/copilot.webp"
      alt={title ?? "Copilot"}
      width={opt}
      height={opt}
      sizes={`${size}px`}
      className={cn("shrink-0", className)}
      style={{ width: size, height: size }}
    />
  )
})

export type EngineKey =
  | "google"
  | "chatgpt"
  | "claude"
  | "perplexity"
  | "gemini"
  | "copilot"

export function EngineLogo({
  engine,
  size,
  className,
}: {
  engine: EngineKey
  size?: number
  className?: string
}) {
  const props = { size, className }
  switch (engine) {
    case "google":
      return <GoogleLogo {...props} />
    case "chatgpt":
      return <ChatGPTLogo {...props} />
    case "claude":
      return <ClaudeLogo {...props} />
    case "perplexity":
      return <PerplexityLogo {...props} />
    case "gemini":
      return <GeminiLogo {...props} />
    case "copilot":
      return <CopilotLogo {...props} />
  }
}

/**
 * Compact overlapping stack of engine logos. Used in project cards, table
 * rows, insight items, etc., to communicate "tracked across these AI
 * surfaces" at a glance.
 *
 * Memoised so re-renders of the parent list (sort/filter, hover state on
 * sibling rows) don't trigger image re-decodes.
 */
export const EngineRow = React.memo(function EngineRow({
  engines,
  size = 18,
  max = 5,
  ringClassName = "ring-card",
  className,
  label,
}: {
  engines: EngineKey[]
  size?: number
  max?: number
  /** Tailwind class for the ring colour — match the parent surface. */
  ringClassName?: string
  className?: string
  label?: string
}) {
  const visible = engines.slice(0, max)
  const overflow = Math.max(0, engines.length - visible.length)
  const overlap = Math.round(size * 0.32)

  return (
    <div
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
    >
      <div className="flex items-center" style={{ paddingLeft: overlap }}>
        {visible.map((engine, i) => (
          <span
            key={engine}
            className={cn("relative inline-flex shrink-0 ring-2", ringClassName)}
            style={{
              width: size,
              height: size,
              marginLeft: -overlap,
              borderRadius: "9999px",
              zIndex: visible.length - i,
            }}
          >
            <EngineLogo engine={engine} size={size} />
          </span>
        ))}
        {overflow > 0 && (
          <span
            className={cn(
              "relative inline-flex shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium tabular text-muted-foreground ring-2",
              ringClassName,
            )}
            style={{
              width: size,
              height: size,
              marginLeft: -overlap,
            }}
          >
            +{overflow}
          </span>
        )}
      </div>
    </div>
  )
})

/** Canonical ordering used for deterministic per-project engine selection. */
export const ALL_ENGINES: EngineKey[] = [
  "chatgpt",
  "perplexity",
  "claude",
  "gemini",
  "copilot",
  "google",
]

/**
 * Per-project engine cache. Returning the same array reference for a given
 * project ID lets memoised consumers (`EngineRow`) short-circuit their
 * shallow-equality check and skip rendering work entirely.
 */
const ENGINES_CACHE = new Map<string, EngineKey[]>()

/**
 * Deterministic per-project engine list — the engines we track for THIS
 * site. Stable across renders so the chips don't shuffle. Mock-data only;
 * swap for a real per-project config when wired to the backend.
 */
export function projectEngines(projectId: string): EngineKey[] {
  const cached = ENGINES_CACHE.get(projectId)
  if (cached) return cached

  let h = 2166136261
  for (let i = 0; i < projectId.length; i++) {
    h ^= projectId.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  // Always include the big three (chatgpt, perplexity, claude); add the
  // others probabilistically based on the hash so each site has its own
  // recognisable mix.
  const result: EngineKey[] = ["chatgpt", "perplexity", "claude"]
  if (((h >>> 0) % 3) !== 0) result.push("gemini")
  if (((h >>> 4) % 4) !== 0) result.push("copilot")
  if (((h >>> 8) % 5) === 0) result.push("google")

  ENGINES_CACHE.set(projectId, result)
  return result
}
