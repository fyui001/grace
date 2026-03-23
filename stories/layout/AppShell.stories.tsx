import type { Meta, StoryObj } from '@storybook/react'
import { Header, SpaceBetween } from '@cloudscape-design/components'
import AppShell from '../../components/layout/AppShell'
import { withThemeProvider } from '../decorators'

const sampleUser = {
  name: 'テストユーザー',
  iconUrl: null,
}

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
  args: {
    user: sampleUser,
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

export const DrugListActive: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/medication/drugs',
      },
    },
  },
  args: {
    children: (
      <SpaceBetween size="l">
        <Header variant="h1">薬一覧</Header>
      </SpaceBetween>
    ),
  },
}

export const DrugDetailWithBreadcrumbs: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/medication/drugs/1',
      },
    },
  },
  args: {
    breadcrumbs: [
      { text: 'Grace', href: '/dashboard' },
      { text: '薬一覧', href: '/medication/drugs' },
      { text: 'レボチロキシン', href: '/medication/drugs/1' },
    ],
    children: (
      <SpaceBetween size="l">
        <Header variant="h1">レボチロキシン</Header>
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

export const MedicationHistoryDetailWithBreadcrumbs: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/medication/history/1',
      },
    },
  },
  args: {
    breadcrumbs: [
      { text: 'Grace', href: '/dashboard' },
      { text: '服薬履歴', href: '/medication/history' },
      { text: '服薬履歴詳細', href: '/medication/history/1' },
    ],
    children: (
      <SpaceBetween size="l">
        <Header variant="h1">服薬履歴詳細</Header>
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
