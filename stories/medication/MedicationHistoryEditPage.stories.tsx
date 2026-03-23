import type { Meta, StoryObj } from '@storybook/react'
import MedicationHistoryEditPage from '../../components/page-component/MedicationHistoryEditPage'
import { withAppShell } from '../decorators'

const meta = {
  title: 'Pages/MedicationHistoryEdit',
  component: MedicationHistoryEditPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      navigation: {
        pathname: '/medication/history/1/edit',
      },
    },
  },
} satisfies Meta<typeof MedicationHistoryEditPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    history: {
      id: 1,
      drugName: 'レボチロキシン',
      amount: 50,
      note: JSON.stringify([
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '朝食前に水で服用。体調良好。' }],
        },
      ]),
      createdAt: '2026-03-23T07:30:00',
    },
  },
}

export const WithAppShell: Story = {
  args: {
    history: {
      id: 1,
      drugName: 'レボチロキシン',
      amount: 50,
      note: null,
      createdAt: '2026-03-23T07:30:00',
    },
  },
  decorators: [withAppShell],
}
