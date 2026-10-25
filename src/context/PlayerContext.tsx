import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react'
import type { Track, PlaybackState } from '../types/music'
import { QueueManager } from '../utils/queueManager'
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage'
import { VERIFIED_TRACKS } from '../data/verifiedCatalogue'

interface PlayerContextType {
  playbackState: PlaybackState
  queue: Track[]
  currentIndex: number
  likedTrackIds: string[]
  playTrack: (track: Track, newQueue?: Track[]) => void
  togglePlayPause: () => void
  playNext: () => void
  playPrevious: () => void
  seek: (seconds: number) => void
  setVolume: (level: number) => void
  toggleMute: () => void
  toggleShuffle: () => void
  cycleRepeatMode: () => void
  addToQueue: (track: Track) => void
  playNextInQueue: (track: Track) => void
  removeFromQueue: (index: number) => void
  toggleLikeTrack: (trackId: string) => void
  isLiked: (trackId: string) => boolean
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const queueManagerRef = useRef<QueueManager>(new QueueManager(VERIFIED_TRACKS, 0))

  const [likedTrackIds, setLikedTrackIds] = useState<string[]>(() => {
    return loadFromStorage<string[]>(STORAGE_KEYS.LIKED_TRACKS, [])
  })

  const [queue, setQueue] = useState<Track[]>(() => queueManagerRef.current.getQueue())
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const [playbackState, setPlaybackState] = useState<PlaybackState>(() => {
    const initialVolume = loadFromStorage<number>(STORAGE_KEYS.AUDIO_VOLUME, 0.8)
    return {
      currentTrack: queueManagerRef.current.getCurrentTrack(),
      status: 'idle',
      currentTime: 0,
      duration: queueManagerRef.current.getCurrentTrack()?.duration || 0,
      volume: initialVolume,
      isMuted: false,
      playbackRate: 1,
      repeatMode: 'off',
      isShuffled: false,
      errorMessage: null,
    }
  })

  // Synchronize audio element settings
  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'metadata'
    audio.volume = playbackState.volume
    audioRef.current = audio

    const onTimeUpdate = () => {
      setPlaybackState(prev => ({
        ...prev,
        currentTime: audio.currentTime,
        duration: audio.duration && !isNaN(audio.duration) ? audio.duration : prev.duration,
      }))
    }

    const onEnded = () => {
      playNext()
    }

    const onError = () => {
      console.warn('[Audio Player] Audio loading/playback error encountered.')
      setPlaybackState(prev => ({
        ...prev,
        status: 'error',
        errorMessage: 'Playback failed. The remote audio source may be temporarily unavailable.',
      }))
    }

    const onPlay = () => {
      setPlaybackState(prev => ({ ...prev, status: 'playing', errorMessage: null }))
    }

    const onPause = () => {
      setPlaybackState(prev => (prev.status === 'error' ? prev : { ...prev, status: 'paused' }))
    }

    const onLoadedMetadata = () => {
      setPlaybackState(prev => ({
        ...prev,
        duration: audio.duration && !isNaN(audio.duration) ? audio.duration : prev.duration,
      }))
    }

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)

    return () => {
      audio.pause()
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
    }
  }, [])

  // Sync liked tracks to local storage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.LIKED_TRACKS, likedTrackIds)
  }, [likedTrackIds])

  const syncQueueState = useCallback(() => {
    setQueue(queueManagerRef.current.getQueue())
    setCurrentIndex(queueManagerRef.current.getCurrentIndex())
  }, [])

  const startPlaybackOfTrack = useCallback((track: Track) => {
    if (!audioRef.current) return
    const audio = audioRef.current
    audio.src = track.audioUrl
    audio.currentTime = 0

    setPlaybackState(prev => ({
      ...prev,
      currentTrack: track,
      status: 'loading',
      currentTime: 0,
      duration: track.duration,
      errorMessage: null,
    }))

    audio.play().catch(err => {
      console.warn('[Audio Player] Autoplay restricted or playback interrupted:', err)
      setPlaybackState(prev => ({
        ...prev,
        status: 'paused',
        errorMessage: 'Click play to start audio playback.',
      }))
    })
  }, [])

  const playTrack = useCallback((track: Track, newQueue?: Track[]) => {
    if (newQueue && newQueue.length > 0) {
      const idx = newQueue.findIndex(t => t.id === track.id)
      queueManagerRef.current.setQueue(newQueue, idx !== -1 ? idx : 0)
    } else {
      const existingQueue = queueManagerRef.current.getQueue()
      const existingIdx = existingQueue.findIndex(t => t.id === track.id)
      if (existingIdx !== -1) {
        queueManagerRef.current.setQueue(existingQueue, existingIdx)
      } else {
        queueManagerRef.current.addToEnd(track)
        queueManagerRef.current.setQueue(queueManagerRef.current.getQueue(), queueManagerRef.current.getQueue().length - 1)
      }
    }

    syncQueueState()
    startPlaybackOfTrack(track)
  }, [startPlaybackOfTrack, syncQueueState])

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    if (playbackState.status === 'playing') {
      audio.pause()
    } else {
      if (!audio.src && playbackState.currentTrack) {
        startPlaybackOfTrack(playbackState.currentTrack)
      } else {
        audio.play().catch(err => {
          console.warn('[Audio Player] Play failure:', err)
        })
      }
    }
  }, [playbackState.status, playbackState.currentTrack, startPlaybackOfTrack])

  const playNext = useCallback(() => {
    const nextTrack = queueManagerRef.current.next()
    syncQueueState()
    if (nextTrack) {
      startPlaybackOfTrack(nextTrack)
    } else {
      setPlaybackState(prev => ({ ...prev, status: 'idle' }))
    }
  }, [startPlaybackOfTrack, syncQueueState])

  const playPrevious = useCallback(() => {
    const prevTrack = queueManagerRef.current.previous()
    syncQueueState()
    if (prevTrack) {
      startPlaybackOfTrack(prevTrack)
    }
  }, [startPlaybackOfTrack, syncQueueState])

  const seek = useCallback((seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds
      setPlaybackState(prev => ({ ...prev, currentTime: seconds }))
    }
  }, [])

  const setVolume = useCallback((level: number) => {
    const clamped = Math.max(0, Math.min(1, level))
    if (audioRef.current) {
      audioRef.current.volume = clamped
    }
    setPlaybackState(prev => ({
      ...prev,
      volume: clamped,
      isMuted: clamped === 0,
    }))
    saveToStorage(STORAGE_KEYS.AUDIO_VOLUME, clamped)
  }, [])

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return
    setPlaybackState(prev => {
      const willMute = !prev.isMuted
      audioRef.current!.muted = willMute
      return { ...prev, isMuted: willMute }
    })
  }, [])

  const toggleShuffle = useCallback(() => {
    const shuffled = queueManagerRef.current.toggleShuffle()
    syncQueueState()
    setPlaybackState(prev => ({ ...prev, isShuffled: shuffled }))
  }, [syncQueueState])

  const cycleRepeatMode = useCallback(() => {
    const newRepeat = queueManagerRef.current.cycleRepeatMode()
    setPlaybackState(prev => ({ ...prev, repeatMode: newRepeat }))
  }, [])

  const addToQueue = useCallback((track: Track) => {
    queueManagerRef.current.addToEnd(track)
    syncQueueState()
  }, [syncQueueState])

  const playNextInQueue = useCallback((track: Track) => {
    queueManagerRef.current.addNext(track)
    syncQueueState()
  }, [syncQueueState])

  const removeFromQueue = useCallback((index: number) => {
    queueManagerRef.current.removeAt(index)
    syncQueueState()
  }, [syncQueueState])

  const toggleLikeTrack = useCallback((trackId: string) => {
    setLikedTrackIds(prev => 
      prev.includes(trackId) ? prev.filter(id => id !== trackId) : [...prev, trackId]
    )
  }, [])

  const isLiked = useCallback((trackId: string) => {
    return likedTrackIds.includes(trackId)
  }, [likedTrackIds])

  return (
    <PlayerContext.Provider
      value={{
        playbackState,
        queue,
        currentIndex,
        likedTrackIds,
        playTrack,
        togglePlayPause,
        playNext,
        playPrevious,
        seek,
        setVolume,
        toggleMute,
        toggleShuffle,
        cycleRepeatMode,
        addToQueue,
        playNextInQueue,
        removeFromQueue,
        toggleLikeTrack,
        isLiked,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer(): PlayerContextType {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider')
  }
  return context
}
