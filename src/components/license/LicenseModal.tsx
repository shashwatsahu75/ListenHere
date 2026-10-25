import React, { useState } from 'react'
import type { Track } from '../../types/music'
import { FileText, ExternalLink, X, ShieldCheck } from 'lucide-react'
import { formatAttribution } from '../../utils/licenseValidator'

interface LicenseModalProps {
  track: Track
  isOpen: boolean
  onClose: () => void
}

export const LicenseModal: React.FC<LicenseModalProps> = ({ track, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const attributionString = formatAttribution(
    track.title,
    track.artist,
    track.license,
    track.sourceUrl
  )

  const handleCopy = () => {
    navigator.clipboard.writeText(attributionString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="license-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
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
          maxWidth: '540px',
          padding: '24px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          color: 'var(--color-text-primary)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={22} color="var(--color-accent)" />
            <h3 id="license-modal-title" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              Track Credits & Licensing
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              color: 'var(--color-text-muted)',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
          <img
            src={track.artworkUrl}
            alt={track.title}
            style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
          />
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{track.title}</h4>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '2px' }}>
              {track.artist}
            </p>
            {track.album && (
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginTop: '2px' }}>
                Album: {track.album} ({track.year || 'Archival'})
              </p>
            )}
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--color-bg-card)',
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px',
            fontSize: '0.875rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>License:</span>
            <span style={{ fontWeight: 600, color: 'var(--color-accent)' }}>{track.license.name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Source Provider:</span>
            <span>{track.license.sourceDomain}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Commercial Streaming:</span>
            <span>{track.license.commercialUseAllowed ? 'Permitted' : 'Non-Commercial Only'}</span>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
              MANDATORY ATTRIBUTION TEXT
            </span>
            <button
              onClick={handleCopy}
              style={{
                fontSize: '0.75rem',
                color: 'var(--color-accent)',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-bg-card)',
              }}
            >
              {copied ? 'Copied!' : 'Copy Attribution'}
            </button>
          </div>
          <div
            style={{
              padding: '10px',
              backgroundColor: 'var(--color-bg-card)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              color: 'var(--color-text-secondary)',
              border: '1px dashed var(--color-border)',
              lineHeight: 1.4,
            }}
          >
            {attributionString}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <a
            href={track.license.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-bg-card)',
              color: 'var(--color-text-primary)',
            }}
          >
            <FileText size={16} /> View License Deed
          </a>
          <a
            href={track.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-accent)',
              color: '#ffffff',
              fontWeight: 600,
            }}
          >
            <ExternalLink size={16} /> Source Archive
          </a>
        </div>
      </div>
    </div>
  )
}
