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
import { SearchView } from './components/views/SearchView'
import { LibraryView } from './components/views/LibraryView'
import { PlaylistsView } from './components/views/PlaylistsView'
import { LicensesView } from './components/views/LicensesView'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import type { ActiveTab } from './types/music'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { usePlayer } from './context/PlayerContext'

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('discover')
  const [searchQuery, setSearchQuery] = useState('')
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false)
  const [isNowPlayingExpanded, setIsNowPlayingExpanded] = useState(false)
  const [isQueueDrawerOpen, setIsQueueDrawerOpen] = useState(false)

  const { togglePlayPause, playNext, playPrevious, toggleMute, seek, playbackState } = usePlayer()

  useKeyboardShortcuts({
    onTogglePlayPause: togglePlayPause,
    onNext: playNext,
    onPrevious: playPrevious,
    onMuteToggle: toggleMute,
    onSeekForward: () => seek(Math.min(playbackState.duration, playbackState.currentTime + 5)),
    onSeekBackward: () => seek(Math.max(0, playbackState.currentTime - 5)),
    onOpenVoiceSearch: () => setIsVoiceModalOpen(true),
  })

  const handleOpenSearchWithQuery = (query: string) => {
    setSearchQuery(query)
    setActiveTab('search')
  }

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
      <div className="desktop-sidebar">
        <SidebarNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onOpenVoiceSearch={() => setIsVoiceModalOpen(true)}
        />
      </div>

      {/* Main View Area */}
      <main style={{ flex: 1, minWidth: 0, paddingBottom: 'calc(var(--player-height) + 60px)' }}>
        <ErrorBoundary>
        {activeTab === 'discover' && (
          <DiscoverView onOpenVoiceSearch={() => setIsVoiceModalOpen(true)} />
        )}
        {activeTab === 'search' && (
          <SearchView
            initialQuery={searchQuery}
            onOpenVoiceSearch={() => setIsVoiceModalOpen(true)}
          />
        )}
        {activeTab === 'library' && <LibraryView />}
        {activeTab === 'playlists' && <PlaylistsView />}
        {activeTab === 'licenses' && <LicensesView />}
              </ErrorBoundary>
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
        onSearchResults={handleOpenSearchWithQuery}
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
