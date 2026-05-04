import { AppSidebar } from "@/components/app-sidebar"
import { AppTopbar } from "@/components/app-topbar"
import { DataChatBar } from "@/components/data-chat-bar"
import { ChatBarCoachMark } from "@/components/chat-bar-coach-mark"

type ChatContext = {
  domain: string
  niche?: string
  suggestions?: string[]
}

const defaultChatContext: ChatContext = {
  domain: "your workspace",
  niche: "technical, content and AI-visibility SEO",
  suggestions: [
    "Which projects need attention this week?",
    "Show pages losing AI citations",
    "Summarise what changed since last crawl",
    "What should I fix first to move my health score?",
  ],
}

export function AppShell({
  children,
  chatContext,
}: {
  children: React.ReactNode
  /** Optional per-section overrides so the chat bar feels site-aware on project pages. */
  chatContext?: ChatContext
}) {
  const ctx = chatContext ?? defaultChatContext
  return (
    <div className="flex min-h-svh bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppTopbar />
        {/* pb leaves room for the persistent floating chat bar so content
            never runs under it. We add `env(safe-area-inset-bottom)` on
            top of the static 8rem so the gap is correct on iPhone X-class
            devices where the bar itself sits inset by the home indicator.
            min-w-0 prevents long table cells / wide graphs from forcing
            horizontal scroll on the shell flexbox. */}
        <main className="flex-1 min-w-0 pb-[calc(8rem+env(safe-area-inset-bottom))]">
          {children}
        </main>

        {/* Persistent, context-aware AI chat bar — visible on every page. */}
        <DataChatBar
          domain={ctx.domain}
          niche={ctx.niche}
          suggestions={ctx.suggestions}
        />

        {/* First-run coach mark introducing the chat bar. Renders nothing
            unless the access gate flagged a fresh unlock this session,
            so existing users don't see it on every navigation. */}
        <ChatBarCoachMark />
      </div>
    </div>
  )
}
