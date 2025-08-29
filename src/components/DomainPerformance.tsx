'use client'

import { useState, useEffect } from 'react'
import { getAllDomainStats, initializeProgress } from '@/lib/localStorage'
import type { DomainStats } from '@/lib/localStorage'
import { CISSP_DOMAINS } from '@/data/domains'
import '../app/quiz/quiz.css'

export default function DomainPerformance() {
  const [domainStats, setDomainStats] = useState<DomainStats[]>([])
  const [expandedDomain, setExpandedDomain] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDomainStats()
  }, [])

  const loadDomainStats = () => {
    console.log('CISSP_DOMAINS from data:', CISSP_DOMAINS)
    console.log('Number of domains in data:', CISSP_DOMAINS.length)
    
    // Force initialization of all domains if needed
    const progress = initializeProgress()
    if (!progress.domainStats || Object.keys(progress.domainStats).length < 8) {
      console.log('Initializing missing domain stats...')
      // Force save to ensure all domains exist
      localStorage.setItem('cissp_quiz_progress', JSON.stringify(progress))
    }
    
    const stats = getAllDomainStats()
    console.log('Loaded domain stats:', stats)
    console.log('Number of domains loaded:', stats.length)
    
    // If stats are empty or incomplete, create them manually
    // Always ensure we have all 8 domains
    const allDomainStats: DomainStats[] = []
    for (let i = 1; i <= 8; i++) {
      const existingStat = stats.find(s => s.domain_id === i)
      if (existingStat) {
        allDomainStats.push(existingStat)
      } else {
        const domain = CISSP_DOMAINS.find(d => d.id === i)
        allDomainStats.push({
          domain_id: i,
          domain_name: domain?.name || `Domain ${i}`,
          total_attempts: 0,
          questions_attempted: 0,
          correct_answers: 0,
          average_score: 0,
          best_score: 0,
          avg_time_per_question: 0
        })
      }
    }
    
    console.log('Final domain stats to display:', allDomainStats)
    setDomainStats(allDomainStats)
    setIsLoading(false)
  }

  const getPerformanceClass = (percentage: number) => {
    if (percentage >= 80) return 'excellent'
    if (percentage >= 60) return 'good'
    return 'needs-practice'
  }

  const getAccuracyBadgeText = (percentage: number) => {
    if (percentage >= 80) return `${percentage}%`
    if (percentage >= 60) return `${percentage}%`
    return percentage > 0 ? `${percentage}%` : '0%'
  }

  const formatTime = (seconds: number) => {
    if (seconds === 0) return '0s'
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  if (isLoading) {
    return (
      <div className="domain-performance-section">
        <h2 className="section-header">Performance by Domain</h2>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>Loading domain stats...</div>
      </div>
    )
  }

  return (
    <div className="domain-performance-section" style={{ marginBottom: '3rem' }}>
      <h2 className="section-header">Performance by Domain</h2>
      <div className="domain-cards" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem',
        width: '100%'
      }}>
        {domainStats.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
            No domain stats available. Start taking quizzes to see your progress!
          </div>
        ) : (
          domainStats.map((domain) => {
            const percentage = domain.average_score || 0
            const performanceClass = getPerformanceClass(percentage)
            const isExpanded = expandedDomain === domain.domain_id
            console.log(`Rendering domain ${domain.domain_id}: ${domain.domain_name}`)

            return (
            <div
              key={domain.domain_id}
              className={`domain-card ${performanceClass}`}
              onClick={() => setExpandedDomain(isExpanded ? null : domain.domain_id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="domain-header">
                <span className="domain-number">DOMAIN {domain.domain_id}</span>
                <span className={`accuracy-badge ${performanceClass}`}>
                  {getAccuracyBadgeText(percentage)}
                </span>
              </div>
              
              <h3 className="domain-name">{domain.domain_name}</h3>
              
              <div className="domain-stats">
                <div className="stat">
                  <span className="stat-value">
                    {domain.correct_answers}/{domain.questions_attempted}
                  </span>
                  <span className="stat-label">CORRECT</span>
                </div>
                <div className="stat">
                  <span className="stat-value">
                    {formatTime(domain.avg_time_per_question)}
                  </span>
                  <span className="stat-label">AVG TIME</span>
                </div>
              </div>

              <div className="domain-progress-bar">
                <div 
                  className="domain-progress-fill"
                  style={{
                    width: `${percentage}%`,
                    background: percentage >= 80 
                      ? 'linear-gradient(90deg, #10b981, #059669)'
                      : percentage >= 60
                      ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                      : 'linear-gradient(90deg, #ef4444, #dc2626)'
                  }}
                />
              </div>

              {percentage < 60 && domain.questions_attempted > 0 && (
                <div className="domain-recommendation">
                  <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>Needs Practice</span>
                </div>
              )}

              {isExpanded && (
                <div style={{
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid rgba(148, 163, 184, 0.2)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className="stat-label">Total Attempts:</span>
                    <span className="stat-value">{domain.total_attempts}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className="stat-label">Best Score:</span>
                    <span className="stat-value">{domain.best_score}%</span>
                  </div>
                  {domain.last_attempt_date && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span className="stat-label">Last Attempt:</span>
                      <span className="stat-value">
                        {new Date(domain.last_attempt_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
            )
          })
        )}
      </div>
    </div>
  )
}
