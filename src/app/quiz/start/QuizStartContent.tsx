'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { flushSync } from 'react-dom'
import MultiQuestionCard from '@/components/MultiQuestionCard'
import QuizResults from '@/components/QuizResults'
import QuizTimer from '@/components/QuizTimer'
import ScrollToTopLink from '@/components/ScrollToTopLink'
import { QuizQuestion as QuizQuestionType } from '@/types/quiz'
import { getFilteredQuestions, getRandomQuestions } from '@/lib/static-questions'
import '../quiz.css'

const QUESTIONS_PER_PAGE = 10

export default function QuizStartContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [questions, setQuestions] = useState<QuizQuestionType[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [startTime] = useState(Date.now())
  const [elapsedTime, setElapsedTime] = useState(0)
  const [timeLimit, setTimeLimit] = useState<number | null>(null)
  
  // Determine timer mode based on quiz type
  const isQuickQuiz = searchParams.get('count') === '30' && !searchParams.get('timeLimit')
  const timerMode = isQuickQuiz ? 'countup' : timeLimit ? 'countdown' : 'countup'
  const initialTime = timerMode === 'countdown' && timeLimit ? timeLimit : 0
  
  // Calculate pagination
  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE)
  const currentQuestions = questions.slice(
    currentPage * QUESTIONS_PER_PAGE,
    (currentPage + 1) * QUESTIONS_PER_PAGE
  )

  // Force scroll to top function with better reliability
  const forceScrollToTop = useCallback(() => {
    // Method 1: Window scroll
    window.scrollTo(0, 0)
    
    // Method 2: Document element scroll
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    
    // Method 3: Find and scroll quiz container
    const quizContainer = document.querySelector('.quiz-container')
    if (quizContainer) {
      quizContainer.scrollTop = 0
      quizContainer.scrollIntoView({ block: 'start', behavior: 'instant' })
    }
    
    // Method 4: Find main element and scroll it
    const mainElement = document.querySelector('main')
    if (mainElement) {
      mainElement.scrollTop = 0
    }
    
    // Method 5: Focus on header to force viewport to top
    const quizHeader = document.querySelector('.quiz-header')
    if (quizHeader instanceof HTMLElement) {
      quizHeader.focus({ preventScroll: false })
    }
  }, [])

  // Scroll to top whenever currentPage changes
  useEffect(() => {
    forceScrollToTop()
  }, [currentPage, forceScrollToTop])

  // Load quiz questions on component mount
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true)
        
        // Parse query parameters
        const count = parseInt(searchParams.get('count') || '30')
        const domainId = searchParams.get('domain') ? parseInt(searchParams.get('domain')!) : undefined
        const subdomainIds = searchParams.get('subdomains')?.split(',').map(id => parseInt(id))
        const difficulty = searchParams.get('difficulty')?.split(',').map(d => parseInt(d))
        const shuffle = searchParams.get('shuffle') !== 'false'
        const shuffleAnswers = searchParams.get('shuffleAnswers') !== 'false'
        
        // Load questions using static loader
        let loadedQuestions: QuizQuestionType[]
        
        if (domainId || subdomainIds || difficulty) {
          loadedQuestions = await getFilteredQuestions(
            count,
            domainId,
            subdomainIds,
            difficulty,
            shuffle,
            shuffleAnswers
          )
        } else {
          loadedQuestions = await getRandomQuestions(count)
        }
        
        if (loadedQuestions.length === 0) {
          throw new Error('No questions found matching criteria')
        }
        
        setQuestions(loadedQuestions)
        
        // Set time limit if specified
        const timeLimitParam = searchParams.get('timeLimit')
        if (timeLimitParam) {
          const limit = parseInt(timeLimitParam)
          setTimeLimit(limit)
        }
        
      } catch (error) {
        console.error('Error loading questions:', error)
        setError(error instanceof Error ? error.message : 'Failed to load quiz')
      } finally {
        setLoading(false)
      }
    }
    
    loadQuestions()
  }, [searchParams])

  // Update elapsed time for results
  useEffect(() => {
    if (!showResults) {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [startTime, showResults])

  const handleAnswersChange = useCallback((answers: Record<number, string>) => {
    setUserAnswers(prev => ({
      ...prev,
      ...answers
    }))
  }, [])

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      // Use requestAnimationFrame to ensure DOM updates before scrolling
      requestAnimationFrame(() => {
        flushSync(() => {
          setCurrentPage(prev => prev + 1)
        })
        
        // Double requestAnimationFrame to ensure render completion
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            forceScrollToTop()
          })
        })
      })
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      // Use requestAnimationFrame to ensure DOM updates before scrolling
      requestAnimationFrame(() => {
        flushSync(() => {
          setCurrentPage(prev => prev - 1)
        })
        
        // Double requestAnimationFrame to ensure render completion
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            forceScrollToTop()
          })
        })
      })
    }
  }

  const handleSubmitQuiz = useCallback(async () => {
    flushSync(() => {
      setShowResults(true)
    })
    
    forceScrollToTop()
    
    // Save results to localStorage
    try {
      const { saveQuizAttempt } = await import('@/lib/localStorage')
      const urlDomainId = searchParams.get('domain')
      const correctAnswers = questions.filter(q => userAnswers[q.id] === q.correct_answer).length
      const score = Math.round((correctAnswers / questions.length) * 100)
      const difficulty = searchParams.get('difficulty')?.split(',').map(Number) || [1, 2, 3, 4, 5]
      const timeSpent = timerMode === 'countdown' && timeLimit ? timeLimit - elapsedTime : elapsedTime
      
      // If a specific domain was selected, save for that domain
      if (urlDomainId) {
        saveQuizAttempt({
          domain_id: parseInt(urlDomainId),
          questions_attempted: questions.length,
          correct_answers: correctAnswers,
          score,
          time_spent: timeSpent,
          difficulty
        })
      } else {
        // For mixed quizzes, save stats for each domain represented
        const domainGroups: Record<number, { questions: typeof questions, correct: number }> = {}
        
        questions.forEach(q => {
          // Determine domain_id from question
          let domainId = q.domain_id
          if (!domainId && q.subdomain_id) {
            domainId = Math.floor(q.subdomain_id / 10) || 1
          }
          if (!domainId) {
            // If no domain info, skip or assign to domain 1
            domainId = 1
          }
          
          if (!domainGroups[domainId]) {
            domainGroups[domainId] = { questions: [], correct: 0 }
          }
          domainGroups[domainId].questions.push(q)
          if (userAnswers[q.id] === q.correct_answer) {
            domainGroups[domainId].correct++
          }
        })
        
        // Save a quiz attempt for each domain
        for (const [domainId, group] of Object.entries(domainGroups)) {
          const domainScore = group.questions.length > 0 
            ? Math.round((group.correct / group.questions.length) * 100)
            : 0
          const domainTime = Math.round(timeSpent * (group.questions.length / questions.length))
          
          saveQuizAttempt({
            domain_id: parseInt(domainId),
            questions_attempted: group.questions.length,
            correct_answers: group.correct,
            score: domainScore,
            time_spent: domainTime,
            difficulty
          })
        }
      }
    } catch (submitError) {
      console.warn('Failed to save quiz attempt to localStorage:', submitError)
    }
  }, [questions, userAnswers, searchParams, forceScrollToTop, timerMode, timeLimit, elapsedTime])

  const handleTimeUp = useCallback(() => {
    if (!showResults) {
      handleSubmitQuiz()
    }
  }, [showResults, handleSubmitQuiz])

  const handleRetakeQuiz = () => {
    flushSync(() => {
      setUserAnswers({})
      setShowResults(false)
      setCurrentPage(0)
      setElapsedTime(0)
    })
    forceScrollToTop()
  }

  // Calculate domain performance
  const domainPerformance = useMemo(() => {
    if (!showResults) return []
    
    const domainStats: Record<number, any> = {}
    
    const domainNames: Record<number, string> = {
      1: 'Security and Risk Management',
      2: 'Asset Security', 
      3: 'Security Architecture and Engineering',
      4: 'Communication and Network Security',
      5: 'Identity and Access Management',
      6: 'Security Assessment and Testing',
      7: 'Security Operations',
      8: 'Software Development Security'
    }
    
    questions.forEach(q => {
      let domainId = q.domain_id
      
      if (!domainId && q.subdomain_id) {
        domainId = Math.floor(q.subdomain_id / 10) || 1
      }
      
      if (!domainId) {
        domainId = Math.floor(Math.random() * 8) + 1
      }
      
      if (!domainStats[domainId]) {
        domainStats[domainId] = {
          domainNumber: domainId,
          domainName: domainNames[domainId] || `Domain ${domainId}`,
          questionsAttempted: 0,
          correctAnswers: 0,
          totalTime: 0,
          accuracy: 0,
          averageTime: 0
        }
      }
      
      domainStats[domainId].questionsAttempted++
      domainStats[domainId].totalTime += elapsedTime / questions.length
      
      if (userAnswers[q.id] === q.correct_answer) {
        domainStats[domainId].correctAnswers++
      }
    })
    
    Object.values(domainStats).forEach((stat: any) => {
      stat.accuracy = Math.round((stat.correctAnswers / stat.questionsAttempted) * 100)
      stat.averageTime = stat.totalTime / stat.questionsAttempted
    })
    
    return Object.values(domainStats)
  }, [showResults, questions, userAnswers, elapsedTime])

  const calculateScore = () => {
    let correct = 0
    questions.forEach(question => {
      if (userAnswers[question.id] === question.correct_answer) {
        correct++
      }
    })
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100)
    }
  }

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="quiz-content">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading quiz questions...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="quiz-container">
        <div className="quiz-content">
          <div className="text-center max-w-md mx-auto">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-100 mb-2">Unable to load quiz</h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <ScrollToTopLink
              href="/quiz"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-block"
            >
              Back to Quiz Selection
            </ScrollToTopLink>
          </div>
        </div>
      </div>
    )
  }

  const score = showResults ? calculateScore() : null

  return (
    <div className="quiz-container">
      <ScrollToTopLink href="/quiz" className="back-to-home">
        ← Back to Quiz Selection
      </ScrollToTopLink>
      
      <div className="quiz-content" id="quiz-top">
        <div className="quiz-header" tabIndex={-1}>
          <h1>CISSP Practice Quiz</h1>
          <p>Master your knowledge with comprehensive practice questions</p>
        </div>

        {/* Quiz Timer Display */}
        {!showResults && (
          <QuizTimer
            mode={timerMode}
            initialTime={initialTime}
            onTimeUp={timerMode === 'countdown' ? handleTimeUp : undefined}
            isActive={!showResults}
          />
        )}

        {/* Enhanced Results Display */}
        {showResults && score && (
          <QuizResults
            score={score}
            timeSpent={elapsedTime}
            domainPerformance={domainPerformance}
            averageTimePerQuestion={elapsedTime / questions.length}
            onRetakeQuiz={handleRetakeQuiz}
          />
        )}

        {/* Question Card - Only show when not showing results */}
        {!showResults && (
          <MultiQuestionCard
            questions={currentQuestions}
            onAnswersChange={handleAnswersChange}
            showResults={showResults}
            userAnswers={userAnswers}
          />
        )}

        {/* Navigation and Progress - Only show when not showing results */}
        {!showResults && (
          <div className="navigation-container">
            <div className="navigation-controls">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 0}
                className="nav-button nav-button-prev"
              >
                <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="nav-button-text">Previous</span>
              </button>

              <div className="page-indicator">
                <span className="page-text">
                  Page {currentPage + 1} of {totalPages}
                </span>
              </div>

              {currentPage === totalPages - 1 && !showResults ? (
                <button
                  onClick={handleSubmitQuiz}
                  className="nav-button nav-button-submit"
                >
                  <span className="nav-button-text">Submit Quiz</span>
                  <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages - 1}
                  className="nav-button nav-button-next"
                >
                  <span className="nav-button-text">Next</span>
                  <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>

            {/* Progress Bar */}
            <div className="progress-section">
              <div className="progress-info">
                <span className="progress-text">
                  <span className="progress-label">Progress:</span> 
                  <span className="progress-value">{Object.keys(userAnswers).length} / {questions.length}</span> answered
                </span>
                <span className="time-text">
                  <span className="time-label">Time:</span> 
                  <span className="time-value">{Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}</span>
                </span>
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill"
                  style={{ 
                    width: `${(Object.keys(userAnswers).length / questions.length) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
