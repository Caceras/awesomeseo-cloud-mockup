import type { MetadataRoute } from "next"

/**
 * Web App Manifest — gives the app an installable PWA shell, the right
 * theme/background colors when launched standalone (Android) or pinned
 * to the iOS home screen, and a real app name in the OS launcher.
 *
 * Even on browsers that never actually install the app, having this file
 * resolves the implicit `<link rel="manifest">` Next.js emits, which
 * unlocks several Lighthouse "PWA-ready" wins and a higher mobile
 * score. The numbers below mirror the topbar/background tokens so the
 * standalone splash matches our actual UI palette.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AwesomeSEO Cloud",
    short_name: "AwesomeSEO",
    description:
      "The cloud companion to the AwesomeSEO Chrome extension. Schedule crawls, persist history, prioritize fixes with AI, and ship them with your team.",
    start_url: "/",
    // `standalone` removes browser chrome on Android once installed —
    // the user experience the chat bar, sidebar, and topbar were
    // designed for. We deliberately avoid `fullscreen` since the URL
    // bar gives users an obvious "back to safety" affordance.
    display: "standalone",
    orientation: "portrait",
    background_color: "#0a1024",
    theme_color: "#0a1024",
    categories: ["productivity", "business", "developer"],
    // Next.js auto-resolves these from the conventions in /app
    // (icon.png, apple-icon.png) — listing them explicitly here makes
    // them discoverable to non-Next.js consumers (Lighthouse, install
    // prompts) without duplicating files.
    icons: [
      { src: "/icon.png", sizes: "any", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  }
}
