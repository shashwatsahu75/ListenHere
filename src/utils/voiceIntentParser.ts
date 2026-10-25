import { VoiceIntent, Genre, Language, Mood } from '../types/music'

const GENRE_MAP: Record<string, Genre> = {
  'indie': 'Indie',
  'acoustic': 'Acoustic',
  'classical': 'Classical',
  'shastriya': 'Classical',
  'folk': 'Folk',
  'lok geet': 'Folk',
  'lofi': 'Lo-Fi',
  'lo-fi': 'Lo-Fi',
  'chillhop': 'Lo-Fi',
  'devotional': 'Devotional',
  'bhajan': 'Devotional',
  'aarti': 'Devotional',
  'stotram': 'Devotional',
  'ambient': 'Ambient',
  'fusion': 'Fusion',
  'sufi': 'Sufi',
  'qawwali': 'Sufi',
  'instrumental': 'Instrumental',
}

const LANGUAGE_MAP: Record<string, Language> = {
  'hindi': 'Hindi',
  'hindustani': 'Hindi',
  'sanskrit': 'Sanskrit',
  'bengali': 'Bengali',
  'bangla': 'Bengali',
  'punjabi': 'Punjabi',
  'tamil': 'Tamil',
  'telugu': 'Telugu',
  'classical': 'Indian Classical',
  'indian classical': 'Indian Classical',
}

const MOOD_MAP: Record<string, Mood> = {
  'relaxing': 'Relaxing',
  'relax': 'Relaxing',
  'shant': 'Relaxing',
  'peaceful': 'Peaceful',
  'sukoon': 'Peaceful',
  'focus': 'Focus',
  'study': 'Focus',
  'dhyan': 'Focus',
  'meditative': 'Meditative',
  'meditation': 'Meditative',
  'soulful': 'Soulful',
  'dil se': 'Soulful',
  'upbeat': 'Upbeat',
  'energetic': 'Upbeat',
  'josh': 'Upbeat',
}

/**
 * Natural Language and Speech Intent Parser:
 * Supports English, Hindi transliteration, and Hinglish.
 * Maps spoken utterances to structured player actions and music queries.
 */
export function parseVoiceIntent(transcript: string, langCode: string = 'en-US'): VoiceIntent {
  const clean = transcript.trim().toLowerCase()

  // 1. Immediate Playback Controls
  if (/^(pause|stop|ruko|rok do|gana roko|pause the music|pause music)$/i.test(clean)) {
    return {
      type: 'pause',
      confidence: 0.98,
      rawTranscript: transcript,
      detectedLangCode: langCode,
    }
  }

  if (/^(play|resume|chalao|bajao|shuru karo|continue|resume the music|play music)$/i.test(clean)) {
    return {
      type: 'resume',
      confidence: 0.98,
      rawTranscript: transcript,
      detectedLangCode: langCode,
    }
  }

  if (/^(next|next song|play next|agla gana|agla track|skip|aage badho)$/i.test(clean)) {
    return {
      type: 'next',
      confidence: 0.95,
      rawTranscript: transcript,
      detectedLangCode: langCode,
    }
  }

  if (/^(previous|prev|previous song|pichhla gana|back)$/i.test(clean)) {
    return {
      type: 'previous',
      confidence: 0.95,
      rawTranscript: transcript,
      detectedLangCode: langCode,
    }
  }

  if (/^(shuffle|shuffle playlist|shuffle music|mix karo)$/i.test(clean)) {
    return {
      type: 'shuffle',
      confidence: 0.9,
      rawTranscript: transcript,
      detectedLangCode: langCode,
    }
  }

  if (/^(repeat|loop|dohrao|bar bar bajao)$/i.test(clean)) {
    return {
      type: 'repeat',
      confidence: 0.9,
      rawTranscript: transcript,
      detectedLangCode: langCode,
    }
  }

  // 2. Extracted Target Attributes (Genre, Language, Mood)
  let foundGenre: Genre | undefined
  for (const [key, value] of Object.entries(GENRE_MAP)) {
    if (new RegExp(`\\b${key}\\b`, 'i').test(clean)) {
      foundGenre = value
      break
    }
  }

  let foundLanguage: Language | undefined
  for (const [key, value] of Object.entries(LANGUAGE_MAP)) {
    if (new RegExp(`\\b${key}\\b`, 'i').test(clean)) {
      foundLanguage = value
      break
    }
  }

  let foundMood: Mood | undefined
  for (const [key, value] of Object.entries(MOOD_MAP)) {
    if (new RegExp(`\\b${key}\\b`, 'i').test(clean)) {
      foundMood = value
      break
    }
  }

  // 3. Play or Search specific commands
  const isPlayCommand = /^(play|chalao|bajao|suno|listen to)\b/i.test(clean)
  const isSearchCommand = /^(search|find|dhoondo|khojo|show me|look for)\b/i.test(clean)

  // Strip prefixes to get search query
  let queryText = clean
    .replace(/^(play|search for|search|find me|find|chalao|bajao|dhoondo|khojo|show me|suno)\s+/i, '')
    .replace(/\s+(songs?|music|tracks?|gaane?|gana)$/i, '')
    .trim()

  if (foundGenre && (isPlayCommand || !isSearchCommand)) {
    return {
      type: 'play_genre',
      targetGenre: foundGenre,
      targetLanguage: foundLanguage,
      targetMood: foundMood,
      query: queryText || foundGenre,
      confidence: 0.9,
      rawTranscript: transcript,
      detectedLangCode: langCode,
    }
  }

  if (foundLanguage && !foundGenre && (isPlayCommand || !isSearchCommand)) {
    return {
      type: 'play_language',
      targetLanguage: foundLanguage,
      targetMood: foundMood,
      query: queryText || foundLanguage,
      confidence: 0.88,
      rawTranscript: transcript,
      detectedLangCode: langCode,
    }
  }

  if (foundMood && !foundGenre && !foundLanguage) {
    return {
      type: 'play_mood',
      targetMood: foundMood,
      query: queryText || foundMood,
      confidence: 0.85,
      rawTranscript: transcript,
      detectedLangCode: langCode,
    }
  }

  if (queryText.length > 0) {
    const hasIntentKeyword = isPlayCommand || isSearchCommand || Boolean(foundGenre || foundLanguage || foundMood)
    return {
      type: isPlayCommand ? 'play_track' : 'search',
      query: queryText,
      targetGenre: foundGenre,
      targetLanguage: foundLanguage,
      targetMood: foundMood,
      confidence: hasIntentKeyword ? 0.85 : 0.45,
      rawTranscript: transcript,
      detectedLangCode: langCode,
    }
  }

  return {
    type: 'unknown',
    query: clean,
    confidence: 0.1,
    rawTranscript: transcript,
    detectedLangCode: langCode,
  }
}
