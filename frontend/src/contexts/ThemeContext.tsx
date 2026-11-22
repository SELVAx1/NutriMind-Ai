import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  resolved: 'light' | 'dark'
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      return (localStorage.getItem('nutrimind_theme') as Theme) || 'system'
    } catch {
      return 'system'
    }
  })

  const [resolved, setResolved] = useState<'light' | 'dark'>(() =>
    theme === 'system' ? getSystemTheme() : theme
  )

  useEffect(() => {
    // Dark mode UI is not yet fully implemented — always resolve to light
    // The toggle remains in Settings for future use
    setResolved('light')
    document.documentElement.classList.remove('dark')
  }, [theme])

  const setTheme = (t: Theme) => {
    setThemeState(t)
    try { localStorage.setItem('nutrimind_theme', t) } catch {}
  }

  return (
    <ThemeContext.Provider value={{ theme, resolved, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
