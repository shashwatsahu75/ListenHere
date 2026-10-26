import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useKeyboardShortcuts, KeyboardShortcutHandlers } from './useKeyboardShortcuts'

describe('useKeyboardShortcuts Hook', () => {
  let handlers: KeyboardShortcutHandlers

  beforeEach(() => {
    handlers = {
      onTogglePlayPause: vi.fn(),
      onNext: vi.fn(),
      onPrevious: vi.fn(),
      onMuteToggle: vi.fn(),
      onSeekForward: vi.fn(),
      onSeekBackward: vi.fn(),
      onOpenVoiceSearch: vi.fn(),
    }
  })

  it('triggers onTogglePlayPause on space or k key', () => {
    renderHook(() => useKeyboardShortcuts(handlers))

    window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }))
    expect(handlers.onTogglePlayPause).toHaveBeenCalledTimes(1)

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k' }))
    expect(handlers.onTogglePlayPause).toHaveBeenCalledTimes(2)
  })

  it('triggers onNext and onPrevious on n and p keys', () => {
    renderHook(() => useKeyboardShortcuts(handlers))

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'n' }))
    expect(handlers.onNext).toHaveBeenCalledTimes(1)

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'p' }))
    expect(handlers.onPrevious).toHaveBeenCalledTimes(1)
  })

  it('triggers onMuteToggle on m key', () => {
    renderHook(() => useKeyboardShortcuts(handlers))

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'm' }))
    expect(handlers.onMuteToggle).toHaveBeenCalledTimes(1)
  })

  it('triggers onOpenVoiceSearch on v key', () => {
    renderHook(() => useKeyboardShortcuts(handlers))

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'v' }))
    expect(handlers.onOpenVoiceSearch).toHaveBeenCalledTimes(1)
  })

  it('ignores shortcuts when typing in input elements', () => {
    renderHook(() => useKeyboardShortcuts(handlers))

    const input = document.createElement('input')
    document.body.appendChild(input)

    const event = new KeyboardEvent('keydown', { key: ' ' })
    Object.defineProperty(event, 'target', { value: input })

    window.dispatchEvent(event)
    expect(handlers.onTogglePlayPause).not.toHaveBeenCalled()

    document.body.removeChild(input)
  })
})
