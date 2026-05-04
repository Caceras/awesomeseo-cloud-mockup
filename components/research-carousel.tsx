"use client"

import { useEffect, useRef, useState } from "react"
import Image, { type StaticImageData } from "next/image"
import Link from "next/link"
import { Download } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Two real industry reports surfaced in the sidebar footer as a pair of
 * full-bleed PDF cover thumbnails that rotate on a timer. The cover IS
 * the card — no surrounding chrome, no stat panel, no header pill —
 * so the brand identity of each report carries the entire surface.
 *
 * Each cover links to its bundled PDF in /public/reports, with a
 * floating Download button that appears on hover/focus for an explicit
 * fetch action (separate from the cover-tap which opens the PDF inline).
 */
type Slide = {
  id: string
  label: string
  /** Human filename used for the download attribute. */
  filename: string
  pdfHref: string
  /** Real cover screenshot served via next/image. */
  cover: string | StaticImageData
  /** Aspect ratio of the source image — keeps both slides identically sized
   *  no matter what the originals' raw dimensions are. */
  aspect: string
}

const SLIDES: Slide[] = [
  {
    id: "geo-2026",
    label: "GEO 2026 — EMARKETER",
    filename: "GEO-2026-EMARKETER.pdf",
    pdfHref: "/reports/geo-2026.pdf",
    cover: "/reports/geo-2026-cover.png",
    aspect: "1083/1404",
  },
  {
    id: "aeo-divide",
    label: "The AEO Divide — Webflow",
    filename: "The-AEO-Divide-Webflow.pdf",
    pdfHref: "/reports/aeo-divide.pdf",
    cover: "/reports/aeo-divide-cover.png",
    aspect: "814/1052",
  },
]

const DWELL_MS = 7_000
// Circumference of the spinner's r=6 circle (2 · π · 6) — paired with
// the `@keyframes carousel-spin` block in globals.css.
const SPINNER_CIRCUMFERENCE = 37.7

export function ResearchCarousel() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  // Re-keyed counter forces the spinner SVG to remount on each tick so
  // the CSS animation restarts cleanly without a JS rAF loop.
  const [tick, setTick] = useState(0)
  const reducedMotion = useRef(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    reducedMotion.current =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
  }, [])

  useEffect(() => {
    if (paused || reducedMotion.current) return
    const id = window.setTimeout(() => {
      setActive((i) => (i + 1) % SLIDES.length)
      setTick((t) => t + 1)
    }, DWELL_MS)
    return () => window.clearTimeout(id)
  }, [active, paused])

  const slide = SLIDES[active]

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Industry research"
    >
      {/* The cover IS the carousel item — full-bleed, no chrome. The
          rounded-corner clip + drop shadow makes it read like a printed
          report sitting on the sidebar surface. */}
      <div
        key={slide.id}
        className={cn(
          "group relative w-full overflow-hidden rounded-lg",
          "ring-1 ring-foreground/10",
          "shadow-[0_8px_24px_-8px_rgba(0,0,0,0.55),0_1px_0_0_rgba(255,255,255,0.04)_inset]",
          "transition-transform duration-300 hover:-translate-y-0.5",
          "animate-in fade-in zoom-in-[0.98] duration-500",
        )}
        style={{ aspectRatio: slide.aspect }}
      >
        {/* Tap-target — the cover itself opens the PDF inline. */}
        <Link
          href={slide.pdfHref}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${slide.label} (PDF)`}
          className="block h-full w-full"
        >
          <Image
            src={slide.cover}
            alt={`${slide.label} report cover`}
            fill
            sizes="(max-width: 1024px) 18rem, 16rem"
            className="object-cover"
            priority={active === 0}
          />
        </Link>

        {/* Floating Download button — separate from the cover tap so users
            who want the file (rather than an inline preview) get a clear
            affordance. Always visible on touch/keyboard focus; subtly
            de-emphasised at rest on hover-capable devices. */}
        <a
          href={slide.pdfHref}
          download={slide.filename}
          aria-label={`Download ${slide.label} as PDF`}
          className={cn(
            "absolute bottom-2 right-2 inline-flex items-center gap-1.5",
            "rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-medium",
            "text-foreground ring-1 ring-foreground/10 backdrop-blur-md",
            "shadow-sm transition-all duration-200",
            "hover:bg-background hover:text-foreground hover:scale-105",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            // On hover-capable devices, fade in only when the user is
            // engaging — keeps the cover pristine at rest. Always visible
            // on touch (no hover) and when keyboard focus enters.
            "opacity-100 sm:opacity-0 group-hover:opacity-100 group-focus-within:opacity-100",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <Download className="size-3" aria-hidden />
          PDF
        </a>
      </div>

      {/* Footer: pip indicators + circular dwell spinner. Sits below the
          cover so the artwork stays unobstructed. */}
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5" role="tablist">
          {SLIDES.map((s, i) => {
            const isActive = i === active
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Show ${s.label}`}
                onClick={() => {
                  setActive(i)
                  setTick((t) => t + 1)
                }}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  isActive
                    ? "w-6 bg-foreground/70"
                    : "w-1.5 bg-foreground/20 hover:bg-foreground/40",
                )}
              />
            )
          })}
        </div>

        <svg
          key={`spinner-${active}-${tick}`}
          viewBox="0 0 16 16"
          className="size-3.5 -rotate-90 motion-reduce:hidden"
          aria-hidden
        >
          <circle
            cx="8"
            cy="8"
            r="6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-foreground/15"
          />
          <circle
            cx="8"
            cy="8"
            r="6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className={cn(
              "text-foreground/70",
              !paused && "animate-[carousel-spin_7s_linear_forwards]",
            )}
            strokeDasharray={SPINNER_CIRCUMFERENCE}
            strokeDashoffset={paused ? 0 : SPINNER_CIRCUMFERENCE}
            style={{ animationPlayState: paused ? "paused" : "running" }}
          />
        </svg>
      </div>
    </div>
  )
}
