"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ArrowDown, Sparkles, X } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * One-time, first-run coach mark introducing the persistent chat bar.
 *
 * Why it exists:
 *   The chat bar deliberately fades to ~22% opacity when idle so it
 *   doesn't fight the dashboard for attention. That same restraint
 *   makes it easy to miss on first visit. This component pops a single
 *   contextual callout right above the bar, with a soft pulsing ring
 *   drawn around the bar's exact bounds so the user's eye is led to it.
 *
 * Lifecycle:
 *   - Reads `sessionStorage["awesomeseo:chatbar-intro"]`. If `"pending"`
 *     (set by the access gate when onboarding completes), shows itself
 *     after a short reveal delay.
 *   - Self-dismisses on: "Got it" click, X, Escape, focus inside the
 *     chat bar's input (any `<input>` inside `[data-chat-bar-root]`),
 *     or a 14 s safety timeout.
 *   - Persists `"seen"` so navigation between pages doesn't re-trigger.
 *
 * Accessibility:
 *   - role="dialog" with aria-labelledby pointing at the title.
 *   - Auto-focuses the primary "Got it" button on reveal so keyboard
 *     users can dismiss with Enter.
 *   - Animations are wrapped in `motion-safe:` so users with the OS
 *     reduce-motion preference get a static callout.
 */

const STORAGE_KEY = "awesomeseo:chatbar-intro"
const REVEAL_DELAY_MS = 700
const AUTO_DISMISS_MS = 14000

export function ChatBarCoachMark() {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const dismiss = useCallback(() => {
    setLeaving(true)
    try {
      sessionStorage.setItem(STORAGE_KEY, "seen")
    } catch {
      // Private browsing — unlocking still works for this render.
    }
    // Tell the chat bar the callout is going away so it can drop back
    // to its dormant transparent state. Fired before the unmount so the
    // bar's exit transition stays in sync with the callout's fade-out.
    window.dispatchEvent(
      new CustomEvent("awesomeseo:chatbar-coach", { detail: { open: false } }),
    )
    // Match the CSS exit duration so the unmount happens after fade.
    window.setTimeout(() => setVisible(false), 220)
  }, [])

  // Reveal: only when the gate explicitly flagged a fresh unlock.
  useEffect(() => {
    let timer = 0
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "pending") {
        timer = window.setTimeout(() => setVisible(true), REVEAL_DELAY_MS)
      }
    } catch {
      // No storage — silently skip the coach mark.
    }
    return () => {
      if (timer) window.clearTimeout(timer)
    }
  }, [])

  // Whenever the callout becomes visible, broadcast `open:true` so the
  // chat bar wakes up — otherwise the dormant pill is invisible at ~22%
  // opacity and the coach-mark arrow points at empty space. Cleanup
  // also fires `open:false` for safety in case the component unmounts
  // (e.g. route change) before `dismiss()` runs.
  useEffect(() => {
    if (!visible) return
    window.dispatchEvent(
      new CustomEvent("awesomeseo:chatbar-coach", { detail: { open: true } }),
    )
    return () => {
      window.dispatchEvent(
        new CustomEvent("awesomeseo:chatbar-coach", { detail: { open: false } }),
      )
    }
  }, [visible])

  // Auto-dismiss safety net.
  useEffect(() => {
    if (!visible) return
    const t = window.setTimeout(dismiss, AUTO_DISMISS_MS)
    return () => window.clearTimeout(t)
  }, [visible, dismiss])

  // Dismiss-on-interact: any focus inside the chat bar means the user
  // engaged with it, so the coach mark has done its job.
  useEffect(() => {
    if (!visible) return
    function onFocusIn(e: FocusEvent) {
      const target = e.target as HTMLElement | null
      if (target?.closest("[data-chat-bar-root]")) dismiss()
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") dismiss()
    }
    document.addEventListener("focusin", onFocusIn)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("focusin", onFocusIn)
      document.removeEventListener("keydown", onKey)
    }
  }, [visible, dismiss])

  // Steal focus to the primary action so Enter dismisses immediately.
  useEffect(() => {
    if (!visible) return
    const btn = cardRef.current?.querySelector<HTMLButtonElement>("[data-primary]")
    btn?.focus({ preventScroll: true })
  }, [visible])

  if (!visible) return null

  return (
    <>
      {/* Pulsing ring drawn over the chat bar's bounds. We mirror the
          chat bar's positioning classes verbatim so the ring lands
          exactly on the pill regardless of viewport width. */}
      <div
        aria-hidden="true"
        className={cn(
          "fixed inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-5 pointer-events-none lg:pl-[16.5rem]",
          "transition-opacity duration-200",
          leaving ? "opacity-0" : "opacity-100",
        )}
      >
        <div className="relative w-full max-w-2xl">
          {/* Glow halo — soft brand-coloured bloom behind the bar. */}
          <div className="absolute -inset-3 rounded-3xl bg-primary/15 blur-2xl motion-safe:animate-pulse" />
          {/* Crisp ring matched to the pill's geometry (rounded-2xl, ~52px tall). */}
          <div className="relative h-[52px] rounded-2xl ring-2 ring-primary/70 motion-safe:animate-[coach-ring_1.8s_ease-out_infinite]" />
        </div>
      </div>

      {/* Callout card sitting above the chat bar. */}
      <div
        role="dialog"
        aria-labelledby="chatbar-coach-title"
        aria-describedby="chatbar-coach-body"
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-24 pointer-events-none lg:pl-[16.5rem]",
          "transition-all duration-200 ease-out",
          leaving
            ? "translate-y-1 opacity-0"
            : "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:duration-300",
        )}
      >
        <div className="pointer-events-auto w-full max-w-md" ref={cardRef}>
          <div className="relative rounded-2xl border border-primary/30 bg-popover/95 p-4 shadow-2xl backdrop-blur-2xl backdrop-saturate-150">
            <button
              type="button"
              onClick={dismiss}
              className="absolute right-2.5 top-2.5 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Dismiss"
            >
              <X className="size-3.5" />
            </button>

            <div className="flex items-start gap-3 pr-6">
              <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-inset ring-primary/30">
                <Sparkles className="size-4" />
              </span>
              <div className="space-y-1.5">
                <h3
                  id="chatbar-coach-title"
                  className="text-sm font-semibold leading-tight"
                >
                  Your AI sidekick lives down here
                </h3>
                <p
                  id="chatbar-coach-body"
                  className="text-xs leading-relaxed text-muted-foreground"
                >
                  It follows you across every page and{" "}
                  <span className="font-medium text-foreground/85">
                    fades into the background
                  </span>{" "}
                  while you work, then snaps back the moment you reach for
                  it. It&apos;s{" "}
                  <span className="font-medium text-foreground/85">
                    context-aware
                  </span>{" "}
                  — it already knows which project, page, and metric
                  you&apos;re looking at.
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-end gap-2 pl-11">
              <button
                type="button"
                data-primary
                onClick={dismiss}
                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                Got it
              </button>
            </div>

            {/* Card "tail" — small rotated square that visually merges
                the card with the popover surface, then a bouncing arrow
                below pointing all the way down to the bar. */}
            <span
              aria-hidden="true"
              className="absolute -bottom-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 border-b border-r border-primary/30 bg-popover"
            />
          </div>

          <div
            aria-hidden="true"
            className="mt-3 flex justify-center text-primary/60 motion-safe:animate-bounce"
          >
            <ArrowDown className="size-4" />
          </div>
        </div>
      </div>
    </>
  )
}
