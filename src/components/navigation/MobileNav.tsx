import React from 'react'
import {
  Compass,
  Search,
  Heart,
  Library,
  ShieldCheck,
} from 'lucide-react'
import type { ActiveTab } from '../../types/music'
import { usePlayer } from '../../context/PlayerContext'

interface MobileNavProps {
  activeTab: ActiveTab
  onSelectTab: (tab: ActiveTab) => void
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onSelectTab }) => {
  const { likedTrackIds } = usePlayer()

  const tabs: { tab: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { tab: 'discover', label: 'Discover', icon: <Compass size={20} /> },
    { tab: 'search', label: 'Search', icon: <Search size={20} /> },
    { tab: 'library', label: 'Liked', icon: <Heart size={20} />, badge: likedTrackIds.length },
    { tab: 'playlists', label: 'Playlists', icon: <Library size={20} /> },
    { tab: 'licenses', label: 'Licenses', icon: <ShieldCheck size={20} /> },
  ]

  return (
    <nav
      role="navigation"
      aria-label="Mobile Navigation"
      style={{
        position: 'fixed',
        bottom: 'var(--player-height)',
        left: 0,
        right: 0,
        height: '56px',
        backgroundColor: 'var(--color-bg-surface)',
        borderTop: '1px solid var(--color-border)',
        zIndex: 95,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
      }}
    >
      {tabs.map(item => {
        const isActive = activeTab === item.tab
        return (
          <button
            key={item.tab}
            onClick={() => onSelectTab(item.tab)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              padding: '6px',
              flex: 1,
              color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
            }}
          >
            <div style={{ position: 'relative' }}>
              {item.icon}
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-8px',
                    fontSize: '0.65rem',
                    backgroundColor: 'var(--color-accent)',
                    color: '#ffffff',
                    width: '16px',
                    height: '16px',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                  }}
                >
                  {item.badge}
                </span>
              )}
            </div>
            <span style={{ fontSize: '0.65rem', fontWeight: isActive ? 700 : 500 }}>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
