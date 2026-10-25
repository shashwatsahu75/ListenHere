import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ThemeMode } from '../styles/theme'
import { applyThemeVariables } from '../styles/theme'
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage'

interface ThemeContextType {
  theme: ThemeMode
  toggleTheme: () => void
  setTheme: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return loadFromStorage<ThemeMode>(STORAGE_KEYS.THEME_MODE, 'dark')
  })

  useEffect(() => {
    applyThemeVariables(theme)
    saveToStorage(STORAGE_KEYS.THEME_MODE, theme)
  }, [theme])

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
