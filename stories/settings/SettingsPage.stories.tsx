import type { Meta, StoryObj } from '@storybook/react'
import SettingsPage from '../../components/page-component/SettingsPage'
import { withAppShell, withThemeProvider } from '../decorators'

const meta = {
  title: 'Pages/Settings',
  component: SettingsPage,
  decorators: [withThemeProvider],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      navigation: {
        pathname: '/settings',
      },
    },
  },
} satisfies Meta<typeof SettingsPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    userName: 'テストユーザー',
  },
}

export const WithAppShell: Story = {
  args: {
    userName: 'テストユーザー',
  },
  decorators: [withAppShell],
}
