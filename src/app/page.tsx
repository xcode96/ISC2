'use client'

import { useState, useEffect } from 'react'
import styles from './landing.module.css'
import Link from 'next/link'

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if mobile on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || window.innerHeight < 600)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    // Prevent body scroll when menu is open
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile)
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <main className={styles.landingContainer} style={{ margin: 0, padding: 0 }}>
      {/* Navigation Overlay */}
      <div 
        className={`${styles.navOverlay} ${isMenuOpen ? styles.navOverlayActive : ''}`} 
        onClick={closeMenu}
        aria-hidden="true"
      />
      
      {/* Slide-in Navigation Menu */}
      <nav 
        className={`${styles.navMenu} ${isMenuOpen ? styles.navMenuActive : ''}`}
        aria-label="Main navigation"
      >
        <div className={styles.navHeader}>
          <h2 className={styles.navTitle}>Navigation</h2>
          <button 
            className={styles.closeBtn} 
            onClick={closeMenu}
            aria-label="Close navigation menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className={styles.navLinks}>
          <Link href="/" className={styles.navLink} onClick={closeMenu}>
            <span className={styles.navIcon}>🏠</span>
            <span>Home</span>
          </Link>
          
          <Link href="/domains" className={styles.navLink} onClick={closeMenu}>
            <span className={styles.navIcon}>📚</span>
            <span>CISSP Domains</span>
          </Link>
          
          <Link href="/quiz" className={styles.navLink} onClick={closeMenu}>
            <span className={styles.navIcon}>📝</span>
            <span>Practice Quiz</span>
          </Link>
          
          <Link href="/progress" className={styles.navLink} onClick={closeMenu}>
            <span className={styles.navIcon}>📊</span>
            <span>Your Progress</span>
          </Link>
          
          <Link href="/domains/1" className={styles.navLink} onClick={closeMenu}>
            <span className={styles.navIcon}>🔒</span>
            <span>Security & Risk</span>
          </Link>
          
          <Link href="/domains/2" className={styles.navLink} onClick={closeMenu}>
            <span className={styles.navIcon}>💼</span>
            <span>Asset Security</span>
          </Link>
          
          <Link href="/domains/3" className={styles.navLink} onClick={closeMenu}>
            <span className={styles.navIcon}>🏗️</span>
            <span>Security Architecture</span>
          </Link>
          
          <Link href="/domains/4" className={styles.navLink} onClick={closeMenu}>
            <span className={styles.navIcon}>🌐</span>
            <span>Network Security</span>
          </Link>
          
          <Link href="/domains/5" className={styles.navLink} onClick={closeMenu}>
            <span className={styles.navIcon}>👤</span>
            <span>Identity & Access</span>
          </Link>
          
          <Link href="/domains/6" className={styles.navLink} onClick={closeMenu}>
            <span className={styles.navIcon}>🔍</span>
            <span>Security Testing</span>
          </Link>
          
          <Link href="/domains/7" className={styles.navLink} onClick={closeMenu}>
            <span className={styles.navIcon}>⚙️</span>
            <span>Security Operations</span>
          </Link>
          
          <Link href="/domains/8" className={styles.navLink} onClick={closeMenu}>
            <span className={styles.navIcon}>💻</span>
            <span>Software Security</span>
          </Link>
        </div>
        
        <div className={styles.navFooter}>
          <p className={styles.navFooterText}>CISSP Study Platform v1.0</p>
        </div>
      </nav>

      <div className={styles.contentWrapper}>
        {/* Header with navigation */}
        <header className={styles.headerSection}>
          <button 
            className={styles.menuIcon} 
            onClick={toggleMenu} 
            aria-label="Open navigation menu"
            aria-expanded={isMenuOpen}
          >
            <span className={styles.menuLine}></span>
          </button>
          
          <h1 className={styles.mainHeading}>CISSP Study Platform</h1>
        </header>

        {/* Side coordinates - hide on very small screens */}
        {!isMobile && (
          <p className={styles.coordinates}>CISSP Certification  /  Study Platform</p>
        )}

        {/* Central animated section */}
        <div className={styles.ellipsesContainer}>
          <h2 className={styles.greeting}>
            {isMobile ? 'CISSP' : 'Welcome'}
          </h2>
          
          <div className={`${styles.ellipses} ${styles.ellipsesOuterThin}`}>
            <div className={`${styles.ellipses} ${styles.ellipsesOrbit}`}></div>
          </div>
          
          <div className={`${styles.ellipses} ${styles.ellipsesOuterThick}`}></div>
          
          {/* Action buttons positioned in the center */}
          <div className={styles.actionButtons}>
            <Link
              href="/quiz"
              className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
            >
              Start Practice Quiz
            </Link>
            <Link
              href="/domains"
              className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
            >
              Browse Domains
            </Link>
          </div>
        </div>

        {/* Right side scroller - hide on mobile */}
        {!isMobile && (
          <div className={styles.scrollerSection}>
            <p className={styles.pageTitle}>home</p>
            
            <div className={styles.timeline}>
              <span className={styles.timelineUnit}></span>
              <span className={`${styles.timelineUnit} ${styles.timelineUnitActive}`}></span>
              <span className={styles.timelineUnit}></span>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}