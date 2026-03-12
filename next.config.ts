import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",           // Gera pasta `out/` estática para Cloudflare Pages
  trailingSlash: true,        // Necessário para rotas funcionarem corretamente no Cloudflare
  images: {
    unoptimized: true,        // Cloudflare Pages não tem o Next.js Image optimizer
  },
};

export default nextConfig;


