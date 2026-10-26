import React, { useState } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { PlayerProvider } from './context/PlayerContext'
import { SidebarNav } from './components/navigation/SidebarNav'
import { MobileNav } from './components/navigation/MobileNav'
import { MiniPlayer } from './components/player/MiniPlayer'
import { NowPlayingExpanded } from './components/player/NowPlayingExpanded'
import { QueueDrawer } from './components/player/QueueDrawer'
import { VoiceSearchModal } from './components/voice/VoiceSearchModal'
import { DiscoverView } from './components/views/DiscoverView'
import type { ActiveTab } from './types/music'

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('discover')
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false)
  const [isNowPlayingExpanded, setIsNowPlayingExpanded] = useState(false)
  const [isQueueDrawerOpen, setIsQueueDrawerOpen] = useState(false)

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg-base)',
        color: 'var(--color-text-primary)',
      }}
    >
      {/* Desktop Sidebar Navigation */}
      <div style={{ display: 'none', md: 'block' } as any} className="sidebar-container">
        <SidebarNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onOpenVoiceSearch={() => setIsVoiceModalOpen(true)}
        />
      </div>

      {/* Main View Area */}
      <main style={{ flex: 1, minWidth: 0, paddingBottom: 'calc(var(--player-height) + 60px)' }}>
        {activeTab === 'discover' && (
          <DiscoverView onOpenVoiceSearch={() => setIsVoiceModalOpen(true)} />
        )}
        {activeTab === 'search' && (
          <div style={{ padding: '32px' }}>Search view loading...</div>
        )}
        {activeTab === 'library' && (
          <div style={{ padding: '32px' }}>Liked tracks loading...</div>
        )}
        {activeTab === 'playlists' && (
          <div style={{ padding: '32px' }}>Curated playlists loading...</div>
        )}
        {activeTab === 'licenses' && (
          <div style={{ padding: '32px' }}>Legal licenses loading...</div>
        )}
      </main>

      {/* Persistent Mini Player */}
      <MiniPlayer
        onExpandNowPlaying={() => setIsNowPlayingExpanded(true)}
        onToggleQueueDrawer={() => setIsQueueDrawerOpen(prev => !prev)}
      />

      {/* Mobile Bottom Navigation */}
      <MobileNav activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Overlays / Modals */}
      <NowPlayingExpanded
        isOpen={isNowPlayingExpanded}
        onClose={() => setIsNowPlayingExpanded(false)}
      />

      <QueueDrawer
        isOpen={isQueueDrawerOpen}
        onClose={() => setIsQueueDrawerOpen(false)}
      />

      <VoiceSearchModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSearchResults={query => {
          setActiveTab('search')
          console.log('Voice search query:', query)
        }}
      />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <PlayerProvider>
        <AppContent />
      </PlayerProvider>
    </ThemeProvider>
  )
}
