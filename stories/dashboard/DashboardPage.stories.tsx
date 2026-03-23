import type { Meta, StoryObj } from '@storybook/react'
import DashboardPage from '../../components/page-component/DashboardPage'
import { withAppShell } from '../decorators'

const meta = {
  title: 'Pages/Dashboard',
  component: DashboardPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      navigation: {
        pathname: '/dashboard',
      },
    },
  },
} satisfies Meta<typeof DashboardPage>

export default meta
type Story = StoryObj<typeof meta>

const generateHistories = () => {
  const drugs = ['レボチロキシン', 'ロキソプロフェン', 'アムロジピン']
  const amounts = [50, 60, 5]
  return Array.from({ length: 120 }, (_, i) => {
    const date = new Date(2026, 2, 23)
    date.setDate(date.getDate() - Math.floor(i / 3))
    date.setHours(7 + (i % 5), (i * 7) % 60)
    const drugIndex = i % 3
    return {
      id: i + 1,
      drugName: drugs[drugIndex],
      amount: amounts[drugIndex],
      createdAt: date.toISOString(),
    }
  })
}

export const Default: Story = {
  args: {
    histories: generateHistories(),
  },
}

export const WithAppShell: Story = {
  args: {
    histories: generateHistories(),
  },
  decorators: [withAppShell],
}

export const NoData: Story = {
  args: {
    histories: [],
  },
}
