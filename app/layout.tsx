import type { Metadata } from 'next'
import '@cloudscape-design/global-styles/index.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'Grace',
  description: 'Grace application',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
