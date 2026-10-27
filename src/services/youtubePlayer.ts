/**
 * YouTube IFrame Player API Bridge
 * Enables pauseVideo, playVideo, seekTo, setVolume across the app
 */

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void
    YT?: any
  }
}


let apiLoadPromise: Promise<void> | null = null

export function loadYouTubeIframeAPI(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.YT && window.YT.Player) return Promise.resolve()

  if (apiLoadPromise) return apiLoadPromise

  apiLoadPromise = new Promise(resolve => {
    const existing = document.querySelector('script[src*="youtube.com/iframe_api"]')
    if (existing) {
      if (window.YT && window.YT.Player) {
        resolve()
      } else {
        const prev = window.onYouTubeIframeAPIReady
        window.onYouTubeIframeAPIReady = () => {
          if (prev) prev()
          resolve()
        }
      }
      return
    }

    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag)

    window.onYouTubeIframeAPIReady = () => {
      
      resolve()
    }
  })

  return apiLoadPromise
}

class YouTubeController {
  private player: any = null
  private pendingVideoId: string | null = null
  
  private onStateChangeCallback: ((isPlaying: boolean) => void) | null = null
  private onTimeUpdateCallback: ((time: number, duration: number) => void) | null = null
  private pollInterval: any = null

  async init(containerId: string, onStateChange?: (isPlaying: boolean) => void, onTimeUpdate?: (time: number, duration: number) => void) {
    await loadYouTubeIframeAPI()

    this.onStateChangeCallback = onStateChange || null
    this.onTimeUpdateCallback = onTimeUpdate || null

    if (this.player) {
      try {
        this.player.destroy()
      } catch {}
      this.player = null
    }

    return new Promise<void>(resolve => {
      this.player = new window.YT.Player(containerId, {
        height: '100%',
        width: '100%',
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          modestbranding: 1,
          origin: typeof window !== 'undefined' ? window.location.origin : '',
        },
        events: {
          onReady: () => {
            this.startPolling()
            if (this.pendingVideoId) {
              this.player.loadVideoById(this.pendingVideoId)
              this.pendingVideoId = null
            }
            resolve()
          },
          onStateChange: (event: any) => {
            // YT.PlayerState.PLAYING = 1, PAUSED = 2, ENDED = 0
            if (event.data === 1) {
              this.onStateChangeCallback?.(true)
            } else if (event.data === 2 || event.data === 0) {
              this.onStateChangeCallback?.(false)
            }
          },
        },
      })
    })
  }

  loadVideo(videoId: string) {
    this.pendingVideoId = videoId
    if (this.player && typeof this.player.loadVideoById === 'function') {
      this.player.loadVideoById(videoId)
      this.pendingVideoId = null
    }
  }

  play() {
    if (this.player && typeof this.player.playVideo === 'function') {
      this.player.playVideo()
      this.onStateChangeCallback?.(true)
    }
  }

  pause() {
    if (this.player && typeof this.player.pauseVideo === 'function') {
      this.player.pauseVideo()
      this.onStateChangeCallback?.(false)
    }
  }

  seekTo(seconds: number) {
    if (this.player && typeof this.player.seekTo === 'function') {
      this.player.seekTo(seconds, true)
    }
  }

  setVolume(volPercent: number) {
    if (this.player && typeof this.player.setVolume === 'function') {
      this.player.setVolume(volPercent * 100)
    }
  }

  mute() {
    if (this.player && typeof this.player.mute === 'function') {
      this.player.mute()
    }
  }

  unMute() {
    if (this.player && typeof this.player.unMute === 'function') {
      this.player.unMute()
    }
  }

  private startPolling() {
    if (this.pollInterval) clearInterval(this.pollInterval)
    this.pollInterval = setInterval(() => {
      if (this.player && typeof this.player.getCurrentTime === 'function') {
        const cur = this.player.getCurrentTime() || 0
        const dur = this.player.getDuration() || 0
        if (dur > 0) {
          this.onTimeUpdateCallback?.(cur, dur)
        }
      }
    }, 500)
  }

  destroy() {
    if (this.pollInterval) clearInterval(this.pollInterval)
    this.pendingVideoId = null
    if (this.player) {
      try {
        this.player.destroy()
      } catch {}
      this.player = null
    }
  }
}

export const youtubeController = new YouTubeController()
