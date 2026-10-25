import type { Track, RepeatMode } from '../types/music'

export interface QueueState {
  originalQueue: Track[]
  shuffledQueue: Track[]
  currentIndex: number
  isShuffled: boolean
  repeatMode: RepeatMode
}

export class QueueManager {
  private originalQueue: Track[] = []
  private currentQueue: Track[] = []
  private currentIndex: number = -1
  private isShuffled: boolean = false
  private repeatMode: RepeatMode = 'off'

  constructor(initialTracks: Track[] = [], startIndex: number = 0) {
    this.setQueue(initialTracks, startIndex)
  }

  setQueue(tracks: Track[], startIndex: number = 0): void {
    this.originalQueue = [...tracks]
    if (this.isShuffled) {
      this.currentQueue = this.shuffleArray([...tracks])
      const activeTrack = tracks[startIndex]
      if (activeTrack) {
        const newIdx = this.currentQueue.findIndex(t => t.id === activeTrack.id)
        this.currentIndex = newIdx !== -1 ? newIdx : 0
      } else {
        this.currentIndex = 0
      }
    } else {
      this.currentQueue = [...tracks]
      this.currentIndex = Math.max(0, Math.min(startIndex, tracks.length - 1))
    }
  }

  getCurrentTrack(): Track | null {
    if (this.currentIndex >= 0 && this.currentIndex < this.currentQueue.length) {
      return this.currentQueue[this.currentIndex]
    }
    return null
  }

  getQueue(): Track[] {
    return [...this.currentQueue]
  }

  getCurrentIndex(): number {
    return this.currentIndex
  }

  next(): Track | null {
    if (this.currentQueue.length === 0) return null

    if (this.repeatMode === 'one') {
      return this.getCurrentTrack()
    }

    if (this.currentIndex < this.currentQueue.length - 1) {
      this.currentIndex++
      return this.getCurrentTrack()
    }

    if (this.repeatMode === 'all') {
      this.currentIndex = 0
      return this.getCurrentTrack()
    }

    return null
  }

  previous(): Track | null {
    if (this.currentQueue.length === 0) return null

    if (this.currentIndex > 0) {
      this.currentIndex--
      return this.getCurrentTrack()
    }

    if (this.repeatMode === 'all') {
      this.currentIndex = this.currentQueue.length - 1
      return this.getCurrentTrack()
    }

    return this.getCurrentTrack()
  }

  addNext(track: Track): void {
    const insertIndex = this.currentIndex + 1
    this.currentQueue.splice(insertIndex, 0, track)
    this.originalQueue.push(track)
  }

  addToEnd(track: Track): void {
    this.currentQueue.push(track)
    this.originalQueue.push(track)
  }

  removeAt(index: number): void {
    if (index < 0 || index >= this.currentQueue.length) return
    const removedTrack = this.currentQueue[index]
    this.currentQueue.splice(index, 1)

    const origIdx = this.originalQueue.findIndex(t => t.id === removedTrack.id)
    if (origIdx !== -1) {
      this.originalQueue.splice(origIdx, 1)
    }

    if (index < this.currentIndex) {
      this.currentIndex--
    } else if (index === this.currentIndex && this.currentIndex >= this.currentQueue.length) {
      this.currentIndex = Math.max(0, this.currentQueue.length - 1)
    }
  }

  toggleShuffle(): boolean {
    this.isShuffled = !this.isShuffled
    const currentTrack = this.getCurrentTrack()

    if (this.isShuffled) {
      this.currentQueue = this.shuffleArray([...this.originalQueue])
      if (currentTrack) {
        const newIdx = this.currentQueue.findIndex(t => t.id === currentTrack.id)
        if (newIdx !== -1) {
          // Keep current track at active index
          const [item] = this.currentQueue.splice(newIdx, 1)
          this.currentQueue.unshift(item)
          this.currentIndex = 0
        }
      }
    } else {
      this.currentQueue = [...this.originalQueue]
      if (currentTrack) {
        const origIdx = this.currentQueue.findIndex(t => t.id === currentTrack.id)
        this.currentIndex = origIdx !== -1 ? origIdx : 0
      }
    }

    return this.isShuffled
  }

  cycleRepeatMode(): RepeatMode {
    if (this.repeatMode === 'off') {
      this.repeatMode = 'all'
    } else if (this.repeatMode === 'all') {
      this.repeatMode = 'one'
    } else {
      this.repeatMode = 'off'
    }
    return this.repeatMode
  }

  getRepeatMode(): RepeatMode {
    return this.repeatMode
  }

  getIsShuffled(): boolean {
    return this.isShuffled
  }

  private shuffleArray(array: Track[]): Track[] {
    const result = [...array]
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[result[i], result[j]] = [result[j], result[i]]
    }
    return result
  }
}
