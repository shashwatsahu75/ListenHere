export interface AudioVisualizerOptions {
  barCount?: number
  accentColor?: string
  gap?: number
}

/**
 * Animated Canvas Audio Visualizer
 * Renders smooth animated reactive frequency bars when track is playing
 */
export class CanvasAudioVisualizer {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D | null
  private animationId: number | null = null
  private barCount: number
  private accentColor: string
  private gap: number
  private heights: number[] = []

  constructor(canvas: HTMLCanvasElement, options?: AudioVisualizerOptions) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.barCount = options?.barCount || 32
    this.accentColor = options?.accentColor || '#10b981'
    this.gap = options?.gap || 3

    for (let i = 0; i < this.barCount; i++) {
      this.heights.push(0.1 + Math.random() * 0.3)
    }
  }

  setAccentColor(color: string) {
    this.accentColor = color
  }

  start(isPlaying: boolean) {
    this.stop()

    const render = () => {
      if (!this.ctx) return
      const { width, height } = this.canvas

      this.ctx.clearRect(0, 0, width, height)

      const totalGapWidth = (this.barCount - 1) * this.gap
      const barWidth = Math.max(2, (width - totalGapWidth) / this.barCount)

      for (let i = 0; i < this.barCount; i++) {
        if (isPlaying) {
          const target = 0.15 + Math.random() * 0.85
          this.heights[i] += (target - this.heights[i]) * 0.15
        } else {
          this.heights[i] += (0.05 - this.heights[i]) * 0.1
        }

        const barHeight = this.heights[i] * height
        const x = i * (barWidth + this.gap)
        const y = height - barHeight

        const gradient = this.ctx.createLinearGradient(0, height, 0, 0)
        gradient.addColorStop(0, this.accentColor)
        gradient.addColorStop(1, '#34d399')

        this.ctx.fillStyle = gradient
        this.ctx.beginPath()
        this.ctx.roundRect ? this.ctx.roundRect(x, y, barWidth, barHeight, [2, 2, 0, 0]) : this.ctx.rect(x, y, barWidth, barHeight)
        this.ctx.fill()
      }

      this.animationId = requestAnimationFrame(render)
    }

    render()
  }

  stop() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }
}
