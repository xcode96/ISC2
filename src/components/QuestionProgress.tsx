'use client'

import { useState, useEffect } from 'react'
import { getSeenQuestionsStats, clearSeenQuestions } from '@/lib/question-tracker'

export default function QuestionProgress() {
  const [stats, setStats] = useState({
    seenCount: 0,
    lastUpdated: null as Date | null,
    percentageSeen: 0
  })
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = () => {
    const currentStats = getSeenQuestionsStats()
    setStats(currentStats)
  }

  const handleReset = () => {
    clearSeenQuestions()
    loadStats()
    setShowResetConfirm(false)
  }

  const formatDate = (date: Date | null) => {
    if (!date) return 'Never'
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    return 'Just now'
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '12px',
        padding: '1.5rem',
        color: 'white',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            margin: '0',
            display: 'flex',
            alignItems: 'center'
          }}>
            <svg 
              style={{ marginRight: '0.5rem' }}
              width="20" 
              height="20" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            Question Progress
          </h3>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '0.875rem', opacity: '0.9' }}>Questions Seen:</span>
            <span style={{ fontWeight: '600', fontSize: '1rem' }}>{stats.seenCount} / 900</span>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '0.875rem', opacity: '0.9' }}>Coverage:</span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flex: '1',
              maxWidth: '200px',
              marginLeft: '1rem'
            }}>
              <div style={{
                flex: '1',
                height: '8px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #4ade80 0%, #22c55e 100%)',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease',
                  width: `${stats.percentageSeen}%`
                }} />
              </div>
              <span style={{
                fontWeight: '600',
                minWidth: '40px',
                textAlign: 'right'
              }}>
                {stats.percentageSeen}%
              </span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '0.875rem', opacity: '0.9' }}>Last Practice:</span>
            <span style={{ fontWeight: '600', fontSize: '1rem' }}>{formatDate(stats.lastUpdated)}</span>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          paddingTop: '1rem'
        }}>
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              disabled={stats.seenCount === 0}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                padding: '0.75rem',
                background: stats.seenCount === 0 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                color: 'white',
                fontWeight: '500',
                cursor: stats.seenCount === 0 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: stats.seenCount === 0 ? '0.5' : '1'
              }}
              onMouseEnter={(e) => {
                if (stats.seenCount > 0) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <svg 
                style={{ marginRight: '0.5rem' }}
                width="16" 
                height="16" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset Progress
            </button>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
                Are you sure? This will mark all questions as unseen.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={handleReset}
                  style={{
                    flex: '1',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: '#ef4444',
                    border: '1px solid #ef4444',
                    color: 'white'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#dc2626'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ef4444'
                  }}
                >
                  Yes, Reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  style={{
                    flex: '1',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {stats.percentageSeen > 70 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.75rem',
            background: 'rgba(251, 191, 36, 0.1)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            borderRadius: '8px',
            marginTop: '1rem',
            fontSize: '0.875rem'
          }}>
            <svg 
              style={{ marginRight: '0.5rem', flexShrink: '0' }}
              width="16" 
              height="16" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>You've seen most questions! Consider resetting for a fresh experience.</span>
          </div>
        )}
      </div>
    </div>
  )
}
