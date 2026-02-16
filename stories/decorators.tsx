import type { Decorator } from '@storybook/react'
import AppShell from '../components/layout/AppShell'

export const withAppShell: Decorator = (Story) => (
  <AppShell>
    <Story />
  </AppShell>
)
