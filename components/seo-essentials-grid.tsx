import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

/**
 * Six on-page-SEO essentials surfaced from the portfolio dashboard.
 *
 * Each card is now a compact icon-tile + text pairing instead of a
 * full-bleed illustration. The original /cards/*.png assets were ~1MB
 * each (~6MB raw for the row); the new /icons/*.png tiles average ~35KB
 * raw and ship as ~5KB AVIF at the 80px render size, which means the
 * whole row downloads in roughly the time the old grid took to paint
 * its first card. Title + tagline are real text so they're instantly
 * selectable, translatable, and indexable.
 *
 * `riskiestProjectId` lets every card jump straight into the workspace
 * where the corresponding fix is most urgent — keeps the dashboard
 * actionable instead of decorative.
 */

type Essential = {
  slug: string
  /** Path under /projects/[id] this card opens. */
  hrefSegment: string
  /** Public path to the icon tile. */
  icon: string
  title: string
  tagline: string
}

const ESSENTIALS: Essential[] = [
  {
    slug: "title",
    hrefSegment: "issues?type=title",
    icon: "/icons/search.png",
    title: "Title Tag",
    tagline: "Shape stronger first impressions in search.",
  },
  {
    slug: "meta",
    hrefSegment: "issues?type=meta-description",
    icon: "/icons/bars.png",
    title: "Meta Description",
    tagline: "Turn impressions into qualified clicks.",
  },
  {
    slug: "og",
    hrefSegment: "social",
    icon: "/icons/wave.png",
    title: "Open Graph",
    tagline: "Control how pages look when shared.",
  },
  {
    slug: "canonical",
    hrefSegment: "issues?type=canonical",
    icon: "/icons/trend.png",
    title: "Canonical",
    tagline: "Consolidate duplicate signals with confidence.",
  },
  {
    slug: "schema",
    hrefSegment: "schema",
    icon: "/icons/sparkle.png",
    title: "Schema",
    tagline: "Add structured data search engines understand.",
  },
  {
    slug: "favicon",
    hrefSegment: "issues?type=favicon",
    icon: "/icons/squircle-circle.png",
    title: "Favicon",
    tagline: "Keep your brand recognizable in every tab.",
  },
]

export function SeoEssentialsGrid({
  riskiestProjectId,
}: {
  /** The project we deep-link into when a card is clicked. */
  riskiestProjectId: string
}) {
  return (
    <section className="mt-10">
      <header className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-base font-medium">On-page essentials</h2>
          <p className="text-xs text-muted-foreground">
            The six checks that move the most pages, fastest.
          </p>
        </div>
      </header>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ESSENTIALS.map((card, i) => {
          // First three icons are above the fold on a typical lg viewport.
          // Mark those as priority so they fetch on the critical path.
          const isAboveFold = i < 3
          return (
            <li key={card.slug}>
              <Link
                href={`/projects/${riskiestProjectId}/${card.hrefSegment}`}
                aria-label={`${card.title} — ${card.tagline}`}
                className="group relative flex items-start gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {/* Lightweight icon tile. Rendered at 64px in the card
                    but we ask the optimizer for a 2x source so retina
                    displays stay crisp. AVIF + the 80px sizes hint puts
                    each tile at ~5KB on the wire. */}
                <span className="shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={card.icon}
                    alt=""
                    aria-hidden="true"
                    width={128}
                    height={128}
                    quality={70}
                    priority={isAboveFold}
                    loading={isAboveFold ? "eager" : "lazy"}
                    sizes="80px"
                    className="block size-16 object-cover"
                  />
                </span>

                {/* Title + tagline render as real text — no images, so
                    they paint with the rest of the page on first byte. */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold leading-tight text-foreground">
                      {card.title}
                    </h3>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 shrink-0 text-muted-foreground/60 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                    />
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                    {card.tagline}
                  </p>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
