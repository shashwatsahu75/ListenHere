import type { Track } from '../types/music'

/**
 * Rule-based recommendation engine for ListenHere:
 * Finds tracks with matching genres, language, mood, or instrument tags.
 * Completely transparent without opaque "black box" claims.
 */
export function getSimilarTracks(currentTrack: Track, allTracks: Track[], limit: number = 4): Track[] {
  if (!currentTrack || allTracks.length === 0) return []

  const candidates = allTracks.filter(t => t.id !== currentTrack.id)

  const scored = candidates.map(track => {
    let score = 0

    // Exact genre match (+3)
    if (track.genre === currentTrack.genre) score += 3

    // Exact language match (+2)
    if (track.language === currentTrack.language) score += 2

    // Mood match (+2)
    if (track.mood === currentTrack.mood) score += 2

    // Shared tags (+1 each)
    const sharedTags = track.tags.filter(tag => currentTrack.tags.includes(tag))
    score += sharedTags.length

    return { track, score }
  })

  // Sort descending by score, take top N
  scored.sort((a, b) => b.score - a.score)

  return scored.slice(0, limit).map(s => s.track)
}
