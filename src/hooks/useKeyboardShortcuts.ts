import { useEffect } from 'react'

export interface KeyboardShortcutHandlers {
  onTogglePlayPause?: () => void
  onNext?: () => void
  onPrevious?: () => void
  onMuteToggle?: () => void
  onSeekForward?: () => void
  onSeekBackward?: () => void
  onOpenVoiceSearch?: () => void
}

/**
 * Global Keyboard Controls for ListenHere:
 * - Space / 'k': Play / Pause
 * - 'j' / ArrowLeft: Seek backward 5s
 * - 'l' / ArrowRight: Seek forward 5s
 * - 'n': Next track
 * - 'p': Previous track
 * - 'm': Toggle mute
 * - 'v': Open voice assistant
 */
export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing inside an input or textarea
      const target = e.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return
      }

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault()
          handlers.onTogglePlayPause?.()
          break

        case 'n':
          e.preventDefault()
          handlers.onNext?.()
          break

        case 'p':
          e.preventDefault()
          handlers.onPrevious?.()
          break

        case 'm':
          e.preventDefault()
          handlers.onMuteToggle?.()
          break

        case 'arrowright':
        case 'l':
          e.preventDefault()
          handlers.onSeekForward?.()
          break

        case 'arrowleft':
        case 'j':
          e.preventDefault()
          handlers.onSeekBackward?.()
          break

        case 'v':
          e.preventDefault()
          handlers.onOpenVoiceSearch?.()
          break

        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handlers, enabled])
}
