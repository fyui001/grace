'use client'

import { useState } from 'react'
import {
  Box,
  Button,
  Container,
  FormField,
  Header,
  KeyValuePairs,
  SpaceBetween,
  TimeInput,
  Toggle,
} from '@cloudscape-design/components'
import { useTheme } from 'components/theme/ThemeProvider'

export default function SettingsPage() {
  const [reminderEnabled, setReminderEnabled] = useState(true)
  const [reminderTime, setReminderTime] = useState('07:30')
  const { mode, toggleMode } = useTheme()

  return (
    <SpaceBetween size="l">
      <Header variant="h1">設定</Header>

      <Container header={<Header variant="h2">表示設定</Header>}>
        <Toggle checked={mode === 'dark'} onChange={toggleMode}>
          ダークモード
        </Toggle>
      </Container>

      <Container header={<Header variant="h2">通知設定</Header>}>
        <SpaceBetween size="l">
          <Toggle
            checked={reminderEnabled}
            onChange={({ detail }) => setReminderEnabled(detail.checked)}
          >
            服薬リマインダー
          </Toggle>
          <FormField label="通知時刻">
            <TimeInput
              value={reminderTime}
              onChange={({ detail }) => setReminderTime(detail.value)}
              format="hh:mm"
              placeholder="hh:mm"
              disabled={!reminderEnabled}
            />
          </FormField>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">アカウント</Header>}>
        <SpaceBetween size="l">
          <KeyValuePairs
            columns={2}
            items={[
              { label: 'メールアドレス', value: 'user@example.com' },
              { label: 'プラン', value: 'フリー' },
            ]}
          />
          <Box>
            <Button variant="normal">ログアウト</Button>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  )
}
