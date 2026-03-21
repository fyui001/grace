'use client'

import { useState, useCallback } from 'react'
import { AppLayout, SideNavigation } from '@cloudscape-design/components'
import { usePathname } from 'next/navigation'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
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
            items={[
              { type: 'link', text: '服薬履歴', href: '/dashboard' },
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
