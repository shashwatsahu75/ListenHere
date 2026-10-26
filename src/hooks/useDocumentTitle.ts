import { useEffect, useRef } from 'react'

/**
 * Hook to manage document.title and audio metadata in browser tab
 */
export function useDocumentTitle(title: string, artist?: string, isPlaying: boolean = false) {
  const originalTitle = useRef<string>(document.title)

  useEffect(() => {
    if (title && isPlaying) {
      document.title = `▶ ${title} - ${artist || 'ListenHere'}`
    } else if (title) {
      document.title = `${title} - ${artist || 'ListenHere'}`
    } else {
      document.title = originalTitle.current || 'ListenHere - Discover Legal Music'
    }

    return () => {
      document.title = originalTitle.current || 'ListenHere - Discover Legal Music'
    }
  }, [title, artist, isPlaying])
}
