"use client"

import { useEffect, useState } from "react"
import { Lock, X, Skull, Radiation, Sparkles, ArrowRight, Info } from "lucide-react"
import { AwesomeLogo } from "@/components/awesome-logo"
import { DashboardPreloads } from "@/components/dashboard-preloads"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type Stage = "locked" | "jumpscare" | "onboarding" | "unlocked"

const STORAGE_KEY = "awesomeseo:demo-access"
const ANSWER = "form" // "Färg och form?" — Swedish for "Colour and form?"
const JUMPSCARE_MS = 2000

/**
 * Client-side access gate that wraps the entire app.
 *
 * Flow:
 *  1. Locked     — riddle login ("Färg och…?", answer: "form").
 *  2. Jumpscare  — 2 s of strobing red with X / skull / radiation icons.
 *  3. Onboarding — collects Name, URL, Main Keyword, Competitors with a
 *                  clear "this is a demo, dummy data only" caveat.
 *  4. Unlocked   — renders children. Persisted in sessionStorage so the
 *                  gate doesn't fire again on every navigation in the
 *                  same tab. Per-tab on purpose — a fresh window resets.
 */
export function AccessGate({ children }: { children: React.ReactNode }) {
  // Avoid SSR/CSR flash by starting in a "checking" state. We only render
  // either the gate UI or children once we've inspected sessionStorage.
  const [stage, setStage] = useState<Stage | "checking">("checking")

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      setStage(stored === "unlocked" ? "unlocked" : "locked")
    } catch {
      setStage("locked")
    }
  }, [])

  function handleUnlock() {
    setStage("jumpscare")
    window.setTimeout(() => setStage("onboarding"), JUMPSCARE_MS)
  }

  function handleOnboardingComplete() {
    try {
      sessionStorage.setItem(STORAGE_KEY, "unlocked")
      // Flag a fresh-unlock so the chat bar coach mark fires once the
      // dashboard mounts. Covers both the Submit and Skip paths because
      // both end up here. The coach mark itself flips this to "seen".
      sessionStorage.setItem("awesomeseo:chatbar-intro", "pending")
    } catch {
      // Storage may be unavailable (private browsing, etc.) — gate still
      // unlocks for this render, just won't persist across reloads.
    }
    setStage("unlocked")
  }

  if (stage === "checking") {
    // Empty placeholder matched to body bg so we don't flash white before
    // the effect resolves. Aria-busy lets AT consumers know we're waiting.
    return (
      <div
        aria-busy
        aria-live="polite"
        className="min-h-svh w-full bg-background"
      />
    )
  }

  if (stage === "unlocked") return <>{children}</>

  return (
    <>
      {/* Warm the dashboard's heavy images in the background while the
          user is still inside the gate — they're guaranteed to land on
          the dashboard next, so any work we do here is "free" wall-clock
          time. React 19 hoists these <link> tags into <head>. */}
      <DashboardPreloads />
      {stage === "locked" && <RiddleLogin onSolved={handleUnlock} />}
      {stage === "jumpscare" && <Jumpscare />}
      {stage === "onboarding" && <Onboarding onComplete={handleOnboardingComplete} />}
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* Stage 1 — the riddle login                                                 */
/* -------------------------------------------------------------------------- */

function RiddleLogin({ onSolved }: { onSolved: () => void }) {
  const [value, setValue] = useState("")
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const guess = value.trim().toLowerCase()
    if (guess === ANSWER) {
      onSolved()
      return
    }
    setError(true)
    setShake(true)
    window.setTimeout(() => setShake(false), 450)
  }

  return (
    <main className="relative min-h-svh w-full overflow-hidden bg-background flex items-center justify-center p-6">
      {/* Soft ambient glow — keeps the page from feeling stark. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(60%_50%_at_50%_30%,oklch(0.55_0.18_260/.18),transparent_70%),radial-gradient(40%_40%_at_80%_80%,oklch(0.55_0.18_30/.10),transparent_70%)]"
      />

      <div
        className={cn(
          "w-full max-w-md rounded-2xl border border-border bg-card/70 backdrop-blur-md shadow-2xl",
          "p-8 sm:p-10",
          shake && "motion-safe:animate-[shake_0.45s_ease-in-out]",
        )}
        style={{
          // Inline keyframes via CSS variable; works without touching globals.
          // The `animation` property above references this name.
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <AwesomeLogo size={36} />
          <div className="leading-tight">
            <div className="text-sm font-semibold">AwesomeSEO Cloud</div>
            <div className="text-xs text-muted-foreground">Private demo</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-2">
          <Lock className="size-3.5" />
          <span>Riddle to enter</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
          Färg och…?
        </h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Answer the riddle to unlock the demo workspace. One word.
        </p>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3">
          <Label htmlFor="riddle-answer" className="sr-only">
            Your answer
          </Label>
          <Input
            id="riddle-answer"
            type="password"
            autoFocus
            autoComplete="off"
            spellCheck={false}
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              if (error) setError(false)
            }}
            placeholder="…"
            aria-invalid={error}
            aria-describedby={error ? "riddle-error" : undefined}
            className={cn(
              "h-12 text-base bg-background/60 border-border",
              error && "border-destructive focus-visible:ring-destructive/40",
            )}
          />
          {error && (
            <p
              id="riddle-error"
              role="alert"
              className="text-xs text-destructive"
            >
              Not quite. Try again.
            </p>
          )}
          <Button type="submit" size="lg" className="h-12 mt-1">
            Unlock
            <ArrowRight className="size-4" />
          </Button>
        </form>

        <p className="mt-6 text-[11px] text-muted-foreground/80 leading-relaxed">
          This is a private demo build of AwesomeSEO Cloud. No real data is
          collected.
        </p>
      </div>

      {/* Local keyframes so we don't need to touch globals.css just for the
          shake. Tailwind's arbitrary `animate-[shake…]` resolves against any
          `@keyframes shake` defined in scope. */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </main>
  )
}

/* -------------------------------------------------------------------------- */
/* Stage 2 — the 2-second jumpscare                                           */
/* -------------------------------------------------------------------------- */

function Jumpscare() {
  return (
    <div
      role="alert"
      aria-label="Access granted"
      // The whole panel pulses red. Inner icons jitter for a more aggressive
      // vibe. `motion-reduce:` collapses the animation for accessibility.
      className={cn(
        "fixed inset-0 z-[200] flex items-center justify-center",
        "bg-red-600",
        "motion-safe:animate-[jumpscare-flash_0.18s_steps(2)_infinite]",
        "motion-reduce:bg-red-700",
      )}
    >
      <div className="flex items-center gap-6 sm:gap-10 motion-safe:animate-[jumpscare-jitter_0.09s_steps(2)_infinite]">
        <X
          className="size-24 sm:size-32 md:size-40 text-white drop-shadow-[0_0_24px_rgba(0,0,0,0.8)]"
          strokeWidth={3}
          aria-hidden
        />
        <Skull
          className="size-24 sm:size-32 md:size-40 text-white drop-shadow-[0_0_24px_rgba(0,0,0,0.8)]"
          strokeWidth={2.25}
          aria-hidden
        />
        <Radiation
          className="size-24 sm:size-32 md:size-40 text-white drop-shadow-[0_0_24px_rgba(0,0,0,0.8)]"
          strokeWidth={2.25}
          aria-hidden
        />
      </div>

      {/* Subtle scanline overlay to amp up the "danger" feel without
          being so loud it triggers seizure thresholds. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-30 [background:repeating-linear-gradient(0deg,rgba(0,0,0,0.6)_0px,rgba(0,0,0,0.6)_2px,transparent_2px,transparent_4px)]"
      />

      <style jsx>{`
        @keyframes jumpscare-flash {
          0%, 49% { background-color: oklch(0.58 0.24 27); }
          50%, 100% { background-color: oklch(0.32 0.22 27); }
        }
        @keyframes jumpscare-jitter {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-3px, 2px) rotate(-1.5deg); }
          50% { transform: translate(2px, -2px) rotate(1.5deg); }
          75% { transform: translate(-2px, -1px) rotate(-1deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
      `}</style>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Stage 3 — the dummy-data onboarding form                                   */
/* -------------------------------------------------------------------------- */

function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [name, setName] = useState("")
  const [url, setUrl] = useState("")
  const [keyword, setKeyword] = useState("")
  const [competitors, setCompetitors] = useState("")

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Intentionally throw the input away — this is a demo. We just need
    // a "yes I clicked through" gate before letting the user in.
    onComplete()
  }

  return (
    <main className="min-h-svh w-full bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <div className="flex items-center gap-3 mb-6">
          <AwesomeLogo size={36} />
          <div className="leading-tight">
            <div className="text-sm font-semibold">AwesomeSEO Cloud</div>
            <div className="text-xs text-muted-foreground">Workspace setup</div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-md shadow-xl p-7 sm:p-9">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-2">
            <Sparkles className="size-3.5" />
            <span>Getting started</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
            Welcome <span aria-hidden>🤗</span>
            <span className="sr-only">— hugging face</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Tell us about your site and we&apos;ll prefill your dashboard so
            the demo feels real. Takes about 30 seconds.
          </p>

          {/* The honest caveat — important to set expectations up-front. */}
          <div className="mt-5 flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/10 p-3.5">
            <Info className="size-4 mt-0.5 text-warning shrink-0" aria-hidden />
            <p className="text-xs text-foreground/85 leading-relaxed">
              <span className="font-medium text-warning">Heads up:</span>{" "}
              this is a demo. Whatever you enter here is{" "}
              <span className="font-medium">used as dummy data only</span>{" "}
              — no crawl runs, no data leaves your browser, nothing is
              saved past this session.
            </p>
          </div>

          <form
            onSubmit={onSubmit}
            className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <Field
              label="Your name"
              hint="Used in the workspace greeting."
              className="sm:col-span-2"
            >
              <Input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Anders Andersson"
                autoComplete="name"
                className="h-11 bg-background/60"
              />
            </Field>

            <Field
              label="Site URL"
              hint="The site we'll pretend to crawl."
              className="sm:col-span-2"
            >
              <Input
                required
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                autoComplete="url"
                className="h-11 bg-background/60"
              />
            </Field>

            <Field
              label="Main keyword"
              hint="What you most want to rank for."
            >
              <Input
                required
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="ergonomic office chair"
                className="h-11 bg-background/60"
              />
            </Field>

            <Field
              label="Top competitors"
              hint="Comma-separated."
            >
              <Input
                value={competitors}
                onChange={(e) => setCompetitors(e.target.value)}
                placeholder="competitor.com, another.io"
                className="h-11 bg-background/60"
              />
            </Field>

            <div className="sm:col-span-2 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onComplete}
                className="text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline self-center sm:self-auto"
              >
                Skip — just show me the demo
              </button>
              <Button type="submit" size="lg" className="h-11 sm:min-w-44">
                Enter workspace
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

function Field({
  label,
  hint,
  className,
  children,
}: {
  label: string
  hint?: string
  className?: string
  children: React.ReactNode
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-")
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id} className="text-xs font-medium">
        {label}
      </Label>
      {/* `children` is the actual input — we clone via wrapper so the htmlFor
          association still works without forwarding refs through the API. */}
      <div className="[&>*]:w-full" id={`${id}-wrap`}>
        {children}
      </div>
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  )
}
