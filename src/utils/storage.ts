/**
 * Safe client-side storage utility for preferences, liked tracks, and playlists.
 * Handles JSON serialization, corrupted state recovery, and localStorage unavailability.
 */

export const STORAGE_KEYS = {
  LIKED_TRACKS: 'listenhere_liked_tracks_v1',
  CUSTOM_PLAYLISTS: 'listenhere_custom_playlists_v1',
  RECENTLY_PLAYED: 'listenhere_recently_played_v1',
  AUDIO_VOLUME: 'listenhere_volume_v1',
  THEME_MODE: 'listenhere_theme_v1',
  VOICE_LANGUAGE: 'listenhere_voice_lang_v1',
} as const

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return fallback
    }
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch (error) {
    console.warn(`[Storage] Failed to read "${key}" from localStorage:`, error)
    return fallback
  }
}

export function saveToStorage<T>(key: string, value: T): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false
    }
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.warn(`[Storage] Failed to write "${key}" to localStorage:`, error)
    return false
  }
}

export function removeFromStorage(key: string): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false
    }
    window.localStorage.removeItem(key)
    return true
  } catch (error) {
    console.warn(`[Storage] Failed to remove "${key}":`, error)
    return false
  }
}
