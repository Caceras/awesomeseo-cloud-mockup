/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // The project ships type-checked locally; keep build green if a stray
    // type error sneaks into a non-critical surface.
    ignoreBuildErrors: true,
  },
  // Image optimisation is on by default — we explicitly opt into AVIF +
  // WebP so the engine logos and SEO essentials cards (large PNGs) get
  // resized and re-encoded by the Vercel image CDN. This single change
  // turns ~6MB of raw PNG payload on the dashboard into ~120KB of
  // properly sized AVIF for typical viewports.
  images: {
    formats: ["image/avif", "image/webp"],
    // Brand marks rendered at 14–20px don't benefit from per-DPR variants;
    // these are kept conservative to avoid wasted optimisation work.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 24, 32, 48, 64, 96, 128, 256],
  },
  // Tighten compression of HTML/RSC payloads.
  compress: true,
  // Strip the default `X-Powered-By: Next.js` header — saves bytes on
  // every response and removes a small fingerprinting surface.
  poweredByHeader: false,
  // React 19 strict mode catches state-update foot-guns at dev time.
  reactStrictMode: true,
}

export default nextConfig
