'use client';

import Link from 'next/link'
import { useState } from 'react'
import { FlashcardModal } from '@/components/FlashcardModal'
import { getFlashcardsBySubdomain, hasFlashcardsForSubdomain } from '@/lib/flashcards/flashcard-data'
import './domain.css'

// Domain colors matching the circular menu
const DOMAIN_COLORS = [
  '#3B82F6', // Security and Risk Management - Blue
  '#8B5CF6', // Asset Security - Purple
  '#EC4899', // Security Architecture - Pink
  '#10B981', // Network Security - Green
  '#F59E0B', // Identity and Access - Amber
  '#EF4444', // Security Testing - Red
  '#06B6D4', // Security Operations - Cyan
  '#6366F1', // Software Security - Indigo
]

// Domain icons
const DOMAIN_ICONS = [
  '🛡️', // Security and Risk Management
  '🔐', // Asset Security
  '🏗️', // Security Architecture and Engineering
  '🌐', // Communication and Network Security
  '🔑', // Identity and Access Management
  '🔍', // Security Assessment and Testing
  '⚙️', // Security Operations
  '💻', // Software Development Security
]

interface DomainDetailClientProps {
  domain: any
  domainId: number
}

export default function DomainDetailClient({ domain, domainId }: DomainDetailClientProps) {
  // State for flashcard modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSubdomain, setSelectedSubdomain] = useState<string>('')
  const [selectedSubdomainTitle, setSelectedSubdomainTitle] = useState<string>('')

  const domainColor = DOMAIN_COLORS[domainId - 1]
  const domainIcon = DOMAIN_ICONS[domainId - 1]

  const handleStudyClick = (subdomainNumber: string, subdomainTitle: string) => {
    // Check if flashcards exist for this subdomain
    const hasCards = hasFlashcardsForSubdomain(domainId, subdomainNumber);
    
    if (hasCards) {
      setSelectedSubdomain(subdomainNumber)
      setSelectedSubdomainTitle(subdomainTitle)
      setIsModalOpen(true)
    } else {
      // You could show a toast or alert here
      console.log(`No flashcards available yet for subdomain ${subdomainNumber}`)
    }
  }

  // Get flashcards for selected subdomain
  const flashcards = selectedSubdomain 
    ? getFlashcardsBySubdomain(domainId, selectedSubdomain)
    : []

  return (
    <div className="domain-detail-container">
      {/* Animated background particles */}
      <div className="particles-bg"></div>
      
      {/* Main content */}
      <div className="domain-content">
        {/* Header Card */}
        <div className="glass-card header-card" style={{ '--accent-color': domainColor } as React.CSSProperties}>
          <Link href="/domains" className="back-button">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span>Back to Domains</span>
          </Link>
          
          <div className="header-content">
            <div className="domain-badge">
              <span className="domain-icon-large">{domainIcon}</span>
              <span className="domain-number-badge">Domain {domain.domain_number}</span>
            </div>
            
            <h1 className="domain-title">{domain.name}</h1>
            
            <div className="domain-stats">
              <div className="stat-item">
                <span className="stat-value">{domain.weight_percentage}%</span>
                <span className="stat-label">Exam Weight</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-value">{domain.subdomains.length}</span>
                <span className="stat-label">Subdomains</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subdomains Grid */}
        <div className="subdomains-grid">
          {domain.subdomains.map((subdomain: any, index: number) => {
            const hasCards = hasFlashcardsForSubdomain(domainId, subdomain.subdomain_number);
            
            return (
              <div
                key={subdomain.subdomain_number}
                className="glass-card subdomain-card"
                style={{
                  '--card-delay': `${index * 0.1}s`,
                  '--accent-color': domainColor
                } as React.CSSProperties}
              >
                <div className="card-header">
                  <span className="subdomain-number">{subdomain.subdomain_number}</span>
                  <div className="card-glow"></div>
                  {hasCards && (
                    <span className="flashcard-indicator" title="Flashcards available">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M2 4a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm2-1a1 1 0 00-1 1v1h10V4a1 1 0 00-1-1H4zm9 4H3v5a1 1 0 001 1h8a1 1 0 001-1V7z"/>
                      </svg>
                    </span>
                  )}
                </div>
                
                <h3 className="subdomain-title">{subdomain.title}</h3>
                
                <div className="concepts-container">
                  <h4 className="concepts-label">Key Concepts</h4>
                  <div className="concepts-tags">
                    {subdomain.key_concepts.map((concept: string, i: number) => (
                      <span
                        key={i}
                        className="concept-tag"
                        style={{
                          '--tag-delay': `${(index * 0.1) + (i * 0.02)}s`
                        } as React.CSSProperties}
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="card-footer">
                  <button 
                    className={`study-button ${hasCards ? 'has-cards' : 'no-cards'}`}
                    onClick={() => handleStudyClick(subdomain.subdomain_number, subdomain.title)}
                    title={hasCards ? 'Study with flashcards' : 'Flashcards coming soon'}
                  >
                    <span>{hasCards ? 'Study This Topic' : 'Coming Soon'}</span>
                    {hasCards ? (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Navigation Footer */}
        <div className="navigation-footer">
          <Link 
            href={`/domains/${domainId > 1 ? domainId - 1 : 8}`}
            className="nav-button prev-button"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Previous Domain</span>
          </Link>
          
          <Link href="/domains" className="nav-button home-button">
            <span>All Domains</span>
          </Link>
          
          <Link 
            href={`/domains/${domainId < 8 ? domainId + 1 : 1}`}
            className="nav-button next-button"
          >
            <span>Next Domain</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Flashcard Modal */}
      <FlashcardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        flashcards={flashcards}
        subdomainTitle={selectedSubdomainTitle}
        domainColor={domainColor}
      />
    </div>
  )
}
