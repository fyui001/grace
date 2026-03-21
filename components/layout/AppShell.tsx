'use client'

import { useState, useCallback } from 'react'
import { AppLayout, SideNavigation } from '@cloudscape-design/components'
import { usePathname, useRouter } from 'next/navigation'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [hydrated, setHydrated] = useState(false)

  const appLayoutRef = useCallback((node: HTMLElement | null) => {
    if (node) setHydrated(true)
  }, [])

  return (
    <div ref={appLayoutRef} style={{ opacity: hydrated ? 1 : 0 }}>
      <AppLayout
        navigation={
          <SideNavigation
            activeHref={pathname}
            header={{ href: '/dashboard', text: 'Grace' }}
            onFollow={(event) => {
              event.preventDefault()
              router.push(event.detail.href)
            }}
            items={[
              {
                type: 'expandable-link-group',
                text: '服薬指導室',
                href: '/dashboard',
                items: [
                  { type: 'link', text: 'ダッシュボード', href: '/dashboard' },
                  {
                    type: 'link',
                    text: '服薬履歴',
                    href: '/medication/history',
                  },
                ],
              },
              { type: 'divider' },
              { type: 'link', text: '設定', href: '/settings' },
            ]}
          />
        }
        content={children}
        toolsHide
      />
    </div>
  )
}
