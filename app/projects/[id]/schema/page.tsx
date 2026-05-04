import { notFound } from "next/navigation"
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { projectById, schemaSummary } from "@/lib/mock-data"

// One question: where is structured data missing or broken?

export default async function SchemaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = projectById(id)
  if (!project) notFound()

  const totalErrors = schemaSummary.reduce((s, x) => s + x.errors, 0)
  const totalWarnings = schemaSummary.reduce((s, x) => s + x.warnings, 0)
  const totalValid = schemaSummary.reduce((s, x) => s + x.valid, 0)
  const totalPages = schemaSummary.reduce((s, x) => s + x.pages, 0)
  const validityRate = Math.round((totalValid / totalPages) * 100)

  return (
    <div className="mx-auto max-w-5xl py-10 space-y-10">
      <header>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">
          Structured data
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Is my schema valid?
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Validated against schema.org and Google&apos;s rich-results requirements.
          Errors block rich snippets in SERPs; warnings reduce eligibility.
        </p>
      </header>

      {/* Single hero number */}
      <section className="rounded-2xl border border-border bg-card p-6 lg:p-8 grid gap-6 sm:grid-cols-[auto_1fr] items-center">
        <div className="flex items-baseline gap-2">
          <span className="text-6xl font-semibold tabular leading-none">
            {validityRate}
          </span>
          <span className="text-2xl text-muted-foreground">%</span>
        </div>
        <div>
          <div className="font-medium">of structured-data items are valid</div>
          <p className="mt-1 text-sm text-muted-foreground">
            {totalValid.toLocaleString()} valid · {totalWarnings} warnings ·{" "}
            <span className="text-destructive">{totalErrors} errors</span> across{" "}
            {totalPages.toLocaleString()} markup instances.
          </p>
          {/* Stacked bar */}
          <div className="mt-4 h-2 rounded-full overflow-hidden bg-muted flex">
            <div
              className="bg-success"
              style={{ width: `${(totalValid / totalPages) * 100}%` }}
            />
            <div
              className="bg-warning"
              style={{ width: `${(totalWarnings / totalPages) * 100}%` }}
            />
            <div
              className="bg-destructive"
              style={{ width: `${(totalErrors / totalPages) * 100}%` }}
            />
          </div>
        </div>
      </section>

      {/* Per-type list */}
      <section>
        <header className="flex items-end justify-between mb-3">
          <div>
            <h2 className="text-base font-medium">Schema types in use</h2>
            <p className="text-xs text-muted-foreground">
              One row per schema.org type detected on the site.
            </p>
          </div>
        </header>
        <ul className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
          {schemaSummary.map((s) => {
            const errPct = (s.errors / s.pages) * 100
            const warnPct = (s.warnings / s.pages) * 100
            const validPct = (s.valid / s.pages) * 100
            return (
              <li key={s.type} className="px-5 py-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{s.type}</span>
                      <span className="text-xs text-muted-foreground tabular">
                        {s.pages} item{s.pages === 1 ? "" : "s"}
                      </span>
                    </div>
                    {s.topError && (
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                        Top error: {s.topError}
                      </p>
                    )}
                  </div>
                  <div className="hidden sm:flex items-center gap-3 w-56">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-muted flex">
                      <div className="bg-success" style={{ width: `${validPct}%` }} />
                      <div className="bg-warning" style={{ width: `${warnPct}%` }} />
                      <div
                        className="bg-destructive"
                        style={{ width: `${errPct}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs tabular shrink-0">
                    <Stat
                      icon={<CheckCircle2 className="size-3.5 text-success" />}
                      value={s.valid}
                    />
                    <Stat
                      icon={<AlertTriangle className="size-3.5 text-warning" />}
                      value={s.warnings}
                    />
                    <Stat
                      icon={<XCircle className="size-3.5 text-destructive" />}
                      value={s.errors}
                      muted={s.errors === 0}
                    />
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}

function Stat({
  icon,
  value,
  muted,
}: {
  icon: React.ReactNode
  value: number
  muted?: boolean
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 w-12 justify-end",
        muted && "text-muted-foreground",
      )}
    >
      {icon}
      {value}
    </span>
  )
}
