// Core Domain Types for ListenHere Music Discovery & Player

export type Language = 
  | 'Hindi' 
  | 'Indian Classical' 
  | 'Sanskrit' 
  | 'Punjabi' 
  | 'Bengali' 
  | 'Tamil' 
  | 'Telugu' 
  | 'Instrumental' 
  | 'Universal' 
  | 'English'

export type Genre =
  | 'Indie'
  | 'Classical'
  | 'Folk'
  | 'Lo-Fi'
  | 'Acoustic'
  | 'Devotional'
  | 'Ambient'
  | 'Fusion'
  | 'Sufi'
  | 'Instrumental'

export type Mood = 
  | 'Relaxing' 
  | 'Focus' 
  | 'Upbeat' 
  | 'Meditative' 
  | 'Soulful' 
  | 'Nostalgic' 
  | 'Peaceful'

export interface LicenseInfo {
  name: string
  url: string
  summary: string
  commercialUseAllowed: boolean
  attributionRequired: boolean
  attributionText: string
  sourceDomain: 'archive.org' | 'commons.wikimedia.org' | 'freemusicarchive.org' | 'musopen.org' | 'cc-community'
}

export interface Track {
  id: string
  title: string
  artist: string
  album?: string
  language: Language
  genre: Genre
  mood: Mood
  duration: number // in seconds
  audioUrl: string
  artworkUrl: string
  accentColor?: string
  sourceUrl: string
  license: LicenseInfo
  description?: string
  year?: number
  isVerifiedPlayable: boolean
  tags: string[]
  youtubeVideoId?: string
}

export type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error'

export type RepeatMode = 'off' | 'all' | 'one'

export interface PlaybackState {
  currentTrack: Track | null
  status: PlaybackStatus
  currentTime: number
  duration: number
  volume: number // 0.0 to 1.0
  isMuted: boolean
  playbackRate: number
  repeatMode: RepeatMode
  isShuffled: boolean
  errorMessage: string | null
}

export interface Playlist {
  id: string
  title: string
  description: string
  coverUrl?: string
  trackIds: string[]
  isCustom?: boolean
  createdAt: string
  updatedAt: string
}

export type VoiceIntentType = 
  | 'search'
  | 'play_track'
  | 'play_genre'
  | 'play_language'
  | 'play_mood'
  | 'pause'
  | 'resume'
  | 'next'
  | 'previous'
  | 'set_volume'
  | 'shuffle'
  | 'repeat'
  | 'queue_track'
  | 'show_lyrics_or_credits'
  | 'unknown'

export interface VoiceIntent {
  type: VoiceIntentType
  query?: string
  targetLanguage?: Language
  targetGenre?: Genre
  targetMood?: Mood
  confidence: number // 0.0 to 1.0
  rawTranscript: string
  detectedLangCode: 'en-US' | 'hi-IN' | string
}

export type ActiveTab = 'discover' | 'search' | 'library' | 'playlists' | 'licenses'

export interface MusicProvider {
  id: string
  name: string
  description: string
  getTracks(): Promise<Track[]>
  getTrackById(id: string): Promise<Track | null>
}
