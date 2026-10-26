import React, { useEffect, useRef } from 'react'
import { CanvasAudioVisualizer } from '../../utils/visualizer'

interface AudioVisualizerProps {
  isPlaying: boolean
  accentColor?: string
  barCount?: number
  height?: number
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isPlaying,
  accentColor = '#10b981',
  barCount = 28,
  height = 48,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const visualizerRef = useRef<CanvasAudioVisualizer | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    canvas.width = canvas.parentElement?.clientWidth || 300
    canvas.height = height

    const visualizer = new CanvasAudioVisualizer(canvas, {
      barCount,
      accentColor,
      gap: 3,
    })

    visualizerRef.current = visualizer
    visualizer.start(isPlaying)

    return () => {
      visualizer.stop()
    }
  }, [barCount, height])

  useEffect(() => {
    if (visualizerRef.current) {
      visualizerRef.current.setAccentColor(accentColor)
      visualizerRef.current.start(isPlaying)
    }
  }, [isPlaying, accentColor])

  return (
    <div
      style={{
        width: '100%',
        height: `${height}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ width: '100%', height: `${height}px`, display: 'block' }}
      />
    </div>
  )
}
