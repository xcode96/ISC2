'use client'

import { useState, useEffect } from 'react'
import ProgressDashboard from '@/components/ProgressDashboard'
import Link from 'next/link'
import './progress.css'

export default function ProgressPage() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show scroll to top button with debouncing for performance
      const shouldShow = window.scrollY > 300
      if (shouldShow !== showScrollTop) {
        setShowScrollTop(shouldShow)
      }
    }

    // Add passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check initial position

    return () => window.removeEventListener('scroll', handleScroll)
  }, [showScrollTop])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="progress-page-container">
      {/* Simple static gradient background */}
      <div className="gradient-background" />
      
      {/* Content - no animations */}
      <div className="progress-content-wrapper">
        <div className="progress-content-inner">
          <Link href="/" className="back-button-progress">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span>Back to Home</span>
          </Link>
          
          <div className="progress-main-content">
            <ProgressDashboard />
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="scroll-to-top visible"
          aria-label="Scroll to top"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  )
}
