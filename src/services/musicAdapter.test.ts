import { describe, it, expect } from 'vitest'
import { ArchiveMusicAdapter } from './musicAdapter'

describe('ArchiveMusicAdapter Service', () => {
  const adapter = new ArchiveMusicAdapter()

  it('retrieves all verified playable tracks', async () => {
    const tracks = await adapter.getTracks()
    expect(tracks.length).toBeGreaterThan(0)
    for (const t of tracks) {
      expect(t.isVerifiedPlayable).toBe(true)
    }
  })

  it('retrieves a track by ID', async () => {
    const track = await adapter.getTrackById('track-rag-bhairav-ia')
    expect(track).toBeDefined()
    expect(track?.title).toContain('Raga Bhairav')
  })

  it('returns null for nonexistent track ID', async () => {
    const track = await adapter.getTrackById('non-existent-id')
    expect(track).toBeNull()
  })

  it('searches tracks by keyword', async () => {
    const results = await adapter.search({ term: 'acoustic' })
    expect(results.length).toBeGreaterThan(0)
    expect(results.some(r => r.title.toLowerCase().includes('acoustic') || r.genre === 'Acoustic')).toBe(true)
  })

  it('filters tracks by language', async () => {
    const results = await adapter.search({ language: 'Hindi' })
    expect(results.length).toBeGreaterThan(0)
    for (const r of results) {
      expect(r.language).toBe('Hindi')
    }
  })

  it('filters tracks by genre and mood', async () => {
    const results = await adapter.search({ genre: 'Classical', mood: 'Meditative' })
    expect(results.length).toBeGreaterThan(0)
    for (const r of results) {
      expect(r.genre).toBe('Classical')
      expect(r.mood).toBe('Meditative')
    }
  })

  it('generates curated discovery shelves', async () => {
    const shelves = await adapter.getCuratedShelves()
    expect(shelves.length).toBeGreaterThanOrEqual(4)
    expect(shelves.find(s => s.id === 'hindi-indie')?.tracks.length).toBeGreaterThan(0)
  })
})
