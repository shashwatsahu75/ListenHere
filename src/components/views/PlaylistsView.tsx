import React, { useState, useEffect } from 'react'
import type { Track } from '../../types/music'
import { Play, Music } from 'lucide-react'
import { defaultMusicAdapter } from '../../services/musicAdapter'
import { usePlayer } from '../../context/PlayerContext'
import { TrackList } from '../track/TrackList'

interface ShelfData {
  id: string
  title: string
  subtitle: string
  tracks: Track[]
}

export const PlaylistsView: React.FC = () => {
  const { playTrack } = usePlayer()
  const [shelves, setShelves] = useState<ShelfData[]>([])
  const [activeShelfId, setActiveShelfId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchShelves() {
      setLoading(true)
      const data = await defaultMusicAdapter.getCuratedShelves()
      setShelves(data)
      if (data.length > 0) {
        setActiveShelfId(data[0].id)
      }
      setLoading(false)
    }
    fetchShelves()
  }, [])

  const selectedShelf = shelves.find(s => s.id === activeShelfId)

  return (
    <div style={{ padding: '24px 32px 120px 32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* View Header */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '6px' }}>
          Curated Soundtracks & Archives
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
          Thematically grouped legal collections highlighting India's rich auditory traditions and modern independent sounds.
        </p>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          Loading playlists...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '32px' }}>
          {/* Left Column: Playlist Selector Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Select Playlist
            </div>

            {shelves.map(shelf => {
              const isSelected = shelf.id === activeShelfId
              const firstCover = shelf.tracks[0]?.artworkUrl

              return (
                <div
                  key={shelf.id}
                  onClick={() => setActiveShelfId(shelf.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isSelected ? 'var(--color-bg-card-hover)' : 'var(--color-bg-card)',
                    border: isSelected ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {firstCover ? (
                    <img
                      src={firstCover}
                      alt={shelf.title}
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: 'var(--radius-sm)',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Music size={22} color="var(--color-text-muted)" />
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        color: isSelected ? 'var(--color-accent)' : 'var(--color-text-primary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {shelf.title}
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-secondary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginTop: '2px',
                      }}
                    >
                      {shelf.tracks.length} tracks
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right Column: Active Playlist Details & Track Listing */}
          <div>
            {selectedShelf && (
              <>
                {/* Playlist Banner */}
                <div
                  style={{
                    padding: '24px',
                    backgroundColor: 'var(--color-bg-card)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border)',
                    marginBottom: '24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase' }}>
                      Playlist
                    </span>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '4px 0 6px 0' }}>
                      {selectedShelf.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                      {selectedShelf.subtitle}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (selectedShelf.tracks.length > 0) {
                        playTrack(selectedShelf.tracks[0], selectedShelf.tracks)
                      }
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 20px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--color-accent)',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      boxShadow: '0 4px 14px var(--color-accent-glow)',
                    }}
                  >
                    <Play size={18} fill="#ffffff" /> Play All
                  </button>
                </div>

                {/* Track Listing */}
                <TrackList tracks={selectedShelf.tracks} />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
