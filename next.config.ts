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
  ],
}

export default nextConfig
