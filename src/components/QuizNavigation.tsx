'use client'

import QuizButton from './QuizButton'
import { cn, formatTime } from '@/lib/utils'

interface QuizNavigationProps {
  currentQuestion: number
  totalQuestions: number
  answeredQuestions: Set<number>
  onQuestionSelect: (questionIndex: number) => void
  onPrevious: () => void
  onNext: () => void
  onSubmit: () => void
  canGoNext: boolean
  canGoPrevious: boolean
  isLastQuestion: boolean
  timeElapsed: number
  isReviewMode?: boolean
}

export default function QuizNavigation({
  currentQuestion,
  totalQuestions,
  answeredQuestions,
  onQuestionSelect,
  onPrevious,
  onNext,
  onSubmit,
  canGoNext,
  canGoPrevious,
  isLastQuestion,
  timeElapsed,
  isReviewMode = false
}: QuizNavigationProps) {
  const getQuestionStatus = (index: number) => {
    const questionNumber = index + 1
    if (questionNumber === currentQuestion) return 'current'
    if (answeredQuestions.has(index)) return 'answered'
    return 'unanswered'
  }

  const getQuestionButtonVariant = (status: string) => {
    switch (status) {
      case 'current':
        return 'primary'
      case 'answered':
        return 'secondary'
      default:
        return 'answer'
    }
  }

  return (
    <div className="bg-white border-t border-gray-200 p-4 sticky bottom-0 shadow-lg">
      <div className="max-w-6xl mx-auto">
        {/* Question Grid */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">Question Navigation</h3>
            <div className="text-sm text-gray-600">
              Time: {formatTime(timeElapsed)}
            </div>
          </div>
          
          <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-20 gap-2">
            {Array.from({ length: totalQuestions }, (_, index) => {
              const status = getQuestionStatus(index)
              const questionNumber = index + 1
              
              return (
                <button
                  key={index}
                  onClick={() => onQuestionSelect(index)}
                  className={cn(
                    "w-8 h-8 text-xs font-medium rounded transition-all duration-200",
                    "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1",
                    status === 'current' && "bg-blue-600 text-white ring-2 ring-blue-300 scale-110",
                    status === 'answered' && "bg-green-500 text-white hover:bg-green-600",
                    status === 'unanswered' && "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  )}
                >
                  {questionNumber}
                </button>
              )
            })}
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center space-x-6 mt-3 text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span>Current</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Answered ({answeredQuestions.size})</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <span>Unanswered ({totalQuestions - answeredQuestions.size})</span>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <QuizButton
            variant="secondary"
            onClick={onPrevious}
            disabled={!canGoPrevious}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Previous</span>
          </QuizButton>

          <div className="flex-1 mx-4">
            {/* Progress Information */}
            <div className="text-center">
              <div className="text-sm font-medium text-gray-900 mb-1">
                Progress: {answeredQuestions.size} of {totalQuestions} answered
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(answeredQuestions.size / totalQuestions) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            {!isLastQuestion ? (
              <QuizButton
                variant="primary"
                onClick={onNext}
                disabled={!canGoNext}
              >
                <span>Next</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </QuizButton>
            ) : (
              <QuizButton
                variant="primary"
                onClick={onSubmit}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <span>{isReviewMode ? 'Finish Review' : 'Submit Quiz'}</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </QuizButton>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        {!isReviewMode && (
          <div className="flex justify-center mt-3 space-x-4">
            <button
              onClick={onSubmit}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Submit Early
            </button>
            <span className="text-gray-300">|</span>
            <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              Mark for Review
            </button>
          </div>
        )}
      </div>
    </div>
  )
}