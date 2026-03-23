'use client'

import { useCallback, useEffect, useState } from 'react'
import { Header, SpaceBetween } from '@cloudscape-design/components'
import { useTheme } from 'components/theme/ThemeProvider'
import { useApiClient } from 'client/apiClient'
import { userRepository } from 'repository/userRepository'
import { discordLinkPath } from 'utils/urls'
import DisplaySettings from 'components/settings/DisplaySettings'
import NotificationSettings from 'components/settings/NotificationSettings'
import ExternalServiceSettings from 'components/settings/ExternalServiceSettings'
import AccountSettings from 'components/settings/AccountSettings'

export default function SettingsPage() {
  const [reminderEnabled, setReminderEnabled] = useState(true)
  const [reminderTime, setReminderTime] = useState('07:30')
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

  return (
    <SpaceBetween size="l">
      <Header variant="h1">設定</Header>

      <DisplaySettings mode={mode} onToggle={toggleMode} />

      <NotificationSettings
        reminderEnabled={reminderEnabled}
        onReminderEnabledChange={setReminderEnabled}
        reminderTime={reminderTime}
        onReminderTimeChange={setReminderTime}
      />

      <ExternalServiceSettings
        discordUserId={discordUserId}
        unlinking={unlinking}
        onDiscordLink={handleDiscordLink}
        onDiscordUnlink={handleDiscordUnlink}
      />

      <AccountSettings
        email="user@example.com"
        plan="フリー"
        onLogout={() => {}}
      />
    </SpaceBetween>
  )
}
