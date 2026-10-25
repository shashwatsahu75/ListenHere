/**
 * ListenHere Design Tokens & Theme Configuration
 * Inspired by Spotify / Apple Music elegance:
 * Charcoal dark-first palettes, luminous accents, responsive spacing.
 */

export const THEME_COLORS = {
  dark: {
    bgBase: '#0a0b0e',
    bgSurface: '#12141a',
    bgCard: '#1a1d26',
    bgCardHover: '#232734',
    bgHighlight: '#2c3142',
    border: '#262a38',
    borderLight: '#343a4e',
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    accent: '#10b981', // Emerald vibrant
    accentHover: '#059669',
    accentGlow: 'rgba(16, 185, 129, 0.25)',
    playerBg: 'rgba(18, 20, 26, 0.95)',
  },
  light: {
    bgBase: '#f8fafc',
    bgSurface: '#ffffff',
    bgCard: '#f1f5f9',
    bgCardHover: '#e2e8f0',
    bgHighlight: '#cbd5e1',
    border: '#e2e8f0',
    borderLight: '#cbd5e1',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#64748b',
    accent: '#059669',
    accentHover: '#047857',
    accentGlow: 'rgba(5, 150, 105, 0.2)',
    playerBg: 'rgba(255, 255, 255, 0.95)',
  },
} as const

export type ThemeMode = 'dark' | 'light'

export function applyThemeVariables(mode: ThemeMode): void {
  const root = document.documentElement
  const colors = THEME_COLORS[mode]

  root.style.setProperty('--color-bg-base', colors.bgBase)
  root.style.setProperty('--color-bg-surface', colors.bgSurface)
  root.style.setProperty('--color-bg-card', colors.bgCard)
  root.style.setProperty('--color-bg-card-hover', colors.bgCardHover)
  root.style.setProperty('--color-bg-highlight', colors.bgHighlight)
  root.style.setProperty('--color-border', colors.border)
  root.style.setProperty('--color-border-light', colors.borderLight)
  root.style.setProperty('--color-text-primary', colors.textPrimary)
  root.style.setProperty('--color-text-secondary', colors.textSecondary)
  root.style.setProperty('--color-text-muted', colors.textMuted)
  root.style.setProperty('--color-accent', colors.accent)
  root.style.setProperty('--color-accent-hover', colors.accentHover)
  root.style.setProperty('--color-accent-glow', colors.accentGlow)
  root.style.setProperty('--color-player-bg', colors.playerBg)

  if (mode === 'dark') {
    root.classList.add('dark-theme')
    root.classList.remove('light-theme')
  } else {
    root.classList.add('light-theme')
    root.classList.remove('dark-theme')
  }
}
