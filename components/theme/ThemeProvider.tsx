'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { applyMode, Mode } from '@cloudscape-design/global-styles'

type ThemeMode = 'light' | 'dark'

interface ThemeContextValue {
  mode: ThemeMode
  toggleMode: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const COOKIE_KEY = 'grace-theme-mode'

function applyTheme(mode: ThemeMode) {
  document.cookie = `${COOKIE_KEY}=${mode};path=/;max-age=31536000`

  // Tailwind dark mode
  if (mode === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }

  // Cloudscape dark mode (kept during migration, remove in Phase 7)
  applyMode(mode === 'dark' ? Mode.Dark : Mode.Light)
}

export function ThemeProvider({
  children,
  initialMode,
}: {
  children: ReactNode
  initialMode: ThemeMode
}) {
  const [mode, setMode] = useState<ThemeMode>(initialMode)

  const toggleMode = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light'
      applyTheme(next)
      return next
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
