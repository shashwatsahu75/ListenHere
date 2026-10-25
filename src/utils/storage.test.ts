import { describe, it, expect, beforeEach } from 'vitest'
import { loadFromStorage, saveToStorage, removeFromStorage, STORAGE_KEYS } from './storage'

describe('Storage Utility', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('saves and retrieves complex objects', () => {
    const data = ['track-1', 'track-2', 'track-3']
    const saved = saveToStorage(STORAGE_KEYS.LIKED_TRACKS, data)
    expect(saved).toBe(true)

    const loaded = loadFromStorage<string[]>(STORAGE_KEYS.LIKED_TRACKS, [])
    expect(loaded).toEqual(data)
  })

  it('returns fallback value if key does not exist', () => {
    const loaded = loadFromStorage<number>(STORAGE_KEYS.AUDIO_VOLUME, 0.8)
    expect(loaded).toBe(0.8)
  })

  it('removes stored keys properly', () => {
    saveToStorage('test_key', 'test_val')
    removeFromStorage('test_key')
    expect(loadFromStorage('test_key', null)).toBeNull()
  })

  it('gracefully handles JSON parse failures with fallback', () => {
    window.localStorage.setItem('corrupted_key', '{not valid json}')
    const loaded = loadFromStorage('corrupted_key', ['default'])
    expect(loaded).toEqual(['default'])
  })
})
