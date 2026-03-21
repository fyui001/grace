import type { Meta, StoryObj } from '@storybook/react'
import { Header, SpaceBetween } from '@cloudscape-design/components'
import AppShell from '../../components/layout/AppShell'
import { withThemeProvider } from '../decorators'

const meta = {
  title: 'Layout/AppShell',
  component: AppShell,
  decorators: [withThemeProvider],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      navigation: {
        pathname: '/dashboard',
      },
    },
  },
} satisfies Meta<typeof AppShell>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <SpaceBetween size="l">
        <Header variant="h1">ダッシュボード</Header>
      </SpaceBetween>
    ),
  },
}

export const MedicationHistoryActive: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/medication/history',
      },
    },
  },
  args: {
    children: (
      <SpaceBetween size="l">
        <Header variant="h1">服薬履歴</Header>
      </SpaceBetween>
    ),
  },
}

export const SettingsActive: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/settings',
      },
    },
  },
  args: {
    children: (
      <SpaceBetween size="l">
        <Header variant="h1">設定</Header>
      </SpaceBetween>
    ),
  },
}
