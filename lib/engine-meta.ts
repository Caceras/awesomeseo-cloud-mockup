import type { AiEngineKey } from "@/lib/mock-data"

/**
 * Per-engine editorial metadata used by the AI Visibility hub and the
 * dedicated engine pages. Kept out of `mock-data.ts` because this is
 * positioning content (would survive in a real backend) rather than
 * sample telemetry.
 */
export type EngineMeta = {
  key: AiEngineKey
  name: string
  parent: string
  tagline: string
  // Short positioning paragraph for hero
  positioning: string
  // 3-line "how it differs" – each is a single, scannable sentence
  differentiators: string[]
  // What this engine actually rewards
  rankingSignals: { label: string; weight: "high" | "medium" | "low" }[]
  // 3 concrete tasks the user can act on for this engine
  actions: { title: string; body: string }[]
  // Brand colors (for accent strips/glows only — not theme bleed)
  accent: string
  glow: string
  // Audience / use-case framing
  audience: string
  // Where data is sourced
  dataSource: string
}

export const engineMeta: Record<AiEngineKey, EngineMeta> = {
  chatgpt: {
    key: "chatgpt",
    name: "ChatGPT",
    parent: "OpenAI",
    tagline: "The largest answer engine — your brand needs to be in its training data and live web index.",
    positioning:
      "ChatGPT serves the broadest audience of any AI engine, mixing pretrained knowledge with live browsing through Bing. Citations skew toward well-established, frequently-mentioned brands, structured factual content, and pages that earn third-party endorsements across the open web.",
    differentiators: [
      "Largest user base — visibility here compounds faster than anywhere else.",
      "Hybrid: leans on pretraining for definitions, on live browsing for fresh comparisons.",
      "Citations correlate with brand mentions across Reddit, GitHub, Wikipedia, and major publications.",
    ],
    rankingSignals: [
      { label: "Brand mentions across the open web", weight: "high" },
      { label: "Bing index ranking", weight: "high" },
      { label: "Structured factual content (lists, tables, definitions)", weight: "high" },
      { label: "Reddit / Stack Overflow / Wikipedia presence", weight: "medium" },
      { label: "Schema.org markup", weight: "medium" },
    ],
    actions: [
      {
        title: "Earn brand mentions on high-authority forums",
        body: "ChatGPT pulls heavily from Reddit, Stack Overflow, Hacker News, and Wikipedia. Track unlinked mentions and seed authentic discussions in communities where your audience already is.",
      },
      {
        title: "Publish structured comparison content",
        body: "Lists, tables, and definitions are over-represented in ChatGPT answers. Create '[Tool] vs [Tool]' and 'Best X for Y' pages with crisp, scannable structure.",
      },
      {
        title: "Optimize for Bing alongside Google",
        body: "ChatGPT's browse mode uses Bing. Submit your sitemap to Bing Webmaster Tools and validate that your top 20 pages rank in Bing's top 10.",
      },
    ],
    accent: "#10A37F",
    glow: "rgba(16, 163, 127, 0.18)",
    audience: "Generalist consumers, developers, knowledge workers",
    dataSource: "ChatGPT API + browsing tool, replayed weekly",
  },
  claude: {
    key: "claude",
    name: "Claude",
    parent: "Anthropic",
    tagline: "The depth-first engine — rewards long, well-structured documentation over surface-level pages.",
    positioning:
      "Claude is the most enterprise-aligned answer engine and is heavily used inside dev tools, research workflows, and customer-support replacements. It rarely browses live; instead, it leans on its long-context training, which favors thorough documentation, original research, and semantically clear writing.",
    differentiators: [
      "Long context window — entire docs sites are remembered, not just snippets.",
      "Less browsing-dependent than ChatGPT or Perplexity; pretraining matters more.",
      "Tends to over-cite well-structured technical documentation and academic sources.",
    ],
    rankingSignals: [
      { label: "Comprehensive technical documentation", weight: "high" },
      { label: "Clear semantic HTML and headings", weight: "high" },
      { label: "Original research and primary data", weight: "high" },
      { label: "Glossary / definition pages", weight: "medium" },
      { label: "Open-source repository presence", weight: "medium" },
    ],
    actions: [
      {
        title: "Deepen your most-cited topic clusters",
        body: "Claude rewards thorough, single-page treatments of a topic. Identify your top 5 cited URLs and expand each into a definitive 3,000+ word reference.",
      },
      {
        title: "Add explicit definitions and glossaries",
        body: "Claude pattern-matches on '[Term] is [definition]' phrasing. Add a glossary section to your docs and your most-trafficked guides.",
      },
      {
        title: "Open-source a meaningful asset",
        body: "Claude's training corpus over-indexes on GitHub. Publishing a useful library or data set under your domain dramatically increases citation likelihood.",
      },
    ],
    accent: "#D97757",
    glow: "rgba(217, 119, 87, 0.18)",
    audience: "Developers, technical writers, researchers, enterprise teams",
    dataSource: "Claude API, replayed weekly",
  },
  perplexity: {
    key: "perplexity",
    name: "Perplexity",
    parent: "Perplexity AI",
    tagline: "The search-first answer engine — citations are the entire product, freshness wins.",
    positioning:
      "Perplexity is built around live web search and always shows its sources. Of all the AI engines, it has the highest correlation with traditional SEO: if you rank in Google or Bing for a query, you have a strong chance of being cited. It rewards freshness, primary sources, and citation-friendly formatting.",
    differentiators: [
      "Always browses live — pretraining barely matters.",
      "Shows numbered citations on every answer, so being source #1–3 is gold.",
      "Strongest correlation with traditional Google/Bing rankings.",
    ],
    rankingSignals: [
      { label: "Google / Bing organic ranking", weight: "high" },
      { label: "Content freshness and update cadence", weight: "high" },
      { label: "Primary-source data and original quotes", weight: "high" },
      { label: "Clear publish/update dates", weight: "medium" },
      { label: "Citation-friendly formatting (short paragraphs, lists)", weight: "medium" },
    ],
    actions: [
      {
        title: "Refresh your top 10 cited pages monthly",
        body: "Perplexity heavily weights freshness signals. Add an updated date, change at least 10% of the content, and republish.",
      },
      {
        title: "Publish primary research",
        body: "Perplexity prefers primary sources over commentary. Run a survey, publish proprietary benchmarks, or release original data — these get cited disproportionately often.",
      },
      {
        title: "Win Google/Bing for your target prompts",
        body: "Reverse-engineer the prompts where you don't appear: rank in Google's top 5 for the underlying query and Perplexity citation typically follows within weeks.",
      },
    ],
    accent: "#22D3DC",
    glow: "rgba(34, 211, 220, 0.18)",
    audience: "Researchers, journalists, knowledge workers",
    dataSource: "Perplexity API, replayed weekly",
  },
  gemini: {
    key: "gemini",
    name: "Gemini",
    parent: "Google",
    tagline: "Google's AI — wins on AI Overview presence and multimodal content.",
    positioning:
      "Gemini powers Google's AI Overviews and is increasingly the surface where Google's organic traffic ends up. Its citation patterns mirror Google's E-E-A-T signals, with extra weight on multimodal content (videos, images, structured data) that Google already understands.",
    differentiators: [
      "Tied directly to Google Search and AI Overviews — winning here protects organic traffic.",
      "Multimodal: pages with embedded video, images, and rich data get cited more.",
      "E-E-A-T (experience, expertise, authoritativeness, trust) is the baseline.",
    ],
    rankingSignals: [
      { label: "Google AI Overview presence", weight: "high" },
      { label: "E-E-A-T signals (author, citations, reviews)", weight: "high" },
      { label: "Schema.org structured data", weight: "high" },
      { label: "Embedded video and images", weight: "medium" },
      { label: "Google Knowledge Panel coverage", weight: "medium" },
    ],
    actions: [
      {
        title: "Win the AI Overview for your top 20 keywords",
        body: "AI Overview presence is the strongest predictor of Gemini citations. Use the Google tab to find your queries with AI Overview shown but no inclusion — those are your top targets.",
      },
      {
        title: "Add author bios with credentials",
        body: "Gemini reads E-E-A-T signals literally. Every cornerstone page should have an author block linking to a real person with verifiable expertise.",
      },
      {
        title: "Embed multimodal content",
        body: "Gemini disproportionately cites pages with video and high-quality images. Add at least one short embedded video to your top 10 pages.",
      },
    ],
    accent: "#4F86F7",
    glow: "rgba(79, 134, 247, 0.18)",
    audience: "Google users (the broadest audience of any engine)",
    dataSource: "Gemini API + Google AI Overview scraping, weekly",
  },
  copilot: {
    key: "copilot",
    name: "Copilot",
    parent: "Microsoft",
    tagline: "Microsoft's AI — Bing-first, with a strong enterprise distribution channel.",
    positioning:
      "Copilot lives inside Microsoft 365, Edge, and Windows, giving it disproportionate reach inside enterprises. Its answers are powered primarily by Bing search, so winning Copilot is largely a function of winning Bing — but with a layer of Microsoft-ecosystem signals on top.",
    differentiators: [
      "Default AI inside Microsoft 365 — enterprise distribution at scale.",
      "Bing-powered: ranking signals overlap heavily with Bing organic.",
      "Over-cites Microsoft Learn, GitHub, Stack Overflow, and LinkedIn content.",
    ],
    rankingSignals: [
      { label: "Bing organic ranking", weight: "high" },
      { label: "Schema.org markup (Bing reads it eagerly)", weight: "high" },
      { label: "Microsoft Learn / Docs citations", weight: "medium" },
      { label: "LinkedIn presence and articles", weight: "medium" },
      { label: "GitHub repository visibility", weight: "medium" },
    ],
    actions: [
      {
        title: "Submit your sitemap to Bing Webmaster Tools",
        body: "Copilot citations require a strong Bing index presence. If you only optimize for Google, your Copilot share will lag — fix that first.",
      },
      {
        title: "Mirror your best content as LinkedIn articles",
        body: "Copilot pulls heavily from LinkedIn for B2B prompts. Republish your top 5 cornerstone posts there with canonical tags pointing home.",
      },
      {
        title: "Add comprehensive Schema.org markup",
        body: "Bing rewards explicit structured data more than Google does. Validate that every page has Article, FAQ, or HowTo schema — whichever fits.",
      },
    ],
    accent: "#A855F7",
    glow: "rgba(168, 85, 247, 0.18)",
    audience: "Enterprise knowledge workers using Microsoft 365",
    dataSource: "Copilot API, replayed weekly",
  },
}

export const allEngineKeys: AiEngineKey[] = [
  "chatgpt",
  "claude",
  "perplexity",
  "gemini",
  "copilot",
]
