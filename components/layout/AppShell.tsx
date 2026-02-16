'use client'

import { AppLayout, SideNavigation } from '@cloudscape-design/components'
import { usePathname } from 'next/navigation'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
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
  )
}
