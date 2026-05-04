/**
 * Warms the optimizer + browser cache for the dashboard's heaviest
 * images while the user is still inside the access gate. The gate stages
 * (riddle login → jumpscare → onboarding) are guaranteed to be visible
 * for several seconds before the dashboard mounts, which is plenty of
 * time to fetch and decode the SEO essentials cards and the sidebar
 * research carousel covers in the background.
 *
 * Why this matters:
 *   The cards' source PNGs are ~600KB–1.4MB each (~6MB raw total). Even
 *   though `next/image` emits AVIF/WebP variants, the optimizer has to
 *   *generate* those variants on first request, and the browser still
 *   has to download them. Doing both on the dashboard's critical path
 *   produces the slow load the user is seeing. Pre-fetching during the
 *   gate amortises that cost into time the user is already spending in
 *   another part of the UI, so the dashboard arrives fully warm.
 *
 * How it works:
 *   We render `<link rel="preload" as="image">` tags pointing at the
 *   exact optimized URLs `next/image` would request. React 19 hoists
 *   these into <head> automatically. We also include `imageSrcSet` /
 *   `imageSizes` so the browser picks the variant matching the user's
 *   actual viewport / DPR — no wasted bytes on the wrong size.
 */

import * as React from "react"

/** Build the optimized URL Next.js' image endpoint will serve. */
function nextImg(src: string, width: number, quality = 65) {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`
}

/** Build a srcset string covering the candidate widths. */
function buildSrcSet(src: string, widths: number[], quality = 65) {
  return widths.map((w) => `${nextImg(src, w, quality)} ${w}w`).join(", ")
}

// SEO essentials icon tiles — match `seo-essentials-grid.tsx`:
//   sizes="80px"
//   quality={70}
// Rendered at 64px in the card; 128w covers 2x retina with headroom.
// These are tiny (~5KB AVIF each), but preloading still saves a render
// frame because the icons are decoded and ready in the browser cache
// the moment the dashboard mounts.
const ICON_SOURCES = [
  "/icons/search.png",
  "/icons/bars.png",
  "/icons/wave.png",
  "/icons/trend.png",
  "/icons/sparkle.png",
  "/icons/squircle-circle.png",
] as const
const ICON_WIDTHS = [128, 256] as const
const ICON_SIZES = "80px"

// Sidebar research carousel covers — rendered at ~200px wide; 384w is
// plenty for 2x DPR. Default quality (75) since the carousel uses no
// explicit quality prop.
const COVER_SOURCES = [
  "/reports/aeo-divide-cover.png",
  "/reports/geo-2026-cover.png",
] as const
const COVER_WIDTHS = [256, 384] as const
const COVER_SIZES = "(min-width: 1024px) 224px, 80vw"

export function DashboardPreloads() {
  return (
    <>
      {ICON_SOURCES.map((src) => (
        <link
          key={src}
          rel="preload"
          as="image"
          // Fallback `href` — older browsers without imagesrcset support
          // will fetch this directly. 128w covers a 2x retina render.
          href={nextImg(src, 128, 70)}
          // Modern browsers use the srcset + sizes pair to pick the
          // exact width they'd render, exactly matching what next/image
          // will later request from the same URL.
          imageSrcSet={buildSrcSet(src, [...ICON_WIDTHS], 70)}
          imageSizes={ICON_SIZES}
          // Lower priority than the gate UI itself — we don't want to
          // fight the riddle's own resources for bandwidth.
          fetchPriority="low"
        />
      ))}
      {COVER_SOURCES.map((src) => (
        <link
          key={src}
          rel="preload"
          as="image"
          href={nextImg(src, 384, 75)}
          imageSrcSet={buildSrcSet(src, [...COVER_WIDTHS], 75)}
          imageSizes={COVER_SIZES}
          fetchPriority="low"
        />
      ))}
    </>
  )
}
