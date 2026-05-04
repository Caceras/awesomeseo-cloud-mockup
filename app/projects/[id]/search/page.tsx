import { notFound } from "next/navigation"
import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  ExternalLink,
} from "lucide-react"
import {
  projectById,
  googleSummary,
  serpFeatureLabels,
  serpKeywords,
  type SerpFeature,
} from "@/lib/mock-data"
import { GoogleLogo } from "@/components/engine-logos"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

function formatNumber(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k"
  return n.toString()
}

function formatPct(n: number, fractionDigits = 1) {
  const sign = n > 0 ? "+" : ""
  return sign + (n * 100).toFixed(fractionDigits) + "%"
}

function DeltaPill({
  value,
  invert = false,
  unit = "%",
}: {
  value: number
  /** When true, lower numbers are good (e.g. position). */
  invert?: boolean
  unit?: "%" | "pts" | "abs"
}) {
  const good = invert ? value < 0 : value > 0
  const neutral = value === 0
  const Icon = neutral ? Minus : good ? ArrowUpRight : ArrowDownRight
  let label: string
  if (unit === "%") label = formatPct(value)
  else if (unit === "pts") label = `${value > 0 ? "+" : ""}${value.toFixed(1)} pts`
  else label = `${value > 0 ? "+" : ""}${value.toFixed(1)}`

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium tabular-nums",
        neutral
          ? "bg-muted text-muted-foreground"
          : good
            ? "bg-emerald-500/10 text-emerald-300"
            : "bg-rose-500/10 text-rose-300",
      )}
    >
      <Icon className="size-3" />
      {label}
    </span>
  )
}

const featureColors: Record<SerpFeature, string> = {
  "ai-overview": "bg-primary/15 text-primary border-primary/30",
  "featured-snippet": "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  "people-also-ask": "bg-sky-500/10 text-sky-300 border-sky-500/30",
  video: "bg-rose-500/10 text-rose-300 border-rose-500/30",
  "image-pack": "bg-amber-500/10 text-amber-300 border-amber-500/30",
  "site-links": "bg-violet-500/10 text-violet-300 border-violet-500/30",
  shopping: "bg-orange-500/10 text-orange-300 border-orange-500/30",
}

function PositionBadge({ pos }: { pos: number }) {
  const tier =
    pos <= 3 ? "great" : pos <= 10 ? "page-one" : pos <= 20 ? "page-two" : "deep"
  return (
    <span
      className={cn(
        "inline-flex h-7 min-w-7 items-center justify-center rounded-md px-1.5 text-sm font-semibold tabular-nums",
        tier === "great" && "bg-emerald-500/15 text-emerald-300",
        tier === "page-one" && "bg-primary/15 text-primary",
        tier === "page-two" && "bg-amber-500/10 text-amber-300",
        tier === "deep" && "bg-muted text-muted-foreground",
      )}
    >
      {pos}
    </span>
  )
}

export default async function GoogleSearchPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = projectById(id)
  if (!project) notFound()

  const sorted = [...serpKeywords].sort((a, b) => a.position - b.position)

  // Distribution buckets
  const top3 = serpKeywords.filter((k) => k.position <= 3).length
  const top10 = serpKeywords.filter((k) => k.position <= 10).length
  const top20 = serpKeywords.filter((k) => k.position <= 20).length
  const deeper = serpKeywords.length - top20

  const aiOverviewCount = serpKeywords.filter((k) =>
    k.features.includes("ai-overview"),
  ).length

  return (
    <div className="mx-auto max-w-6xl py-10 space-y-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between max-w-4xl">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <GoogleLogo size={14} />
            Google Search
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-balance">
            How visible am I in Google?
          </h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed text-pretty">
            Tracked keywords, position changes and SERP features pulled from the
            last 28 days of Search Console + live SERP scrapes.
          </p>
        </div>
        <Button variant="outline" size="sm">
          Connect Search Console
        </Button>
      </header>

      {/* Hero KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="text-xs text-muted-foreground">Impressions</div>
          <div className="mt-2 flex items-end gap-2">
            <div className="font-mono text-3xl font-semibold tabular-nums">
              {formatNumber(googleSummary.totalImpressions)}
            </div>
            <DeltaPill value={googleSummary.deltaImpressions} />
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-muted-foreground">Clicks</div>
          <div className="mt-2 flex items-end gap-2">
            <div className="font-mono text-3xl font-semibold tabular-nums">
              {formatNumber(googleSummary.totalClicks)}
            </div>
            <DeltaPill value={googleSummary.deltaClicks} />
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-muted-foreground">Avg position</div>
          <div className="mt-2 flex items-end gap-2">
            <div className="font-mono text-3xl font-semibold tabular-nums">
              {googleSummary.avgPosition.toFixed(1)}
            </div>
            <DeltaPill
              value={googleSummary.deltaPosition}
              invert
              unit="abs"
            />
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-muted-foreground">CTR</div>
          <div className="mt-2 flex items-end gap-2">
            <div className="font-mono text-3xl font-semibold tabular-nums">
              {(googleSummary.ctr * 100).toFixed(1)}%
            </div>
            <DeltaPill value={googleSummary.deltaCtr} unit="pts" />
          </div>
        </Card>
      </div>

      {/* Position distribution + AI Overview presence */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Position distribution</div>
            <div className="text-xs text-muted-foreground">
              {serpKeywords.length} tracked keywords
            </div>
          </div>
          <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="bg-emerald-500"
              style={{ width: `${(top3 / serpKeywords.length) * 100}%` }}
              aria-label={`Top 3: ${top3}`}
            />
            <div
              className="bg-primary"
              style={{
                width: `${((top10 - top3) / serpKeywords.length) * 100}%`,
              }}
              aria-label={`Pos 4-10: ${top10 - top3}`}
            />
            <div
              className="bg-amber-500/70"
              style={{
                width: `${((top20 - top10) / serpKeywords.length) * 100}%`,
              }}
              aria-label={`Pos 11-20: ${top20 - top10}`}
            />
            <div
              className="bg-muted-foreground/30"
              style={{ width: `${(deeper / serpKeywords.length) * 100}%` }}
              aria-label={`Deeper: ${deeper}`}
            />
          </div>
          <dl className="mt-4 grid grid-cols-4 gap-3 text-xs">
            <div>
              <dt className="text-muted-foreground">Top 3</dt>
              <dd className="font-mono text-base font-semibold text-emerald-300">
                {top3}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Pos 4–10</dt>
              <dd className="font-mono text-base font-semibold text-primary">
                {top10 - top3}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Pos 11–20</dt>
              <dd className="font-mono text-base font-semibold text-amber-300">
                {top20 - top10}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Beyond 20</dt>
              <dd className="font-mono text-base font-semibold text-muted-foreground">
                {deeper}
              </dd>
            </div>
          </dl>
        </Card>
        <Card className="p-5">
          <div className="text-sm font-medium">AI Overview exposure</div>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            Keywords where Google now shows an AI Overview above your result.
          </p>
          <div className="mt-4 flex items-end gap-3">
            <div className="font-mono text-4xl font-semibold tabular-nums">
              {aiOverviewCount}
            </div>
            <div className="pb-1 text-xs text-muted-foreground">
              of {serpKeywords.length} tracked
            </div>
          </div>
          <Button variant="outline" size="sm" className="mt-4 w-full">
            Optimise for AI Overviews
          </Button>
        </Card>
      </div>

      {/* Keyword table */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <div className="text-sm font-medium">Tracked keywords</div>
            <div className="text-xs text-muted-foreground">
              Sorted by current position. Negative deltas mean you climbed.
            </div>
          </div>
          <Button variant="ghost" size="sm">
            Add keyword
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[40%]">Query</TableHead>
                <TableHead>Pos</TableHead>
                <TableHead>Δ</TableHead>
                <TableHead className="text-right">Impr.</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="text-right">CTR</TableHead>
                <TableHead>SERP features</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((k) => (
                <TableRow key={k.id} className="text-sm">
                  <TableCell>
                    <div className="font-medium">{k.query}</div>
                    <a
                      href={k.url}
                      className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      {k.url}
                      <ExternalLink className="size-3" />
                    </a>
                  </TableCell>
                  <TableCell>
                    <PositionBadge pos={k.position} />
                  </TableCell>
                  <TableCell>
                    {k.delta === 0 ? (
                      <span className="text-xs text-muted-foreground">—</span>
                    ) : (
                      <DeltaPill value={k.delta} invert unit="abs" />
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {formatNumber(k.impressions)}
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {formatNumber(k.clicks)}
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {(k.ctr * 100).toFixed(1)}%
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {k.features.length === 0 ? (
                        <span className="text-xs text-muted-foreground">—</span>
                      ) : (
                        k.features.map((f) => (
                          <Badge
                            key={f}
                            variant="outline"
                            className={cn(
                              "border text-[10px] font-medium",
                              featureColors[f],
                            )}
                          >
                            {serpFeatureLabels[f]}
                          </Badge>
                        ))
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
