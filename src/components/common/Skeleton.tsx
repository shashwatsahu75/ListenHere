import React from 'react'

export interface SkeletonProps {
  width?: string | number
  height?: string | number
  borderRadius?: string
  style?: React.CSSProperties
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  borderRadius = 'var(--radius-sm)',
  style,
}) => {
  return (
    <div
      aria-hidden="true"
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: 'var(--color-bg-card)',
        backgroundImage: 'linear-gradient(90deg, var(--color-bg-card) 0%, var(--color-bg-highlight) 50%, var(--color-bg-card) 100%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-shimmer 1.5s infinite linear',
        ...style,
      }}
    />
  )
}

export const TrackCardSkeleton: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Skeleton height="180px" borderRadius="var(--radius-md)" style={{ marginBottom: '12px' }} />
      <Skeleton width="75%" height="18px" style={{ marginBottom: '8px' }} />
      <Skeleton width="45%" height="14px" style={{ marginBottom: '12px' }} />
      <div style={{ display: 'flex', gap: '6px', marginTop: 'auto' }}>
        <Skeleton width="50px" height="20px" borderRadius="var(--radius-full)" />
        <Skeleton width="50px" height="20px" borderRadius="var(--radius-full)" />
      </div>
    </div>
  )
}
