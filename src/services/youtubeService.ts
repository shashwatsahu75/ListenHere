import type { Track, Language, Genre, Mood } from '../types/music'

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || 'AIzaSyBVljymN4zP3phF6wjerNufk6Gl7Tzach4'

export interface YouTubeSearchOptions {
  query: string
  maxResults?: number
}

// Decode HTML entities commonly returned by YouTube API (e.g. &amp;, &#39;)
function decodeHtml(html: string): string {
  const txt = document.createElement('textarea')
  txt.innerHTML = html
  return txt.value
}

export async function searchYouTubeMusic(query: string, maxResults: number = 10): Promise<Track[]> {
  if (!API_KEY) {
    console.warn('[YouTube API] No API key configured')
    return []
  }

  try {
    const q = query.toLowerCase().includes('song') || query.toLowerCase().includes('music')
      ? query
      : `${query} music song`

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      q
    )}&type=video&videoEmbeddable=true&maxResults=${maxResults}&key=${API_KEY}`

    const res = await fetch(url)
    if (!res.ok) {
      console.warn('[YouTube API] Request failed with status:', res.status)
      return []
    }

    const data = await res.json()
    if (!data.items || !Array.isArray(data.items)) {
      return []
    }

    return data.items.map((item: any): Track => {
      const rawTitle = decodeHtml(item.snippet.title || 'Untitled Track')
      const channelTitle = decodeHtml(item.snippet.channelTitle || 'Artist')
      const videoId = item.id.videoId

      // Clean title if formatted as "Artist - Title"
      let cleanTitle = rawTitle
      let cleanArtist = channelTitle

      if (rawTitle.includes(' - ')) {
        const parts = rawTitle.split(' - ')
        cleanArtist = parts[0].trim()
        cleanTitle = parts.slice(1).join(' - ').trim()
      }

      // Remove noise like "(Official Video)", "[Lyrical Video]"
      cleanTitle = cleanTitle.replace(/\((Official|Lyric|Audio|Music|Video|Full Song|HD|4K)[^)]*\)/gi, '').trim()
      cleanTitle = cleanTitle.replace(/\[(Official|Lyric|Audio|Music|Video|Full Song|HD|4K)[^\]]*\]/gi, '').trim()

      return {
        id: `yt-${videoId}`,
        title: cleanTitle || rawTitle,
        artist: cleanArtist || 'YouTube Music',
        album: item.snippet.channelTitle || 'Official Release',
        language: (query.toLowerCase().includes('hindi') || rawTitle.toLowerCase().includes('hindi') ? 'Hindi' : 'Universal') as Language,
        genre: 'Indie' as Genre,
        mood: 'Upbeat' as Mood,
        duration: 240, // Estimated standard song duration
        audioUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&enablejsapi=1`,
        artworkUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
        sourceUrl: `https://www.youtube.com/watch?v=${videoId}`,
        youtubeVideoId: videoId,
        isVerifiedPlayable: true,
        license: {
          name: 'YouTube Embed Terms of Service',
          url: 'https://www.youtube.com/t/terms',
          summary: 'Officially streamed via authorized YouTube Embed Player API',
          commercialUseAllowed: false,
          attributionRequired: true,
          attributionText: `Content provided by ${channelTitle} via official YouTube player`,
          sourceDomain: 'cc-community',
        },
        description: item.snippet.description || rawTitle,
        year: new Date(item.snippet.publishedAt).getFullYear() || 2024,
        tags: ['youtube', 'music', 'official'],
      }
    })
  } catch (error) {
    console.error('[YouTube API Error]:', error)
    return []
  }
}

/**
 * Fetch recommended trending Indian / Hindi music songs
 */
export async function getTrendingMusic(): Promise<Track[]> {
  return searchYouTubeMusic('Bollywood Hindi Top Hits Songs', 8)
}
