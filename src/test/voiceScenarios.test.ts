import { describe, it, expect } from 'vitest'
import { parseVoiceIntent } from '../utils/voiceIntentParser'

describe('Voice Control End-to-End Intents', () => {
  it('correctly maps Hindi phrase "Hindi indie chalao" to play_genre', () => {
    const res = parseVoiceIntent('Hindi indie chalao', 'hi-IN')
    expect(res.type).toBe('play_genre')
    expect(res.targetGenre).toBe('Indie')
    expect(res.targetLanguage).toBe('Hindi')
  })

  it('correctly maps Hinglish "thoda classical bajao"', () => {
    const res = parseVoiceIntent('thoda classical bajao', 'hi-IN')
    expect(res.type).toBe('play_genre')
    expect(res.targetGenre).toBe('Classical')
  })

  it('correctly maps "agla gana" to next intent', () => {
    const res = parseVoiceIntent('agla gana')
    expect(res.type).toBe('next')
  })

  it('correctly maps "rok do" to pause intent', () => {
    const res = parseVoiceIntent('rok do')
    expect(res.type).toBe('pause')
  })

  it('correctly maps "relaxing lo-fi beats chalao"', () => {
    const res = parseVoiceIntent('relaxing lo-fi beats chalao')
    expect(res.targetGenre).toBe('Lo-Fi')
    expect(res.targetMood).toBe('Relaxing')
  })
})
