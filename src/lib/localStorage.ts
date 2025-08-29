// localStorage utilities for quiz progress and settings with enhanced domain tracking

import { CISSP_DOMAINS } from '@/data/domains'

export interface QuizAttempt {
  id?: string
  domain_id: number | null
  domain_name?: string
  questions_attempted: number
  correct_answers: number
  score: number
  time_spent: number
  difficulty: number[]
  date: string
  question_ids?: number[]
}

export interface DomainStats {
  domain_id: number
  domain_name: string
  total_attempts: number
  questions_attempted: number
  correct_answers: number
  average_score: number
  best_score: number
  avg_time_per_question: number
  last_attempt_date?: string
}

export interface StudyProgress {
  totalQuestions: number
  correctAnswers: number
  attempts: QuizAttempt[]
  lastActivity: string
  domainStats: Record<number, DomainStats>
}

export interface UserProgress {
  totalQuestions: number
  correctAnswers: number
  attempts: QuizAttempt[]
  lastActivity: string
  domainStats?: Record<number, DomainStats>
}

const STORAGE_KEYS = {
  PROGRESS: 'cissp_quiz_progress',
  SETTINGS: 'cissp_quiz_settings',
  BOOKMARKS: 'cissp_bookmarked_questions',
  DOMAIN_STATS: 'cissp_domain_stats'
}

// Initialize progress if not exists with all domains
export function initializeProgress(): UserProgress {
  const defaultProgress: UserProgress = {
    totalQuestions: 0,
    correctAnswers: 0,
    attempts: [],
    lastActivity: new Date().toISOString(),
    domainStats: initializeDomainStats()
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS)
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(defaultProgress))
      return defaultProgress
    }
    
    const progress = JSON.parse(stored)
    
    // Ensure domainStats exists and is properly initialized
    if (!progress.domainStats) {
      progress.domainStats = initializeDomainStats()
    } else {
      // Ensure all 8 domains are present
      for (let i = 1; i <= 8; i++) {
        if (!progress.domainStats[i]) {
          const domain = CISSP_DOMAINS.find(d => d.id === i)
          if (domain) {
            progress.domainStats[i] = {
              domain_id: i,
              domain_name: domain.name,
              total_attempts: 0,
              questions_attempted: 0,
              correct_answers: 0,
              average_score: 0,
              best_score: 0,
              avg_time_per_question: 0
            }
          }
        }
      }
    }
    
    return progress
  } catch (error) {
    console.error('Error initializing progress:', error)
    return defaultProgress
  }
}

// Initialize domain stats for all 8 CISSP domains
function initializeDomainStats(): Record<number, DomainStats> {
  const stats: Record<number, DomainStats> = {}
  
  for (const domain of CISSP_DOMAINS) {
    stats[domain.id] = {
      domain_id: domain.id,
      domain_name: domain.name,
      total_attempts: 0,
      questions_attempted: 0,
      correct_answers: 0,
      average_score: 0,
      best_score: 0,
      avg_time_per_question: 0
    }
  }
  
  return stats
}

// Save a quiz attempt and update domain stats
export function saveQuizAttempt(attempt: Omit<QuizAttempt, 'date'>): void {
  try {
    const progress = initializeProgress()
    
    const fullAttempt: QuizAttempt = {
      ...attempt,
      date: new Date().toISOString()
    }
    
    progress.attempts.push(fullAttempt)
    progress.totalQuestions += attempt.questions_attempted
    progress.correctAnswers += attempt.correct_answers
    progress.lastActivity = new Date().toISOString()
    
    // Update domain-specific stats if domain_id is provided
    if (attempt.domain_id && progress.domainStats) {
      const domainId = attempt.domain_id
      const domainStat = progress.domainStats[domainId]
      
      if (domainStat) {
        // Update basic counts
        domainStat.total_attempts++
        domainStat.questions_attempted += attempt.questions_attempted
        domainStat.correct_answers += attempt.correct_answers
        domainStat.last_attempt_date = new Date().toISOString()
        
        // Update best score
        if (attempt.score > domainStat.best_score) {
          domainStat.best_score = attempt.score
        }
        
        // Calculate new average score
        const domainAttempts = progress.attempts.filter(a => a.domain_id === domainId)
        const totalScore = domainAttempts.reduce((sum, a) => sum + a.score, 0) + attempt.score
        domainStat.average_score = Math.round(totalScore / (domainAttempts.length + 1))
        
        // Calculate average time per question
        const totalTime = domainAttempts.reduce((sum, a) => sum + a.time_spent, 0) + attempt.time_spent
        const totalQs = domainAttempts.reduce((sum, a) => sum + a.questions_attempted, 0) + attempt.questions_attempted
        domainStat.avg_time_per_question = totalQs > 0 ? Math.round(totalTime / totalQs) : 0
      }
    }
    
    // Keep only last 100 attempts to prevent storage bloat
    if (progress.attempts.length > 100) {
      progress.attempts = progress.attempts.slice(-100)
    }
    
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress))
  } catch (error) {
    console.error('Error saving quiz attempt:', error)
  }
}

// Get user progress
export function getUserProgress(): UserProgress {
  return initializeProgress()
}

// Get domain-specific stats
export function getDomainStats(domainId: number): DomainStats {
  const progress = initializeProgress()
  
  if (progress.domainStats && progress.domainStats[domainId]) {
    return progress.domainStats[domainId]
  }
  
  // Return default stats if not found
  const domain = CISSP_DOMAINS.find(d => d.id === domainId)
  return {
    domain_id: domainId,
    domain_name: domain?.name || `Domain ${domainId}`,
    total_attempts: 0,
    questions_attempted: 0,
    correct_answers: 0,
    average_score: 0,
    best_score: 0,
    avg_time_per_question: 0
  }
}

// Get all domain stats
export function getAllDomainStats(): DomainStats[] {
  const progress = initializeProgress()
  const stats: DomainStats[] = []
  
  for (let i = 1; i <= 8; i++) {
    if (progress.domainStats && progress.domainStats[i]) {
      stats.push(progress.domainStats[i])
    } else {
      stats.push(getDomainStats(i))
    }
  }
  
  return stats
}

// Save user settings
export function saveSettings(settings: Record<string, any>): void {
  try {
    const existing = getSettings()
    const updated = { ...existing, ...settings }
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated))
  } catch (error) {
    console.error('Error saving settings:', error)
  }
}

// Get user settings
export function getSettings(): Record<string, any> {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.error('Error getting settings:', error)
    return {}
  }
}

// Bookmark a question
export function bookmarkQuestion(questionId: number): void {
  try {
    const bookmarks = getBookmarks()
    if (!bookmarks.includes(questionId)) {
      bookmarks.push(questionId)
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks))
    }
  } catch (error) {
    console.error('Error bookmarking question:', error)
  }
}

// Remove bookmark
export function removeBookmark(questionId: number): void {
  try {
    const bookmarks = getBookmarks()
    const filtered = bookmarks.filter(id => id !== questionId)
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(filtered))
  } catch (error) {
    console.error('Error removing bookmark:', error)
  }
}

// Get bookmarked questions
export function getBookmarks(): number[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.BOOKMARKS)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error getting bookmarks:', error)
    return []
  }
}

// Export progress as JSON
export function exportProgress(): string {
  const progress = getUserProgress()
  const settings = getSettings()
  const bookmarks = getBookmarks()
  
  const exportData = {
    progress,
    settings,
    bookmarks,
    exportDate: new Date().toISOString(),
    version: '1.0.0'
  }
  
  return JSON.stringify(exportData, null, 2)
}

// Import progress from JSON
export function importProgress(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString)
    
    if (data.progress) {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(data.progress))
    }
    
    if (data.settings) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings))
    }
    
    if (data.bookmarks) {
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(data.bookmarks))
    }
    
    return true
  } catch (error) {
    console.error('Error importing progress:', error)
    return false
  }
}

// Clear all data
export function clearAllData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.PROGRESS)
    localStorage.removeItem(STORAGE_KEYS.SETTINGS)
    localStorage.removeItem(STORAGE_KEYS.BOOKMARKS)
    localStorage.removeItem(STORAGE_KEYS.DOMAIN_STATS)
  } catch (error) {
    console.error('Error clearing data:', error)
  }
}

// Get motivational message based on score
export function getMotivationalMessage(percentage: number): string {
  if (percentage === 100) {
    return "🏆 Perfect Score! You're a CISSP master!"
  } else if (percentage >= 90) {
    return "🌟 Outstanding performance! You're almost there!"
  } else if (percentage >= 80) {
    return "💪 Great job! Keep up the excellent work!"
  } else if (percentage >= 70) {
    return "👍 Good effort! You're on the right track."
  } else if (percentage >= 60) {
    return "📈 Making progress! Keep practicing to improve."
  } else if (percentage >= 50) {
    return "💡 Halfway there! Focus on understanding the concepts."
  } else {
    return "🎯 Every expert was once a beginner. Keep studying!"
  }
}

// Get study progress with domain stats
export function getStudyProgress(): StudyProgress {
  const progress = initializeProgress()
  
  // Ensure all domains are represented
  if (!progress.domainStats) {
    progress.domainStats = initializeDomainStats()
  }
  
  return {
    ...progress,
    domainStats: progress.domainStats
  } as StudyProgress
}

// Get recent quiz attempts
export function getRecentAttempts(limit: number = 5): QuizAttempt[] {
  const progress = getUserProgress()
  
  return progress.attempts
    .slice(-limit)
    .reverse()
    .map((attempt, index) => {
      const domain = attempt.domain_id ? CISSP_DOMAINS.find(d => d.id === attempt.domain_id) : null
      return {
        ...attempt,
        id: `attempt-${index}`,
        domain_name: domain?.name || 'All Domains'
      }
    })
}

// Get overall statistics
export function getOverallStats(): {
  totalAttempts: number
  averageScore: number
  totalStudyTime: number
  bestScore: number
} {
  const progress = getUserProgress()
  
  if (progress.attempts.length === 0) {
    return {
      totalAttempts: 0,
      averageScore: 0,
      totalStudyTime: 0,
      bestScore: 0
    }
  }
  
  const totalAttempts = progress.attempts.length
  const averageScore = Math.round(
    progress.attempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts
  )
  const totalStudyTime = progress.attempts.reduce((sum, a) => sum + a.time_spent, 0)
  const bestScore = Math.max(...progress.attempts.map(a => a.score))
  
  return {
    totalAttempts,
    averageScore,
    totalStudyTime,
    bestScore
  }
}

// Clear progress data
export function clearProgress(): boolean {
  try {
    const confirmed = window.confirm(
      'Are you sure you want to clear all your progress? This action cannot be undone.'
    )
    
    if (confirmed) {
      localStorage.removeItem(STORAGE_KEYS.PROGRESS)
      localStorage.removeItem(STORAGE_KEYS.DOMAIN_STATS)
      return true
    }
    return false
  } catch (error) {
    console.error('Error clearing progress:', error)
    return false
  }
}

// Format time in human-readable format
export function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`
  }
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  
  if (minutes > 0) {
    return `${minutes}m ${secs}s`
  }
  
  return `${secs}s`
}

// Recalculate all domain stats from attempts (useful for migration)
export function recalculateDomainStats(): void {
  const progress = initializeProgress()
  
  // Reset all domain stats
  progress.domainStats = initializeDomainStats()
  
  // Recalculate from attempts
  for (const attempt of progress.attempts) {
    if (attempt.domain_id && progress.domainStats[attempt.domain_id]) {
      const domainStat = progress.domainStats[attempt.domain_id]
      
      domainStat.total_attempts++
      domainStat.questions_attempted += attempt.questions_attempted
      domainStat.correct_answers += attempt.correct_answers
      
      if (attempt.score > domainStat.best_score) {
        domainStat.best_score = attempt.score
      }
    }
  }
  
  // Calculate averages
  for (const domainId in progress.domainStats) {
    const domainStat = progress.domainStats[domainId]
    const domainAttempts = progress.attempts.filter(a => a.domain_id === parseInt(domainId))
    
    if (domainAttempts.length > 0) {
      domainStat.average_score = Math.round(
        domainAttempts.reduce((sum, a) => sum + a.score, 0) / domainAttempts.length
      )
      
      const totalTime = domainAttempts.reduce((sum, a) => sum + a.time_spent, 0)
      const totalQs = domainAttempts.reduce((sum, a) => sum + a.questions_attempted, 0)
      domainStat.avg_time_per_question = totalQs > 0 ? Math.round(totalTime / totalQs) : 0
      
      const lastAttempt = domainAttempts.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0]
      
      if (lastAttempt) {
        domainStat.last_attempt_date = lastAttempt.date
      }
    }
  }
  
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress))
}
