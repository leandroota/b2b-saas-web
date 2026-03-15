import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sem output: "export" — permite Server Components e API Routes
  // @cloudflare/next-on-pages compila para Cloudflare Workers
  images: {
    unoptimized: true,        // Cloudflare Pages não tem o Next.js Image optimizer
  },
};

export default nextConfig;


