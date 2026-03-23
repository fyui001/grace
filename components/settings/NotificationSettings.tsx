import {
  Container,
  FormField,
  Header,
  SpaceBetween,
  TimeInput,
  Toggle,
} from '@cloudscape-design/components'

interface NotificationSettingsProps {
  reminderEnabled: boolean
  onReminderEnabledChange: (enabled: boolean) => void
  reminderTime: string
  onReminderTimeChange: (time: string) => void
}

export default function NotificationSettings({
  reminderEnabled,
  onReminderEnabledChange,
  reminderTime,
  onReminderTimeChange,
}: NotificationSettingsProps) {
  return (
    <Container header={<Header variant="h2">通知設定</Header>}>
      <SpaceBetween size="l">
        <Toggle
          checked={reminderEnabled}
          onChange={({ detail }) => onReminderEnabledChange(detail.checked)}
        >
          服薬リマインダー
        </Toggle>
        <FormField label="通知時刻">
          <TimeInput
            value={reminderTime}
            onChange={({ detail }) => onReminderTimeChange(detail.value)}
            format="hh:mm"
            placeholder="hh:mm"
            disabled={!reminderEnabled}
          />
        </FormField>
      </SpaceBetween>
    </Container>
  )
}
