/** @type {import('next').NextConfig} */
const nextConfig = {
  // Otimizações de performance
  compress: true,
  poweredByHeader: false,
  
  // Otimizações de imagens
  images: {
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
  
  // Configurações de desenvolvimento
  ...(process.env.NODE_ENV === 'development' && {
    // Desabilitar Fast Refresh problemático
    reactStrictMode: false,
    // Desabilitar hot reload completamente
    webpack: (config, { dev }) => {
      if (dev) {
        config.watchOptions = {
          poll: false,
          aggregateTimeout: 1000,
          ignored: ['**/node_modules/**', '**/.git/**', '**/.next/**']
        }
        // Desabilitar hot reload
        config.optimization = {
          ...config.optimization,
          splitChunks: false
        }
      }
      return config
    },
  }),
  
  // Compressão e otimizações (swcMinify é padrão no Next.js 15)
  
  // Headers de performance, SEO e segurança
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
        ],
      },
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
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

export default nextConfig
