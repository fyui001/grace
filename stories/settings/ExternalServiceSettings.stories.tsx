import type { Meta, StoryObj } from '@storybook/react'
import ExternalServiceSettings from '../../components/settings/ExternalServiceSettings'
import { withThemeProvider } from '../decorators'

const meta = {
  title: 'Components/ExternalServiceSettings',
  component: ExternalServiceSettings,
  decorators: [withThemeProvider],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof ExternalServiceSettings>

export default meta
type Story = StoryObj<typeof meta>

export const Linked: Story = {
  args: {
    discordUserId: '123456789',
    unlinking: false,
    onDiscordLink: () => {},
    onDiscordUnlink: () => {},
  },
}

export const Unlinked: Story = {
  args: {
    discordUserId: null,
    unlinking: false,
    onDiscordLink: () => {},
    onDiscordUnlink: () => {},
  },
}

export const Unlinking: Story = {
  args: {
    discordUserId: '123456789',
    unlinking: true,
    onDiscordLink: () => {},
    onDiscordUnlink: () => {},
  },
}
