'use client'

import React, { useRef, useState } from 'react'
import Link from 'next/link'
import ScrollToTopLink from './ScrollToTopLink'
import { usePDFExport } from '@/lib/pdf-export'
import { getMotivationalMessage } from '@/lib/localStorage'
import BuyMeACoffee from './BuyMeACoffee'

interface DomainPerformance {
  domainNumber: number
  domainName: string
  questionsAttempted: number
  correctAnswers: number
  accuracy: number
  averageTime: number
}

interface QuizResultsProps {
  score: {
    correct: number
    total: number
    percentage: number
  }
  timeSpent: number
  domainPerformance?: DomainPerformance[]
  averageTimePerQuestion?: number
  onRetakeQuiz: () => void
}



export default function QuizResults({
  score,
  timeSpent,
  domainPerformance = [],
  averageTimePerQuestion,
  onRetakeQuiz
}: QuizResultsProps) {
  // Calculate performance metrics
  const avgTime = averageTimePerQuestion || timeSpent / score.total
  const speedRating = getSpeedRating(avgTime)
  const performanceLevel = getPerformanceLevel(score.percentage)
  const resultsRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)
  const { exportToPDF } = usePDFExport()
  
  const handleDownloadPDF = async () => {
    if (isExporting) return
    
    setIsExporting(true)
    try {
      await exportToPDF(resultsRef, {
        title: 'CISSP Study Platform - Quiz Results',
        metadata: {
          score: score.percentage,
          questionsCount: score.total,
          timeSpent: timeSpent
        },
        filename: `CISSP_Quiz_Results_${new Date().toISOString().split('T')[0]}_Score_${score.percentage}%.pdf`
      })
    } catch (error) {
      console.error('PDF export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }
  
  return (
    <div className="quiz-results-container" ref={resultsRef}>
      <h2 className="results-title">Quiz Results</h2>
      
      {/* Motivational Message */}
      <div className="motivational-message">
        <p className="motivational-text">{getMotivationalMessage(score.percentage)}</p>
      </div>
      
      {/* Main Score Display */}
      <div className="results-grid">
        {/* Overall Score Circle */}
        <div className="result-card">
          <div className="circular-progress-container">
            <svg className="circular-progress" viewBox="0 0 200 200">
              <circle
                className="progress-bg"
                cx="100"
                cy="100"
                r="90"
                strokeWidth="12"
              />
              <circle
                className="progress-fill"
                cx="100"
                cy="100"
                r="90"
                strokeWidth="12"
                strokeDasharray={`${(score.percentage / 100) * 565.48} 565.48`}
                style={{
                  stroke: getScoreColor(score.percentage),
                  animation: 'progressAnimation 1.5s ease-out forwards'
                }}
              />
            </svg>
            <div className="progress-text">
              <span className="progress-value">{score.percentage}%</span>
              <span className="progress-label">Score</span>
            </div>
          </div>
          <div className="metric-details">
            <h3 className={`performance-level ${performanceLevel.toLowerCase().replace(' ', '-')}`}>
              {performanceLevel}
            </h3>
            <p className="metric-subtitle">
              {score.correct} of {score.total} correct
            </p>
          </div>
        </div>

        {/* Speed Metric */}
        <div className="result-card">
          <div className="circular-progress-container smaller">
            <svg className="circular-progress" viewBox="0 0 200 200">
              <circle
                className="progress-bg"
                cx="100"
                cy="100"
                r="90"
                strokeWidth="12"
              />
              <circle
                className="progress-fill speed"
                cx="100"
                cy="100"
                r="90"
                strokeWidth="12"
                strokeDasharray={`${(speedRating.score / 100) * 565.48} 565.48`}
                style={{
                  animation: 'progressAnimation 1.5s ease-out 0.3s forwards'
                }}
              />
            </svg>
            <div className="progress-text">
              <span className="progress-value">{formatTime(avgTime)}</span>
              <span className="progress-label">Avg/Question</span>
            </div>
          </div>
          <div className="metric-details">
            <h3 className={`speed-rating ${speedRating.rating.toLowerCase().replace(' ', '-')}`}>
              {speedRating.rating}
            </h3>
            <p className="metric-subtitle">
              Total: {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
            </p>
          </div>
        </div>

        {/* Accuracy Metric */}
        <div className="result-card">
          <div className="circular-progress-container smaller">
            <svg className="circular-progress" viewBox="0 0 200 200">
              <circle
                className="progress-bg"
                cx="100"
                cy="100"
                r="90"
                strokeWidth="12"
              />
              <circle
                className="progress-fill accuracy"
                cx="100"
                cy="100"
                r="90"
                strokeWidth="12"
                strokeDasharray={`${(score.percentage / 100) * 565.48} 565.48`}
                style={{
                  animation: 'progressAnimation 1.5s ease-out 0.6s forwards'
                }}
              />
            </svg>
            <div className="progress-text">
              <span className="progress-value">{score.percentage}%</span>
              <span className="progress-label">Accuracy</span>
            </div>
          </div>
          <div className="metric-details">
            <h3>Questions Answered</h3>
            <p className="metric-subtitle">
              {score.total} questions completed
            </p>
          </div>
        </div>
      </div>

      {/* View Detailed Progress Link */}
      <div className="progress-link-section" style={{
        margin: '3rem auto',
        maxWidth: '600px',
        textAlign: 'center'
      }}>
        <Link
          href="/progress"
          className="progress-dashboard-link"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1.5rem 2.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '1rem',
            fontSize: '1.125rem',
            fontWeight: '600',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.3)'
          }}
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M3 12h18m0 0l-6-6m6 6l-6 6" />
          </svg>
          <span>View Your Complete Domain Progress</span>
        </Link>
        <p style={{
          marginTop: '1rem',
          color: '#94a3b8',
          fontSize: '0.95rem',
          lineHeight: '1.6'
        }}>
          Track your performance across all 8 CISSP domains, identify weak areas, and monitor improvement over time
        </p>
      </div>

      {/* Recommendations */}
      <div className="recommendations-section">
        <h3 className="section-header">Recommendations</h3>
        <div className="recommendations-grid">
          {getRecommendations(score.percentage, domainPerformance, avgTime).map((rec, index) => (
            <div key={index} className="recommendation-card">
              <div className="rec-icon">{rec.icon}</div>
              <div className="rec-content">
                <h4>{rec.title}</h4>
                <p>{rec.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Support Section - Only show for good scores */}
      {score.percentage >= 60 && (
        <div className="support-section">
          <p className="support-text">
            Found this helpful? Support free CISSP study resources for everyone!
          </p>
          <div className="support-button-wrapper">
            <BuyMeACoffee />
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="results-actions">
        <button 
          onClick={handleDownloadPDF} 
          className="btn-download-pdf"
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <svg className="btn-icon animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Generating PDF...</span>
            </>
          ) : (
            <>
              <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download Results as PDF</span>
            </>
          )}
        </button>
        
        <button onClick={onRetakeQuiz} className="btn-retake">
          <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Retake Quiz</span>
        </button>
        
        <ScrollToTopLink href="/quiz" className="btn-back">
          <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Back to Selection</span>
        </ScrollToTopLink>
      </div>
    </div>
  )
}

// Helper functions
function getScoreColor(percentage: number): string {
  if (percentage >= 80) return '#10b981'
  if (percentage >= 60) return '#f59e0b'
  return '#ef4444'
}

function getPerformanceLevel(percentage: number): string {
  if (percentage >= 90) return 'Excellent'
  if (percentage >= 80) return 'Good'
  if (percentage >= 70) return 'Satisfactory'
  if (percentage >= 60) return 'Needs Improvement'
  return 'Keep Practicing'
}

function getSpeedRating(avgTime: number): { rating: string; score: number } {
  if (avgTime <= 30) return { rating: 'Very Fast', score: 100 }
  if (avgTime <= 45) return { rating: 'Fast', score: 85 }
  if (avgTime <= 60) return { rating: 'Average', score: 70 }
  if (avgTime <= 90) return { rating: 'Slow', score: 50 }
  return { rating: 'Very Slow', score: 30 }
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`
  return `${Math.floor(seconds / 60)}:${(Math.round(seconds) % 60).toString().padStart(2, '0')}`
}

function getDomainPerformanceClass(accuracy: number): string {
  if (accuracy >= 80) return 'excellent'
  if (accuracy >= 60) return 'good'
  return 'needs-practice'
}

function getRecommendations(overallScore: number, domainPerformance: DomainPerformance[], avgTime: number) {
  const recommendations = []
  
  if (overallScore < 70) {
    recommendations.push({
      icon: '📚',
      title: 'Review Fundamentals',
      description: 'Focus on core concepts before attempting advanced questions'
    })
  }
  
  const weakDomains = domainPerformance.filter(d => d.accuracy < 70)
  if (weakDomains.length > 0) {
    recommendations.push({
      icon: '🎯',
      title: 'Target Weak Domains',
      description: `Focus on Domain ${weakDomains[0].domainNumber}: ${weakDomains[0].domainName}`
    })
  }
  
  if (avgTime > 60) {
    recommendations.push({
      icon: '⏱️',
      title: 'Improve Speed',
      description: 'Practice timed quizzes to improve response time'
    })
  }
  
  if (overallScore >= 80) {
    recommendations.push({
      icon: '🚀',
      title: 'Ready for Next Level',
      description: 'Try the Full Exam mode for a comprehensive challenge'
    })
  }
  
  if (recommendations.length === 0) {
    recommendations.push({
      icon: '✨',
      title: 'Keep Practicing',
      description: 'Consistent practice leads to mastery'
    })
  }
  
  return recommendations
}