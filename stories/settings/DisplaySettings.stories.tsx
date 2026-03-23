import type { Meta, StoryObj } from '@storybook/react'
import DisplaySettings from '../../components/settings/DisplaySettings'
import { withThemeProvider } from '../decorators'

const meta = {
  title: 'Components/DisplaySettings',
  component: DisplaySettings,
  decorators: [withThemeProvider],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof DisplaySettings>

export default meta
type Story = StoryObj<typeof meta>

export const LightMode: Story = {
  args: {
    mode: 'light',
    onToggle: () => {},
  },
}

export const DarkMode: Story = {
  args: {
    mode: 'dark',
    onToggle: () => {},
  },
}
