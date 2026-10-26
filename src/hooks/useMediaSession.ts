import { useEffect } from 'react'
import type { Track } from '../types/music'

export interface MediaSessionHandlers {
  onPlay?: () => void
  onPause?: () => void
  onNext?: () => void
  onPrevious?: () => void
  onSeek?: (time: number) => void
}

/**
 * Hook to integrate with OS lockscreen / hardware media controls (Media Session API)
 */
export function useMediaSession(
  track: Track | null,
  isPlaying: boolean,
  handlers: MediaSessionHandlers
) {
  useEffect(() => {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) return
    if (!track) return

    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      album: track.album || 'ListenHere Collection',
      artwork: [
        { src: track.artworkUrl, sizes: '512x512', type: 'image/jpeg' },
      ],
    })

    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused'

    if (handlers.onPlay) {
      navigator.mediaSession.setActionHandler('play', handlers.onPlay)
    }
    if (handlers.onPause) {
      navigator.mediaSession.setActionHandler('pause', handlers.onPause)
    }
    if (handlers.onNext) {
      navigator.mediaSession.setActionHandler('nexttrack', handlers.onNext)
    }
    if (handlers.onPrevious) {
      navigator.mediaSession.setActionHandler('previoustrack', handlers.onPrevious)
    }

    return () => {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('play', null)
        navigator.mediaSession.setActionHandler('pause', null)
        navigator.mediaSession.setActionHandler('nexttrack', null)
        navigator.mediaSession.setActionHandler('previoustrack', null)
      }
    }
  }, [track, isPlaying, handlers])
}
