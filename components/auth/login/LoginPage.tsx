'use client'

import LoginRequired from './LoginRequired'

export default function LoginPage({ returnTo }: { returnTo?: string }) {
  return <LoginRequired returnTo={returnTo} />
}
