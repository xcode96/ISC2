'use client'

import { useState, useEffect } from 'react'
import { QuizQuestion } from '@/types/quiz'
import './MultiQuestionCard.css'

interface MultiQuestionCardProps {
  questions: QuizQuestion[]
  onAnswersChange?: (answers: Record<number, string>) => void
  showResults?: boolean
  userAnswers?: Record<number, string>
}

export default function MultiQuestionCard({ 
  questions, 
  onAnswersChange,
  showResults = false,
  userAnswers = {}
}: MultiQuestionCardProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>(userAnswers)
  const [showExplanations, setShowExplanations] = useState<Record<number, boolean>>({})

  useEffect(() => {
    if (onAnswersChange) {
      onAnswersChange(selectedAnswers)
    }
  }, [selectedAnswers, onAnswersChange])

  const handleAnswerSelect = (questionId: number, answer: string) => {
    if (!showResults) {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionId]: answer
      }))
    }
  }

  const toggleExplanation = (questionId: number) => {
    setShowExplanations(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }))
  }

  const getAnswerClass = (questionId: number, optionLetter: string) => {
    const selected = selectedAnswers[questionId]
    const correct = questions.find(q => q.id === questionId)?.correct_answer
    
    if (!showResults) {
      return selected === optionLetter ? 'option-selected' : ''
    }
    
    if (optionLetter === correct) {
      return 'option-correct'
    }
    
    if (selected === optionLetter && selected !== correct) {
      return 'option-incorrect'
    }
    
    return ''
  }

  return (
    <div className="multi-question-card">
      <div className="card-header">
        <h2 className="card-title">Quiz Questions</h2>
        {showResults && (
          <div className="results-summary">
            {Object.keys(selectedAnswers).length} of {questions.length} answered
          </div>
        )}
      </div>
      
      <div className="questions-container">
        {questions.map((question, index) => {
          const selected = selectedAnswers[question.id]
          const isCorrect = showResults && selected === question.correct_answer
          
          return (
            <div key={question.id} className="question-block">
              <div className="question-header">
                <span className="question-number">Question {index + 1}</span>
                {showResults && (
                  <span className={`question-status ${isCorrect ? 'correct' : selected ? 'incorrect' : 'unanswered'}`}>
                    {isCorrect ? '✓ Correct' : selected ? '✗ Incorrect' : '— Unanswered'}
                  </span>
                )}
              </div>
              
              <p className="question-text">{question.question_text}</p>
              
              <div className="options-grid">
                {question.options.map((option, optionIndex) => {
                  const optionLetter = String.fromCharCode('a'.charCodeAt(0) + optionIndex)
                  
                  return (
                    <label
                      key={optionIndex}
                      className={`option-label ${getAnswerClass(question.id, optionLetter)}`}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={optionLetter}
                        checked={selectedAnswers[question.id] === optionLetter}
                        onChange={() => handleAnswerSelect(question.id, optionLetter)}
                        disabled={showResults}
                        className="option-radio"
                      />
                      <span className="option-letter">{optionLetter}.</span>
                      <span className="option-text">{option}</span>
                      {showResults && optionLetter === question.correct_answer && (
                        <span className="correct-indicator">✓</span>
                      )}
                    </label>
                  )
                })}
              </div>
              
              {showResults && question.explanation && (
                <div className="explanation-section">
                  <button
                    onClick={() => toggleExplanation(question.id)}
                    className="explanation-toggle"
                  >
                    {showExplanations[question.id] ? 'Hide' : 'Show'} Explanation
                  </button>
                  {showExplanations[question.id] && (
                    <div className="explanation-content">
                      {question.explanation}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}