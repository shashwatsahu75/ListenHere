import React, { useState } from 'react'
import type { Track } from '../../types/music'
import { Play, Pause, Heart, Info, Plus, Music } from 'lucide-react'
import { usePlayer } from '../../context/PlayerContext'
import { LicenseModal } from '../license/LicenseModal'
import { formatTime } from '../../utils/formatTime'

interface TrackCardProps {
  track: Track
  playlistContext?: Track[]
}

export const TrackCard: React.FC<TrackCardProps> = ({ track, playlistContext }) => {
  const { playbackState, playTrack, togglePlayPause, isLiked, toggleLikeTrack, addToQueue } = usePlayer()
  const [showLicenseModal, setShowLicenseModal] = useState(false)
  const [imageError, setImageError] = useState(false)

  const isCurrentTrack = playbackState.currentTrack?.id === track.id
  const isPlayingThis = isCurrentTrack && playbackState.status === 'playing'
  const liked = isLiked(track.id)

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isCurrentTrack) {
      togglePlayPause()
    } else {
      playTrack(track, playlistContext)
    }
  }

  return (
    <>
      <div
        role="group"
        aria-label={`${track.title} by ${track.artist}`}
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
          cursor: 'pointer',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-4px)'
          e.currentTarget.style.borderColor = 'var(--color-border-light)'
          e.currentTarget.style.boxShadow = '0 12px 24px -10px rgba(0, 0, 0, 0.4)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.borderColor = 'var(--color-border)'
          e.currentTarget.style.boxShadow = 'none'
        }}
        onClick={() => playTrack(track, playlistContext)}
      >
        {/* Cover Artwork Container */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1/1',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            backgroundColor: 'var(--color-bg-card)',
            marginBottom: '12px',
          }}
        >
          {imageError ? (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: track.accentColor || '#334155',
                color: '#ffffff',
              }}
            >
              <Music size={40} />
            </div>
          ) : (
            <img
              src={track.artworkUrl}
              alt={track.title}
              onError={() => setImageError(true)}
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
              }}
            />
          )}

          {/* Quick Play Overlay Button */}
          <button
            onClick={handlePlayClick}
            aria-label={isPlayingThis ? `Pause ${track.title}` : `Play ${track.title}`}
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-accent)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              transition: 'transform 0.15s ease',
            }}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.92)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {isPlayingThis ? <Pause size={20} fill="#ffffff" /> : <Play size={20} fill="#ffffff" style={{ marginLeft: '2px' }} />}
          </button>
        </div>

        {/* Metadata */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h4
            title={track.title}
            style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              color: isCurrentTrack ? 'var(--color-accent)' : 'var(--color-text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              marginBottom: '4px',
            }}
          >
            {track.title}
          </h4>
          <p
            title={track.artist}
            style={{
              fontSize: '0.825rem',
              color: 'var(--color-text-secondary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              marginBottom: '8px',
            }}
          >
            {track.artist}
          </p>

          {/* Tags / Pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: 'auto', marginBottom: '10px' }}>
            <span
              style={{
                fontSize: '0.7rem',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-bg-card)',
                color: 'var(--color-text-secondary)',
                fontWeight: 500,
              }}
            >
              {track.language}
            </span>
            <span
              style={{
                fontSize: '0.7rem',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-bg-card)',
                color: 'var(--color-accent)',
                fontWeight: 600,
              }}
            >
              {track.genre}
            </span>
          </div>

          {/* Bottom Card Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '8px',
              borderTop: '1px solid var(--color-border)',
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
            }}
          >
            <span>{formatTime(track.duration)}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={e => {
                  e.stopPropagation()
                  toggleLikeTrack(track.id)
                }}
                aria-label={liked ? 'Unlike track' : 'Like track'}
                style={{
                  color: liked ? '#ef4444' : 'var(--color-text-muted)',
                  display: 'flex',
                  padding: '4px',
                }}
              >
                <Heart size={16} fill={liked ? '#ef4444' : 'none'} />
              </button>

              <button
                onClick={e => {
                  e.stopPropagation()
                  addToQueue(track)
                }}
                aria-label="Add to Queue"
                title="Add to Queue"
                style={{
                  color: 'var(--color-text-muted)',
                  display: 'flex',
                  padding: '4px',
                }}
              >
                <Plus size={16} />
              </button>

              <button
                onClick={e => {
                  e.stopPropagation()
                  setShowLicenseModal(true)
                }}
                aria-label="View track license info"
                title="Credits & License"
                style={{
                  color: 'var(--color-text-muted)',
                  display: 'flex',
                  padding: '4px',
                }}
              >
                <Info size={16} />
              </button>
            </div>
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
