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

export const Default: Story = {}

export const WithAppShell: Story = {
  decorators: [withAppShell],
}
