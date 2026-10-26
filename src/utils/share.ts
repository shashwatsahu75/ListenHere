import type { Track } from '../types/music'

export interface ShareData {
  title: string
  text: string
  url: string
}

/**
 * Safe Share Utility
 * Uses navigator.share if available on mobile/supported desktop,
 * otherwise falls back to clipboard copy.
 */
export async function shareTrack(track: Track): Promise<'shared' | 'copied' | 'failed'> {
  const sharePayload: ShareData = {
    title: `${track.title} - ListenHere`,
    text: `Listen to "${track.title}" by ${track.artist} on ListenHere (Verified ${track.license.name}):`,
    url: track.sourceUrl || window.location.href,
  }

  try {
    if (typeof navigator !== 'undefined' && navigator.share) {
      await navigator.share(sharePayload)
      return 'shared'
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(`${sharePayload.text} ${sharePayload.url}`)
      return 'copied'
    }

    return 'failed'
  } catch (error: any) {
    if (error.name === 'AbortError') {
      // User cancelled system share sheet
      return 'failed'
    }

    // Fallback to clipboard if share threw
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(`${sharePayload.text} ${sharePayload.url}`)
        return 'copied'
      }
    } catch {
      return 'failed'
    }

    return 'failed'
  }
}
