# ListenHere 🎵

> A premium, responsive, voice-enabled web app focused on discovering and playing legally verified music, with special emphasis on Hindi/Indian independent music, instrumental ragas, acoustic sessions, folk, and meditative audio.

---

## 🌟 Key Features

1. **Voice-Enabled Music Discovery & Control**
   - Natural language voice recognition powered by browser Web Speech API.
   - Dual-language support: **English (`en-US`)** and **हिन्दी / Hindi (`hi-IN`)**.
   - Spoken playback controls: "Play Hindi indie songs", "अगला गाना" (Next song), "गाना रोको" (Pause), "thoda classical bajao".
   - Deterministic offline-first regex intent parser with confidence scoring.

2. **Copyright & Licensing Safeguards**
   - **Zero Commercial Bollywood Scraping**: Strict refusal to rip, proxy, or scrape copyrighted commercial tracks from YouTube, Spotify, or Apple Music.
   - **Verified Open Catalogue**: Curated audio sourced strictly from the **Internet Archive** and **Wikimedia Commons** with verified Public Domain or Creative Commons licenses (CC BY, CC BY-SA, CC0).
   - Transparent attribution modals on every track, showing author, license deeds, and source archive links.

3. **Audio Player**
   - Responsive dark-first theme with optional light mode.
   - Persistent mini-player with live seek scrubbing, responsive timers, volume control, mute, shuffle, and cycle repeat modes.
   - Expanded full-screen **Now Playing** view with backdrop ambient color glow and artwork animations.
   - Slide-out **Queue Drawer** for re-ordering, playing, and removing queued tracks.

4. **Multi-Facet Discovery & Search**
   - Filter by language (Hindi, Indian Classical, Bengali, Punjabi, Sanskrit, Instrumental).
   - Filter by genre (Indie, Classical, Acoustic, Lo-Fi, Devotional, Folk, Sufi).
   - Filter by mood (Relaxing, Focus, Meditative, Soulful, Peaceful, Upbeat).
   - Grid and Table view modes.
   - Curated shelves ("Hindi Indie Finds", "Indian Classical Heritage", "Relax & Focus Drones").

5. **Client-Side Persistence**
   - Liked tracks, custom queues, volume levels, and theme choices are persisted in `localStorage` with corrupted-state recovery.
   - No forced account creation or logins required.

---

## 🏗️ Architecture & Tech Stack

- **Frontend Framework**: React 19 + TypeScript + Vite
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library + jsdom
- **State Management**: React Context (`ThemeContext`, `PlayerContext`) + `QueueManager` OOP model
- **Audio API**: HTML5 `HTMLAudioElement` with user gesture handling and autoplay fallback

---

## 🚀 Getting Started

### 1. Installation

Ensure Node.js 18+ is installed:

\`\`\`bash
npm install
\`\`\`

### 2. Development Server

Start the local development server:

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Running Tests

Run the Vitest automated test suite:

\`\`\`bash
npm run test
\`\`\`

### 4. Production Build

Compile TypeScript and build the production bundle:

\`\`\`bash
npm run build
\`\`\`

Preview production build:

\`\`\`bash
npm run preview
\`\`\`

---

## ⚖️ Music Rights & Licensing Statement

All tracks in ListenHere are catalogued with exact attribution to respect original artists:

| Track Title | Artist / Preservation Archive | License | Source Domain |
| :--- | :--- | :--- | :--- |
| **Raga Bhairav (Morning Alap)** | All India Radio Archives | Public Domain Mark 1.0 | archive.org |
| **Rimjhim (Hindi Rain Melody)** | Aarav Sharma & Open Indie | CC BY 4.0 | archive.org |
| **Raga Darbari Kanada** | Ustad Ali Akbar Khan disciples | Public Domain Mark 1.0 | archive.org |
| **O Mon Re (Baul Ektara)** | Nadia Baul Sampradaya | CC BY-SA 4.0 | commons.wikimedia.org |
| **Chai Aur Shaam (Lo-Fi Hindi)** | Desi Chillhop Lab | CC0 1.0 Universal | archive.org |
| **Shiva Tandava Stotram** | Varanasi Vedic Collective | Public Domain Mark 1.0 | archive.org |
| **Vrindavan Bansuri** | Pt. Hari Shankar Flute Trio | CC BY 3.0 | archive.org |
| **Duma Dum Mast Qalandar** | Sufi Soul Travelers | CC BY-SA 3.0 | archive.org |
| **Rahi Ke Kadam (Acoustic)** | Kabir & Mountain Echo | CC BY 4.0 | archive.org |
| **Teental Drut Laya (Tabla)** | Banaras Gharana Legacy | Public Domain Mark 1.0 | archive.org |

*(If external network issues interrupt playback for any archive file, ListenHere handles the error gracefully and displays a friendly notice.)*

---

## 📜 Code License

The codebase of ListenHere is licensed under the MIT License. Music recordings and media assets are governed separately by their respective Creative Commons and Public Domain licenses as documented above.
