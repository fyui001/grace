import type { Meta, StoryObj } from '@storybook/react'
import { Container, Header, SpaceBetween } from '@cloudscape-design/components'
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
    breadcrumbs: [{ text: 'ダッシュボード', href: '/dashboard' }],
    contentType: 'default',
    children: (
      <SpaceBetween size="l">
        <Container header={<Header variant="h2">サンプルコンテンツ</Header>}>
          ダッシュボードのコンテンツがここに表示されます。
        </Container>
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
    breadcrumbs: [{ text: '薬一覧', href: '/medication/drugs' }],
    contentType: 'table',
    children: (
      <Container header={<Header variant="h2">薬一覧テーブル</Header>}>
        テーブルコンテンツ
      </Container>
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
      { text: '薬一覧', href: '/medication/drugs' },
      { text: 'レボチロキシン', href: '/medication/drugs/1' },
    ],
    children: (
      <SpaceBetween size="l">
        <Header variant="h1">レボチロキシン</Header>
        <Container header={<Header variant="h2">基本情報</Header>}>
          薬の詳細情報
        </Container>
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
    breadcrumbs: [{ text: '設定', href: '/settings' }],
    contentType: 'form',
    children: (
      <Container header={<Header variant="h2">表示設定</Header>}>
        設定コンテンツ
      </Container>
    ),
  },
}
