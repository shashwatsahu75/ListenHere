import React, { useEffect, useState } from 'react'
import type { Track } from '../../types/music'
import { defaultMusicAdapter } from '../../services/musicAdapter'
import { getTrendingMusic } from '../../services/youtubeService'
import { TrackCard } from '../track/TrackCard'
import { Sparkles, Mic } from 'lucide-react'
import { TrackCardSkeleton } from '../common/Skeleton'

interface DiscoverViewProps {
  onOpenVoiceSearch: () => void
}

interface Shelf {
  id: string
  title: string
  subtitle: string
  tracks: Track[]
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({ onOpenVoiceSearch }) => {
  const [shelves, setShelves] = useState<Shelf[]>([])
  const [featuredTrack, setFeaturedTrack] = useState<Track | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDiscoverData() {
      setLoading(true)
      const data = await defaultMusicAdapter.getCuratedShelves()
      try {
        const trending = await getTrendingMusic()
        if (trending.length > 0) {
          data.unshift({
            id: 'trending-hits',
            title: '🔥 Trending Indian Hits (Live YouTube)',
            subtitle: 'Popular tracks streaming via authorized YouTube API',
            tracks: trending,
          })
        }
      } catch (err) {
        console.warn('Failed to fetch trending live tracks:', err)
      }

      setShelves(data)
      if (data.length > 0 && data[0].tracks.length > 0) {
        setFeaturedTrack(data[0].tracks[0])
      }
      setLoading(false)
    }
    loadDiscoverData()
  }, [])

  if (loading) {
    return (
      <div style={{ padding: '24px 32px 120px 32px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '20px' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <TrackCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px 32px 120px 32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Hero Showcase */}
      {featuredTrack && (
        <div
          style={{
            position: 'relative',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            backgroundColor: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            marginBottom: '40px',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            padding: '32px',
            gap: '32px',
            backgroundImage: `radial-gradient(circle at 10% 50%, ${featuredTrack.accentColor || '#10b981'}33 0%, transparent 60%)`,
          }}
        >
          <img
            src={featuredTrack.artworkUrl}
            alt={featuredTrack.title}
            style={{
              width: '200px',
              height: '200px',
              borderRadius: 'var(--radius-md)',
              objectFit: 'cover',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            }}
          />

          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--color-accent)',
                  backgroundColor: 'var(--color-accent-glow)',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Sparkles size={14} /> Featured Masterpiece
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                {featuredTrack.license.name}
              </span>
            </div>

            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.02em' }}>
              {featuredTrack.title}
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
              {featuredTrack.artist}
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5, maxWidth: '640px', marginBottom: '20px' }}>
              {featuredTrack.description}
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={onOpenVoiceSearch}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--color-accent)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-full)',
                  boxShadow: '0 4px 14px var(--color-accent-glow)',
                }}
              >
                <Mic size={18} /> Speak to Discover
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Curated Shelves */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {shelves.map(shelf => (
          <section key={shelf.id} aria-labelledby={`shelf-title-${shelf.id}`}>
            <div style={{ marginBottom: '16px' }}>
              <h3
                id={`shelf-title-${shelf.id}`}
                style={{ fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.01em', marginBottom: '4px' }}
              >
                {shelf.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                {shelf.subtitle}
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
                gap: '20px',
              }}
            >
              {shelf.tracks.map(track => (
                <TrackCard key={track.id} track={track} playlistContext={shelf.tracks} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
