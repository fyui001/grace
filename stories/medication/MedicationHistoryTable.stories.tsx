import type { Meta, StoryObj } from '@storybook/react'
import MedicationHistoryTable from '../../components/medication/MedicationHistoryTable'

const meta = {
  title: 'Components/MedicationHistoryTable',
  component: MedicationHistoryTable,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof MedicationHistoryTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: [
      { id: '1', date: '2026-02-15', name: 'レボチロキシン', time: '07:30', status: 'completed' },
      { id: '2', date: '2026-02-14', name: 'レボチロキシン', time: '07:25', status: 'completed' },
      { id: '3', date: '2026-02-13', name: 'レボチロキシン', time: '-', status: 'missed' },
    ],
  },
}

export const Empty: Story = {
  args: {
    items: [],
  },
}

export const Loading: Story = {
  args: {
    items: [],
    loading: true,
  },
}
