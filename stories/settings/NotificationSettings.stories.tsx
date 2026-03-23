import type { Meta, StoryObj } from '@storybook/react'
import NotificationSettings from '../../components/settings/NotificationSettings'
import { withThemeProvider } from '../decorators'

const meta = {
  title: 'Components/NotificationSettings',
  component: NotificationSettings,
  decorators: [withThemeProvider],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof NotificationSettings>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    reminderEnabled: true,
    onReminderEnabledChange: () => {},
    reminderTime: '07:30',
    onReminderTimeChange: () => {},
  },
}

export const ReminderDisabled: Story = {
  args: {
    reminderEnabled: false,
    onReminderEnabledChange: () => {},
    reminderTime: '07:30',
    onReminderTimeChange: () => {},
  },
}
