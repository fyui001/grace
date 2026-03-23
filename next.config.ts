import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  compiler: {},
  allowedDevOrigins: ['grace.localhost'],
  transpilePackages: [
    '@cloudscape-design/components',
    '@cloudscape-design/design-tokens',
    '@cloudscape-design/component-toolkit',
    '@blocknote/core',
    '@blocknote/react',
    '@blocknote/mantine',
  ],
  async rewrites() {
    const target = process.env.SSR_API_BASE_PATH
    if (!target) return []
    return [
      {
        source: '/api/:path*',
        destination: `${target}/api/:path*`,
      },
      {
        source: '/auth0/:path*',
        destination: `${target}/auth0/:path*`,
      },
    ]
  },
  // ローカルではTraefikが/api/*,/auth0/*をSophiaに直接転送するため
  // rewritesは本番デプロイ時のみ使用される
}

export default nextConfig
