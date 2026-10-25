import React, { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, AlertCircle, Sparkles } from 'lucide-react'
import type { VoiceIntent } from '../../types/music'
import { parseVoiceIntent } from '../../utils/voiceIntentParser'
import { usePlayer } from '../../context/PlayerContext'
import { defaultMusicAdapter } from '../../services/musicAdapter'

interface VoiceSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSearchResults?: (query: string) => void
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({
  isOpen,
  onClose,
  onSearchResults,
}) => {
  const { playTrack, togglePlayPause, playNext, playPrevious, toggleShuffle, cycleRepeatMode } = usePlayer()

  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [language, setLanguage] = useState<'en-US' | 'hi-IN'>('en-US')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [intent, setIntent] = useState<VoiceIntent | null>(null)
  const [actionFeedback, setActionFeedback] = useState<string | null>(null)

  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Check SpeechRecognition browser API support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      setErrorMessage(
        'Web Speech API is not supported in this browser. You can still use the text search bar.'
      )
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = language

    recognition.onstart = () => {
      setIsListening(true)
      setErrorMessage(null)
      setActionFeedback(null)
    }

    recognition.onresult = (event: any) => {
      let currentTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript
      }
      setTranscript(currentTranscript)

      // Parse current intent in real-time
      if (currentTranscript.trim()) {
        const parsed = parseVoiceIntent(currentTranscript, language)
        setIntent(parsed)
      }
    }

    recognition.onerror = (event: any) => {
      console.warn('[Voice Search] Error:', event.error)
      setIsListening(false)
      if (event.error === 'not-allowed') {
        setErrorMessage(
          'Microphone permission was denied. Please allow microphone access in your browser settings to use voice search.'
        )
      } else {
        setErrorMessage(`Voice recognition failed (${event.error}). Please try again.`)
      }
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition

    return () => {
      recognition.abort()
    }
  }, [language])

  if (!isOpen) return null

  const startListening = () => {
    setTranscript('')
    setIntent(null)
    setErrorMessage(null)
    setActionFeedback(null)

    try {
      recognitionRef.current?.start()
    } catch (err) {
      console.warn('SpeechRecognition start error:', err)
      recognitionRef.current?.stop()
      setTimeout(() => recognitionRef.current?.start(), 100)
    }
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }

  const handleExecuteIntent = async () => {
    if (!intent) return

    switch (intent.type) {
      case 'pause':
      case 'resume':
        togglePlayPause()
        setActionFeedback('Command executed: Toggle playback.')
        setTimeout(onClose, 1200)
        break

      case 'next':
        playNext()
        setActionFeedback('Command executed: Skipping to next track.')
        setTimeout(onClose, 1200)
        break

      case 'previous':
        playPrevious()
        setActionFeedback('Command executed: Returning to previous track.')
        setTimeout(onClose, 1200)
        break

      case 'shuffle':
        toggleShuffle()
        setActionFeedback('Command executed: Toggled shuffle.')
        setTimeout(onClose, 1200)
        break

      case 'repeat':
        cycleRepeatMode()
        setActionFeedback('Command executed: Updated repeat mode.')
        setTimeout(onClose, 1200)
        break

      case 'play_genre':
      case 'play_language':
      case 'play_mood':
      case 'play_track': {
        const results = await defaultMusicAdapter.search({
          term: intent.query,
          genre: intent.targetGenre,
          language: intent.targetLanguage,
          mood: intent.targetMood,
        })

        if (results.length > 0) {
          playTrack(results[0], results)
          setActionFeedback(`Playing "${results[0].title}" by ${results[0].artist}`)
          setTimeout(onClose, 1400)
        } else {
          setActionFeedback('No matching verified track found. Searching catalogue...')
          if (onSearchResults && intent.query) {
            onSearchResults(intent.query)
            setTimeout(onClose, 1000)
          }
        }
        break
      }

      case 'search':
      default:
        if (onSearchResults && (intent.query || transcript)) {
          onSearchResults(intent.query || transcript)
          onClose()
        }
        break
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '480px',
          padding: '28px',
          textAlign: 'center',
          boxShadow: '0 20px 30px rgba(0, 0, 0, 0.6)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--color-accent)" />
            <h3 id="voice-modal-title" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              Voice Music Search
            </h3>
          </div>

          {/* Language Toggle */}
          <div style={{ display: 'flex', gap: '6px', backgroundColor: 'var(--color-bg-card)', padding: '2px', borderRadius: 'var(--radius-full)' }}>
            <button
              onClick={() => setLanguage('en-US')}
              style={{
                padding: '4px 10px',
                fontSize: '0.75rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                backgroundColor: language === 'en-US' ? 'var(--color-accent)' : 'transparent',
                color: language === 'en-US' ? '#ffffff' : 'var(--color-text-secondary)',
              }}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi-IN')}
              style={{
                padding: '4px 10px',
                fontSize: '0.75rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                backgroundColor: language === 'hi-IN' ? 'var(--color-accent)' : 'transparent',
                color: language === 'hi-IN' ? '#ffffff' : 'var(--color-text-secondary)',
              }}
            >
              हिन्दी / Hindi
            </button>
          </div>
        </div>

        {/* Microphone Button */}
        <div style={{ margin: '30px 0' }}>
          <button
            onClick={isListening ? stopListening : startListening}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
            style={{
              width: '88px',
              height: '88px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: isListening ? '#ef4444' : 'var(--color-accent)',
              color: '#ffffff',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isListening ? '0 0 25px rgba(239, 68, 68, 0.5)' : '0 8px 24px var(--color-accent-glow)',
              transition: 'transform 0.15s ease, background-color 0.2s ease',
            }}
          >
            {isListening ? <Mic size={36} /> : <MicOff size={36} />}
          </button>
          <p style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
            {isListening ? 'Listening... Speak now' : 'Click microphone to speak'}
          </p>
        </div>

        {/* Transcript or Instructions */}
        <div
          style={{
            minHeight: '64px',
            padding: '12px',
            backgroundColor: 'var(--color-bg-card)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px',
            fontSize: '0.95rem',
            fontStyle: transcript ? 'normal' : 'italic',
            color: transcript ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
            lineHeight: 1.4,
          }}
        >
          {transcript || 'e.g., "Play Hindi indie songs" or "Pause the music"'}
        </div>

        {/* Detected Intent feedback */}
        {intent && intent.type !== 'unknown' && (
          <div
            style={{
              marginBottom: '16px',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-accent-glow)',
              color: 'var(--color-accent)',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}
          >
            Intent Detected: {intent.type} {intent.targetGenre ? `(${intent.targetGenre})` : ''}
          </div>
        )}

        {actionFeedback && (
          <div style={{ color: 'var(--color-accent)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '16px' }}>
            {actionFeedback}
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              padding: '10px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem',
              textAlign: 'left',
              marginBottom: '16px',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-bg-card)',
              color: 'var(--color-text-secondary)',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleExecuteIntent}
            disabled={!transcript.trim()}
            style={{
              padding: '8px 20px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: transcript.trim() ? 'var(--color-accent)' : 'var(--color-border)',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: transcript.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            Execute Command
          </button>
        </div>
      </div>
    </div>
  )
}
