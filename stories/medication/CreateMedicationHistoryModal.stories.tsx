import type { Meta, StoryObj } from '@storybook/react'
import CreateMedicationHistoryModal from '../../components/medication/CreateMedicationHistoryModal'

const meta = {
  title: 'Components/CreateMedicationHistoryModal',
  component: CreateMedicationHistoryModal,
  parameters: {
    layout: 'padded',
    nextjs: {
      navigation: {
        pathname: '/medication/history',
      },
    },
  },
} satisfies Meta<typeof CreateMedicationHistoryModal>

export default meta
type Story = StoryObj<typeof meta>

const sampleDrugs = [
  { id: '1', name: 'レボチロキシン' },
  { id: '2', name: 'ロキソプロフェン' },
  { id: '3', name: 'アムロジピン' },
  { id: '4', name: 'メトホルミン' },
  { id: '5', name: 'アトルバスタチン' },
]

export const Default: Story = {
  args: {
    visible: true,
    onDismiss: () => {},
    onCreated: () => {},
    drugs: sampleDrugs,
  },
}

export const FewDrugs: Story = {
  args: {
    visible: true,
    onDismiss: () => {},
    onCreated: () => {},
    drugs: [{ id: '1', name: 'レボチロキシン' }],
  },
}
