import React, { useEffect } from 'react'
import type { Preview } from '@storybook/react'
import '@cloudscape-design/global-styles/index.css'
import '../app/globals.css'
import { ThemeProvider } from '../components/theme/ThemeProvider'

const globalDecorators: Preview['decorators'] = [
  (Story) => {
    useEffect(() => {
      const handler = (e: MouseEvent) => {
        const anchor = (e.target as HTMLElement).closest('a[href]')
        if (!anchor) return
        const href = anchor.getAttribute('href')
        if (!href) return
        if (anchor.getAttribute('target') === '_blank') return
        if (href.startsWith('/') || href.startsWith('?')) {
          e.preventDefault()
          e.stopPropagation()
        }
      }
      document.addEventListener('click', handler, true)
      return () => document.removeEventListener('click', handler, true)
    }, [])
    return (
      <ThemeProvider initialMode="light">
        <Story />
      </ThemeProvider>
    )
  },
]

const preview: Preview = {
  decorators: globalDecorators,
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
      },
    },
  },
}

export default preview
