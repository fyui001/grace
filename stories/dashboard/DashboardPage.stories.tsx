import type { Meta, StoryObj } from '@storybook/react'
import DashboardPage from '../../components/page-component/DashboardPage'

const meta = {
  title: 'Dashboard/DashboardPage',
  component: DashboardPage,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof DashboardPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
