import { describe, it, expect } from 'vitest'
import { validateTrackLicense, formatAttribution } from './licenseValidator'
import { LicenseInfo } from '../types/music'

describe('License Validator Utility', () => {
  it('validates public domain license correctly', () => {
    const license: LicenseInfo = {
      name: 'Public Domain Mark 1.0',
      url: 'https://creativecommons.org/publicdomain/mark/1.0/',
      summary: 'Public Domain Work',
      commercialUseAllowed: true,
      attributionRequired: false,
      attributionText: 'Public domain recording via Internet Archive',
      sourceDomain: 'archive.org',
    }

    const res = validateTrackLicense(license)
    expect(res.isValid).toBe(true)
    expect(res.isPlayable).toBe(true)
    expect(res.licenseType).toBe('public_domain')
  })

  it('validates Creative Commons license with attribution', () => {
    const license: LicenseInfo = {
      name: 'CC BY-SA 4.0',
      url: 'https://creativecommons.org/licenses/by-sa/4.0/',
      summary: 'Attribution-ShareAlike 4.0 International',
      commercialUseAllowed: true,
      attributionRequired: true,
      attributionText: 'Uploaded to Wikimedia Commons by Recording Artist',
      sourceDomain: 'commons.wikimedia.org',
    }

    const res = validateTrackLicense(license)
    expect(res.isValid).toBe(true)
    expect(res.isPlayable).toBe(true)
    expect(res.licenseType).toBe('creative_commons')
  })

  it('rejects unsupported / unverified domains', () => {
    const license: LicenseInfo = {
      name: 'CC BY 4.0',
      url: 'https://example.com',
      summary: 'Unknown',
      commercialUseAllowed: false,
      attributionRequired: true,
      attributionText: '',
      sourceDomain: 'unauthorized-site.com' as any,
    }

    const res = validateTrackLicense(license)
    expect(res.isValid).toBe(false)
    expect(res.isPlayable).toBe(false)
    expect(res.licenseType).toBe('restricted')
    expect(res.warning).toContain('Unverified audio source domain')
  })

  it('formats CC attribution text correctly', () => {
    const license: LicenseInfo = {
      name: 'CC BY 3.0',
      url: 'https://creativecommons.org/licenses/by/3.0/',
      summary: 'Attribution 3.0',
      commercialUseAllowed: true,
      attributionRequired: true,
      attributionText: 'Performed by Traditional Ensemble',
      sourceDomain: 'archive.org',
    }

    const attribution = formatAttribution('Raga Bhairav', 'Pandit Ravi', license, 'https://archive.org/details/raga1')
    expect(attribution).toContain('"Raga Bhairav" by Pandit Ravi')
    expect(attribution).toContain('Performed by Traditional Ensemble')
    expect(attribution).toContain('licensed under CC BY 3.0')
    expect(attribution).toContain('https://archive.org/details/raga1')
  })
})
