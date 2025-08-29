'use client'

import { useState, useEffect, useMemo } from 'react'
import { 
  getStudyProgress, 
  getRecentAttempts, 
  getOverallStats, 
  clearProgress,
  exportProgress,
  formatTime
} from '@/lib/localStorage'
import QuestionProgress from './QuestionProgress'
import DomainPerformance from './DomainPerformance'
import type { StudyProgress } from '@/lib/localStorage'
import styles from './ProgressDashboard.module.css'

export default function ProgressDashboard() {
  const [progress, setProgress] = useState<StudyProgress | null>(null)
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportData, setExportData] = useState('')
  
  useEffect(() => {
    // Batch localStorage reads
    const loadProgress = () => {
      const studyProgress = getStudyProgress()
      setProgress(studyProgress)
    }
    
    // Use requestIdleCallback for non-critical initialization
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadProgress)
    } else {
      loadProgress()
    }
  }, [])
  
  // Memoize expensive computations
  const stats = useMemo(() => {
    if (!progress) return null
    return getOverallStats()
  }, [progress])
  
  const recentAttempts = useMemo(() => {
    if (!progress) return []
    return getRecentAttempts(5)
  }, [progress])
  
  const handleClearProgress = () => {
    if (clearProgress()) {
      setProgress(getStudyProgress())
    }
  }
  
  const handleExportProgress = () => {
    const data = exportProgress()
    setExportData(data)
    setShowExportModal(true)
  }
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(exportData)
    alert('Progress data copied to clipboard!')
  }
  
  const handleDownloadJSON = () => {
    const blob = new Blob([exportData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cissp-progress-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  
  if (!progress || !stats) {
    return <div className={styles.loading}>Loading progress...</div>
  }
  
  return (
    <div className={styles.progressDashboard}>
      <div className={styles.dashboardHeader}>
        <h2 className={styles.dashboardTitle}>Your Study Progress</h2>
        <p className={styles.dashboardSubtitle}>
          All data is stored locally in your browser - no account needed!
        </p>
      </div>
      
      {/* Overall Stats Cards */}
      <div id="stats" className={`${styles.statsGrid} ${styles.scrollSection}`}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconBlue}`}>
            <svg fill="currentColor" viewBox="0 0 20 20" width="24" height="24">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
              <path d="M3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statLabel}>Total Attempts</h3>
            <p className={styles.statValue}>{stats.totalAttempts}</p>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconGreen}`}>
            <svg fill="currentColor" viewBox="0 0 20 20" width="24" height="24">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statLabel}>Average Score</h3>
            <p className={styles.statValue}>{stats.averageScore}%</p>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconPurple}`}>
            <svg fill="currentColor" viewBox="0 0 20 20" width="24" height="24">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statLabel}>Study Time</h3>
            <p className={styles.statValue}>{formatTime(stats.totalStudyTime)}</p>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconYellow}`}>
            <svg fill="currentColor" viewBox="0 0 20 20" width="24" height="24">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statLabel}>Best Score</h3>
            <p className={styles.statValue}>{stats.bestScore}%</p>
          </div>
        </div>
      </div>
      
      {/* Recent Attempts */}
      <div id="recent" className={`${styles.recentAttempts} ${styles.scrollSection}`}>
        <h3 className={styles.sectionTitle}>Recent Quiz Attempts</h3>
        {recentAttempts.length > 0 ? (
          <div className={styles.attemptsList}>
            {recentAttempts.map((attempt) => (
              <div key={attempt.id} className={styles.attemptCard}>
                <div className={styles.attemptHeader}>
                  <span className={styles.attemptDomain}>{attempt.domain_name}</span>
                  <span className={styles.attemptDate}>
                    {new Date(attempt.date).toLocaleDateString()}
                  </span>
                </div>
                <div className={styles.attemptStats}>
                  <span className={styles.attemptScore}>
                    Score: <strong>{attempt.score}%</strong>
                  </span>
                  <span className={styles.attemptQuestions}>
                    {attempt.correct_answers}/{attempt.questions_attempted} correct
                  </span>
                  <span className={styles.attemptTime}>
                    Time: {formatTime(attempt.time_spent)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.noAttempts}>No quiz attempts yet. Start practicing to track your progress!</p>
        )}
      </div>
      
      {/* Enhanced Domain Performance Component */}
      <div id="domains" className={styles.scrollSection}>
        <DomainPerformance />
      </div>
      
      {/* Progress Management */}
      <div id="manage" className={`${styles.progressManagement} ${styles.scrollSection}`}>
        <h3 className={styles.sectionTitle}>Manage Your Progress</h3>
        <div className={styles.managementButtons}>
          <button 
            onClick={handleExportProgress}
            className={`${styles.managementBtn} ${styles.btnExport}`}
          >
            <svg className={styles.btnIcon} fill="currentColor" viewBox="0 0 20 20" width="16" height="16">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Export Progress
          </button>
          <button 
            onClick={handleClearProgress}
            className={`${styles.managementBtn} ${styles.btnClear}`}
          >
            <svg className={styles.btnIcon} fill="currentColor" viewBox="0 0 20 20" width="16" height="16">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Clear All Progress
          </button>
        </div>
        <p className={styles.managementNote}>
          💡 Tip: Export your progress regularly to back it up. Your data stays in your browser only.
        </p>
      </div>
      
      {/* Export Modal */}
      {showExportModal && (
        <div className={styles.modalOverlay} onClick={() => setShowExportModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Export Progress Data</h3>
            <textarea 
              className={styles.exportTextarea}
              value={exportData}
              readOnly
            />
            <div className={styles.modalButtons}>
              <button onClick={handleCopyToClipboard} className={`${styles.modalBtn} ${styles.btnCopy}`}>
                Copy to Clipboard
              </button>
              <button onClick={handleDownloadJSON} className={`${styles.modalBtn} ${styles.btnDownload}`}>
                Download JSON
              </button>
              <button onClick={() => setShowExportModal(false)} className={`${styles.modalBtn} ${styles.btnClose}`}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
