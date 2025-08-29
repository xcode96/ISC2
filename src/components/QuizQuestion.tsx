'use client'

import { useState, useEffect } from 'react'
import QuizButton from './QuizButton'
import { QuizQuestion as QuizQuestionType } from '@/types/quiz'
import { cn } from '@/lib/utils'

interface QuizQuestionProps {
  question: QuizQuestionType
  selectedAnswer?: string
  onAnswerSelect: (answer: string) => void
  showResult?: boolean
  isReviewMode?: boolean
  questionNumber: number
  totalQuestions: number
  timeRemaining?: number
}

export default function QuizQuestion({
  question,
  selectedAnswer,
  onAnswerSelect,
  showResult = false,
  isReviewMode = false,
  questionNumber,
  totalQuestions,
  timeRemaining
}: QuizQuestionProps) {
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([])

  useEffect(() => {
    // Shuffle options once when component mounts
    if (question.options) {
      const shuffled = [...question.options].sort(() => Math.random() - 0.5)
      setShuffledOptions(shuffled)
    }
  }, [question.options])

  const getOptionVariant = (option: string) => {
    if (!showResult && !isReviewMode) {
      return selectedAnswer === option ? 'selected' : 'answer'
    }
    
    if (option === question.correct_answer) {
      return 'correct'
    }
    
    if (selectedAnswer === option && selectedAnswer !== question.correct_answer) {
      return 'incorrect'
    }
    
    return 'answer'
  }

  const getOptionLetter = (index: number) => {
    return String.fromCharCode(65 + index) // A, B, C, D...
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-500">
            Question {questionNumber} of {totalQuestions}
          </span>
          {question.difficulty && (
            <span className={cn(
              "px-2 py-1 rounded text-xs font-medium",
              question.difficulty <= 3 ? "bg-green-100 text-green-800" :
              question.difficulty <= 6 ? "bg-yellow-100 text-yellow-800" :
              "bg-red-100 text-red-800"
            )}>
              {question.difficulty <= 3 ? 'Easy' :
               question.difficulty <= 6 ? 'Medium' : 'Hard'}
            </span>
          )}
        </div>
        {timeRemaining !== undefined && (
          <div className={cn(
            "text-sm font-medium px-3 py-1 rounded",
            timeRemaining <= 60 ? "bg-red-100 text-red-600" :
            timeRemaining <= 300 ? "bg-yellow-100 text-yellow-600" :
            "bg-gray-100 text-gray-600"
          )}>
            {formatTime(timeRemaining)}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question Text */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
          {question.question_text}
        </h2>
      </div>

      {/* Answer Options */}
      <div className="space-y-4 mb-8">
        {shuffledOptions.map((option, index) => (
          <div key={option} className="relative">
            <QuizButton
              variant={getOptionVariant(option)}
              size="lg"
              className="w-full text-left justify-start min-h-[60px] p-4"
              onClick={() => !showResult && !isReviewMode && onAnswerSelect(option)}
              disabled={showResult || isReviewMode}
            >
              <span className="flex items-start space-x-3 w-full">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-current bg-opacity-20 flex items-center justify-center text-sm font-medium">
                  {getOptionLetter(index)}
                </span>
                <span className="flex-1 text-left">{option}</span>
              </span>
            </QuizButton>
            
            {/* Correct answer indicator */}
            {showResult && option === question.correct_answer && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            
            {/* Wrong answer indicator */}
            {showResult && selectedAnswer === option && option !== question.correct_answer && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Explanation */}
      {(showResult || isReviewMode) && question.explanation && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Explanation</h3>
          <p className="text-blue-700 text-sm leading-relaxed">{question.explanation}</p>
        </div>
      )}
    </div>
  )
}