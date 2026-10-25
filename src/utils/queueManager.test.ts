import { describe, it, expect, beforeEach } from 'vitest'
import { QueueManager } from './queueManager'
import { VERIFIED_TRACKS } from '../data/verifiedCatalogue'

describe('QueueManager Utility', () => {
  let queueManager: QueueManager
  const sampleTracks = VERIFIED_TRACKS.slice(0, 4)

  beforeEach(() => {
    queueManager = new QueueManager(sampleTracks, 0)
  })

  it('initializes with given tracks and index', () => {
    expect(queueManager.getCurrentTrack()?.id).toBe(sampleTracks[0].id)
    expect(queueManager.getCurrentIndex()).toBe(0)
    expect(queueManager.getQueue().length).toBe(4)
  })

  it('advances through tracks on next()', () => {
    const nextTrack = queueManager.next()
    expect(nextTrack?.id).toBe(sampleTracks[1].id)
    expect(queueManager.getCurrentIndex()).toBe(1)
  })

  it('stops at end of queue when repeat is off', () => {
    queueManager.next() // 1
    queueManager.next() // 2
    queueManager.next() // 3
    const atEnd = queueManager.next() // beyond end
    expect(atEnd).toBeNull()
  })

  it('loops around when repeatMode is "all"', () => {
    queueManager.cycleRepeatMode() // off -> all
    expect(queueManager.getRepeatMode()).toBe('all')

    queueManager.next() // 1
    queueManager.next() // 2
    queueManager.next() // 3
    const looped = queueManager.next()
    expect(looped?.id).toBe(sampleTracks[0].id)
    expect(queueManager.getCurrentIndex()).toBe(0)
  })

  it('repeats same track when repeatMode is "one"', () => {
    queueManager.cycleRepeatMode() // all
    queueManager.cycleRepeatMode() // one
    expect(queueManager.getRepeatMode()).toBe('one')

    const same = queueManager.next()
    expect(same?.id).toBe(sampleTracks[0].id)
  })

  it('adds track to play next', () => {
    const newTrack = VERIFIED_TRACKS[4]
    queueManager.addNext(newTrack)

    const nextTrack = queueManager.next()
    expect(nextTrack?.id).toBe(newTrack.id)
  })

  it('toggles shuffle without losing the currently playing track', () => {
    const activeTrack = queueManager.getCurrentTrack()
    const shuffled = queueManager.toggleShuffle()
    expect(shuffled).toBe(true)
    expect(queueManager.getCurrentTrack()?.id).toBe(activeTrack?.id)
  })
})
