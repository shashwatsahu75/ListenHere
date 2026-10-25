import React, { useState } from 'react'
import {
  X,
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
  ShieldCheck,
} from 'lucide-react'
import { usePlayer } from '../../context/PlayerContext'
import { formatTime } from '../../utils/formatTime'
import { LicenseModal } from '../license/LicenseModal'

interface NowPlayingExpandedProps {
  isOpen: boolean
  onClose: () => void
}

export const NowPlayingExpanded: React.FC<NowPlayingExpandedProps> = ({ isOpen, onClose }) => {
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
  const track = playbackState.currentTrack

  if (!isOpen || !track) return null

  const isPlaying = playbackState.status === 'playing'
  const liked = isLiked(track.id)
  const progressPercent = playbackState.duration > 0
    ? (playbackState.currentTime / playbackState.duration) * 100
    : 0

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Expanded Now Playing View"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'var(--color-bg-base)',
          zIndex: 200,
          display: 'flex',
          flexDirection: 'column',
          padding: '24px',
          overflowY: 'auto',
          backgroundImage: `radial-gradient(circle at 50% 20%, ${track.accentColor || '#10b981'}25 0%, transparent 60%)`,
        }}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
            Now Playing
          </div>
          <button
            onClick={onClose}
            aria-label="Collapse now playing view"
            style={{
              color: 'var(--color-text-primary)',
              padding: '8px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-bg-card)',
              display: 'flex',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Center Artwork & Visualizer */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '520px',
            margin: '0 auto',
            width: '100%',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '1/1',
              maxWidth: '380px',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
              marginBottom: '28px',
            }}
          >
            <img
              src={track.artworkUrl}
              alt={track.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: isPlaying ? 'scale(1.02)' : 'scale(1)',
                transition: 'transform 0.5s ease',
              }}
            />
          </div>

          {/* Track Details */}
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '4px' }}>{track.title}</h2>
              <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)' }}>{track.artist}</p>
              {track.album && (
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  {track.album} • {track.language}
                </p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => toggleLikeTrack(track.id)}
                aria-label={liked ? 'Unlike' : 'Like'}
                style={{
                  color: liked ? '#ef4444' : 'var(--color-text-muted)',
                  padding: '8px',
                  backgroundColor: 'var(--color-bg-card)',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                }}
              >
                <Heart size={22} fill={liked ? '#ef4444' : 'none'} />
              </button>

              <button
                onClick={() => setShowLicenseModal(true)}
                aria-label="View license details"
                title="Credits & Licensing"
                style={{
                  color: 'var(--color-accent)',
                  padding: '8px',
                  backgroundColor: 'var(--color-bg-card)',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                }}
              >
                <ShieldCheck size={22} />
              </button>
            </div>
          </div>

          {/* Seek Bar */}
          <div style={{ width: '100%', marginBottom: '24px' }}>
            <div
              role="slider"
              aria-label="Seek track"
              aria-valuemin={0}
              aria-valuemax={playbackState.duration}
              aria-valuenow={playbackState.currentTime}
              style={{
                width: '100%',
                height: '6px',
                backgroundColor: 'var(--color-bg-card)',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
                position: 'relative',
              }}
              onClick={e => {
                const rect = e.currentTarget.getBoundingClientRect()
                const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
                seek(ratio * playbackState.duration)
              }}
            >
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-accent)',
                  boxShadow: '0 0 12px var(--color-accent-glow)',
                }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '8px',
                fontSize: '0.8rem',
                color: 'var(--color-text-muted)',
              }}
            >
              <span>{formatTime(playbackState.currentTime)}</span>
              <span>{formatTime(playbackState.duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '28px' }}>
            <button
              onClick={toggleShuffle}
              aria-label="Toggle shuffle"
              style={{
                color: playbackState.isShuffled ? 'var(--color-accent)' : 'var(--color-text-muted)',
                padding: '8px',
              }}
            >
              <Shuffle size={22} />
            </button>

            <button
              onClick={playPrevious}
              aria-label="Previous track"
              style={{ color: 'var(--color-text-primary)', padding: '8px' }}
            >
              <SkipBack size={26} />
            </button>

            <button
              onClick={togglePlayPause}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-accent)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px var(--color-accent-glow)',
                transition: 'transform 0.1s ease',
              }}
              onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.95)')}
              onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              {isPlaying ? <Pause size={30} fill="#ffffff" /> : <Play size={30} fill="#ffffff" style={{ marginLeft: '4px' }} />}
            </button>

            <button
              onClick={playNext}
              aria-label="Next track"
              style={{ color: 'var(--color-text-primary)', padding: '8px' }}
            >
              <SkipForward size={26} />
            </button>

            <button
              onClick={cycleRepeatMode}
              aria-label="Cycle repeat mode"
              style={{
                color: playbackState.repeatMode !== 'off' ? 'var(--color-accent)' : 'var(--color-text-muted)',
                padding: '8px',
              }}
            >
              {playbackState.repeatMode === 'one' ? <Repeat1 size={22} /> : <Repeat size={22} />}
            </button>
          </div>

          {/* Volume Scrubber */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', maxWidth: '280px' }}>
            <button
              onClick={toggleMute}
              aria-label={playbackState.isMuted ? 'Unmute' : 'Mute'}
              style={{ color: 'var(--color-text-muted)', padding: '4px' }}
            >
              {playbackState.isMuted || playbackState.volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
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
                flex: 1,
                accentColor: 'var(--color-accent)',
                cursor: 'pointer',
              }}
            />
          </div>
        </div>
      </div>

      <LicenseModal
        track={track}
        isOpen={showLicenseModal}
        onClose={() => setShowLicenseModal(false)}
      />
    </>
  )
}
