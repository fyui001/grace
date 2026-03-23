import type { Decorator } from '@storybook/react'
import { ThemeProvider } from '../components/theme/ThemeProvider'
import AppShell from '../components/layout/AppShell'

const sampleUser = {
  name: 'テストユーザー',
  iconUrl: null,
}

export const withThemeProvider: Decorator = (Story) => (
  <ThemeProvider initialMode="light">
    <Story />
  </ThemeProvider>
)

export const withAppShell: Decorator = (Story) => (
  <ThemeProvider initialMode="light">
    <AppShell user={sampleUser}>
      <Story />
    </AppShell>
  </ThemeProvider>
)
