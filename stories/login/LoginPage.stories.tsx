import type { Meta, StoryObj } from '@storybook/react'
import LoginPage from '../../components/auth/login/LoginPage'

const meta = {
  title: 'Pages/Login',
  component: LoginPage,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof LoginPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithReturnTo: Story = {
  args: {
    returnTo: '/dashboard',
  },
}
