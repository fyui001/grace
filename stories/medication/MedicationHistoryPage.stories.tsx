import type { Meta, StoryObj } from '@storybook/react'
import MedicationHistoryPage from '../../components/page-component/MedicationHistoryPage'
import { withAppShell } from '../decorators'

const meta = {
  title: 'Pages/MedicationHistory',
  component: MedicationHistoryPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      navigation: {
        pathname: '/medication/history',
      },
    },
  },
} satisfies Meta<typeof MedicationHistoryPage>

export default meta
type Story = StoryObj<typeof meta>

const sampleItems = [
  { id: '1', name: 'レボチロキシン', amount: 50, takenAt: '2026-03-23 07:30', hasNote: true },
  {
    id: '2',
    name: 'ロキソプロフェン',
    amount: 60,
    takenAt: '2026-03-23 08:00',
    hasNote: false,
  },
  { id: '3', name: 'レボチロキシン', amount: 50, takenAt: '2026-03-22 07:25', hasNote: true },
]

const paginationArgs = {
  currentPage: 1,
  lastPage: 4,
  perPage: 25,
  total: 80,
}

export const Default: Story = {
  args: {
    items: sampleItems,
    ...paginationArgs,
  },
}

export const WithAppShell: Story = {
  args: {
    items: sampleItems,
    ...paginationArgs,
  },
  decorators: [withAppShell],
}
