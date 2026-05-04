import Image from "next/image"
import type { Project } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

/**
 * Single source of truth for the way a Project is iconified across the
 * app. When `project.avatar` is set we render the brand image inside a
 * rounded tile with a soft inset ring — same footprint, same radius, no
 * background bleed. When it's missing we fall back to the existing
 * gradient-letter mark so newly added projects still look intentional.
 *
 * Sizes are passed in pixels because the existing call sites already
 * use the Tailwind `size-N` ladder (5/8/9/10) and rely on exact pixel
 * footprints. Mapping size → radius keeps small chips visually crisp
 * and large tiles soft.
 */
export function ProjectAvatar({
  project,
  size,
  className,
  /** Set on a single hero/top avatar to prioritize its decode and skip
   *  lazy-loading. Everything else stays lazy so off-screen lists don't
   *  fight for the network with the LCP image. */
  priority = false,
}: {
  project: Pick<Project, "name" | "favicon" | "avatar">
  size: number
  className?: string
  priority?: boolean
}) {
  const radius =
    size <= 20 ? "rounded-md" : size <= 36 ? "rounded-lg" : "rounded-xl"

  // The fallback gradient tile preserves the historical look exactly so
  // a missing avatar never feels like a bug.
  const Fallback = (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center bg-gradient-to-br from-primary/40 to-primary/10 ring-1 ring-inset ring-primary/20 font-semibold text-primary",
        radius,
        className,
      )}
      style={{
        width: size,
        height: size,
        // Letter scales with tile so a size-5 chip stays legible.
        fontSize: Math.max(10, Math.round(size * 0.42)),
      }}
      aria-hidden
    >
      {project.favicon}
    </span>
  )

  if (!project.avatar) return Fallback

  return (
    <span
      className={cn(
        "relative shrink-0 overflow-hidden ring-1 ring-inset ring-border/60 bg-card",
        radius,
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <Image
        src={project.avatar}
        alt=""
        width={size * 2}
        height={size * 2}
        // We render at `size` but request a 2x source so retina screens
        // stay crisp. `sizes` matches that 1× display width so Next.js
        // picks the smallest variant that fits.
        sizes={`${size}px`}
        className="size-full object-cover"
        // Default to lazy + low fetchPriority so 6-8 list avatars never
        // compete with the page's actual LCP image. Hero/topbar callers
        // can pass `priority` to opt back into eager + high priority.
        loading={priority ? "eager" : "lazy"}
        priority={priority}
        fetchPriority={priority ? "high" : "low"}
        decoding="async"
      />
    </span>
  )
}
