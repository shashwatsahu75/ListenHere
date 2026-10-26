import React from 'react'
import { ShieldCheck, FileCheck, AlertTriangle, ExternalLink, Scale, CheckCircle2 } from 'lucide-react'
import { VERIFIED_TRACKS } from '../../data/verifiedCatalogue'
import { formatAttribution } from '../../utils/licenseValidator'

export const LicensesView: React.FC = () => {
  return (
    <div style={{ padding: '24px 32px 120px 32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Page Title */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <ShieldCheck size={28} color="var(--color-accent)" />
          <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Licensing & Ethical Music Architecture
          </h2>
        </div>
        <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          ListenHere is committed to uncompromising copyright integrity. Every audio file playable on this platform is verified to have an explicit open license or is in the worldwide public domain.
        </p>
      </div>

      {/* Core Principles Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
          marginBottom: '40px',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <CheckCircle2 size={22} color="var(--color-accent)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Authorized Audio Only</h3>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            We only index recordings from reputable archives such as Internet Archive and Wikimedia Commons where digital files and licenses are explicitly documented and verified.
          </p>
        </div>

        <div
          style={{
            backgroundColor: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <AlertTriangle size={22} color="#f59e0b" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>No Commercial Bollywood Scraping</h3>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            We strictly refuse to scrape, rehost, or proxy proprietary commercial Hindi film music from YouTube, Spotify, Apple Music, or pirate sources. We believe in respecting artists' intellectual property.
          </p>
        </div>

        <div
          style={{
            backgroundColor: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <Scale size={22} color="#6366f1" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Transparent Attribution</h3>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            Creative Commons rules require clear attribution. We provide direct access to the performer, recorder, license deed, and host archive on every track card.
          </p>
        </div>
      </div>

      {/* Complete Verified Catalogue Registry */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <FileCheck size={20} color="var(--color-accent)" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            Active Playable Catalogue Registry ({VERIFIED_TRACKS.length} items)
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {VERIFIED_TRACKS.map(track => {
            const attribution = formatAttribution(track.title, track.artist, track.license, track.sourceUrl)
            return (
              <div
                key={track.id}
                style={{
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{track.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                      Artist / Group: {track.artist}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: 'var(--color-bg-card)',
                        color: 'var(--color-accent)',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      {track.license.name}
                    </span>
                    <a
                      href={track.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem',
                        color: 'var(--color-text-secondary)',
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--color-bg-card)',
                      }}
                    >
                      Archive URL <ExternalLink size={12} />
                    </a>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--color-bg-card)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                    border: '1px dashed var(--color-border)',
                  }}
                >
                  <strong style={{ color: 'var(--color-text-secondary)' }}>Attribution Notice: </strong>
                  {attribution}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
