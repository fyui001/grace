import type { Meta, StoryObj } from '@storybook/react'
import LoginRequired from '../../components/auth/login/LoginRequired'

const meta = {
  title: 'Login/LoginRequired',
  component: LoginRequired,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof LoginRequired>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithReturnTo: Story = {
  args: {
    returnTo: '/dashboard',
  },
}
