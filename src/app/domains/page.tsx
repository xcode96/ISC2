'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import './domains.css'
import { CISSP_DOMAINS } from '@/data/domains'

// Add icons to domains
const DOMAIN_ICONS = {
  1: '🛡️',
  2: '🔐',
  3: '🏗️',
  4: '🌐',
  5: '🔑',
  6: '🔍',
  7: '⚙️',
  8: '💻'
}

interface Domain {
  id: number
  domain_number: number
  name: string
  weight_percentage: number
  description?: string
  subdomains?: any[]
  icon?: string
}

export default function DomainsPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredDomain, setHoveredDomain] = useState<number | null>(null)
  const [isMobileView, setIsMobileView] = useState(false)
  const [circleDistance, setCircleDistance] = useState(200)

  useEffect(() => {
    // Check if we should use mobile list view
    const checkMobileView = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      setIsMobileView(width < 480 && height < 700)
      
      // Calculate dynamic circle distance based on viewport
      const viewportMin = Math.min(width, height)
      if (viewportMin < 400) {
        setCircleDistance(viewportMin * 0.35)
      } else if (viewportMin < 600) {
        setCircleDistance(viewportMin * 0.3)
      } else {
        setCircleDistance(200)
      }
    }

    checkMobileView()
    window.addEventListener('resize', checkMobileView)

    // Auto-open the menu after a short delay
    setTimeout(() => setIsOpen(true), 500)

    return () => window.removeEventListener('resize', checkMobileView)
  }, [])

  // Use static domains with icons
  const displayDomains = CISSP_DOMAINS.map(domain => ({
    ...domain,
    icon: DOMAIN_ICONS[domain.domain_number as keyof typeof DOMAIN_ICONS] || '📚'
  }))
  
  // Position mapping: Start from 0° (right) and go clockwise
  const getRotationForDomain = (domainNumber: number) => {
    const positions: { [key: number]: number } = {
      1: 0,    // Right (3 o'clock)
      2: 45,   // Bottom-right
      3: 90,   // Bottom (6 o'clock)
      4: 135,  // Bottom-left
      5: 180,  // Left (9 o'clock)
      6: 225,  // Top-left
      7: 270,  // Top (12 o'clock)
      8: 315,  // Top-right
    }
    return positions[domainNumber] || 0
  }

  // Mobile list view for very small screens
  if (isMobileView) {
    return (
      <div className="domains-container mobile-view">
        {/* Back to Frontpage Button */}
        <Link href="/" className="back-to-home">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span>To Frontpage</span>
        </Link>
        
        {/* Header */}
        <div className="domains-header">
          <h1>CISSP CBK</h1>
          <p>All 8 domains</p>
        </div>

        {/* Mobile List */}
        <div className="mobile-domains-list">
          {displayDomains.map((domain: Domain) => (
            <Link
              key={domain.domain_number}
              href={`/domains/${domain.domain_number}`}
              className="mobile-domain-card"
            >
              <div className="mobile-domain-icon">{domain.icon}</div>
              <div className="mobile-domain-info">
                <div className="mobile-domain-title">DOMAIN {domain.domain_number}</div>
                <div className="mobile-domain-name">{domain.name}</div>
                <div className="mobile-domain-weight">{domain.weight_percentage}%</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    )
  }
  
  return (
    <div className="domains-container">
      {/* Back to Frontpage Button */}
      <Link href="/" className="back-to-home">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        <span>To Frontpage</span>
      </Link>
      
      {/* Header */}
      <div className="domains-header">
        <h1>CISSP Common Body of Knowledge</h1>
        <p>Explore all 8 domains of cybersecurity expertise</p>
      </div>

      {/* Circular Navigation Menu */}
      <nav className={`circular-menu ${isOpen ? 'active' : ''}`}>
        <div 
          className="menu-toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="toggle-icon">{isOpen ? '×' : '+'}</span>
        </div>
        
        {displayDomains.map((domain: Domain, index: number) => {
          const rotation = getRotationForDomain(domain.domain_number)
          const isHovered = hoveredDomain === domain.domain_number
          
          // Determine label position based on angle
          let labelClass = 'label-right' // 0° position
          if (rotation > 22.5 && rotation <= 67.5) {
            labelClass = 'label-bottom-right'
          } else if (rotation > 67.5 && rotation <= 112.5) {
            labelClass = 'label-bottom'
          } else if (rotation > 112.5 && rotation <= 157.5) {
            labelClass = 'label-bottom-left'
          } else if (rotation > 157.5 && rotation <= 202.5) {
            labelClass = 'label-left'
          } else if (rotation > 202.5 && rotation <= 247.5) {
            labelClass = 'label-top-left'
          } else if (rotation > 247.5 && rotation <= 292.5) {
            labelClass = 'label-top'
          } else if (rotation > 292.5 && rotation <= 337.5) {
            labelClass = 'label-top-right'
          }
          
          return (
            <div key={domain.domain_number} className="menu-item-wrapper">
              {/* Dotted line from center to circle */}
              <div 
                className={`dotted-line ${isOpen ? 'visible' : ''} ${isHovered ? 'active' : ''}`}
                style={{
                  transform: `rotate(${rotation}deg)`,
                  width: `${circleDistance}px`,
                  transitionDelay: isOpen ? `${index * 0.05}s` : '0s'
                }}
              />
              
              {/* Domain circle at end of line */}
              <Link
                href={`/domains/${domain.domain_number}`}
                className={`menu-item domain-${domain.domain_number} ${isHovered ? 'hovered' : ''}`}
                style={{
                  transform: isOpen 
                    ? `rotate(${rotation}deg) translate(${circleDistance}px) rotate(-${rotation}deg)` 
                    : 'rotate(0deg) translate(0) rotate(0deg)',
                  transitionDelay: isOpen ? `${index * 0.05}s` : '0s'
                }}
                onMouseEnter={() => setHoveredDomain(domain.domain_number)}
                onMouseLeave={() => setHoveredDomain(null)}
              >
                <div className="domain-circle">
                  <span className="domain-icon">{domain.icon}</span>
                  <span className="domain-number">D{domain.domain_number}</span>
                </div>
                
                {/* Domain label - hidden on mobile, shown on hover on desktop */}
                <div className={`domain-label ${labelClass} ${isOpen ? 'visible' : ''} ${isHovered ? 'active' : ''}`}>
                  <div className="label-content">
                    <span className="label-title">DOMAIN {domain.domain_number}</span>
                    <span className="label-name">{domain.name}</span>
                    <span className="label-weight">{domain.weight_percentage}%</span>
                  </div>
                </div>
              </Link>
            </div>
          )
        })}
        
        {/* Center info display */}
        <div className="center-info">
          <div className="info-title">CISSP CBK</div>
          <div className="info-subtitle"></div>
        </div>
      </nav>

      {/* Footer Instructions */}
      <div className="domains-footer">
        <p>Click any domain to view detailed information and study materials</p>
        <p className="footer-note">All 8 CISSP CBK domains • Total exam weight: 100%</p>
      </div>
    </div>
  )
}