"use client"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { usePathname } from "next/navigation"
import { ArrowUp, CornerDownLeft, X, Loader2, AlertTriangle, Check, ChevronDown } from "lucide-react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, type UIMessage } from "ai"
import { EngineLogo } from "@/components/engine-logos"
import { engineMeta } from "@/lib/engine-meta"
import type { AiEngineKey } from "@/lib/mock-data"
import {
  ActionChips,
  SynthesizedRail,
} from "@/components/chat-answer-flourishes"
// Lazy-loaded — recharts (~80KB gz) only ships down once the user
// actually starts a conversation and the first chart needs to render.
// Until then a slim CSS skeleton fills the slot with no layout shift.
import { CitationShareChartLazy } from "@/components/charts-lazy"
import { MessageMarkdown } from "@/components/message-markdown"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { projects } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

/** localStorage key for the user's selected display engine. The actual
 *  backend model never changes — this is purely a visual brand override
 *  so the demo can showcase the multi-engine support story. */
const ENGINE_STORAGE_KEY = "awesomeseo:chat-engine"

/** Engines offered in the picker. Order mirrors the dashboard
 *  "Tracked across" rail so the visual hierarchy stays consistent. */
const ENGINE_OPTIONS: AiEngineKey[] = [
  "chatgpt",
  "claude",
  "perplexity",
  "gemini",
  "copilot",
]

type Props = {
  /** Used to label the AI as context-aware ("trained on awesomeseo.app"). */
  domain: string
  /** Niche/topic blurb so the AI feels site-aware. */
  niche?: string
  /** Suggested prompts shown in a popover above the bar on focus. */
  suggestions?: string[]
}

/** Distance (px) from the bar's bounding box at which it wakes up. */
const PROXIMITY_THRESHOLD = 5

/** Pull rendered text out of a UIMessage's parts array. */
function getMessageText(msg: UIMessage): string {
  if (!msg.parts || !Array.isArray(msg.parts)) return ""
  return msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")
}

/**
 * Floating, context-aware AI chat bar wired to /api/chat (Gemini 3 Flash via
 * the Vercel AI Gateway). Streams responses inline above the input.
 *
 * Visibility model:
 *   - dormant — default, scrolling, cursor far away. ~22% opacity, fully
 *               transparent surface, no shadow. Effectively invisible.
 *   - awake   — cursor within 5px / hover / focus / popover or convo open.
 *               Opaque navy frosted glass so data underneath is hidden.
 */
export function DataChatBar({
  domain,
  niche = "technical, content and AI-visibility SEO",
  suggestions,
}: Props) {
  const cleanDomain = domain.replace(/^https?:\/\//, "")

  // Derive the active project ID from the URL so action chips deep-link
  // into the workspace the user is actually viewing. Falls back to the
  // first project for the dashboard / global pages.
  const pathname = usePathname()
  const projectId = useMemo(() => {
    const m = pathname?.match(/^\/projects\/([^/]+)/)
    return m?.[1] ?? projects[0]?.id ?? "default"
  }, [pathname])

  const fallbackSuggestions = [
    "Show pages with errors",
    `Why is the slowest page on ${cleanDomain} slow?`,
    "Find orphan pages",
    "Pages losing AI citations this week",
  ]
  const promptList = suggestions ?? fallbackSuggestions

  // Stable transport — recreating it on every render desynchronises the SSE
  // stream and makes responses appear blank. Re-create only when context changes.
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest: ({ messages: msgs, id }) => ({
          body: { messages: msgs, id, domain: cleanDomain, niche },
        }),
      }),
    [cleanDomain, niche],
  )

  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const { messages, sendMessage, status, setMessages, stop } = useChat({
    transport,
    onError: (err) => {
      console.log("[v0] chat error:", err)
      setErrorMsg(err?.message ?? "Something went wrong. Please try again.")
    },
  })

  const [value, setValue] = useState("")
  const [open, setOpen] = useState(false)
  const [near, setNear] = useState(false)
  const [hover, setHover] = useState(false)
  const [focused, setFocused] = useState(false)
  // `wakePulse` is a transient "look at me" state that fires on every
  // route change (and on initial mount). It forces the bar into its
  // awake styling for ~2s and overlays a soft primary-tinted ring pulse
  // so the user is reminded the chat bar is here, on every page.
  const [wakePulse, setWakePulse] = useState(false)
  // True while the first-run coach-mark callout is on screen. We listen
  // for the custom event the coach-mark component dispatches and fold
  // it into `awake` below so the bar styling stays in sync.
  const [coachOpen, setCoachOpen] = useState(false)
  // Monotonic counter — incrementing it remounts the SVG laser overlay,
  // which reliably replays its CSS keyframe animation. Bumped on every
  // mouseenter (the "wake" trigger the user asked for) and once whenever
  // the route-change wake pulse fires, so each new page also gets a sweep.
  const [laserKey, setLaserKey] = useState(0)
  // 30-second cooldown so the laser feels like a special "wake up" cue,
  // not ambient noise. Without this, rapid hover-in/hover-out cycles or
  // a route-change immediately followed by a mouseenter would double-
  // fire it. We use a ref (not state) because the throttle is purely
  // imperative — checking it shouldn't cause a re-render.
  const lastLaserAtRef = useRef(0)
  const LASER_COOLDOWN_MS = 30_000
  function fireLaser() {
    const now = Date.now()
    if (now - lastLaserAtRef.current < LASER_COOLDOWN_MS) return
    lastLaserAtRef.current = now
    setLaserKey((k) => k + 1)
  }

  // User-facing AI engine choice. Persisted in localStorage so the
  // selection survives reloads, navigations and SSR hydration without
  // flashing the wrong logo: we rehydrate inside an effect so initial
  // render still matches the SSR markup (gemini), then swap once.
  // Backend stays Gemini regardless — this is purely a visual override
  // for the demo. The custom event lets other surfaces (the message
  // avatars, suggestion icons) react to changes within the same tab.
  const [selectedEngine, setSelectedEngine] = useState<AiEngineKey>("gemini")
  const [enginePickerOpen, setEnginePickerOpen] = useState(false)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(ENGINE_STORAGE_KEY)
      if (
        stored &&
        (ENGINE_OPTIONS as string[]).includes(stored)
      ) {
        setSelectedEngine(stored as AiEngineKey)
      }
    } catch {
      // Private mode — silently fall back to gemini.
    }
  }, [])
  const updateEngine = useCallback((next: AiEngineKey) => {
    setSelectedEngine(next)
    setEnginePickerOpen(false)
    try {
      localStorage.setItem(ENGINE_STORAGE_KEY, next)
    } catch {
      // Storage unavailable — selection still applies for this session.
    }
  }, [])
  const selectedMeta = engineMeta[selectedEngine]
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const hasMessages = messages.length > 0
  const isStreaming = status === "streaming" || status === "submitted"

  // Proximity detection — extremely tight (5px) so the bar truly stays
  // out of the way until the user reaches for it.
  //
  // Performance:
  //   - rAF-throttled so we do at most one `getBoundingClientRect()` per
  //     frame instead of per pixel of cursor motion (which forces layout).
  //   - { passive: true } lets the browser skip preventDefault checks.
  //   - Skipped entirely on coarse-pointer devices (touch) where hover
  //     proximity has no meaning.
  //   - Deferred via `requestIdleCallback` (with a setTimeout fallback)
  //     so we don't compete with the page's first interaction-ready
  //     frame. The chat bar is mounted globally, so paying for this
  //     listener during the initial render of every dashboard route
  //     would steal cycles from the user's actual task.
  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.matchMedia?.("(pointer: coarse)").matches) return

    let frame = 0
    let lastEvent: MouseEvent | null = null
    let attached = false
    type IdleWindow = Window & {
      requestIdleCallback?: (
        cb: () => void,
        opts?: { timeout?: number },
      ) => number
      cancelIdleCallback?: (handle: number) => void
    }
    const idleWindow = window as IdleWindow

    function flush() {
      frame = 0
      const e = lastEvent
      const el = wrapperRef.current
      if (!e || !el) return
      const r = el.getBoundingClientRect()
      const dx =
        e.clientX < r.left ? r.left - e.clientX : e.clientX > r.right ? e.clientX - r.right : 0
      const dy =
        e.clientY < r.top ? r.top - e.clientY : e.clientY > r.bottom ? e.clientY - r.bottom : 0
      setNear(Math.hypot(dx, dy) < PROXIMITY_THRESHOLD)
    }

    function onMove(e: MouseEvent) {
      lastEvent = e
      if (frame) return
      frame = requestAnimationFrame(flush)
    }

    function attach() {
      if (attached) return
      attached = true
      window.addEventListener("mousemove", onMove, { passive: true })
    }

    // Wait for the browser to be idle before installing the listener.
    // 2-second timeout caps the wait so the bar still wakes up reliably
    // on quiet pages.
    let idleHandle: number | undefined
    let timeoutHandle: number | undefined
    if (typeof idleWindow.requestIdleCallback === "function") {
      idleHandle = idleWindow.requestIdleCallback(attach, { timeout: 2000 })
    } else {
      timeoutHandle = window.setTimeout(attach, 800)
    }

    return () => {
      if (attached) window.removeEventListener("mousemove", onMove)
      if (frame) cancelAnimationFrame(frame)
      if (
        idleHandle !== undefined &&
        typeof idleWindow.cancelIdleCallback === "function"
      ) {
        idleWindow.cancelIdleCallback(idleHandle)
      }
      if (timeoutHandle !== undefined) window.clearTimeout(timeoutHandle)
    }
  }, [])

  // Close suggestions when clicking outside.
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!wrapperRef.current) return
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [])

  // Close on Escape.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false)
        inputRef.current?.blur()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  // Auto-scroll the conversation panel to the latest message as it streams.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Sync visibility with the first-run coach mark. The coach mark
  // dispatches a `awesomeseo:chatbar-coach` CustomEvent whenever it
  // shows or dismisses; reading `detail.open` lets us hard-force the
  // bar into its awake styling for the entire duration of the callout
  // so the user can actually see what the arrow is pointing at.
  useEffect(() => {
    if (typeof window === "undefined") return
    function onCoach(e: Event) {
      const detail = (e as CustomEvent<{ open: boolean }>).detail
      setCoachOpen(Boolean(detail?.open))
    }
    window.addEventListener("awesomeseo:chatbar-coach", onCoach)
    return () =>
      window.removeEventListener("awesomeseo:chatbar-coach", onCoach)
  }, [])

  // Hold the bar fully visible for 10 seconds after every route change
  // (including the first mount), so users landing on a new page have
  // ample time to notice the chat affordance. After the window expires
  // the bar fades back to its 50% dormant state. Skipped while a
  // conversation is in progress — the bar is already loud enough then,
  // and re-pulsing on navigation would be visual noise.
  useEffect(() => {
    if (hasMessages || isStreaming) return
    setWakePulse(true)
    // Run the border laser alongside the wake window so the bar both
    // fades in *and* gets traced — same trigger, two layers.
    fireLaser()
    const t = window.setTimeout(() => setWakePulse(false), 10000)
    return () => window.clearTimeout(t)
    // We intentionally re-run on pathname only — `hasMessages` /
    // `isStreaming` are read at fire-time, not as dependencies, so
    // navigations that happen mid-stream don't double-pulse afterwards.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const text = value.trim()
    if (!text || isStreaming) return
    setErrorMsg(null)
    sendMessage({ text })
    setValue("")
    setOpen(false)
  }

  // Awake whenever cursor is near, hovered, focused, the suggestions popover
  // is open, there's an active conversation, we're inside the post-navigation
  // wake pulse window, OR the first-run coach mark is currently pointing
  // at us. Folding all of these into the same boolean keeps the existing
  // transition styles uniform — no separate "pulse / coach mode" branches.
  const awake =
    near ||
    hover ||
    focused ||
    open ||
    hasMessages ||
    isStreaming ||
    wakePulse ||
    coachOpen

  return (
    <div
      data-chat-bar-root
      // Bottom padding is `max(20px, env(safe-area-inset-bottom))` so the
      // bar floats above the iPhone home indicator on notched devices
      // while staying at 20px on laptops/Android. `pl` shifts the bar
      // past the persistent sidebar at lg+, and `px-3` (instead of
      // `px-4`) gives the pill more room on narrow phones.
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 sm:px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pointer-events-none lg:pl-[16.5rem]"
      aria-label="Ask AI about this data"
    >
      <div
        ref={wrapperRef}
        onMouseEnter={() => {
          setHover(true)
          // Replay the border laser every time the cursor enters the
          // wrapper — this is the literal "wake up" cue the user asked
          // for. We deliberately don't fire on the broader proximity
          // (`near`) detection because it can flip on/off as the cursor
          // hovers near the edge, which would cause a stutter loop.
          fireLaser()
        }}
        onMouseLeave={() => setHover(false)}
        // Visibility model:
        //   • Awake (hover / focus / active conversation / first 10s on
        //     a new page) → fully opaque.
        //   • Dormant (everything else) → 50% opacity so the bar reads
        //     as "asleep but present" rather than disappearing.
        // Pointer events stay on at all opacities so the user can always
        // tap to wake it.
        className={cn(
          "pointer-events-auto relative w-full max-w-2xl transition-opacity duration-300 ease-out",
          awake ? "opacity-100" : "opacity-50",
        )}
      >
        {/* Conversation panel — only when there are messages. Frosted opaque
            so the page data underneath is fully obscured during use. */}
        {hasMessages && (
          <div className="absolute inset-x-0 bottom-full mb-2">
            <div className="overflow-hidden rounded-2xl border border-border bg-popover/95 shadow-2xl backdrop-blur-2xl backdrop-saturate-150">
              {/* Panel header */}
              <div className="flex items-center justify-between border-b border-border/60 px-3 py-2">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                  <EngineLogo engine={selectedEngine} size={12} />
                  <span>Conversation · {cleanDomain}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    stop()
                    setMessages([])
                  }}
                  // ≥36px tap target so the button is comfortable on
                  // mobile without inflating the desktop header height
                  // (the negative margin pulls the visual chrome back in).
                  className="-my-1 -mr-1 flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  aria-label="Clear conversation"
                >
                  <X className="size-3.5" />
                </button>
              </div>

              {/* Messages */}
              {/* `dvh` (dynamic viewport height) tracks iOS Safari's
                  shrinking/growing chrome so the panel never overshoots
                  the visible area when the URL bar collapses. We also
                  cap height a little tighter on mobile (60dvh) to leave
                  room for the input pill above the home indicator. */}
              <div
                ref={scrollRef}
                className="max-h-[60dvh] sm:max-h-[50dvh] overflow-y-auto overscroll-contain px-3 py-3 space-y-3"
              >
                {errorMsg && (
                  <div className="flex items-start gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive ring-1 ring-inset ring-destructive/25">
                    <AlertTriangle className="size-3.5 shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="leading-relaxed">{errorMsg}</span>
                  </div>
                )}
                {(() => {
                  // Track the assistant-message index across the loop so
                  // we can decorate only the FIRST 1–2 answers with the
                  // AI-SEO flourishes (cross-engine rail + action chips).
                  // After the demo's "wow" moment, follow-up answers stay
                  // clean to keep the panel scannable.
                  let assistantIndex = -1
                  return messages.map((m, i) => {
                    const text = getMessageText(m)
                    if (!text && m.role === "assistant" && !isStreaming && !errorMsg) return null

                    const isAssistant = m.role === "assistant"
                    if (isAssistant) assistantIndex += 1

                    // The user message immediately preceding this assistant
                    // turn — drives the keyword-based action-chip routing.
                    const precedingUserText =
                      isAssistant && i > 0
                        ? getMessageText(messages[i - 1])
                        : ""

                    // Only the LAST message can still be streaming; mark
                    // every prior assistant message as "done" so we don't
                    // wait on them to render the flourishes.
                    const isLastMessage = i === messages.length - 1
                    const isThisStreaming = isLastMessage && isStreaming
                    const showFlourishes =
                      isAssistant &&
                      assistantIndex < 2 &&
                      !isThisStreaming &&
                      text.length > 0

                    return (
                      <div key={m.id} className="space-y-2">
                        <div
                          className={cn(
                            "flex gap-2.5",
                            m.role === "user" ? "flex-row-reverse" : "flex-row",
                          )}
                        >
                          {isAssistant && (
                            <span
                              className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-white/5"
                              title={selectedMeta.name}
                            >
                              <EngineLogo
                                engine={selectedEngine}
                                size={14}
                              />
                            </span>
                          )}
                          <div
                            className={cn(
                              "max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed",
                              m.role === "user"
                                ? "whitespace-pre-wrap bg-primary/15 text-foreground ring-1 ring-inset ring-primary/25"
                                : "bg-accent/40 text-foreground",
                            )}
                          >
                            {text ? (
                              isAssistant ? (
                                // Assistant messages stream as markdown so
                                // headings/lists/tables/code render natively.
                                // react-markdown is incremental-update safe,
                                // so this works during the AI SDK stream.
                                <MessageMarkdown text={text} />
                              ) : (
                                // User messages stay as plain text; we don't
                                // want their typed apostrophes / asterisks
                                // accidentally interpreted as markdown.
                                text
                              )
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                                <Loader2 className="size-3 animate-spin" />
                                Thinking…
                              </span>
                            )}
                          </div>
                        </div>

                        {/* AI-SEO flourishes — three signature elements
                            beneath the first 1–2 assistant answers:
                              1. Cross-engine SynthesizedRail with mini bars.
                              2. CitationShareChart (Recharts) — the visual
                                 anchor; data shown only on the very first
                                 answer to avoid duplicating the same chart
                                 multiple times in a single thread.
                              3. ActionChips — deep-link CTAs.
                            All gated on streaming completion so they don't
                            flicker mid-stream. */}
                        {showFlourishes && (
                          <div className="ml-8 space-y-2 animate-in fade-in slide-in-from-top-1 duration-300">
                            <SynthesizedRail />
                            {assistantIndex === 1 && <CitationShareChartLazy />}
                            <ActionChips
                              projectId={projectId}
                              prompt={precedingUserText}
                              answer={text}
                            />
                          </div>
                        )}
                      </div>
                    )
                  })
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Error toast when there are no messages yet (so a failed first try
            isn't silent). */}
        {!hasMessages && errorMsg && (
          <div className="absolute inset-x-0 bottom-full mb-2">
            <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-popover/95 px-3 py-2.5 text-xs text-destructive shadow-2xl backdrop-blur-2xl backdrop-saturate-150">
              <AlertTriangle className="size-3.5 shrink-0 mt-0.5" aria-hidden="true" />
              <div className="flex-1 leading-relaxed">{errorMsg}</div>
              <button
                type="button"
                onClick={() => setErrorMsg(null)}
                className="rounded p-0.5 text-destructive/70 transition-colors hover:bg-destructive/10 hover:text-destructive"
                aria-label="Dismiss error"
              >
                <X className="size-3" />
              </button>
            </div>
          </div>
        )}

        {/* Suggestions popover — only when focused AND no conversation yet. */}
        {!hasMessages && !errorMsg && (
          <div
            className={cn(
              "absolute inset-x-0 bottom-full mb-2 transition-all duration-200 ease-out",
              open
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-1 opacity-0",
            )}
          >
            <div className="overflow-hidden rounded-2xl border border-border bg-popover/95 p-1.5 shadow-2xl backdrop-blur-2xl backdrop-saturate-150">
              <div className="flex flex-col">
                <div className="px-2.5 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                  Try asking
                </div>
                {promptList.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setErrorMsg(null)
                      sendMessage({ text: s })
                      setValue("")
                      setOpen(false)
                    }}
                    className="group flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-foreground/85 transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <span className="shrink-0 opacity-70 transition-opacity group-hover:opacity-100">
                      <EngineLogo engine={selectedEngine} size={14} />
                    </span>
                    <span className="truncate">{s}</span>
                    <CornerDownLeft
                      className="ml-auto size-3 shrink-0 text-foreground/30 opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Chat pill — always visible. The dormant treatment is a soft
            frosted-navy surface so the bar reads as "asleep but present";
            the awake treatment lifts it with a primary-tinted border, a
            denser shadow, and full backdrop saturation. */}
        <form
          onSubmit={handleSubmit}
          // `touch-manipulation` removes the 300ms tap delay on iOS for
          // every interactive child of the pill (engine picker trigger,
          // input, send button) so taps feel instant on phones.
          className={cn(
            "relative flex items-center gap-2 rounded-2xl pl-3 pr-1.5 py-1.5 touch-manipulation transition-[background,border,box-shadow] duration-300",
            awake
              ? "border border-primary/30 bg-popover/95 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_8px_32px_-8px_rgb(0_0_0/0.7)]"
              : "border border-border/55 bg-popover/55 backdrop-blur-md shadow-[0_4px_18px_-6px_rgb(0_0_0/0.55)]",
          )}
        >
          {/* Wake laser — a comet of light that races once around the
              pill's rounded border every time the user wakes the bar
              (mouseenter / route change), throttled to 30s.
              ──────────────────────────────────────────────────────────
              Implementation: a CSS conic-gradient ring, NOT an SVG.
              SVG strokes don't respect CSS border-radius rendering and
              were clipping unpredictably. Instead we paint a conic
              gradient onto a div the same shape as the form, then use
              `mask-composite: exclude` to hollow out the interior — what
              remains is a perfect ~1.5px ring that hugs the form's
              `rounded-2xl` corners exactly, regardless of width.
              ──────────────────────────────────────────────────────────
              Animation: a custom property `--laser-angle` registered
              via @property in globals.css drives the conic-gradient's
              starting angle. Animating a registered angle property is
              GPU-friendly (one paint, no layout). Re-keyed via
              `laserKey` so the span remounts and replays on each fire. */}
          <span
            key={laserKey}
            aria-hidden="true"
            className="chatbar-laser pointer-events-none absolute inset-0 rounded-2xl motion-reduce:hidden"
          />
          {/* Post-navigation wake ring — a soft primary-tinted ring that
              expands and fades once when the user lands on a new page.
              The wake-visibility window itself lasts 10s (see effect
              above); the ring animation only plays for ~1.6s so it
              registers as a single attention cue, not a long bloom.
              Pointer-events-none so it never blocks the input.
              `motion-reduce:hidden` skips the animation entirely for users
              with reduced-motion preferences (the awake styling alone
              still surfaces the bar). The keyframe (`coach-ring`) is
              defined in globals.css and shared with the first-run coach
              mark for visual consistency. */}
          {wakePulse && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-2xl motion-reduce:hidden"
              style={{ animation: "coach-ring 1.6s ease-out 1" }}
            />
          )}
          {/* Top highlight — only awake */}
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent transition-opacity duration-300",
              awake ? "opacity-100" : "opacity-0",
            )}
          />

          {/* Engine brand mark + picker — clicking the logo opens a
              Popover with the five tracked engines, letting the user
              switch the displayed brand without touching the backend
              (this is a demo — every answer is still served by Gemini).
              The popover is keyboard-accessible (Radix handles focus
              management), closes on Escape/outside-click, and the
              chosen engine is persisted in localStorage so the brand
              mark stays consistent across pages and reloads. */}
          <Popover open={enginePickerOpen} onOpenChange={setEnginePickerOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label={`AI engine: ${selectedMeta.name}. Click to switch.`}
                className="group relative z-10 flex h-8 shrink-0 items-center gap-1 rounded-xl bg-white/5 pl-1.5 pr-1 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                <span
                  className="flex size-6 items-center justify-center"
                  title={selectedMeta.name}
                >
                  <EngineLogo engine={selectedEngine} size={18} />
                </span>
                <ChevronDown
                  className={cn(
                    "size-3 text-foreground/45 transition-transform duration-200 group-hover:text-foreground/80",
                    enginePickerOpen && "rotate-180 text-foreground/80",
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    "absolute -top-0.5 -right-0.5 size-1.5 rounded-full transition-opacity",
                    isStreaming
                      ? "bg-primary animate-pulse opacity-100"
                      : awake
                        ? "bg-primary opacity-100 animate-pulse"
                        : "bg-primary opacity-60",
                  )}
                />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              side="top"
              sideOffset={12}
              // Keep the menu visually anchored to the bar; Radix flips
              // automatically if the viewport is too short. The min-width
              // matches the bar's left segment so it lines up cleanly.
              // `max-w-[calc(100vw-1.5rem)]` keeps the picker on-screen
              // on the narrowest phones (it's anchored to the brand mark
              // on the left, so without this it could overflow the right
              // edge on a 320px-wide viewport). The collision detection
              // built into Radix handles the vertical flip automatically.
              className="w-64 max-w-[calc(100vw-1.5rem)] p-1.5 rounded-2xl border-border/60 bg-popover/95 backdrop-blur-2xl backdrop-saturate-150 shadow-2xl"
              // Prevent the input from losing focus when the popover
              // opens — the user can keep typing while picking an engine.
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <div className="px-2 pb-1.5 pt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                Display answers from
              </div>
              <ul className="flex flex-col" role="radiogroup">
                {ENGINE_OPTIONS.map((engine) => {
                  const meta = engineMeta[engine]
                  const isActive = engine === selectedEngine
                  return (
                    <li key={engine}>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        onClick={() => updateEngine(engine)}
                        className={cn(
                          "flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm transition-colors",
                          isActive
                            ? "bg-accent/60 text-foreground"
                            : "text-foreground/85 hover:bg-accent/40 hover:text-foreground",
                        )}
                      >
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white/5">
                          <EngineLogo engine={engine} size={16} />
                        </span>
                        <span className="flex flex-1 flex-col leading-tight">
                          <span className="font-medium">{meta.name}</span>
                          <span className="text-[11px] text-muted-foreground">
                            {meta.parent}
                          </span>
                        </span>
                        {isActive && (
                          <Check
                            className="size-4 text-primary"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
              <div className="mt-1 border-t border-border/40 px-2 pb-0.5 pt-2 text-[10px] leading-relaxed text-muted-foreground">
                Demo mode — answers are generated by Gemini regardless of
                the brand shown above.
              </div>
            </PopoverContent>
          </Popover>

          <div className="relative z-10 flex-1 min-w-0">
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => {
                setFocused(true)
                if (!hasMessages) setOpen(true)
              }}
              onBlur={() => setFocused(false)}
              placeholder={
                isStreaming
                  ? "Generating…"
                  : hasMessages
                    ? "Ask a follow-up…"
                    : `Ask anything about ${cleanDomain}…`
              }
              disabled={isStreaming}
              // `enterKeyHint="send"` makes the iOS/Android virtual
              // keyboard return key read "Send" instead of "Return".
              // `autoCorrect=off` + `autoCapitalize=off` keep the input
              // clean for query-style text. Empty placeholder on mobile
              // is a non-issue since we always show one.
              enterKeyHint="send"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              // Critical: iOS Safari auto-zooms any text input under
              // 16px on focus, which is jarring inside a fixed bar.
              // Force 16px on phones, drop to the design's 14px from
              // sm: up where there's no zoom risk.
              className="w-full bg-transparent text-base sm:text-sm text-foreground placeholder:text-foreground/45 outline-none py-1 disabled:cursor-not-allowed"
              aria-label={`Ask AI about ${cleanDomain}`}
            />
          </div>

          {isStreaming ? (
            <button
              type="button"
              onClick={() => stop()}
              className="relative z-10 shrink-0 size-9 rounded-xl flex items-center justify-center bg-accent text-foreground hover:bg-accent/80 transition-colors"
              aria-label="Stop generating"
            >
              <span className="size-2.5 rounded-sm bg-foreground" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={value.trim().length === 0}
              className={cn(
                "relative z-10 shrink-0 size-9 rounded-xl flex items-center justify-center transition-all",
                value.trim().length === 0
                  ? "bg-white/[0.06] text-foreground/40 cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:scale-105",
              )}
              aria-label="Send"
            >
              <ArrowUp className="size-4" />
            </button>
          )}
        </form>
      </div>
    </div>
  )
}
