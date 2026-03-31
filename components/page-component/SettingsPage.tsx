'use client'

import { useCallback, useEffect, useState } from 'react'
import { useTheme } from 'components/theme/ThemeProvider'
import { useApiClient } from 'client/apiClient'
import { userRepository } from 'repository/userRepository'
import { discordLinkPath } from 'utils/urls'
import DisplaySettings from 'components/settings/DisplaySettings'
import ExternalServiceSettings from 'components/settings/ExternalServiceSettings'
import AccountSettings from 'components/settings/AccountSettings'

interface SettingsPageProps {
  userName: string
}

export default function SettingsPage({ userName }: SettingsPageProps) {
  const { mode, toggleMode } = useTheme()

  const apiClient = useApiClient()
  const [discordUserId, setDiscordUserId] = useState<string | null>(null)
  const [unlinking, setUnlinking] = useState(false)

  useEffect(() => {
    userRepository.getCurrentUser(apiClient).then((user) => {
      if (user) {
        setDiscordUserId(user.discordUserId)
      }
    })
  }, [apiClient])

  const handleDiscordLink = useCallback(() => {
    window.location.href = discordLinkPath
  }, [])

  const handleDiscordUnlink = useCallback(async () => {
    setUnlinking(true)
    try {
      const user = await userRepository.unlinkDiscord(apiClient)
      setDiscordUserId(user?.discordUserId ?? null)
    } catch {
      // noop
    } finally {
      setUnlinking(false)
    }
  }, [apiClient])

  const handleLogout = useCallback(() => {
    window.location.href = '/logout'
  }, [])

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold">設定</h1>

      <DisplaySettings mode={mode} onToggle={toggleMode} />

      <ExternalServiceSettings
        discordUserId={discordUserId}
        unlinking={unlinking}
        onDiscordLink={handleDiscordLink}
        onDiscordUnlink={handleDiscordUnlink}
      />

      <AccountSettings
        userName={userName}
        authProvider="Auth0"
        onLogout={handleLogout}
      />
    </div>
  )
}
