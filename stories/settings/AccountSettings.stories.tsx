import type { Meta, StoryObj } from '@storybook/react'
import AccountSettings from '../../components/settings/AccountSettings'
import { withThemeProvider } from '../decorators'

const meta = {
  title: 'Components/AccountSettings',
  component: AccountSettings,
  decorators: [withThemeProvider],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof AccountSettings>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    email: 'user@example.com',
    plan: 'フリー',
    onLogout: () => {},
  },
}
