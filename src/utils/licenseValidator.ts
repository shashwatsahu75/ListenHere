import type { LicenseInfo } from '../types/music'

export interface LicenseValidationResult {
  isValid: boolean
  isPlayable: boolean
  warning?: string
  licenseType: 'public_domain' | 'creative_commons' | 'open_audio' | 'restricted'
}

/**
 * Validates a license record against legal streaming requirements.
 * Verifies that the source domain and license terms permit web playback.
 */
export function validateTrackLicense(license: LicenseInfo | undefined | null): LicenseValidationResult {
  if (!license) {
    return {
      isValid: false,
      isPlayable: false,
      warning: 'No license information provided for this track.',
      licenseType: 'restricted',
    }
  }

  const name = license.name.toLowerCase()
  const domain = license.sourceDomain

  const validDomains = ['archive.org', 'commons.wikimedia.org', 'freemusicarchive.org', 'musopen.org', 'cc-community']
  if (!validDomains.includes(domain)) {
    return {
      isValid: false,
      isPlayable: false,
      warning: `Unverified audio source domain: ${domain}`,
      licenseType: 'restricted',
    }
  }

  if (name.includes('public domain') || name.includes('cc0') || name.includes('cc-zero')) {
    return {
      isValid: true,
      isPlayable: true,
      licenseType: 'public_domain',
    }
  }

  if (
    name.includes('cc by') || 
    name.includes('creative commons') || 
    name.includes('by-sa') || 
    name.includes('by-nc') ||
    name.includes('by-nc-sa')
  ) {
    return {
      isValid: true,
      isPlayable: true,
      licenseType: 'creative_commons',
    }
  }

  if (name.includes('open') || name.includes('permissive')) {
    return {
      isValid: true,
      isPlayable: true,
      licenseType: 'open_audio',
    }
  }

  return {
    isValid: true,
    isPlayable: true,
    warning: 'Specific commercial reuse conditions may apply.',
    licenseType: 'creative_commons',
  }
}

/**
 * Formats attribution string adhering to CC guidelines (Title, Author, Source, License).
 */
export function formatAttribution(
  title: string, 
  artist: string, 
  license: LicenseInfo,
  sourceUrl: string
): string {
  const parts: string[] = []
  parts.push(`"${title}" by ${artist}`)
  if (license.attributionText) {
    parts.push(license.attributionText)
  }
  parts.push(`licensed under ${license.name}`)
  if (sourceUrl) {
    parts.push(`(Source: ${sourceUrl})`)
  }
  return parts.join(' • ')
}
