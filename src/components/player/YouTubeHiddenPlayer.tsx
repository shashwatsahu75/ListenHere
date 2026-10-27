import React, { useEffect } from 'react'
import { youtubeController } from '../../services/youtubePlayer'


export const YouTubeHiddenPlayer: React.FC = () => {
  

  useEffect(() => {
    youtubeController.init(
      'yt-hidden-player-iframe',
      () => {},
      () => {}
    )

    return () => {
      youtubeController.destroy()
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        width: '200px',
        height: '200px',
        opacity: 0.001,
        pointerEvents: 'none',
        zIndex: -1,
      }}
    >
      <div id="yt-hidden-player-iframe" />
    </div>
  )
}
