import type { Decorator } from '@storybook/react'
import { ThemeProvider } from '../components/theme/ThemeProvider'
import AppShell from '../components/layout/AppShell'

export const withThemeProvider: Decorator = (Story) => (
  <ThemeProvider initialMode="light">
    <Story />
  </ThemeProvider>
)

export const withAppShell: Decorator = (Story) => (
  <ThemeProvider initialMode="light">
    <AppShell>
      <Story />
    </AppShell>
  </ThemeProvider>
)
