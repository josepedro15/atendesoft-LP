/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  // Configuração para compatibilidade com shadcn/ui
  transpilePackages: ['lucide-react'],
}

export default nextConfig
