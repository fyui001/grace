import type { Meta, StoryObj } from '@storybook/react'
import MedicationHistoryDetailPage from '../../components/page-component/MedicationHistoryDetailPage'
import { withAppShell } from '../decorators'

const meta = {
  title: 'Pages/MedicationHistoryDetail',
  component: MedicationHistoryDetailPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      navigation: {
        pathname: '/medication/history/1',
      },
    },
  },
} satisfies Meta<typeof MedicationHistoryDetailPage>

export default meta
type Story = StoryObj<typeof meta>

const sampleHistory = {
  id: 1,
  drugId: 1,
  drugName: 'レボチロキシン',
  drugUrl: 'https://example.com/drug/levothyroxine',
  amount: 50,
  note: JSON.stringify({
    blocks: [
      { type: 'paragraph', data: { text: '朝食前に水で服用。体調良好。' } },
    ],
  }),
  createdAt: '2026-03-23T07:30:00',
  updatedAt: '2026-03-23T07:30:00',
}

export const Default: Story = {
  args: {
    history: sampleHistory,
  },
}

export const WithAppShell: Story = {
  args: {
    history: sampleHistory,
  },
  decorators: [withAppShell],
}

export const NoNote: Story = {
  args: {
    history: {
      ...sampleHistory,
      id: 2,
      note: null,
      drugUrl: '',
    },
  },
}
