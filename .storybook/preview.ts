import type { Preview } from '@storybook/react'
import { useEffect } from 'react'
import '@cloudscape-design/global-styles/index.css'

const withLinkInterceptor: Preview['decorators'] = [
  (Story) => {
    useEffect(() => {
      const handler = (e: MouseEvent) => {
        const anchor = (e.target as HTMLElement).closest('a[href]')
        if (!anchor) return
        const href = anchor.getAttribute('href')
        if (!href) return
        // 外部リンク（target="_blank"）はそのまま通す
        if (anchor.getAttribute('target') === '_blank') return
        // Storybook 内の相対リンク遷移を防止
        if (href.startsWith('/') || href.startsWith('?')) {
          e.preventDefault()
        }
      }
      document.addEventListener('click', handler, true)
      return () => document.removeEventListener('click', handler, true)
    }, [])
    return Story()
  },
]

const preview: Preview = {
  decorators: withLinkInterceptor,
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
}

export default preview
