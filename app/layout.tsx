import type { Metadata } from 'next'
import { headers } from 'next/headers'
import './globals.css'
import { ThemeProvider } from 'components/theme/ThemeProvider'

export const metadata: Metadata = {
  title: 'Grace',
  description: 'Grace application',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headerStore = await headers()
  const initialMode =
    headerStore.get('x-theme-mode') === 'dark' ? 'dark' : 'light'

  return (
    <html lang="ja" className={initialMode === 'dark' ? 'dark' : ''}>
      <body>
        <ThemeProvider initialMode={initialMode}>{children}</ThemeProvider>
      </body>
    </html>
  )
}
