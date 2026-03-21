import type { Meta, StoryObj } from '@storybook/react'
import SetupForm from '../../components/setup/SetupForm'

const meta = {
  title: 'Components/SetupForm',
  component: SetupForm,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SetupForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithEmail: Story = {
  args: {
    email: 'user@example.com',
  },
}
