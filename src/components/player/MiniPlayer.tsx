import React, { useState } from 'react'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  Maximize2,
  ListMusic,
  Info,
} from 'lucide-react'
import { usePlayer } from '../../context/PlayerContext'
import { formatTime } from '../../utils/formatTime'
import { LicenseModal } from '../license/LicenseModal'

interface MiniPlayerProps {
  onExpandNowPlaying: () => void
  onToggleQueueDrawer: () => void
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({
  onExpandNowPlaying,
  onToggleQueueDrawer,
}) => {
  const {
    playbackState,
    togglePlayPause,
    playNext,
    playPrevious,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeatMode,
    isLiked,
    toggleLikeTrack,
  } = usePlayer()

  const [showLicenseModal, setShowLicenseModal] = useState(false)
  const currentTrack = playbackState.currentTrack

  if (!currentTrack) {
    return null
  }

  const isPlaying = playbackState.status === 'playing'
  const liked = isLiked(currentTrack.id)
  const progressPercent = playbackState.duration > 0
    ? (playbackState.currentTime / playbackState.duration) * 100
    : 0

  return (
    <>
      <footer
        role="region"
        aria-label="Audio Mini Player"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 'var(--player-height)',
          backgroundColor: 'var(--color-player-bg)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid var(--color-border)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Seek Progress Bar */}
        <div
          role="slider"
          aria-label="Playback seek progress"
          aria-valuemin={0}
          aria-valuemax={playbackState.duration}
          aria-valuenow={playbackState.currentTime}
          style={{
            width: '100%',
            height: '4px',
            backgroundColor: 'var(--color-border)',
            cursor: 'pointer',
            position: 'relative',
          }}
          onClick={e => {
            const rect = e.currentTarget.getBoundingClientRect()
            const clickX = e.clientX - rect.left
            const ratio = Math.max(0, Math.min(1, clickX / rect.width))
            seek(ratio * playbackState.duration)
          }}
        >
          <div
            style={{
              width: `${progressPercent}%`,
              height: '100%',
              backgroundColor: 'var(--color-accent)',
              boxShadow: '0 0 10px var(--color-accent-glow)',
              transition: 'width 0.1s linear',
            }}
          />
        </div>

        {/* Player Controls Bar */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            gap: '16px',
          }}
        >
          {/* Left: Track Information */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '220px', maxWidth: '320px' }}>
            <img
              src={currentTrack.artworkUrl}
              alt={currentTrack.title}
              style={{
                width: '54px',
                height: '54px',
                borderRadius: 'var(--radius-md)',
                objectFit: 'cover',
                cursor: 'pointer',
              }}
              onClick={onExpandNowPlaying}
            />
            <div style={{ overflow: 'hidden' }}>
              <div
                onClick={onExpandNowPlaying}
                title={currentTrack.title}
                style={{
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  cursor: 'pointer',
                }}
              >
                {currentTrack.title}
              </div>
              <div
                title={currentTrack.artist}
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--color-text-secondary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {currentTrack.artist}
              </div>
            </div>

            <button
              onClick={() => toggleLikeTrack(currentTrack.id)}
              aria-label={liked ? 'Unlike' : 'Like'}
              style={{
                color: liked ? '#ef4444' : 'var(--color-text-muted)',
                padding: '6px',
                display: 'flex',
              }}
            >
              <Heart size={18} fill={liked ? '#ef4444' : 'none'} />
            </button>

            <button
              onClick={() => setShowLicenseModal(true)}
              aria-label="View license details"
              title="Track license"
              style={{
                color: 'var(--color-text-muted)',
                padding: '6px',
                display: 'flex',
              }}
            >
              <Info size={18} />
            </button>
          </div>

          {/* Center: Playback Controls & Timers */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={toggleShuffle}
                aria-label="Toggle shuffle"
                style={{
                  color: playbackState.isShuffled ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  padding: '6px',
                }}
              >
                <Shuffle size={18} />
              </button>

              <button
                onClick={playPrevious}
                aria-label="Previous track"
                style={{ color: 'var(--color-text-primary)', padding: '6px' }}
              >
                <SkipBack size={20} />
              </button>

              <button
                onClick={togglePlayPause}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-accent)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.1s ease',
                }}
                onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.94)')}
                onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
              >
                {isPlaying ? <Pause size={20} fill="#ffffff" /> : <Play size={20} fill="#ffffff" style={{ marginLeft: '2px' }} />}
              </button>

              <button
                onClick={playNext}
                aria-label="Next track"
                style={{ color: 'var(--color-text-primary)', padding: '6px' }}
              >
                <SkipForward size={20} />
              </button>

              <button
                onClick={cycleRepeatMode}
                aria-label={`Cycle repeat mode (current: ${playbackState.repeatMode})`}
                style={{
                  color: playbackState.repeatMode !== 'off' ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  padding: '6px',
                }}
              >
                {playbackState.repeatMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
              </button>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', gap: '8px' }}>
              <span>{formatTime(playbackState.currentTime)}</span>
              <span>/</span>
              <span>{formatTime(playbackState.duration)}</span>
            </div>
          </div>

          {/* Right: Volume & Drawer Triggers */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '200px', justifyContent: 'flex-end' }}>
            <button
              onClick={onToggleQueueDrawer}
              aria-label="Open playback queue"
              title="Queue"
              style={{ color: 'var(--color-text-secondary)', padding: '6px' }}
            >
              <ListMusic size={20} />
            </button>

            <button
              onClick={toggleMute}
              aria-label={playbackState.isMuted ? 'Unmute' : 'Mute'}
              style={{ color: 'var(--color-text-secondary)', padding: '6px' }}
            >
              {playbackState.isMuted || playbackState.volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>

            <input
              type="range"
              aria-label="Volume slider"
              min={0}
              max={1}
              step={0.01}
              value={playbackState.isMuted ? 0 : playbackState.volume}
              onChange={e => setVolume(parseFloat(e.target.value))}
              style={{
                width: '80px',
                accentColor: 'var(--color-accent)',
                cursor: 'pointer',
              }}
            />

            <button
              onClick={onExpandNowPlaying}
              aria-label="Expand Now Playing full screen"
              title="Full Screen View"
              style={{ color: 'var(--color-text-secondary)', padding: '6px' }}
            >
              <Maximize2 size={18} />
            </button>
          </div>
        </div>
      </footer>

      <LicenseModal
        track={currentTrack}
        isOpen={showLicenseModal}
        onClose={() => setShowLicenseModal(false)}
      />
    </>
  )
}
