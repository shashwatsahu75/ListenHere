import { describe, it, expect } from 'vitest'
import { getSimilarTracks } from './recommendations'
import { VERIFIED_TRACKS } from '../data/verifiedCatalogue'

describe('Recommendations Utility', () => {
  it('returns similar tracks sharing genre, language, or mood', () => {
    const track = VERIFIED_TRACKS.find(t => t.genre === 'Classical')!
    const similar = getSimilarTracks(track, VERIFIED_TRACKS, 3)

    expect(similar.length).toBeLessThanOrEqual(3)
    expect(similar.every(t => t.id !== track.id)).toBe(true)

    // Should include other classical or instrumental tracks
    const genres = similar.map(t => t.genre)
    expect(genres.includes('Classical') || genres.includes('Instrumental')).toBe(true)
  })

  it('excludes current track from recommendations', () => {
    const track = VERIFIED_TRACKS[0]
    const similar = getSimilarTracks(track, VERIFIED_TRACKS, 5)

    expect(similar.find(t => t.id === track.id)).toBeUndefined()
  })

  it('handles empty catalogue or single item gracefully', () => {
    const track = VERIFIED_TRACKS[0]
    expect(getSimilarTracks(track, [], 3)).toEqual([])
    expect(getSimilarTracks(track, [track], 3)).toEqual([])
  })
})
