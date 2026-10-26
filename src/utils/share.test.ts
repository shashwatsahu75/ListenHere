import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shareTrack } from './share'
import { VERIFIED_TRACKS } from '../data/verifiedCatalogue'

describe('Share Utility', () => {
  const track = VERIFIED_TRACKS[0]

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('calls navigator.share when supported', async () => {
    const mockShare = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'share', {
      value: mockShare,
      configurable: true,
      writable: true,
    })

    const res = await shareTrack(track)
    expect(res).toBe('shared')
    expect(mockShare).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.stringContaining(track.title),
      })
    )
  })

  it('falls back to navigator.clipboard when share is unavailable', async () => {
    Object.defineProperty(navigator, 'share', {
      value: undefined,
      configurable: true,
      writable: true,
    })

    const mockWriteText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      configurable: true,
      writable: true,
    })

    const res = await shareTrack(track)
    expect(res).toBe('copied')
    expect(mockWriteText).toHaveBeenCalledWith(expect.stringContaining(track.title))
  })
})
