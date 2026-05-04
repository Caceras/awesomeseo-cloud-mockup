import { notFound } from "next/navigation"
import { Search, Filter, Download } from "lucide-react"
import { PageInventoryTable } from "@/components/page-inventory-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { inventoryRows, projectById } from "@/lib/mock-data"

// One question: which pages exist on this site, and what's the status of each?
// Visual focus: the table — bleed to the edges, nothing else competes.

export default async function InventoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = projectById(id)
  if (!project) notFound()

  const filters = [
    { label: "All", count: 1284, active: true },
    { label: "Indexable", count: 1196 },
    { label: "Errors", count: 3 },
    { label: "Redirects", count: 28 },
    { label: "Canonical", count: 14 },
    { label: "Slow LCP", count: 41 },
    { label: "Thin", count: 22 },
    { label: "Orphan", count: 8 },
  ]

  return (
    <>
      {/* Bleed past the layout's px-4 lg:px-8 to make the table the full-width focus. */}
      <div className="-mx-4 lg:-mx-8">
        {/* Toolbar — full bleed, owns the table */}
        <div className="border-b border-border bg-background/80 backdrop-blur-sm">
          <div className="flex flex-wrap items-center gap-2 px-4 lg:px-8 py-3">
            {/* Count + filter chips, inline */}
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <span className="text-xs text-muted-foreground tabular shrink-0 mr-1">
                <span className="text-foreground font-medium">
                  {inventoryRows.length}
                </span>{" "}
                of{" "}
                <span className="text-foreground font-medium">1,284</span>{" "}
                pages
              </span>
              <span className="h-4 w-px bg-border shrink-0" aria-hidden="true" />
              {filters.map((f) => (
                <button
                  key={f.label}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
                    f.active
                      ? "border-primary/60 bg-primary/15 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                  }`}
                >
                  <span>{f.label}</span>
                  <span className="tabular text-[10px] opacity-70">
                    {f.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search + actions, pushed right */}
            <div className="ml-auto flex items-center gap-2">
              <div className="relative w-56">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  type="search"
                  placeholder="Filter URLs…"
                  className="pl-8 h-8 bg-card/60 border-border text-xs"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent h-8 text-xs"
              >
                <Filter className="size-3.5" /> Filters
              </Button>
              <Button size="sm" className="h-8 text-xs">
                <Download className="size-3.5" /> Export
              </Button>
            </div>
          </div>
        </div>

        {/* The table — edge to edge */}
        <PageInventoryTable rows={inventoryRows} />

        {/* Footer pagination — full bleed */}
        <div className="border-t border-border">
          <div className="flex items-center justify-between px-4 lg:px-8 py-3 text-xs text-muted-foreground">
            <span>
              Showing{" "}
              <span className="text-foreground tabular">
                {inventoryRows.length}
              </span>{" "}
              of <span className="text-foreground tabular">1,284</span> pages
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent h-7 text-xs"
                disabled
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent h-7 text-xs"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}
