import { describe, it, expect } from 'vitest'
import { VERIFIED_TRACKS } from './verifiedCatalogue'
import { validateTrackLicense } from '../utils/licenseValidator'

describe('Verified Music Catalogue', () => {
  it('contains valid tracks with required metadata', () => {
    expect(VERIFIED_TRACKS.length).toBeGreaterThanOrEqual(10)

    for (const track of VERIFIED_TRACKS) {
      expect(track.id).toBeTruthy()
      expect(track.title).toBeTruthy()
      expect(track.artist).toBeTruthy()
      expect(track.audioUrl).toMatch(/^(\/|https?:\/\/)/)
      expect(track.sourceUrl).toMatch(/^https?:\/\//)
      expect(track.duration).toBeGreaterThan(0)
      expect(track.license).toBeDefined()
    }
  })

  it('all tracks pass the legal license validation', () => {
    for (const track of VERIFIED_TRACKS) {
      const validation = validateTrackLicense(track.license)
      expect(validation.isValid).toBe(true)
      expect(validation.isPlayable).toBe(true)
      expect(track.isVerifiedPlayable).toBe(true)
    }
  })

  it('contains legitimate Hindi and Indian traditional tracks', () => {
    const hindiTracks = VERIFIED_TRACKS.filter(t => t.language === 'Hindi')
    const classicalTracks = VERIFIED_TRACKS.filter(t => t.genre === 'Classical')

    expect(hindiTracks.length).toBeGreaterThanOrEqual(3)
    expect(classicalTracks.length).toBeGreaterThanOrEqual(2)
  })
})
