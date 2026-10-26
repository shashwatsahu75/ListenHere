import React, { useState, useEffect } from 'react'
import type { Track } from '../../types/music'
import { Search, Mic, Filter, X } from 'lucide-react'
import { defaultMusicAdapter } from '../../services/musicAdapter'
import { TrackCard } from '../track/TrackCard'
import { TrackList } from '../track/TrackList'

interface SearchViewProps {
  initialQuery?: string
  onOpenVoiceSearch: () => void
}

const LANGUAGES = ['All', 'Hindi', 'Indian Classical', 'Bengali', 'Punjabi', 'Sanskrit', 'Instrumental']
const GENRES = ['All', 'Indie', 'Classical', 'Acoustic', 'Lo-Fi', 'Devotional', 'Folk', 'Sufi', 'Instrumental']
const MOODS = ['All', 'Relaxing', 'Focus', 'Meditative', 'Soulful', 'Peaceful', 'Upbeat']

export const SearchView: React.FC<SearchViewProps> = ({ initialQuery = '', onOpenVoiceSearch }) => {
  const [searchTerm, setSearchTerm] = useState(initialQuery)
  const [selectedLanguage, setSelectedLanguage] = useState('All')
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [selectedMood, setSelectedMood] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [results, setResults] = useState<Track[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setSearchTerm(initialQuery)
  }, [initialQuery])

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    const timer = setTimeout(async () => {
      const filtered = await defaultMusicAdapter.search({
        term: searchTerm || undefined,
        language: selectedLanguage !== 'All' ? selectedLanguage : undefined,
        genre: selectedGenre !== 'All' ? selectedGenre : undefined,
        mood: selectedMood !== 'All' ? selectedMood : undefined,
      })

      if (!cancelled) {
        setResults(filtered)
        setLoading(false)
      }
    }, 200)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [searchTerm, selectedLanguage, selectedGenre, selectedMood])

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedLanguage('All')
    setSelectedGenre('All')
    setSelectedMood('All')
  }

  const hasActiveFilters =
    Boolean(searchTerm) ||
    selectedLanguage !== 'All' ||
    selectedGenre !== 'All' ||
    selectedMood !== 'All'

  return (
    <div style={{ padding: '24px 32px 120px 32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Search Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '6px' }}>
          Explore Legal Indian Music
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
          Search legally cleared audio across Hindi indie, classical ragas, acoustic sessions, and devotional hymns.
        </p>
      </div>

      {/* Input Bar with Voice Trigger */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
        <div
          style={{
            flex: 1,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-full)',
            padding: '0 16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          }}
        >
          <Search size={20} color="var(--color-text-muted)" style={{ marginRight: '10px' }} />
          <input
            type="text"
            placeholder="Search by song name, artist, raga, or instruments (sitar, flute, tabla)..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              height: '46px',
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              color: 'var(--color-text-primary)',
              fontSize: '0.95rem',
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
              style={{ color: 'var(--color-text-muted)', padding: '6px' }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        <button
          onClick={onOpenVoiceSearch}
          aria-label="Open voice search"
          title="Voice Search"
          style={{
            height: '46px',
            width: '46px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-accent)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px var(--color-accent-glow)',
            flexShrink: 0,
          }}
        >
          <Mic size={20} />
        </button>
      </div>

      {/* Filter Row */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
          <Filter size={16} /> Filters:
        </div>

        {/* Language Select */}
        <select
          value={selectedLanguage}
          onChange={e => setSelectedLanguage(e.target.value)}
          aria-label="Filter by language"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 12px',
            fontSize: '0.825rem',
            cursor: 'pointer',
          }}
        >
          {LANGUAGES.map(lang => (
            <option key={lang} value={lang}>Language: {lang}</option>
          ))}
        </select>

        {/* Genre Select */}
        <select
          value={selectedGenre}
          onChange={e => setSelectedGenre(e.target.value)}
          aria-label="Filter by genre"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 12px',
            fontSize: '0.825rem',
            cursor: 'pointer',
          }}
        >
          {GENRES.map(g => (
            <option key={g} value={g}>Genre: {g}</option>
          ))}
        </select>

        {/* Mood Select */}
        <select
          value={selectedMood}
          onChange={e => setSelectedMood(e.target.value)}
          aria-label="Filter by mood"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 12px',
            fontSize: '0.825rem',
            cursor: 'pointer',
          }}
        >
          {MOODS.map(m => (
            <option key={m} value={m}>Mood: {m}</option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            style={{
              fontSize: '0.8rem',
              color: 'var(--color-accent)',
              fontWeight: 600,
              padding: '6px 10px',
            }}
          >
            Reset Filters
          </button>
        )}

        {/* View Mode Toggle */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px', backgroundColor: 'var(--color-bg-card)', padding: '2px', borderRadius: 'var(--radius-sm)' }}>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              padding: '4px 8px',
              fontSize: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              backgroundColor: viewMode === 'grid' ? 'var(--color-accent)' : 'transparent',
              color: viewMode === 'grid' ? '#ffffff' : 'var(--color-text-secondary)',
            }}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('table')}
            style={{
              padding: '4px 8px',
              fontSize: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              backgroundColor: viewMode === 'table' ? 'var(--color-accent)' : 'transparent',
              color: viewMode === 'table' ? '#ffffff' : 'var(--color-text-secondary)',
            }}
          >
            Table
          </button>
        </div>
      </div>

      {/* Results Header */}
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          Found {results.length} verified playable track{results.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Results Grid / Table */}
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          Searching catalogue...
        </div>
      ) : results.length === 0 ? (
        <div
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            backgroundColor: 'var(--color-bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--color-border)',
          }}
        >
          <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '6px' }}>
            No verified tracks matched your criteria
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', maxWidth: '420px', margin: '0 auto 16px auto' }}>
            To respect music copyright, ListenHere only streams verified CC / Public Domain recordings. Commercial Bollywood music is strictly excluded.
          </p>
          <button
            onClick={clearFilters}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-accent)',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
            gap: '20px',
          }}
        >
          {results.map(track => (
            <TrackCard key={track.id} track={track} playlistContext={results} />
          ))}
        </div>
      ) : (
        <TrackList tracks={results} />
      )}
    </div>
  )
}
