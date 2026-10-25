import React, { useState } from 'react'
import type { Track } from '../../types/music'
import { Heart, Info, Clock, Plus } from 'lucide-react'
import { usePlayer } from '../../context/PlayerContext'
import { formatTime } from '../../utils/formatTime'
import { LicenseModal } from '../license/LicenseModal'

interface TrackListProps {
  tracks: Track[]
  showCover?: boolean
  showAlbum?: boolean
  onTrackSelect?: (track: Track) => void
}

export const TrackList: React.FC<TrackListProps> = ({
  tracks,
  showCover = true,
  showAlbum = true,
  onTrackSelect,
}) => {
  const { playbackState, playTrack, togglePlayPause, isLiked, toggleLikeTrack, addToQueue } = usePlayer()
  const [selectedTrackForLicense, setSelectedTrackForLicense] = useState<Track | null>(null)

  if (tracks.length === 0) {
    return (
      <div
        style={{
          padding: '40px 20px',
          textAlign: 'center',
          color: 'var(--color-text-muted)',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px dashed var(--color-border)',
        }}
      >
        <p style={{ fontSize: '0.95rem' }}>No tracks found matching criteria.</p>
      </div>
    )
  }

  return (
    <>
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '0.875rem',
          }}
        >
          <thead>
            <tr
              style={{
                color: 'var(--color-text-muted)',
                borderBottom: '1px solid var(--color-border)',
                height: '40px',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              <th style={{ width: '40px', textAlign: 'center' }}>#</th>
              <th>Title</th>
              {showAlbum && <th>Album / Provenance</th>}
              <th>Language / Genre</th>
              <th style={{ width: '60px', textAlign: 'right' }}>
                <Clock size={14} style={{ display: 'inline' }} />
              </th>
              <th style={{ width: '100px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tracks.map((track, idx) => {
              const isCurrent = playbackState.currentTrack?.id === track.id
              const isPlaying = isCurrent && playbackState.status === 'playing'
              const liked = isLiked(track.id)

              return (
                <tr
                  key={track.id}
                  style={{
                    height: '56px',
                    borderBottom: '1px solid var(--color-border)',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
                    backgroundColor: isCurrent ? 'var(--color-bg-card-hover)' : 'transparent',
                  }}
                  onMouseEnter={e => {
                    if (!isCurrent) e.currentTarget.style.backgroundColor = 'var(--color-bg-card)'
                  }}
                  onMouseLeave={e => {
                    if (!isCurrent) e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                  onClick={() => {
                    if (onTrackSelect) {
                      onTrackSelect(track)
                    } else if (isCurrent) {
                      togglePlayPause()
                    } else {
                      playTrack(track, tracks)
                    }
                  }}
                >
                  {/* Number / Play Status */}
                  <td style={{ textAlign: 'center', color: isCurrent ? 'var(--color-accent)' : 'var(--color-text-muted)' }}>
                    {isPlaying ? (
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>▶</span>
                    ) : (
                      idx + 1
                    )}
                  </td>

                  {/* Title & Cover */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {showCover && (
                        <img
                          src={track.artworkUrl}
                          alt={track.title}
                          loading="lazy"
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: 'var(--radius-sm)',
                            objectFit: 'cover',
                          }}
                        />
                      )}
                      <div>
                        <div
                          style={{
                            fontWeight: 600,
                            color: isCurrent ? 'var(--color-accent)' : 'var(--color-text-primary)',
                          }}
                        >
                          {track.title}
                        </div>
                        <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
                          {track.artist}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Album */}
                  {showAlbum && (
                    <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
                      {track.album || 'Archival Single'}
                    </td>
                  )}

                  {/* Badges */}
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          padding: '2px 6px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--color-bg-card)',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        {track.language}
                      </span>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          padding: '2px 6px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--color-bg-card)',
                          color: 'var(--color-accent)',
                        }}
                      >
                        {track.genre}
                      </span>
                    </div>
                  </td>

                  {/* Duration */}
                  <td style={{ textAlign: 'right', color: 'var(--color-text-muted)' }}>
                    {formatTime(track.duration)}
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          toggleLikeTrack(track.id)
                        }}
                        aria-label="Like"
                        style={{
                          color: liked ? '#ef4444' : 'var(--color-text-muted)',
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
                        style={{
                          color: 'var(--color-text-muted)',
                          padding: '4px',
                        }}
                      >
                        <Plus size={16} />
                      </button>

                      <button
                        onClick={e => {
                          e.stopPropagation()
                          setSelectedTrackForLicense(track)
                        }}
                        aria-label="License Info"
                        style={{
                          color: 'var(--color-text-muted)',
                          padding: '4px',
                        }}
                      >
                        <Info size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {selectedTrackForLicense && (
        <LicenseModal
          track={selectedTrackForLicense}
          isOpen={Boolean(selectedTrackForLicense)}
          onClose={() => setSelectedTrackForLicense(null)}
        />
      )}
    </>
  )
}
