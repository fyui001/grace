'use client'

import { useCallback, useRef } from 'react'
import { logoutPath } from 'utils/urls'

export function useLogoutForm({ csrfToken }: { csrfToken: string }) {
  const formRef = useRef<HTMLFormElement>(null)

  const logoutTrigger = useCallback(() => {
    formRef.current?.submit()
  }, [])

  const LogoutFormElement = (
    <form
      method="post"
      action={logoutPath}
      ref={formRef}
      style={{ display: 'none' }}
    >
      <input type="hidden" name="_csrf" value={csrfToken} />
    </form>
  )

  return [LogoutFormElement, logoutTrigger] as const
}
