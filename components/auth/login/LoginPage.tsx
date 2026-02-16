'use client'

import { ContentLayout } from '@cloudscape-design/components'
import LoginRequired from './LoginRequired'

export default function LoginPage({ returnTo }: { returnTo?: string }) {
  return (
    <ContentLayout>
      <LoginRequired returnTo={returnTo} />
    </ContentLayout>
  )
}
