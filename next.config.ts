import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  compiler: {},
  allowedDevOrigins: ['grace.localhost'],
}

export default nextConfig
