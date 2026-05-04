// Single source of truth for prototype data. Swap each export for a real
// data source (Supabase, Postgres, etc.) when wiring the backend — the
// component layer only depends on the shapes below.

export type Severity = "critical" | "warning" | "notice"
export type CrawlStatus = "running" | "success" | "failed" | "queued"
export type Plan = "free" | "starter" | "growth" | "scale"

export type Project = {
  id: string
  name: string
  domain: string
  /** One-character monogram fallback used when `avatar` is missing. */
  favicon: string
  /** Optional brand image (square, ideally ≥256px). When set, takes
   *  precedence over the gradient-letter tile in `<ProjectAvatar>`. */
  avatar?: string
  pages: number
  health: number // 0–100
  trend: number // last-7d delta in pp
  issues: { critical: number; warning: number; notice: number }
  lastCrawl: string // ISO
  lastCrawlStatus: CrawlStatus
  schedule: "off" | "daily" | "weekly" | "monthly"
}

export type Crawl = {
  id: string
  projectId: string
  startedAt: string
  finishedAt?: string
  pagesCrawled: number
  errors: number
  warnings: number
  status: CrawlStatus
  source: "extension" | "cloud"
}

export type AiTask = {
  id: string
  projectId: string
  title: string
  kind: "fix-list" | "metadata" | "brief" | "ticket"
  impact: "high" | "medium" | "low"
  effort: "S" | "M" | "L"
  pagesAffected: number
  status: "ready" | "drafting" | "review" | "applied"
  updatedAt: string
}

export type PageRow = {
  url: string
  status: number
  words: number
  flesch: number
  lcp: number // seconds
  issues: number
  topic: string
  finalUrl: string
  indexable: boolean
  title: "ok" | "missing" | "long" | "duplicate"
  meta: "ok" | "missing" | "long" | "duplicate"
  canonical: "set" | "missing" | "self"
  h1: number
  h2: number
  lang: string
  hreflang: number
  schema: "rich" | "basic" | "none"
}

export type Issue = {
  id: string
  projectId: string
  severity: Severity
  category: "Indexing" | "Performance" | "Content" | "Schema" | "Links" | "Mobile"
  title: string
  description: string
  pagesAffected: number
  firstSeen: string
  status: "open" | "snoozed" | "fixed"
}

export type Member = {
  id: string
  name: string
  email: string
  role: "owner" | "admin" | "editor" | "viewer"
  avatar: string
  lastActive: string
}

export type ApiKey = {
  id: string
  name: string
  preview: string
  createdAt: string
  lastUsedAt?: string
}

export const currentUser = {
  name: "Emanuel Rosén",
  email: "emanuel@northwind.studio",
  // Single source of truth — referenced by the topbar avatar, the
  // settings header, and the owner row in the team list.
  avatar: "/avatars/users/emanuel.png",
  workspace: "Northwind Studio",
  plan: "growth" as Plan,
}

export const projects: Project[] = [
  {
    id: "northwind",
    name: "Northwind",
    domain: "northwind.studio",
    favicon: "N",
    avatar: "/avatars/projects/northwind.png",
    pages: 1284,
    health: 87,
    trend: 4,
    issues: { critical: 3, warning: 18, notice: 41 },
    lastCrawl: "2026-05-04T05:14:00Z",
    lastCrawlStatus: "success",
    schedule: "daily",
  },
  {
    id: "lumen",
    name: "Lumen Docs",
    domain: "docs.lumen.dev",
    favicon: "L",
    avatar: "/avatars/projects/lumen.png",
    pages: 642,
    health: 92,
    trend: 1,
    issues: { critical: 1, warning: 9, notice: 22 },
    lastCrawl: "2026-05-04T03:02:00Z",
    lastCrawlStatus: "success",
    schedule: "weekly",
  },
  {
    id: "aria",
    name: "Aria Commerce",
    domain: "shop.aria.io",
    favicon: "A",
    avatar: "/avatars/projects/aria.png",
    pages: 4108,
    health: 64,
    trend: -3,
    issues: { critical: 12, warning: 47, notice: 96 },
    lastCrawl: "2026-05-04T01:48:00Z",
    lastCrawlStatus: "success",
    schedule: "daily",
  },
  {
    id: "halcyon",
    name: "Halcyon Press",
    domain: "halcyon.press",
    favicon: "H",
    avatar: "/avatars/projects/halcyon.png",
    pages: 318,
    health: 71,
    trend: 6,
    issues: { critical: 2, warning: 14, notice: 28 },
    lastCrawl: "2026-05-03T22:11:00Z",
    lastCrawlStatus: "success",
    schedule: "weekly",
  },
  {
    id: "voyage",
    name: "Voyage Studio",
    domain: "voyage.so",
    favicon: "V",
    avatar: "/avatars/projects/voyage.png",
    pages: 96,
    health: 78,
    trend: 0,
    issues: { critical: 0, warning: 6, notice: 11 },
    lastCrawl: "2026-05-03T17:30:00Z",
    lastCrawlStatus: "success",
    schedule: "weekly",
  },
  {
    id: "kindred",
    name: "Kindred Co.",
    domain: "kindred.co",
    favicon: "K",
    avatar: "/avatars/projects/kindred.png",
    pages: 540,
    health: 45,
    trend: -8,
    issues: { critical: 18, warning: 62, notice: 110 },
    lastCrawl: "2026-05-04T06:02:00Z",
    lastCrawlStatus: "failed",
    schedule: "daily",
  },
]

export const recentCrawls: Crawl[] = [
  {
    id: "c-9183",
    projectId: "northwind",
    startedAt: "2026-05-04T05:08:00Z",
    finishedAt: "2026-05-04T05:14:00Z",
    pagesCrawled: 1284,
    errors: 3,
    warnings: 18,
    status: "success",
    source: "cloud",
  },
  {
    id: "c-9182",
    projectId: "kindred",
    startedAt: "2026-05-04T05:55:00Z",
    pagesCrawled: 412,
    errors: 18,
    warnings: 62,
    status: "failed",
    source: "cloud",
  },
  {
    id: "c-9181",
    projectId: "lumen",
    startedAt: "2026-05-04T02:55:00Z",
    finishedAt: "2026-05-04T03:02:00Z",
    pagesCrawled: 642,
    errors: 1,
    warnings: 9,
    status: "success",
    source: "extension",
  },
  {
    id: "c-9180",
    projectId: "aria",
    startedAt: "2026-05-04T01:36:00Z",
    finishedAt: "2026-05-04T01:48:00Z",
    pagesCrawled: 4108,
    errors: 12,
    warnings: 47,
    status: "success",
    source: "cloud",
  },
  {
    id: "c-9179",
    projectId: "halcyon",
    startedAt: "2026-05-03T22:08:00Z",
    finishedAt: "2026-05-03T22:11:00Z",
    pagesCrawled: 318,
    errors: 2,
    warnings: 14,
    status: "success",
    source: "extension",
  },
  {
    id: "c-9178",
    projectId: "voyage",
    startedAt: "2026-05-04T06:30:00Z",
    pagesCrawled: 0,
    errors: 0,
    warnings: 0,
    status: "queued",
    source: "cloud",
  },
]

export const aiTasks: AiTask[] = [
  {
    id: "ai-1",
    projectId: "northwind",
    title: "Top 12 fixes ranked by traffic-at-risk",
    kind: "fix-list",
    impact: "high",
    effort: "M",
    pagesAffected: 124,
    status: "ready",
    updatedAt: "2026-05-04T05:18:00Z",
  },
  {
    id: "ai-2",
    projectId: "aria",
    title: "Generate OG/Twitter images for product PDPs",
    kind: "metadata",
    impact: "high",
    effort: "L",
    pagesAffected: 1402,
    status: "drafting",
    updatedAt: "2026-05-04T04:51:00Z",
  },
  {
    id: "ai-3",
    projectId: "lumen",
    title: "Internal-link briefs for orphan docs",
    kind: "brief",
    impact: "medium",
    effort: "S",
    pagesAffected: 38,
    status: "review",
    updatedAt: "2026-05-04T03:11:00Z",
  },
  {
    id: "ai-4",
    projectId: "halcyon",
    title: "Dev tickets — render-blocking & schema",
    kind: "ticket",
    impact: "medium",
    effort: "M",
    pagesAffected: 64,
    status: "ready",
    updatedAt: "2026-05-04T01:02:00Z",
  },
  {
    id: "ai-5",
    projectId: "northwind",
    title: "Thin-content rewrites for /resources/*",
    kind: "brief",
    impact: "low",
    effort: "L",
    pagesAffected: 22,
    status: "applied",
    updatedAt: "2026-05-03T20:40:00Z",
  },
]

export const issues: Issue[] = [
  {
    id: "is-1",
    projectId: "northwind",
    severity: "critical",
    category: "Indexing",
    title: "Canonical points to 404 on /blog/* pagination",
    description:
      "32 paginated archive URLs canonicalize to a destination that returns 404. Search engines drop these from the index.",
    pagesAffected: 32,
    firstSeen: "2026-04-29T12:00:00Z",
    status: "open",
  },
  {
    id: "is-2",
    projectId: "northwind",
    severity: "critical",
    category: "Performance",
    title: "LCP > 4s on mobile for /pricing",
    description:
      "Hero image is unsized and renders after a render-blocking script. Real-user p75 LCP is 4.2s on 4G.",
    pagesAffected: 1,
    firstSeen: "2026-05-01T08:30:00Z",
    status: "open",
  },
  {
    id: "is-3",
    projectId: "northwind",
    severity: "warning",
    category: "Content",
    title: "Duplicate <title> across 14 product pages",
    description: "Same <title> string used by 14 PDPs differing only in colorway.",
    pagesAffected: 14,
    firstSeen: "2026-04-22T09:00:00Z",
    status: "open",
  },
  {
    id: "is-4",
    projectId: "northwind",
    severity: "warning",
    category: "Schema",
    title: "Article schema missing author for 41 posts",
    description: "Article JSON-LD payload omits the author property required for rich results.",
    pagesAffected: 41,
    firstSeen: "2026-04-18T17:30:00Z",
    status: "open",
  },
  {
    id: "is-5",
    projectId: "northwind",
    severity: "notice",
    category: "Links",
    title: "Orphan pages with no internal inbound links",
    description: "8 indexable pages have zero internal inbound links from any other crawled page.",
    pagesAffected: 8,
    firstSeen: "2026-04-30T10:10:00Z",
    status: "snoozed",
  },
  {
    id: "is-6",
    projectId: "northwind",
    severity: "warning",
    category: "Mobile",
    title: "Tap targets < 44px on /shop filters",
    description: "Filter chips render at 28×28px on small viewports — fails Google mobile-friendliness.",
    pagesAffected: 1,
    firstSeen: "2026-05-02T15:42:00Z",
    status: "open",
  },
]

export const inventoryRows: PageRow[] = [
  {
    url: "/",
    status: 200,
    words: 482,
    flesch: 64,
    lcp: 1.8,
    issues: 1,
    topic: "Home",
    finalUrl: "/",
    indexable: true,
    title: "ok",
    meta: "ok",
    canonical: "self",
    h1: 1,
    h2: 4,
    lang: "en",
    hreflang: 2,
    schema: "rich",
  },
  {
    url: "/pricing",
    status: 200,
    words: 612,
    flesch: 58,
    lcp: 4.2,
    issues: 3,
    topic: "Pricing",
    finalUrl: "/pricing",
    indexable: true,
    title: "ok",
    meta: "ok",
    canonical: "self",
    h1: 1,
    h2: 6,
    lang: "en",
    hreflang: 2,
    schema: "basic",
  },
  {
    url: "/about",
    status: 200,
    words: 318,
    flesch: 71,
    lcp: 1.6,
    issues: 0,
    topic: "Company",
    finalUrl: "/about",
    indexable: true,
    title: "ok",
    meta: "ok",
    canonical: "self",
    h1: 1,
    h2: 3,
    lang: "en",
    hreflang: 2,
    schema: "basic",
  },
  {
    url: "/blog",
    status: 200,
    words: 220,
    flesch: 67,
    lcp: 2.1,
    issues: 1,
    topic: "Blog",
    finalUrl: "/blog",
    indexable: true,
    title: "ok",
    meta: "ok",
    canonical: "self",
    h1: 1,
    h2: 8,
    lang: "en",
    hreflang: 2,
    schema: "basic",
  },
  {
    url: "/blog/page/2",
    status: 200,
    words: 184,
    flesch: 65,
    lcp: 2.0,
    issues: 2,
    topic: "Blog",
    finalUrl: "/blog/page/2",
    indexable: false,
    title: "ok",
    meta: "ok",
    canonical: "missing",
    h1: 1,
    h2: 8,
    lang: "en",
    hreflang: 0,
    schema: "none",
  },
  {
    url: "/blog/seo-checklist-2026",
    status: 200,
    words: 2140,
    flesch: 62,
    lcp: 1.9,
    issues: 0,
    topic: "Article",
    finalUrl: "/blog/seo-checklist-2026",
    indexable: true,
    title: "ok",
    meta: "ok",
    canonical: "self",
    h1: 1,
    h2: 12,
    lang: "en",
    hreflang: 2,
    schema: "rich",
  },
  {
    url: "/shop/wool-runner",
    status: 200,
    words: 612,
    flesch: 60,
    lcp: 2.6,
    issues: 2,
    topic: "Product",
    finalUrl: "/shop/wool-runner",
    indexable: true,
    title: "duplicate",
    meta: "ok",
    canonical: "self",
    h1: 1,
    h2: 5,
    lang: "en",
    hreflang: 2,
    schema: "rich",
  },
  {
    url: "/shop/wool-runner-charcoal",
    status: 200,
    words: 612,
    flesch: 60,
    lcp: 2.6,
    issues: 2,
    topic: "Product",
    finalUrl: "/shop/wool-runner-charcoal",
    indexable: true,
    title: "duplicate",
    meta: "ok",
    canonical: "set",
    h1: 1,
    h2: 5,
    lang: "en",
    hreflang: 2,
    schema: "rich",
  },
  {
    url: "/resources/seo-glossary",
    status: 200,
    words: 96,
    flesch: 78,
    lcp: 1.4,
    issues: 1,
    topic: "Resource",
    finalUrl: "/resources/seo-glossary",
    indexable: true,
    title: "ok",
    meta: "missing",
    canonical: "self",
    h1: 1,
    h2: 2,
    lang: "en",
    hreflang: 0,
    schema: "none",
  },
  {
    url: "/legacy/contact-us",
    status: 301,
    words: 0,
    flesch: 0,
    lcp: 0.4,
    issues: 0,
    topic: "Redirect",
    finalUrl: "/contact",
    indexable: false,
    title: "missing",
    meta: "missing",
    canonical: "missing",
    h1: 0,
    h2: 0,
    lang: "en",
    hreflang: 0,
    schema: "none",
  },
  {
    url: "/old-pricing",
    status: 404,
    words: 0,
    flesch: 0,
    lcp: 0.3,
    issues: 1,
    topic: "Error",
    finalUrl: "/old-pricing",
    indexable: false,
    title: "missing",
    meta: "missing",
    canonical: "missing",
    h1: 0,
    h2: 0,
    lang: "en",
    hreflang: 0,
    schema: "none",
  },
  {
    url: "/contact",
    status: 200,
    words: 184,
    flesch: 72,
    lcp: 1.5,
    issues: 0,
    topic: "Company",
    finalUrl: "/contact",
    indexable: true,
    title: "ok",
    meta: "ok",
    canonical: "self",
    h1: 1,
    h2: 2,
    lang: "en",
    hreflang: 2,
    schema: "basic",
  },
  ...generateInventoryFiller(50),
]

// Deterministic filler so the inventory table can stretch the full viewport
// without us hand-authoring 60 rows. Uses a tiny PRNG keyed off the URL so the
// values stay stable across renders.
function generateInventoryFiller(count: number): PageRow[] {
  const segments = [
    "/blog/internal-linking-deep-dive",
    "/blog/cwv-on-shopify",
    "/blog/edge-rendering-2026",
    "/blog/htmx-vs-react",
    "/blog/structured-data-pitfalls",
    "/blog/ai-overview-strategy",
    "/blog/perplexity-citations",
    "/blog/the-end-of-keyword-tools",
    "/blog/content-pruning-2026",
    "/blog/javascript-rendering-budget",
    "/guides/technical-seo",
    "/guides/core-web-vitals",
    "/guides/internal-linking",
    "/guides/xml-sitemaps",
    "/guides/hreflang",
    "/guides/redirect-chains",
    "/customers/acme-co",
    "/customers/lumen-labs",
    "/customers/orbital-foods",
    "/customers/case-studies",
    "/integrations/shopify",
    "/integrations/webflow",
    "/integrations/contentful",
    "/integrations/wordpress",
    "/integrations/sanity",
    "/changelog",
    "/changelog/2026-04",
    "/changelog/2026-03",
    "/compare/screaming-frog",
    "/compare/ahrefs",
    "/compare/semrush",
    "/compare/sitebulb",
    "/features/crawler",
    "/features/performance",
    "/features/link-graph",
    "/features/ai-visibility",
    "/features/exports",
    "/features/scheduling",
    "/tools/schema",
    "/tools/serp-preview",
    "/tools/redirect-checker",
    "/docs/getting-started",
    "/docs/api/projects",
    "/docs/api/crawls",
    "/docs/api/issues",
    "/docs/cli",
    "/legal/privacy",
    "/legal/terms",
    "/legal/dpa",
    "/security",
    "/team",
    "/careers",
    "/careers/senior-engineer",
    "/press",
    "/affiliates",
    "/sitemap",
    "/blog/category/technical-seo",
    "/blog/category/ai-visibility",
    "/blog/tag/lighthouse",
    "/blog/tag/cwv",
    "/blog/tag/schema",
    "/blog/tag/perplexity",
    "/blog/author/alex-morgan",
    "/blog/author/jordan-lee",
  ]
  const topics = [
    "Article",
    "Blog",
    "Guide",
    "Customer",
    "Integration",
    "Compare",
    "Feature",
    "Tool",
    "Docs",
    "Legal",
    "Company",
  ]
  // Tiny deterministic hash → [0, 1)
  const rand = (seed: string, salt: number) => {
    let h = 2166136261
    const s = seed + ":" + salt
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i)
      h = Math.imul(h, 16777619)
    }
    return ((h >>> 0) % 10000) / 10000
  }
  const pick = <T,>(arr: T[], r: number) => arr[Math.floor(r * arr.length) % arr.length]

  const rows: PageRow[] = []
  for (let i = 0; i < count; i++) {
    const url = segments[i % segments.length] + (i >= segments.length ? `-${Math.floor(i / segments.length) + 1}` : "")
    const r1 = rand(url, 1)
    const r2 = rand(url, 2)
    const r3 = rand(url, 3)
    const r4 = rand(url, 4)
    const r5 = rand(url, 5)

    // Mostly 200, occasional 301/404
    const status = r1 < 0.86 ? 200 : r1 < 0.95 ? 301 : 404
    const indexable = status === 200 && r2 > 0.08
    const issues = status === 200 ? Math.floor(r3 * 4) : Math.floor(r3 * 3) + 1
    const lcp = status === 200
      ? +(1.2 + r4 * 2.4).toFixed(1)
      : +(0.3 + r4 * 0.4).toFixed(1)
    const words = status === 200 ? 120 + Math.floor(r5 * 1900) : 0
    const flesch = status === 200 ? 50 + Math.floor(r1 * 35) : 0

    const titleStates: PageRow["title"][] = ["ok", "ok", "ok", "ok", "duplicate", "long", "missing"]
    const metaStates: PageRow["meta"][] = ["ok", "ok", "ok", "missing", "long"]
    const canonStates: PageRow["canonical"][] = ["self", "self", "self", "set", "missing"]
    const schemaStates: PageRow["schema"][] = ["rich", "basic", "basic", "basic", "none"]

    rows.push({
      url,
      status,
      words,
      flesch,
      lcp,
      issues,
      topic: pick(topics, r2),
      finalUrl: status === 301 ? url.replace(/-\d+$/, "") || "/" : url,
      indexable,
      title: status === 200 ? pick(titleStates, r3) : "missing",
      meta: status === 200 ? pick(metaStates, r4) : "missing",
      canonical: status === 200 ? pick(canonStates, r5) : "missing",
      h1: status === 200 ? (r1 < 0.9 ? 1 : r1 < 0.97 ? 0 : 2) : 0,
      h2: status === 200 ? Math.floor(r2 * 10) : 0,
      lang: r3 < 0.92 ? "en" : r3 < 0.97 ? "de" : "fr",
      hreflang: r4 < 0.7 ? 2 : r4 < 0.9 ? 0 : 4,
      schema: status === 200 ? pick(schemaStates, r5) : "none",
    })
  }
  return rows
}

export const members: Member[] = [
  {
    id: "u-1",
    name: "Emanuel Rosén",
    email: "emanuel@northwind.studio",
    role: "owner",
    avatar: "/avatars/users/emanuel.png",
    lastActive: "2026-05-04T06:10:00Z",
  },
  {
    id: "u-2",
    name: "Priya Shah",
    email: "priya@northwind.studio",
    role: "admin",
    avatar: "/avatars/priya.png",
    lastActive: "2026-05-04T05:48:00Z",
  },
  {
    id: "u-3",
    name: "Marcus Lee",
    email: "marcus@northwind.studio",
    role: "editor",
    avatar: "/avatars/marcus.png",
    lastActive: "2026-05-03T22:14:00Z",
  },
  {
    id: "u-4",
    name: "Sofia Ahmed",
    email: "sofia@northwind.studio",
    role: "editor",
    avatar: "/avatars/sofia.png",
    lastActive: "2026-05-03T18:32:00Z",
  },
  {
    id: "u-5",
    name: "Ravi Patel",
    email: "ravi@partner.dev",
    role: "viewer",
    avatar: "/avatars/ravi.png",
    lastActive: "2026-05-02T14:11:00Z",
  },
]

export const apiKeys: ApiKey[] = [
  {
    id: "k-1",
    name: "Production",
    preview: "ase_live_••••••••••••8f21",
    createdAt: "2026-02-14T10:00:00Z",
    lastUsedAt: "2026-05-04T05:14:00Z",
  },
  {
    id: "k-2",
    name: "Staging",
    preview: "ase_test_••••••••••••3b77",
    createdAt: "2026-03-02T15:30:00Z",
    lastUsedAt: "2026-05-03T19:22:00Z",
  },
]

// 14-day health timeline used by the dashboard area chart.
export const healthHistory = [
  { day: "Apr 21", score: 78, issues: 124 },
  { day: "Apr 22", score: 79, issues: 119 },
  { day: "Apr 23", score: 81, issues: 112 },
  { day: "Apr 24", score: 80, issues: 116 },
  { day: "Apr 25", score: 82, issues: 108 },
  { day: "Apr 26", score: 83, issues: 102 },
  { day: "Apr 27", score: 81, issues: 110 },
  { day: "Apr 28", score: 84, issues: 96 },
  { day: "Apr 29", score: 85, issues: 92 },
  { day: "Apr 30", score: 84, issues: 95 },
  { day: "May 01", score: 86, issues: 88 },
  { day: "May 02", score: 86, issues: 86 },
  { day: "May 03", score: 87, issues: 82 },
  { day: "May 04", score: 87, issues: 80 },
]

export const issueMix = [
  { category: "Indexing", critical: 3, warning: 12, notice: 18 },
  { category: "Performance", critical: 4, warning: 10, notice: 14 },
  { category: "Content", critical: 1, warning: 9, notice: 22 },
  { category: "Schema", critical: 0, warning: 6, notice: 11 },
  { category: "Links", critical: 0, warning: 4, notice: 9 },
  { category: "Mobile", critical: 1, warning: 3, notice: 6 },
]

export const usage = {
  pagesCrawled: 18420,
  pagesQuota: 25000,
  aiCredits: 1240,
  aiCreditsQuota: 2000,
  seats: 4,
  seatsQuota: 10,
  resetsAt: "2026-06-01T00:00:00Z",
}

export function projectById(id: string) {
  return projects.find((p) => p.id === id)
}

export function projectIssues(id: string) {
  return issues.filter((i) => i.projectId === id)
}

export function projectAiTasks(id: string) {
  return aiTasks.filter((a) => a.projectId === id)
}

// ---- Performance (Core Web Vitals) ----

export type WebVital = {
  metric: "LCP" | "INP" | "CLS" | "TTFB" | "FCP"
  label: string
  unit: string
  value: number
  good: number // threshold for "good"
  poor: number // threshold for "poor"
  p75: number
  delta: number // delta vs last crawl, in same unit (lower is better for time-based)
}

export const webVitals: WebVital[] = [
  { metric: "LCP", label: "Largest Contentful Paint", unit: "s", value: 2.1, good: 2.5, poor: 4.0, p75: 2.4, delta: -0.3 },
  { metric: "INP", label: "Interaction to Next Paint", unit: "ms", value: 180, good: 200, poor: 500, p75: 210, delta: -22 },
  { metric: "CLS", label: "Cumulative Layout Shift", unit: "", value: 0.06, good: 0.1, poor: 0.25, p75: 0.08, delta: -0.02 },
  { metric: "TTFB", label: "Time to First Byte", unit: "s", value: 0.6, good: 0.8, poor: 1.8, p75: 0.7, delta: -0.05 },
  { metric: "FCP", label: "First Contentful Paint", unit: "s", value: 1.4, good: 1.8, poor: 3.0, p75: 1.5, delta: -0.1 },
]

export type PagePerf = {
  url: string
  lcp: number
  inp: number
  cls: number
  ttfb: number
  status: "good" | "needs-improvement" | "poor"
}

export const pagePerf: PagePerf[] = [
  { url: "/pricing", lcp: 1.8, inp: 140, cls: 0.04, ttfb: 0.5, status: "good" },
  { url: "/blog/seo-checklist-2026", lcp: 2.3, inp: 190, cls: 0.07, ttfb: 0.7, status: "good" },
  { url: "/features/crawler", lcp: 2.9, inp: 240, cls: 0.11, ttfb: 0.8, status: "needs-improvement" },
  { url: "/integrations/shopify", lcp: 4.2, inp: 320, cls: 0.18, ttfb: 1.2, status: "poor" },
  { url: "/changelog", lcp: 1.6, inp: 120, cls: 0.03, ttfb: 0.4, status: "good" },
  { url: "/customers/acme", lcp: 3.1, inp: 280, cls: 0.14, ttfb: 0.9, status: "needs-improvement" },
]

// ---- Social previews ----

export type SocialPreview = {
  url: string
  title: string
  description: string
  ogImage: string | null
  twitterImage: string | null
  ogTitleLength: number
  status: "complete" | "partial" | "missing"
  issues: string[]
}

export const socialPreviews: SocialPreview[] = [
  {
    url: "/pricing",
    title: "Pricing — AwesomeSEO crawler that actually finds the broken pages",
    description: "Three plans for solo SEOs, agencies and enterprise teams. Cancel anytime, real cloud crawls included.",
    ogImage: "/social/pricing-og.jpg",
    twitterImage: "/social/pricing-tw.jpg",
    ogTitleLength: 67,
    status: "complete",
    issues: [],
  },
  {
    url: "/features/crawler",
    title: "The crawler",
    description: "",
    ogImage: "/social/crawler-og.jpg",
    twitterImage: null,
    ogTitleLength: 12,
    status: "partial",
    issues: ["OG description missing", "Twitter image missing", "OG title too short"],
  },
  {
    url: "/blog/seo-checklist-2026",
    title: "The 2026 technical SEO checklist for product-led companies",
    description: "47 checks every PLG site should run before its next launch. Free template + crawler config.",
    ogImage: null,
    twitterImage: null,
    ogTitleLength: 58,
    status: "missing",
    issues: ["OG image missing", "Twitter image missing", "Twitter card type not set"],
  },
  {
    url: "/changelog",
    title: "Changelog — what shipped this week",
    description: "Weekly product changes for the AwesomeSEO platform.",
    ogImage: "/social/changelog-og.jpg",
    twitterImage: "/social/changelog-tw.jpg",
    ogTitleLength: 35,
    status: "complete",
    issues: [],
  },
]

// ---- Structured data / schema validations ----

export type SchemaItem = {
  type: string
  pages: number
  valid: number
  warnings: number
  errors: number
  topError?: string
}

export const schemaSummary: SchemaItem[] = [
  { type: "Article", pages: 184, valid: 162, warnings: 18, errors: 4, topError: "Missing required field: author" },
  { type: "Product", pages: 76, valid: 62, warnings: 11, errors: 3, topError: "priceCurrency not in ISO 4217" },
  { type: "Organization", pages: 1, valid: 1, warnings: 0, errors: 0 },
  { type: "BreadcrumbList", pages: 248, valid: 240, warnings: 8, errors: 0 },
  { type: "FAQPage", pages: 22, valid: 18, warnings: 2, errors: 2, topError: "Question text exceeds 300 chars" },
  { type: "VideoObject", pages: 8, valid: 4, warnings: 1, errors: 3, topError: "thumbnailUrl not reachable" },
  { type: "HowTo", pages: 6, valid: 6, warnings: 0, errors: 0 },
]

// ---- Topic clusters ----

export type TopicCluster = {
  id: string
  topic: string
  pages: number
  keyword: string
  competition: "low" | "medium" | "high"
  coverage: number // 0–100
  pillarPage: string | null
  gap: string | null
}

export const topicClusters: TopicCluster[] = [
  { id: "tc1", topic: "Technical SEO", pages: 24, keyword: "technical seo audit", competition: "high", coverage: 84, pillarPage: "/guides/technical-seo", gap: null },
  { id: "tc2", topic: "Core Web Vitals", pages: 14, keyword: "core web vitals", competition: "high", coverage: 71, pillarPage: "/guides/core-web-vitals", gap: "Missing INP deep-dive" },
  { id: "tc3", topic: "Schema markup", pages: 9, keyword: "schema markup generator", competition: "medium", coverage: 52, pillarPage: null, gap: "No pillar page yet" },
  { id: "tc4", topic: "Internal linking", pages: 11, keyword: "internal link strategy", competition: "medium", coverage: 68, pillarPage: "/guides/internal-linking", gap: null },
  { id: "tc5", topic: "Content briefs", pages: 6, keyword: "ai content briefs", competition: "low", coverage: 40, pillarPage: null, gap: "Thin coverage, 3 orphan pages" },
  { id: "tc6", topic: "Sitemaps", pages: 5, keyword: "xml sitemap best practices", competition: "low", coverage: 78, pillarPage: "/guides/xml-sitemaps", gap: null },
]

// ---- Google Search visibility ----

export type SerpKeyword = {
  id: string
  query: string
  position: number
  delta: number // negative = improved (lower position is better)
  impressions: number
  clicks: number
  ctr: number // 0–1
  url: string
  intent: "informational" | "commercial" | "transactional" | "navigational"
  features: SerpFeature[]
}

export type SerpFeature =
  | "ai-overview"
  | "featured-snippet"
  | "people-also-ask"
  | "video"
  | "image-pack"
  | "site-links"
  | "shopping"

export const serpFeatureLabels: Record<SerpFeature, string> = {
  "ai-overview": "AI Overview",
  "featured-snippet": "Featured Snippet",
  "people-also-ask": "People Also Ask",
  video: "Video Pack",
  "image-pack": "Image Pack",
  "site-links": "Sitelinks",
  shopping: "Shopping",
}

export const serpKeywords: SerpKeyword[] = [
  {
    id: "kw1",
    query: "technical seo audit checklist",
    position: 3,
    delta: -2,
    impressions: 24800,
    clicks: 2120,
    ctr: 0.085,
    url: "/guides/technical-seo",
    intent: "informational",
    features: ["ai-overview", "people-also-ask", "featured-snippet"],
  },
  {
    id: "kw2",
    query: "core web vitals chrome extension",
    position: 1,
    delta: 0,
    impressions: 18400,
    clicks: 4920,
    ctr: 0.267,
    url: "/features/crawler",
    intent: "commercial",
    features: ["site-links", "video"],
  },
  {
    id: "kw3",
    query: "free seo crawler",
    position: 5,
    delta: 1,
    impressions: 41200,
    clicks: 1980,
    ctr: 0.048,
    url: "/pricing",
    intent: "commercial",
    features: ["ai-overview", "shopping"],
  },
  {
    id: "kw4",
    query: "schema markup generator",
    position: 12,
    delta: -4,
    impressions: 9800,
    clicks: 240,
    ctr: 0.024,
    url: "/tools/schema",
    intent: "transactional",
    features: ["people-also-ask"],
  },
  {
    id: "kw5",
    query: "screaming frog alternative",
    position: 7,
    delta: -1,
    impressions: 6200,
    clicks: 410,
    ctr: 0.066,
    url: "/compare/screaming-frog",
    intent: "commercial",
    features: ["ai-overview", "people-also-ask"],
  },
  {
    id: "kw6",
    query: "how to fix indexing issues",
    position: 14,
    delta: 3,
    impressions: 12100,
    clicks: 180,
    ctr: 0.015,
    url: "/blog/indexing-issues",
    intent: "informational",
    features: ["people-also-ask"],
  },
  {
    id: "kw7",
    query: "awesomeseo",
    position: 1,
    delta: 0,
    impressions: 3400,
    clicks: 2890,
    ctr: 0.85,
    url: "/",
    intent: "navigational",
    features: ["site-links"],
  },
  {
    id: "kw8",
    query: "internal link analysis tool",
    position: 9,
    delta: -2,
    impressions: 4900,
    clicks: 215,
    ctr: 0.044,
    url: "/features/link-graph",
    intent: "commercial",
    features: ["video"],
  },
]

export const googleSummary = {
  totalImpressions: 142_300,
  totalClicks: 12_955,
  avgPosition: 8.4,
  ctr: 0.091,
  // deltas vs previous 28 days
  deltaImpressions: 0.184,
  deltaClicks: 0.072,
  deltaPosition: -1.2, // lower is better
  deltaCtr: -0.011,
}

// ---- AI engine visibility (GEO / AISEO) ----

export type AiEngineKey = "chatgpt" | "claude" | "perplexity" | "gemini" | "copilot"

export type AiEngineStat = {
  engine: AiEngineKey
  name: string
  citationRate: number // 0–1, share of monitored prompts where you appear
  delta: number // change vs previous period (in citationRate points)
  shareOfVoice: number // 0–1, your slice of citations across competitors
  monitoredPrompts: number
  citationsThisWeek: number
}

export const aiEngineStats: AiEngineStat[] = [
  { engine: "chatgpt", name: "ChatGPT", citationRate: 0.38, delta: 0.06, shareOfVoice: 0.21, monitoredPrompts: 120, citationsThisWeek: 312 },
  { engine: "claude", name: "Claude", citationRate: 0.31, delta: 0.04, shareOfVoice: 0.18, monitoredPrompts: 120, citationsThisWeek: 198 },
  { engine: "perplexity", name: "Perplexity", citationRate: 0.54, delta: 0.09, shareOfVoice: 0.28, monitoredPrompts: 120, citationsThisWeek: 446 },
  { engine: "gemini", name: "Gemini", citationRate: 0.22, delta: -0.02, shareOfVoice: 0.12, monitoredPrompts: 120, citationsThisWeek: 132 },
  { engine: "copilot", name: "Copilot", citationRate: 0.27, delta: 0.03, shareOfVoice: 0.14, monitoredPrompts: 120, citationsThisWeek: 156 },
]

export type AiPrompt = {
  id: string
  prompt: string
  intent: "comparison" | "how-to" | "definition" | "recommendation"
  engines: Partial<Record<AiEngineKey, { cited: boolean; rank: number | null; citedUrl?: string }>>
  topCompetitor: string | null
}

export const aiPrompts: AiPrompt[] = [
  {
    id: "pr1",
    prompt: "What's the best free SEO crawler in 2026?",
    intent: "recommendation",
    engines: {
      chatgpt: { cited: true, rank: 2, citedUrl: "/pricing" },
      claude: { cited: true, rank: 3, citedUrl: "/" },
      perplexity: { cited: true, rank: 1, citedUrl: "/features/crawler" },
      gemini: { cited: false, rank: null },
      copilot: { cited: true, rank: 4, citedUrl: "/" },
    },
    topCompetitor: "screamingfrog.co.uk",
  },
  {
    id: "pr2",
    prompt: "How do I fix Cumulative Layout Shift on a Next.js site?",
    intent: "how-to",
    engines: {
      chatgpt: { cited: true, rank: 4, citedUrl: "/blog/cls-nextjs" },
      claude: { cited: false, rank: null },
      perplexity: { cited: true, rank: 2, citedUrl: "/blog/cls-nextjs" },
      gemini: { cited: false, rank: null },
      copilot: { cited: false, rank: null },
    },
    topCompetitor: "web.dev",
  },
  {
    id: "pr3",
    prompt: "AwesomeSEO vs Screaming Frog comparison",
    intent: "comparison",
    engines: {
      chatgpt: { cited: true, rank: 1, citedUrl: "/compare/screaming-frog" },
      claude: { cited: true, rank: 1, citedUrl: "/compare/screaming-frog" },
      perplexity: { cited: true, rank: 1, citedUrl: "/compare/screaming-frog" },
      gemini: { cited: true, rank: 2, citedUrl: "/compare/screaming-frog" },
      copilot: { cited: true, rank: 1, citedUrl: "/compare/screaming-frog" },
    },
    topCompetitor: "screamingfrog.co.uk",
  },
  {
    id: "pr4",
    prompt: "What is Generative Engine Optimization?",
    intent: "definition",
    engines: {
      chatgpt: { cited: false, rank: null },
      claude: { cited: false, rank: null },
      perplexity: { cited: true, rank: 5, citedUrl: "/blog/what-is-geo" },
      gemini: { cited: false, rank: null },
      copilot: { cited: false, rank: null },
    },
    topCompetitor: "searchengineland.com",
  },
  {
    id: "pr5",
    prompt: "Best schema markup tool for ecommerce",
    intent: "recommendation",
    engines: {
      chatgpt: { cited: true, rank: 3, citedUrl: "/tools/schema" },
      claude: { cited: true, rank: 4, citedUrl: "/tools/schema" },
      perplexity: { cited: true, rank: 2, citedUrl: "/tools/schema" },
      gemini: { cited: true, rank: 3, citedUrl: "/tools/schema" },
      copilot: { cited: true, rank: 2, citedUrl: "/tools/schema" },
    },
    topCompetitor: "schema.org",
  },
  {
    id: "pr6",
    prompt: "How to monitor Core Web Vitals continuously?",
    intent: "how-to",
    engines: {
      chatgpt: { cited: true, rank: 6, citedUrl: "/features/performance" },
      claude: { cited: false, rank: null },
      perplexity: { cited: true, rank: 3, citedUrl: "/features/performance" },
      gemini: { cited: false, rank: null },
      copilot: { cited: true, rank: 5, citedUrl: "/features/performance" },
    },
    topCompetitor: "calibreapp.com",
  },
]

export const aiCompetitors = [
  { domain: "screamingfrog.co.uk", share: 0.24 },
  { domain: "ahrefs.com", share: 0.18 },
  { domain: "semrush.com", share: 0.16 },
  { domain: "awesomeseo.app", share: 0.19 }, // you
  { domain: "moz.com", share: 0.09 },
  { domain: "other", share: 0.14 },
]

/* ───────────────────── Topic × Competitor heatmap ───────────────────── */
/**
 * Powers the interactive heatmap on /projects/[id]/topics. Each cell
 * states whether a given competitor URL covers a given topic, and how
 * well — the four statuses are designed to map 1:1 to the four colors
 * in the legend (yellow/green/pink/blue).
 *
 * Numbers are intentionally illustrative (this is the demo workspace);
 * the *shape* matches what a real SERP-scrape pipeline would emit.
 */
export type HeatmapStatus = "covered" | "gap" | "quick-win" | "high-priority"

export type HeatmapCompetitor = {
  /** Full deep URL — used for the on-cell tooltip and the external link. */
  url: string
  /** Rank 1–20 on the parent niche query, or `null` if not ranked. */
  rank: number | null
  /** 0–100 content quality score — higher is denser/better-aligned. */
  contentScore: number
}

export type HeatmapTopic = {
  /** Sub-topic / keyword text shown on the left axis. */
  keyword: string
  /** Per-competitor coverage cells, aligned to `topicHeatmap.competitors`. */
  cells: HeatmapStatus[]
  /** Search volume hint — drives the "Relevance" sort. Higher = more relevant. */
  relevance: number
  /** "Must have" signals are topics every top-10 competitor covers. Used by
   *  the Must-Haves sort to surface universally-expected sub-topics. */
  mustHave: boolean
}

export const topicHeatmap: {
  niche: string
  competitors: HeatmapCompetitor[]
  topics: HeatmapTopic[]
} = {
  niche: "email marketing automation",
  competitors: [
    { url: "mailchimp.com/marketing/glossary/email-automation", rank: 1, contentScore: 43 },
    { url: "constantcontact.com/blog/what-is-email-automation", rank: 2, contentScore: 29 },
    { url: "campaignmonitor.com/blog/email-marketing/email-automation-101", rank: 3, contentScore: 50 },
    { url: "blog.hubspot.com/marketing/email-automation", rank: 4, contentScore: 50 },
    { url: "optinmonster.com/31-best-email-marketing-automation", rank: 5, contentScore: 52 },
    { url: "omnisend.com/blog/email-marketing-automation", rank: 6, contentScore: 50 },
    { url: "zendesk.com/sell/features/email-marketing-automation", rank: 7, contentScore: 38 },
    { url: "brevo.com/blog/email-marketing-automation", rank: 8, contentScore: 46 },
    { url: "activecampaign.com/email-automation-software", rank: 9, contentScore: 10 },
    { url: "neilpatel.com/blog/automated-email-marketing", rank: 10, contentScore: 27 },
    { url: "sendgrid.com/resource/what-is-email-automation", rank: 11, contentScore: 27 },
    { url: "zapier.com/blog/automate-email-marketing", rank: 12, contentScore: 19 },
  ],
  // 14 sub-topics. The cells array length always matches `competitors.length`.
  // Sort defaults are encoded by `relevance` (higher first) and `mustHave`.
  topics: [
    {
      keyword: "email marketing automation",
      relevance: 100, mustHave: true,
      cells: [
        "high-priority","covered","covered","gap","high-priority","covered","gap","covered","gap","covered","gap","covered",
      ],
    },
    {
      keyword: "email automation",
      relevance: 96, mustHave: true,
      cells: [
        "covered","gap","gap","covered","gap","covered","gap","covered","gap","gap","gap","covered",
      ],
    },
    {
      keyword: "marketing automation",
      relevance: 94, mustHave: true,
      cells: [
        "covered","gap","covered","gap","covered","gap","gap","covered","covered","covered","gap","covered",
      ],
    },
    {
      keyword: "email marketing",
      relevance: 92, mustHave: true,
      cells: [
        "covered","gap","gap","gap","gap","gap","covered","gap","gap","gap","gap","gap",
      ],
    },
    {
      keyword: "automated email",
      relevance: 88, mustHave: false,
      cells: [
        "high-priority","gap","covered","high-priority","gap","gap","gap","covered","gap","gap","covered","gap",
      ],
    },
    {
      keyword: "drip campaign",
      relevance: 81, mustHave: false,
      cells: [
        "covered","covered","gap","gap","gap","covered","gap","covered","gap","gap","gap","gap",
      ],
    },
    {
      keyword: "lead nurturing",
      relevance: 78, mustHave: true,
      cells: [
        "covered","gap","covered","covered","gap","gap","gap","gap","covered","gap","gap","gap",
      ],
    },
    {
      keyword: "email template",
      relevance: 73, mustHave: false,
      cells: [
        "gap","gap","gap","covered","gap","gap","high-priority","gap","gap","gap","gap","gap",
      ],
    },
    {
      keyword: "automated email marketing",
      relevance: 71, mustHave: false,
      cells: [
        "gap","covered","gap","gap","gap","covered","gap","gap","gap","gap","gap","gap",
      ],
    },
    {
      keyword: "email campaign",
      relevance: 67, mustHave: false,
      cells: [
        "gap","gap","gap","gap","gap","gap","gap","covered","gap","gap","gap","quick-win",
      ],
    },
    {
      keyword: "marketing automation tool",
      relevance: 64, mustHave: false,
      cells: [
        "gap","gap","gap","gap","high-priority","gap","gap","gap","gap","gap","gap","gap",
      ],
    },
    {
      keyword: "transactional email",
      relevance: 58, mustHave: false,
      cells: [
        "gap","gap","gap","gap","gap","gap","gap","gap","gap","gap","covered","gap",
      ],
    },
    {
      keyword: "behavioral email",
      relevance: 52, mustHave: false,
      cells: [
        "gap","gap","gap","gap","gap","gap","gap","gap","quick-win","gap","gap","gap",
      ],
    },
    {
      keyword: "abandoned cart email",
      relevance: 49, mustHave: false,
      cells: [
        "gap","gap","gap","gap","gap","quick-win","gap","gap","gap","gap","gap","gap",
      ],
    },
  ],
}

