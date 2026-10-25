import React from 'react'
import { X, Trash2, Play, Music } from 'lucide-react'
import { usePlayer } from '../../context/PlayerContext'
import { formatTime } from '../../utils/formatTime'

interface QueueDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export const QueueDrawer: React.FC<QueueDrawerProps> = ({ isOpen, onClose }) => {
  const { queue, currentIndex, playbackState, playTrack, removeFromQueue } = usePlayer()

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="queue-drawer-title"
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 'var(--player-height)',
        width: '100%',
        maxWidth: '380px',
        backgroundColor: 'var(--color-bg-surface)',
        borderLeft: '1px solid var(--color-border)',
        zIndex: 90,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.5)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '18px 20px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Music size={18} color="var(--color-accent)" />
          <h3 id="queue-drawer-title" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
            Playback Queue ({queue.length})
          </h3>
        </div>
        <button
          onClick={onClose}
          aria-label="Close queue"
          style={{ color: 'var(--color-text-muted)', padding: '6px' }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Queue List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
        {queue.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Queue is empty.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {queue.map((track, idx) => {
              const isCurrent = idx === currentIndex
              const isPlaying = isCurrent && playbackState.status === 'playing'

              return (
                <div
                  key={`${track.id}-${idx}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isCurrent ? 'var(--color-bg-card-hover)' : 'var(--color-bg-card)',
                    border: isCurrent ? '1px solid var(--color-accent)' : '1px solid transparent',
                  }}
                >
                  <img
                    src={track.artworkUrl}
                    alt={track.title}
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: 'var(--radius-sm)',
                      objectFit: 'cover',
                    }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: isCurrent ? 'var(--color-accent)' : 'var(--color-text-primary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {track.title}
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-secondary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {track.artist} • {formatTime(track.duration)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button
                      onClick={() => playTrack(track)}
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                      style={{
                        padding: '6px',
                        color: isCurrent ? 'var(--color-accent)' : 'var(--color-text-muted)',
                      }}
                    >
                      <Play size={16} fill={isCurrent ? 'var(--color-accent)' : 'none'} />
                    </button>

                    <button
                      onClick={() => removeFromQueue(idx)}
                      aria-label="Remove from queue"
                      style={{
                        padding: '6px',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
