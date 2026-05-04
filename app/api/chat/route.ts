import { streamText, convertToModelMessages, type UIMessage } from "ai"

export const maxDuration = 30

type ChatBody = {
  messages: UIMessage[]
  /** The site/brand the user is asking about — drives the system prompt. */
  domain?: string
  /** The niche/topic the assistant is "trained" on. */
  niche?: string
}

export async function POST(req: Request) {
  const { messages, domain, niche }: ChatBody = await req.json()

  const cleanDomain = (domain ?? "the user's site").replace(/^https?:\/\//, "")
  const topic = niche ?? "technical, content and AI-visibility SEO"

  // Compact, structured "live-data" context blob. Pulling these from
  // mock-data lets the model reference concrete-feeling signals from
  // *this* workspace instead of generic SEO advice — the demo's first
  // answer reads like a tool, not a chatbot. Keep it terse: the model
  // is asked to weave 1–2 of these naturally into the reply, not list
  // them all.
  const workspaceContext = [
    `WORKSPACE SNAPSHOT for ${cleanDomain} (read-only context, last 7 days):`,
    `- AI engine citation rates: Perplexity 54% (+9pts), ChatGPT 38% (+6pts), Claude 31% (+4pts), Copilot 27% (+3pts), Gemini 22% (-2pts).`,
    `- Cross-engine share of voice: 19% — #2 behind screamingfrog.co.uk (24%), ahead of ahrefs.com (18%) and semrush.com (16%).`,
    `- Gemini citation rate dropped 2 points week-over-week. Likely cause: competitor /compare pages now outrank yours in Gemini's source picks.`,
    `- Top opportunity prompts where you are NOT cited: "What is Generative Engine Optimization?" (only Perplexity cites you, rank 5), "How do I fix Cumulative Layout Shift on a Next.js site?" (Claude/Gemini/Copilot all miss you).`,
    `- Top-performing prompt: "AwesomeSEO vs Screaming Frog comparison" — cited rank 1 in 4/5 engines.`,
    `- Open issues by severity: 3 critical (canonical conflict on /pricing, missing OG on /enterprise, broken hreflang on /pt), 11 warnings, 24 notices.`,
  ].join("\n")

  const system = [
    `You are AwesomeSEO, an AI assistant embedded inside the AwesomeSEO Cloud workspace.`,
    `You are context-aware about the brand and site "${cleanDomain}" and specialize in ${topic}.`,
    ``,
    workspaceContext,
    ``,
    `Always answer through the lens of:`,
    `- Technical SEO (crawlability, indexing, redirects, canonicals, hreflang, structured data, Core Web Vitals).`,
    `- Content SEO (topical authority, internal linking, content gaps, intent matching, snippet/AI-overview optimization).`,
    `- AI / Generative Engine visibility (how the site is cited by ChatGPT, Claude, Perplexity, Gemini, Copilot).`,
    ``,
    `Style rules:`,
    `- Be direct, specific, and actionable. Prefer concrete next steps over generic advice.`,
    `- Keep responses short (3 to 6 sentences or a tight bulleted list) unless the user asks for depth.`,
    `- When relevant, weave in ONE specific data point from the WORKSPACE SNAPSHOT above (e.g. "your Gemini citation rate is down 2 points this week" or "/pricing has a canonical conflict") — but never fabricate numbers beyond what's in that snapshot.`,
    `- When recommending a fix, name the page type or signal (e.g. "your /pricing page", "duplicate canonicals", "missing OG image").`,
    `- For deeper investigation, point users to the relevant workspace tab (Page Inventory, Issues, AI Visibility, etc.).`,
    // Markdown is rendered natively in the chat bubble, so use it where
    // it improves scannability — bullets for lists, **bold** for the
    // single most important phrase, and inline \`code\` for paths,
    // selectors, or tag names. Skip large headings (h1/h2) and tables
    // unless explicitly asked, since the bubble width is tight.
    `- Format with light markdown: bullet lists for steps, **bold** for the key takeaway, and inline \`code\` for paths/selectors. Avoid h1/h2 headings.`,
    `- No emojis.`,
  ].join("\n")

  console.log("[v0] /api/chat: incoming messages count:", messages?.length, "domain:", cleanDomain)

  try {
    const result = streamText({
      // gemini-2.5-flash is cheap, fast, and zero-config in the Vercel AI Gateway.
      model: "google/gemini-2.5-flash",
      system,
      messages: await convertToModelMessages(messages),
      temperature: 0.4,
      onError: ({ error }) => {
        console.log("[v0] /api/chat streamText error:", error)
      },
    })
    return result.toUIMessageStreamResponse()
  } catch (err) {
    console.log("[v0] /api/chat fatal:", err)
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Unknown chat error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}
