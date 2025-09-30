/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para GitHub Pages
  output: 'export',
  trailingSlash: true,
  
  // Otimizações de performance
  compress: true,
  poweredByHeader: false,
  
  // Otimizações de imagens (compatível com export estático)
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Configuração para compatibilidade com shadcn/ui
  transpilePackages: ['lucide-react'],
  
  // Otimizações de bundle
  experimental: {
    optimizePackageImports: ['lucide-react', 'motion/react'],
  },
  
  // Compressão e otimizações (swcMinify é padrão no Next.js 15)
}

export default nextConfig
