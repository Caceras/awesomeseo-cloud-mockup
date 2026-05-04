import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AccessGate } from "@/components/access-gate"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
  // Sans is the dominant face — preload prevents FOIT on first paint.
  preload: true,
  // Falls back to a metrics-matched system stack so any swap is
  // visually quiet (no layout shift on font load).
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  // Mono only renders inside KPI digits and small chips — skipping the
  // preload saves ~22KB of WOFF2 bandwidth on the critical path.
  preload: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
})

export const metadata: Metadata = {
  title: {
    default: "AwesomeSEO Cloud — SEO crawls, AI fixes, and team workspaces",
    template: "%s · AwesomeSEO Cloud",
  },
  description:
    "The cloud companion to the AwesomeSEO Chrome extension. Schedule crawls, persist history, prioritize fixes with AI, and ship them with your team.",
  generator: "v0.app",
  applicationName: "AwesomeSEO Cloud",
  keywords: [
    "SEO",
    "crawler",
    "technical SEO",
    "Core Web Vitals",
    "AI SEO",
    "Chrome extension",
  ],
  openGraph: {
    type: "website",
    siteName: "AwesomeSEO Cloud",
    title: "AwesomeSEO Cloud — SEO crawls, AI fixes, and team workspaces",
    description:
      "The cloud companion to the AwesomeSEO Chrome extension. Schedule crawls, persist history, prioritize fixes with AI, and ship them with your team.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AwesomeSEO Cloud — SEO crawls, AI fixes, and team workspaces",
    description:
      "The cloud companion to the AwesomeSEO Chrome extension. Schedule crawls, persist history, prioritize fixes with AI, and ship them with your team.",
  },
  // `icons`, `openGraph.images`, and `twitter.images` are auto-populated by
  // Next.js from the file conventions: app/icon.png, app/opengraph-image.png,
  // app/twitter-image.png — no manual paths needed.

  // Stops iOS Safari from auto-detecting digit strings (page counts,
  // dates, IDs, ports) and silently turning them into tap-to-call
  // links. The dashboard is full of numbers — without this, every
  // "1,824 pages" string gets a phantom anchor under the hood, which
  // both wastes paint cycles and breaks copy/paste.
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  // Gives iOS the right standalone-app metadata when the user pins to
  // the home screen — matches the manifest theme so the launch splash
  // doesn't flash white.
  appleWebApp: {
    capable: true,
    title: "AwesomeSEO",
    statusBarStyle: "black-translucent",
  },
}

export const viewport: Viewport = {
  themeColor: "#0a1024",
  width: "device-width",
  initialScale: 1,
  // Allow up to 5× zoom for accessibility, but don't forbid pinch-to-zoom
  // entirely (which would fail WCAG 2.1 SC 1.4.4).
  maximumScale: 5,
  // Required for `env(safe-area-inset-*)` to resolve on iPhone notch
  // devices — without this the chat bar would sit under the home
  // indicator on iOS.
  viewportFit: "cover",
  colorScheme: "dark",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} bg-background dark`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground font-sans antialiased">
        {/* Gate the entire app behind a riddle + dummy-data onboarding
            so the demo always opens with the intended first impression. */}
        <AccessGate>{children}</AccessGate>
        <Toaster />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
