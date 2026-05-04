"use client"

import {
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react"
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  type Simulation,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from "d3-force"
import { Network, Workflow } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Real interactive node graph with two layout modes:
 *
 *   1. Force — d3-force simulation, draggable nodes, hover highlights
 *      connected neighborhood. Settles to a stable layout but stays
 *      live so users can grab any node and reposition it.
 *
 *   2. Tree — hierarchical BFS from "home", smooth bezier edges, no
 *      drag. Shows parent → child relationships clearly. "Weak" edges
 *      (siblings, cross-links) are hidden here to keep the hierarchy
 *      readable; orphan / broken nodes drop into a final row.
 *
 * Switching modes interpolates implicitly because nodes carry their
 * own (x, y) and the next tick of the simulation either takes over
 * (force) or is overridden by fixed positions (tree).
 */

type NodeKind = "home" | "hub" | "leaf" | "orphan" | "broken"

type GraphNode = SimulationNodeDatum & {
  id: string
  label: string
  kind: NodeKind
  size: number
}

type GraphLink = SimulationLinkDatum<GraphNode> & {
  source: string | GraphNode
  target: string | GraphNode
  weak?: boolean
}

const RAW_NODES: ReadonlyArray<Omit<GraphNode, keyof SimulationNodeDatum>> = [
  { id: "home", label: "/", kind: "home", size: 22 },
  { id: "blog", label: "/blog", kind: "hub", size: 16 },
  { id: "shop", label: "/shop", kind: "hub", size: 16 },
  { id: "about", label: "/about", kind: "hub", size: 12 },
  { id: "pricing", label: "/pricing", kind: "hub", size: 14 },
  { id: "post-1", label: "/blog/seo-2026", kind: "leaf", size: 8 },
  { id: "post-2", label: "/blog/cwv-guide", kind: "leaf", size: 8 },
  { id: "post-3", label: "/blog/case-study", kind: "leaf", size: 7 },
  { id: "p-1", label: "/shop/wool", kind: "leaf", size: 9 },
  { id: "p-2", label: "/shop/wool-charcoal", kind: "leaf", size: 8 },
  { id: "p-3", label: "/shop/runner", kind: "leaf", size: 8 },
  { id: "contact", label: "/contact", kind: "leaf", size: 9 },
  { id: "orphan-1", label: "/legacy/promo", kind: "orphan", size: 7 },
  { id: "orphan-2", label: "/draft/v3", kind: "orphan", size: 6 },
  { id: "broken-1", label: "/old-pricing", kind: "broken", size: 6 },
]

const RAW_LINKS: ReadonlyArray<{
  source: string
  target: string
  weak?: boolean
}> = [
  { source: "home", target: "blog" },
  { source: "home", target: "shop" },
  { source: "home", target: "about" },
  { source: "home", target: "pricing" },
  { source: "home", target: "contact" },
  { source: "blog", target: "post-1" },
  { source: "blog", target: "post-2" },
  { source: "blog", target: "post-3" },
  { source: "shop", target: "p-1" },
  { source: "shop", target: "p-2" },
  { source: "shop", target: "p-3" },
  { source: "p-1", target: "p-2", weak: true },
  { source: "post-1", target: "post-2", weak: true },
  { source: "about", target: "contact", weak: true },
  { source: "pricing", target: "shop", weak: true },
  { source: "pricing", target: "broken-1", weak: true },
]

const KIND_COLOR: Record<NodeKind, string> = {
  home: "var(--color-primary)",
  hub: "var(--color-chart-1)",
  leaf: "var(--color-chart-5)",
  orphan: "var(--color-warning)",
  broken: "var(--color-destructive)",
}

const VIEW_W = 820
const VIEW_H = 480

type Mode = "force" | "tree"

/** BFS from "home" — assigns a depth to every node reachable via
 *  strong edges. Returns positions plus the layered adjacency so the
 *  tree renderer can draw clean parent→child curves. */
function computeTreeLayout() {
  const adj = new Map<string, string[]>()
  for (const e of RAW_LINKS) {
    if (e.weak) continue
    if (!adj.has(e.source)) adj.set(e.source, [])
    adj.get(e.source)!.push(e.target)
  }

  const depth = new Map<string, number>()
  const queue: Array<[string, number]> = [["home", 0]]
  depth.set("home", 0)
  while (queue.length) {
    const [id, d] = queue.shift()!
    for (const child of adj.get(id) ?? []) {
      if (!depth.has(child)) {
        depth.set(child, d + 1)
        queue.push([child, d + 1])
      }
    }
  }

  // Orphan / broken / anything unreachable lands in a final row.
  const reachableMax = depth.size > 0 ? Math.max(...depth.values()) : 0
  const lastRow = reachableMax + 1
  for (const node of RAW_NODES) {
    if (!depth.has(node.id)) depth.set(node.id, lastRow)
  }

  const byDepth = new Map<number, string[]>()
  for (const node of RAW_NODES) {
    const d = depth.get(node.id)!
    if (!byDepth.has(d)) byDepth.set(d, [])
    byDepth.get(d)!.push(node.id)
  }

  const layers = [...byDepth.keys()].sort((a, b) => a - b)
  const VERT_PADDING = 60
  const verticalStep = (VIEW_H - VERT_PADDING * 2) / Math.max(layers.length - 1, 1)

  const pos = new Map<string, { x: number; y: number }>()
  for (const d of layers) {
    const ids = byDepth.get(d)!
    const step = VIEW_W / (ids.length + 1)
    ids.forEach((id, i) => {
      pos.set(id, {
        x: (i + 1) * step,
        y: VERT_PADDING + (d - layers[0]) * verticalStep,
      })
    })
  }

  return pos
}

export function LinkGraph() {
  const [mode, setMode] = useState<Mode>("force")
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  // Tick counter — drives re-renders on simulation tick without
  // copying the entire node array into React state every frame.
  const [, rerender] = useReducer((x: number) => x + 1, 0)

  // Persistent mutable graph state. The simulation mutates these in
  // place, and React reads from them at render time.
  const nodesRef = useRef<GraphNode[]>(
    RAW_NODES.map((n) => ({ ...n })),
  )
  const linksRef = useRef<GraphLink[]>(
    RAW_LINKS.map((l) => ({ ...l })),
  )
  const simRef = useRef<Simulation<GraphNode, GraphLink> | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)

  // Tree positions only depend on the static dataset, so memoize once.
  const treePositions = useMemo(() => computeTreeLayout(), [])

  // Adjacency map for hover highlighting — symmetric so hovering any
  // endpoint dims everything except its direct neighbors.
  const neighbors = useMemo(() => {
    const map = new Map<string, Set<string>>()
    for (const node of RAW_NODES) map.set(node.id, new Set())
    for (const e of RAW_LINKS) {
      map.get(e.source)?.add(e.target)
      map.get(e.target)?.add(e.source)
    }
    return map
  }, [])

  // (Re)initialize the layout whenever the mode flips.
  useEffect(() => {
    const nodes = nodesRef.current
    const links = linksRef.current

    if (mode === "force") {
      // Release any pinned positions from tree mode, then start the
      // simulation. Reasonable forces tuned for ~15 nodes — strong
      // enough repulsion to spread, link distance long enough that
      // labels don't overlap, collide radius prevents nodes covering
      // each other.
      for (const n of nodes) {
        n.fx = null
        n.fy = null
        if (n.x === undefined) n.x = VIEW_W / 2 + (Math.random() - 0.5) * 60
        if (n.y === undefined) n.y = VIEW_H / 2 + (Math.random() - 0.5) * 60
      }

      const sim = forceSimulation<GraphNode>(nodes)
        .force(
          "link",
          forceLink<GraphNode, GraphLink>(links)
            .id((d) => d.id)
            .distance((d) => (d.weak ? 110 : 80))
            .strength((d) => (d.weak ? 0.3 : 0.7)),
        )
        .force("charge", forceManyBody<GraphNode>().strength(-260))
        .force("center", forceCenter(VIEW_W / 2, VIEW_H / 2))
        .force(
          "collide",
          forceCollide<GraphNode>().radius((d) => d.size + 10),
        )
        .alpha(1)
        .alphaDecay(0.03)
        .on("tick", rerender)

      simRef.current = sim
      return () => {
        sim.stop()
        simRef.current = null
      }
    }

    // Tree mode: stop any running simulation and pin every node to
    // its computed hierarchical position.
    simRef.current?.stop()
    simRef.current = null
    for (const n of nodes) {
      const p = treePositions.get(n.id)
      if (!p) continue
      n.x = p.x
      n.y = p.y
      n.fx = p.x
      n.fy = p.y
    }
    rerender()
  }, [mode, treePositions])

  /** Convert a client coordinate to the SVG's user space, accounting
   *  for the responsive viewBox-vs-bounding-rect scale ratio. */
  function clientToSvg(clientX: number, clientY: number) {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const rect = svg.getBoundingClientRect()
    return {
      x: ((clientX - rect.left) / rect.width) * VIEW_W,
      y: ((clientY - rect.top) / rect.height) * VIEW_H,
    }
  }

  function handleNodePointerDown(
    e: ReactPointerEvent<SVGGElement>,
    node: GraphNode,
  ) {
    if (mode !== "force") return
    e.preventDefault()
    e.stopPropagation()
    ;(e.currentTarget as Element).setPointerCapture(e.pointerId)

    const sim = simRef.current
    sim?.alphaTarget(0.3).restart()
    const start = clientToSvg(e.clientX, e.clientY)
    node.fx = node.x ?? start.x
    node.fy = node.y ?? start.y

    const onMove = (ev: PointerEvent) => {
      const p = clientToSvg(ev.clientX, ev.clientY)
      node.fx = p.x
      node.fy = p.y
    }
    const onUp = () => {
      sim?.alphaTarget(0)
      // Release the pin so the node can drift back into place; if
      // you wanted "stick where dropped" behavior, leave fx/fy set.
      node.fx = null
      node.fy = null
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
    }
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
  }

  /** Helper: a link's endpoint may be a string (pre-link) or the
   *  resolved node object (after d3-force has linked them). */
  function endpointId(end: string | GraphNode): string {
    return typeof end === "string" ? end : end.id
  }
  function endpointPos(end: string | GraphNode) {
    if (typeof end === "string") {
      const n = nodesRef.current.find((x) => x.id === end)
      return { x: n?.x ?? 0, y: n?.y ?? 0 }
    }
    return { x: end.x ?? 0, y: end.y ?? 0 }
  }

  const nodes = nodesRef.current
  const links = linksRef.current

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header — title + mode switcher.
          Segmented control mirrors the engine switcher pattern: one
          highlighted "current" segment, the others act as buttons. */}
      <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-border">
        <div className="text-xs text-muted-foreground">
          {mode === "force"
            ? "Drag any node to rearrange. Hover to highlight its neighborhood."
            : "Hierarchical view from the homepage. Cross-links are hidden for clarity."}
        </div>
        <div
          role="tablist"
          aria-label="Graph layout"
          className="inline-flex items-center gap-1 rounded-full border border-border bg-background/60 p-1"
        >
          <ModeButton
            active={mode === "force"}
            onClick={() => setMode("force")}
            icon={<Network className="size-3.5" />}
            label="Force"
          />
          <ModeButton
            active={mode === "tree"}
            onClick={() => setMode("tree")}
            icon={<Workflow className="size-3.5" />}
            label="Tree"
          />
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="block w-full h-auto bg-[radial-gradient(ellipse_at_center,_var(--color-card)_0%,_var(--color-background)_100%)]"
        role="img"
        aria-label={`Site link graph with ${nodes.length} pages and ${links.length} internal links`}
        style={{ touchAction: mode === "force" ? "none" : "auto" }}
      >
        <defs>
          <radialGradient id="graph-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </radialGradient>
          <marker
            id="graph-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-border)" />
          </marker>
        </defs>

        {/* Edges */}
        <g fill="none" stroke="var(--color-border)" strokeWidth={1}>
          {links.map((l, i) => {
            const sourceId = endpointId(l.source)
            const targetId = endpointId(l.target)
            // In tree mode, hide weak/cross-links to keep hierarchy clean.
            if (mode === "tree" && l.weak) return null

            const a = endpointPos(l.source)
            const b = endpointPos(l.target)

            const involved =
              !hoveredId ||
              hoveredId === sourceId ||
              hoveredId === targetId
            const opacity = involved ? (l.weak ? 0.55 : 0.95) : 0.12

            // Smooth cubic curve in tree mode, straight line in force.
            const d =
              mode === "tree"
                ? `M ${a.x} ${a.y} C ${a.x} ${(a.y + b.y) / 2}, ${b.x} ${(a.y + b.y) / 2}, ${b.x} ${b.y}`
                : `M ${a.x} ${a.y} L ${b.x} ${b.y}`

            return (
              <path
                key={i}
                d={d}
                strokeDasharray={l.weak ? "3 4" : undefined}
                opacity={opacity}
                style={{ transition: "opacity 200ms" }}
              />
            )
          })}
        </g>

        {/* Home glow follows the home node */}
        {(() => {
          const home = nodes.find((n) => n.id === "home")
          if (!home || home.x === undefined || home.y === undefined) return null
          return (
            <circle cx={home.x} cy={home.y} r={70} fill="url(#graph-glow)" />
          )
        })()}

        {/* Nodes */}
        <g>
          {nodes.map((n) => {
            const cx = n.x ?? 0
            const cy = n.y ?? 0
            const isHovered = hoveredId === n.id
            const isNeighbor =
              hoveredId !== null && neighbors.get(hoveredId)?.has(n.id) === true
            const dimmed = hoveredId !== null && !isHovered && !isNeighbor

            return (
              <g
                key={n.id}
                transform={`translate(${cx} ${cy})`}
                onPointerDown={(e) => handleNodePointerDown(e, n)}
                onMouseEnter={() => setHoveredId(n.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={cn(
                  "outline-none",
                  mode === "force" ? "cursor-grab active:cursor-grabbing" : "cursor-default",
                )}
                style={{
                  transition: "opacity 200ms",
                  opacity: dimmed ? 0.25 : 1,
                }}
                tabIndex={0}
                role="button"
                aria-label={`${n.label} (${n.kind})`}
              >
                {/* Halo shown on hover / kind=home */}
                {(isHovered || n.kind === "home") && (
                  <circle
                    r={n.size + 6}
                    fill={KIND_COLOR[n.kind]}
                    fillOpacity={0.18}
                    style={{ transition: "all 200ms" }}
                  />
                )}
                <circle
                  r={n.size}
                  fill={KIND_COLOR[n.kind]}
                  fillOpacity={
                    n.kind === "orphan" || n.kind === "broken" ? 0.85 : 0.95
                  }
                  stroke="var(--color-background)"
                  strokeWidth={2}
                />
                <text
                  y={n.size + 14}
                  textAnchor="middle"
                  fontSize={n.kind === "home" || n.kind === "hub" ? 11 : 10}
                  fill="var(--color-foreground)"
                  fontFamily="var(--font-mono)"
                  opacity={isHovered ? 1 : 0.85}
                  className="pointer-events-none select-none"
                >
                  {n.label}
                </text>
              </g>
            )
          })}
        </g>
      </svg>

      {/* Legend + counts */}
      <div className="flex flex-wrap items-center gap-4 px-5 py-3 border-t border-border text-xs text-muted-foreground">
        {[
          { label: "Home", color: "var(--color-primary)" },
          { label: "Hub", color: "var(--color-chart-1)" },
          { label: "Leaf", color: "var(--color-chart-5)" },
          { label: "Orphan", color: "var(--color-warning)" },
          { label: "Broken", color: "var(--color-destructive)" },
        ].map((l) => (
          <span key={l.label} className="inline-flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-full ring-1 ring-background"
              style={{ background: l.color }}
              aria-hidden
            />
            {l.label}
          </span>
        ))}
        <span className="ml-auto">
          <span className="tabular text-foreground">{nodes.length}</span> nodes ·{" "}
          <span className="tabular text-foreground">
            {mode === "tree" ? links.filter((l) => !l.weak).length : links.length}
          </span>{" "}
          edges
        </span>
      </div>
    </div>
  )
}

function ModeButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
        active
          ? "bg-primary/15 text-primary ring-1 ring-inset ring-primary/30"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      {icon}
      {label}
    </button>
  )
}
