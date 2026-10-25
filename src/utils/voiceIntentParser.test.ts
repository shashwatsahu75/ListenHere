import { describe, it, expect } from 'vitest'
import { parseVoiceIntent } from './voiceIntentParser'

describe('Voice Intent Parser', () => {
  it('parses direct playback controls in English', () => {
    expect(parseVoiceIntent('pause').type).toBe('pause')
    expect(parseVoiceIntent('resume the music').type).toBe('resume')
    expect(parseVoiceIntent('next song').type).toBe('next')
    expect(parseVoiceIntent('previous').type).toBe('previous')
    expect(parseVoiceIntent('shuffle').type).toBe('shuffle')
    expect(parseVoiceIntent('repeat').type).toBe('repeat')
  })

  it('parses playback commands in Hindi and Hinglish', () => {
    expect(parseVoiceIntent('gana roko').type).toBe('pause')
    expect(parseVoiceIntent('bajao').type).toBe('resume')
    expect(parseVoiceIntent('agla gana').type).toBe('next')
    expect(parseVoiceIntent('pichhla gana').type).toBe('previous')
  })

  it('extracts genre and language intents correctly', () => {
    const res1 = parseVoiceIntent('Play Hindi indie songs')
    expect(res1.type).toBe('play_genre')
    expect(res1.targetGenre).toBe('Indie')
    expect(res1.targetLanguage).toBe('Hindi')

    const res2 = parseVoiceIntent('Find relaxing acoustic music')
    expect(res2.targetGenre).toBe('Acoustic')
    expect(res2.targetMood).toBe('Relaxing')

    const res3 = parseVoiceIntent('Search for Indian classical instrumental music')
    expect(res3.targetGenre).toBe('Classical')
    expect(res3.targetLanguage).toBe('Indian Classical')
  })

  it('handles devotional and spiritual queries', () => {
    const res = parseVoiceIntent('Find devotional music that is legally available to stream')
    expect(res.targetGenre).toBe('Devotional')
    expect(res.confidence).toBeGreaterThan(0.7)
  })

  it('handles free-form track search query', () => {
    const res = parseVoiceIntent('Search for Raga Bhairav morning alap')
    expect(res.type).toBe('search')
    expect(res.query).toContain('raga bhairav')
  })

  it('returns unknown for ambiguous or empty utterances', () => {
    const res = parseVoiceIntent('xyz abcd 123')
    expect(res.confidence).toBeLessThan(0.5)
  })
})
