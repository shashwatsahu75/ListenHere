import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import App from '../App'

describe('ListenHere Full Application Integration', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.restoreAllMocks()
  })

  it('renders application navigation and discover view on initial load', async () => {
    render(<App />)

    expect(screen.getByText('ListenHere')).toBeInTheDocument()
    expect(screen.getAllByText('Discover')[0]).toBeInTheDocument()
    expect(screen.getByText('Search & Filter')).toBeInTheDocument()
    expect(screen.getByText('Curated Playlists')).toBeInTheDocument()
    expect(screen.getByText('Licenses & Legal')).toBeInTheDocument()

    // Wait for discover view to load
    await waitFor(() => {
      expect(
        screen.queryByText(/Featured Masterpiece/i) ||
        screen.queryByText(/Curated Soundtracks/i) ||
        screen.queryByText(/Speak to Discover/i) ||
        screen.queryByText(/Trending Indian Hits/i) ||
        screen.queryByText(/Hindi Indie/i)
      ).toBeTruthy()
    }, { timeout: 3500 })
  })

  it('navigates to Search & Filter view and performs search', async () => {
    render(<App />)

    // Click on Search navigation tab
    const searchTabs = screen.getAllByText('Search & Filter')
    fireEvent.click(searchTabs[0])

    expect(screen.getByPlaceholderText(/Search by song name/i)).toBeInTheDocument()

    // Type query
    const input = screen.getByPlaceholderText(/Search by song name/i)
    fireEvent.change(input, { target: { value: 'Bhairav' } })

    await waitFor(() => {
      expect(screen.getByText(/Found \d+ verified playable track/i)).toBeInTheDocument()
    }, { timeout: 3500 })
  })

  it('navigates to Legal Licenses view and shows legal registry', () => {
    render(<App />)

    const licenseTabs = screen.getAllByText('Licenses & Legal')
    fireEvent.click(licenseTabs[0])

    expect(screen.getByText(/Licensing & Ethical Music Architecture/i)).toBeInTheDocument()
    expect(screen.getByText(/No Commercial Bollywood Scraping/i)).toBeInTheDocument()
  })

  it('opens and closes the Voice Search modal', () => {
    render(<App />)

    const voiceBtn = screen.getByText('Voice Search')
    fireEvent.click(voiceBtn)

    expect(screen.getByText('Voice Music Search')).toBeInTheDocument()
    expect(screen.getByText('Click microphone to speak')).toBeInTheDocument()

    // Cancel modal
    const cancelBtn = screen.getByText('Cancel')
    fireEvent.click(cancelBtn)

    expect(screen.queryByText('Voice Music Search')).not.toBeInTheDocument()
  })
})
