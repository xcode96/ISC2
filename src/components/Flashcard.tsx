'use client'

import { useState } from 'react'
import { Flashcard } from '@/lib/utils/flashcard-parser'
import './Flashcard.css'

interface FlashcardComponentProps {
  card: Flashcard
  onNext?: () => void
  onPrevious?: () => void
  currentIndex: number
  totalCards: number
}

export default function FlashcardComponent({
  card,
  onNext,
  onPrevious,
  currentIndex,
  totalCards
}: FlashcardComponentProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleFlip = () => {
    if (!isAnimating) {
      setIsAnimating(true)
      setIsFlipped(!isFlipped)
      setTimeout(() => setIsAnimating(false), 600)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      handleFlip()
    } else if (e.key === 'ArrowRight' && onNext) {
      onNext()
      setIsFlipped(false)
    } else if (e.key === 'ArrowLeft' && onPrevious) {
      onPrevious()
      setIsFlipped(false)
    }
  }

  return (
    <div className="flashcard-container" onKeyDown={handleKeyPress} tabIndex={0}>
      <div className="flashcard-header">
        <span className="subdomain-label">Subdomain {card.subdomain}</span>
        <span className="card-counter">{currentIndex + 1} / {totalCards}</span>
      </div>

      <div 
        className={`flashcard ${isFlipped ? 'flipped' : ''}`}
        onClick={handleFlip}
      >
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <div className="card-content">
              <div className="card-label">Question</div>
              <p className="card-text">{card.front}</p>
            </div>
            <div className="flip-hint">Click to reveal answer</div>
          </div>

          <div className="flashcard-back">
            <div className="card-content">
              <div className="card-label">Answer</div>
              <div className="card-text">{card.back}</div>
            </div>
            <div className="flip-hint">Click to see question</div>
          </div>
        </div>
      </div>

      <div className="flashcard-controls">
        <button 
          className="control-btn prev-btn"
          onClick={() => {
            onPrevious?.()
            setIsFlipped(false)
          }}
          disabled={currentIndex === 0}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Previous
        </button>

        <button 
          className="control-btn flip-btn"
          onClick={handleFlip}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Flip Card
        </button>

        <button 
          className="control-btn next-btn"
          onClick={() => {
            onNext?.()
            setIsFlipped(false)
          }}
          disabled={currentIndex === totalCards - 1}
        >
          Next
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="keyboard-hints">
        <span>Space/Enter: Flip</span>
        <span>←→: Navigate</span>
        <span>Esc: Close</span>
      </div>
    </div>
  )
}
