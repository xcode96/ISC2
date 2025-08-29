// Question tracking system to prevent repetition
const STORAGE_KEY = 'cissp_seen_questions'
const STORAGE_EXPIRY_KEY = 'cissp_seen_questions_expiry'
const EXPIRY_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

export interface SeenQuestionsData {
  questionIds: Set<number>
  lastUpdated: number
  totalQuestions: number
}

/**
 * Get seen questions from localStorage
 */
export function getSeenQuestions(): Set<number> {
  if (typeof window === 'undefined') return new Set()
  
  try {
    // Check if data has expired
    const expiryStr = localStorage.getItem(STORAGE_EXPIRY_KEY)
    if (expiryStr) {
      const expiry = parseInt(expiryStr)
      if (Date.now() > expiry) {
        clearSeenQuestions()
        return new Set()
      }
    }
    
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return new Set()
    
    const data = JSON.parse(stored)
    return new Set(data.questionIds)
  } catch (error) {
    console.error('Error loading seen questions:', error)
    return new Set()
  }
}

/**
 * Add questions to seen list
 */
export function addSeenQuestions(questionIds: number[]): void {
  if (typeof window === 'undefined') return
  
  try {
    const currentSeen = getSeenQuestions()
    questionIds.forEach(id => currentSeen.add(id))
    
    const data: SeenQuestionsData = {
      questionIds: Array.from(currentSeen) as any,
      lastUpdated: Date.now(),
      totalQuestions: currentSeen.size
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    
    // Set expiry if not already set
    if (!localStorage.getItem(STORAGE_EXPIRY_KEY)) {
      localStorage.setItem(STORAGE_EXPIRY_KEY, (Date.now() + EXPIRY_DURATION).toString())
    }
  } catch (error) {
    console.error('Error saving seen questions:', error)
  }
}

/**
 * Clear all seen questions
 */
export function clearSeenQuestions(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(STORAGE_EXPIRY_KEY)
  } catch (error) {
    console.error('Error clearing seen questions:', error)
  }
}

/**
 * Get statistics about seen questions
 */
export function getSeenQuestionsStats(): {
  seenCount: number
  lastUpdated: Date | null
  percentageSeen: number
} {
  if (typeof window === 'undefined') {
    return { seenCount: 0, lastUpdated: null, percentageSeen: 0 }
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return { seenCount: 0, lastUpdated: null, percentageSeen: 0 }
    }
    
    const data = JSON.parse(stored)
    const totalQuestions = 900 // Approximate total questions
    
    return {
      seenCount: data.questionIds?.length || 0,
      lastUpdated: data.lastUpdated ? new Date(data.lastUpdated) : null,
      percentageSeen: Math.round(((data.questionIds?.length || 0) / totalQuestions) * 100)
    }
  } catch (error) {
    console.error('Error getting seen questions stats:', error)
    return { seenCount: 0, lastUpdated: null, percentageSeen: 0 }
  }
}

/**
 * Check if we should reset seen questions (when most questions have been seen)
 */
export function shouldResetSeenQuestions(totalAvailable: number): boolean {
  const seen = getSeenQuestions()
  // Reset when 80% of available questions have been seen
  return seen.size >= totalAvailable * 0.8
}
