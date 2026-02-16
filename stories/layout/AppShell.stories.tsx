import type { Meta, StoryObj } from '@storybook/react'
import { ContentLayout, Header } from '@cloudscape-design/components'
import AppShell from '../../components/layout/AppShell'

const meta = {
  title: 'Layout/AppShell',
  component: AppShell,
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
      <ContentLayout header={<Header variant="h1">ページコンテンツ</Header>}>
        サイドナビゲーション付きのレイアウトです。
      </ContentLayout>
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
      <ContentLayout header={<Header variant="h1">設定</Header>}>
        設定ページがアクティブな状態です。
      </ContentLayout>
    ),
  },
}
