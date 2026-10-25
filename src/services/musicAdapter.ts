import type { Track, MusicProvider } from '../types/music'
import { VERIFIED_TRACKS } from '../data/verifiedCatalogue'
import { validateTrackLicense } from '../utils/licenseValidator'

export interface MusicSearchQuery {
  term?: string
  language?: string
  genre?: string
  mood?: string
  tag?: string
}

export class ArchiveMusicAdapter implements MusicProvider {
  id = 'archive-org-adapter'
  name = 'Internet Archive & Wikimedia Commons Legal Audio'
  description = 'Direct playback adapter for legally cleared open audio archives'

  private tracks: Track[]

  constructor(customCatalogue?: Track[]) {
    this.tracks = customCatalogue || VERIFIED_TRACKS
  }

  async getTracks(): Promise<Track[]> {
    return this.tracks.filter(t => {
      const licenseCheck = validateTrackLicense(t.license)
      return licenseCheck.isPlayable && t.isVerifiedPlayable
    })
  }

  async getTrackById(id: string): Promise<Track | null> {
    const track = this.tracks.find(t => t.id === id)
    if (!track) return null

    const check = validateTrackLicense(track.license)
    if (!check.isPlayable) return null

    return track
  }

  async search(query: MusicSearchQuery): Promise<Track[]> {
    const playable = await this.getTracks()

    return playable.filter(track => {
      if (query.term) {
        const cleanTerm = query.term.toLowerCase().trim()
        const matchTitle = track.title.toLowerCase().includes(cleanTerm)
        const matchArtist = track.artist.toLowerCase().includes(cleanTerm)
        const matchAlbum = track.album ? track.album.toLowerCase().includes(cleanTerm) : false
        const matchTag = track.tags.some(tag => tag.toLowerCase().includes(cleanTerm))

        if (!matchTitle && !matchArtist && !matchAlbum && !matchTag) {
          return false
        }
      }

      if (query.language && query.language !== 'All') {
        if (track.language.toLowerCase() !== query.language.toLowerCase()) {
          return false
        }
      }

      if (query.genre && query.genre !== 'All') {
        if (track.genre.toLowerCase() !== query.genre.toLowerCase()) {
          return false
        }
      }

      if (query.mood && query.mood !== 'All') {
        if (track.mood.toLowerCase() !== query.mood.toLowerCase()) {
          return false
        }
      }

      if (query.tag) {
        const lowerTag = query.tag.toLowerCase()
        if (!track.tags.some(t => t.toLowerCase() === lowerTag)) {
          return false
        }
      }

      return true
    })
  }

  async getCuratedShelves(): Promise<{ id: string; title: string; subtitle: string; tracks: Track[] }[]> {
    const all = await this.getTracks()

    return [
      {
        id: 'hindi-indie',
        title: 'Hindi Indie & Acoustic',
        subtitle: 'Authentic indie expressions & monsoon melodies',
        tracks: all.filter(t => t.language === 'Hindi' || t.genre === 'Indie' || t.genre === 'Acoustic'),
      },
      {
        id: 'indian-classical',
        title: 'Indian Classical Heritage',
        subtitle: 'Time-honored morning ragas, sitar, sarod, and bansuri',
        tracks: all.filter(t => t.genre === 'Classical' || t.language === 'Indian Classical'),
      },
      {
        id: 'relax-focus',
        title: 'Relax & Focus Drones',
        subtitle: 'Lo-Fi beats, bamboo flute, and meditative solo instruments',
        tracks: all.filter(t => t.mood === 'Relaxing' || t.mood === 'Focus' || t.genre === 'Lo-Fi'),
      },
      {
        id: 'devotional-sufi',
        title: 'Devotional & Sufi Harmonies',
        subtitle: 'Sacred chants, Kashi invocations, and Baul folk rhythms',
        tracks: all.filter(t => t.genre === 'Devotional' || t.genre === 'Sufi' || t.genre === 'Folk'),
      },
    ]
  }
}

export const defaultMusicAdapter = new ArchiveMusicAdapter()
