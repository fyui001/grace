import type { Meta, StoryObj } from '@storybook/react'
import CreateDrugModal from '../../components/medication/CreateDrugModal'

const meta = {
  title: 'Components/CreateDrugModal',
  component: CreateDrugModal,
  parameters: {
    layout: 'padded',
    nextjs: {
      navigation: {
        pathname: '/medication/drugs',
      },
    },
  },
} satisfies Meta<typeof CreateDrugModal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    visible: true,
    onDismiss: () => {},
    onCreated: () => {},
  },
}
