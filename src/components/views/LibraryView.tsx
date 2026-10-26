import React, { useState, useEffect } from 'react'
import type { Track } from '../../types/music'
import { Heart, Play, Music } from 'lucide-react'
import { usePlayer } from '../../context/PlayerContext'
import { defaultMusicAdapter } from '../../services/musicAdapter'
import { TrackList } from '../track/TrackList'

export const LibraryView: React.FC = () => {
  const { likedTrackIds, playTrack } = usePlayer()
  const [likedTracks, setLikedTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadLikedTracks() {
      setLoading(true)
      const all = await defaultMusicAdapter.getTracks()
      const filtered = all.filter(t => likedTrackIds.includes(t.id))
      setLikedTracks(filtered)
      setLoading(false)
    }
    loadLikedTracks()
  }, [likedTrackIds])

  const playAllLiked = () => {
    if (likedTracks.length > 0) {
      playTrack(likedTracks[0], likedTracks)
    }
  }

  return (
    <div style={{ padding: '24px 32px 120px 32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '24px',
          padding: '32px',
          backgroundColor: 'var(--color-bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          marginBottom: '32px',
          backgroundImage: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, transparent 70%)',
        }}
      >
        <div
          style={{
            width: '120px',
            height: '120px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(239, 68, 68, 0.3)',
            flexShrink: 0,
          }}
        >
          <Heart size={56} color="#ffffff" fill="#ffffff" />
        </div>

        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
            Personal Collection
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '4px 0 8px 0', letterSpacing: '-0.02em' }}>
            Liked Tracks
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
            {likedTracks.length} saved track{likedTracks.length === 1 ? '' : 's'} stored securely in your browser
          </p>

          {likedTracks.length > 0 && (
            <button
              onClick={playAllLiked}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-accent)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.95rem',
                boxShadow: '0 4px 14px var(--color-accent-glow)',
              }}
            >
              <Play size={18} fill="#ffffff" /> Play Collection
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
          Loading saved tracks...
        </div>
      ) : likedTracks.length === 0 ? (
        <div
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            backgroundColor: 'var(--color-bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--color-border)',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-bg-card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              color: 'var(--color-text-muted)',
            }}
          >
            <Music size={26} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>
            No saved tracks yet
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', maxWidth: '400px', margin: '0 auto' }}>
            Explore tracks in Discover or Search, and tap the heart icon to save your favorite songs here.
          </p>
        </div>
      ) : (
        <TrackList tracks={likedTracks} />
      )}
    </div>
  )
}
