/** @type {import('next').NextConfig} */
const nextConfig = {
  // Otimizações de performance
  compress: true,
  poweredByHeader: false,
  
  // Otimizações de imagens
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Configuração para compatibilidade com shadcn/ui
  transpilePackages: ['lucide-react'],
  
  // Otimizações de bundle
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'motion/react'],
  },
  
  // Compressão e otimizações (swcMinify é padrão no Next.js 15)
  
  // Headers de performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

export default nextConfig
