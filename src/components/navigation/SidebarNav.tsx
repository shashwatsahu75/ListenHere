import React from 'react'
import {
  Compass,
  Search,
  Library,
  Heart,
  ShieldCheck,
  Sun,
  Moon,
  Mic,
} from 'lucide-react'
import type { ActiveTab } from '../../types/music'
import { useTheme } from '../../context/ThemeContext'
import { usePlayer } from '../../context/PlayerContext'

interface SidebarNavProps {
  activeTab: ActiveTab
  onSelectTab: (tab: ActiveTab) => void
  onOpenVoiceSearch: () => void
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenVoiceSearch,
}) => {
  const { theme, toggleTheme } = useTheme()
  const { likedTrackIds } = usePlayer()

  const navItems: { tab: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { tab: 'discover', label: 'Discover', icon: <Compass size={20} /> },
    { tab: 'search', label: 'Search & Filter', icon: <Search size={20} /> },
    { tab: 'library', label: 'Liked Tracks', icon: <Heart size={20} />, badge: likedTrackIds.length },
    { tab: 'playlists', label: 'Curated Playlists', icon: <Library size={20} /> },
    { tab: 'licenses', label: 'Licenses & Legal', icon: <ShieldCheck size={20} /> },
  ]

  return (
    <aside
      role="navigation"
      aria-label="Main Navigation"
      style={{
        width: 'var(--sidebar-width)',
        backgroundColor: 'var(--color-bg-surface)',
        borderRight: '1px solid var(--color-border)',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Brand Header */}
      <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px var(--color-accent-glow)',
          }}
        >
          <span style={{ color: '#ffffff', fontWeight: 800, fontSize: '1.1rem' }}>L</span>
        </div>
        <div>
          <h1 style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em' }}>ListenHere</h1>
          <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Verified Legal Audio</p>
        </div>
      </div>

      {/* Voice Assistant Trigger Banner */}
      <div style={{ padding: '0 16px', marginBottom: '16px' }}>
        <button
          onClick={onOpenVoiceSearch}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-primary)',
            transition: 'background-color 0.15s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-bg-card-hover)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-bg-card)')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mic size={18} color="var(--color-accent)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Voice Search</span>
          </div>
          <span
            style={{
              fontSize: '0.7rem',
              backgroundColor: 'var(--color-accent)',
              color: '#ffffff',
              padding: '2px 6px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
            }}
          >
            AI
          </span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map(item => {
          const isActive = activeTab === item.tab
          return (
            <button
              key={item.tab}
              onClick={() => onSelectTab(item.tab)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive ? 'var(--color-bg-card-hover)' : 'transparent',
                color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.9rem',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--color-bg-card)'
                  e.currentTarget.style.color = 'var(--color-text-primary)'
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = 'var(--color-text-secondary)'
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  style={{
                    fontSize: '0.75rem',
                    backgroundColor: 'var(--color-bg-card)',
                    color: 'var(--color-text-muted)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer Settings & Theme Switcher */}
      <div
        style={{
          padding: '16px',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Theme</span>
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-bg-card)',
            color: 'var(--color-text-secondary)',
            fontSize: '0.8rem',
            fontWeight: 600,
          }}
        >
          {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
          <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
        </button>
      </div>
    </aside>
  )
}
