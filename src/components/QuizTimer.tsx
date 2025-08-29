'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

interface QuizTimerProps {
  mode: 'countdown' | 'countup'
  initialTime: number // in seconds
  onTimeUp?: () => void
  isActive?: boolean
}

export default function QuizTimer({ mode, initialTime, onTimeUp, isActive = true }: QuizTimerProps) {
  const [time, setTime] = useState(initialTime)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(Date.now())
  const pausedTimeRef = useRef<number>(0)
  const hasCalledTimeUp = useRef(false)
  
  // Reset when initialTime changes
  useEffect(() => {
    setTime(initialTime)
    startTimeRef.current = Date.now()
    pausedTimeRef.current = 0
    hasCalledTimeUp.current = false
  }, [initialTime])
  
  // Use a more accurate timing mechanism
  const updateTimer = useCallback(() => {
    const now = Date.now()
    const elapsed = Math.floor((now - startTimeRef.current) / 1000) - pausedTimeRef.current
    
    if (mode === 'countdown') {
      const newTime = Math.max(0, initialTime - elapsed)
      setTime(newTime)
      
      if (newTime === 0 && !hasCalledTimeUp.current && onTimeUp) {
        hasCalledTimeUp.current = true
        onTimeUp()
      }
    } else {
      setTime(initialTime + elapsed)
    }
  }, [mode, initialTime, onTimeUp])
  
  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
        // Track paused time
        const now = Date.now()
        pausedTimeRef.current += Math.floor((now - startTimeRef.current) / 1000)
        startTimeRef.current = now
      }
      return
    }
    
    // Update immediately when becoming active
    updateTimer()
    
    // Use requestAnimationFrame for smooth updates
    let rafId: number
    const tick = () => {
      updateTimer()
      rafId = requestAnimationFrame(tick)
    }
    
    // Start the animation frame loop
    rafId = requestAnimationFrame(tick)
    
    // Also use setInterval as a backup (every 100ms for accuracy)
    intervalRef.current = setInterval(updateTimer, 100)
    
    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isActive, updateTimer])
  
  // Calculate time components
  const days = Math.floor(Math.abs(time) / (24 * 60 * 60))
  const hours = Math.floor((Math.abs(time) % (24 * 60 * 60)) / 3600)
  const minutes = Math.floor((Math.abs(time) % 3600) / 60)
  const seconds = Math.abs(time) % 60
  
  // Determine if we should show negative sign (for countdown that's gone negative)
  const isNegative = time < 0
  
  // Determine which units to show based on the magnitude
  const showDays = days > 0
  const showHours = showDays || hours > 0
  
  return (
    <div className="quiz-timer-container">
      <div className="timer-wrapper">
        <div className="timer-display">
          {isNegative && <span className="timer-negative">-</span>}
          
          {showDays && (
            <>
              <div className="timer-unit">
                <span className="timer-value">{String(days).padStart(2, '0')}</span>
                <span className="timer-label">days</span>
              </div>
            </>
          )}
          
          {showHours && (
            <>
              <div className="timer-unit">
                <span className="timer-value">{String(hours).padStart(2, '0')}</span>
                <span className="timer-label">hours</span>
              </div>
            </>
          )}
          
          <div className="timer-unit">
            <span className="timer-value">{String(minutes).padStart(2, '0')}</span>
            <span className="timer-label">minutes</span>
          </div>
          
          <div className="timer-unit">
            <span className="timer-value">{String(seconds).padStart(2, '0')}</span>
            <span className="timer-label">seconds</span>
          </div>
        </div>
        
        {mode === 'countdown' && time <= 300 && time > 0 && (
          <div className="timer-warning">
            <svg className="warning-icon" fill="currentColor" viewBox="0 0 20 20" width="16" height="16">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>5 minutes remaining!</span>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .quiz-timer-container {
          position: sticky;
          top: 20px;
          z-index: 10;
          margin-bottom: 2rem;
        }
        
        .timer-wrapper {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(148, 163, 184, 0.1);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }
        
        .timer-display {
          display: flex;
          justify-content: center;
          align-items: baseline;
          gap: 2rem;
          position: relative;
        }
        
        .timer-negative {
          font-size: 3rem;
          color: #ef4444;
          font-weight: 300;
          margin-right: 1rem;
          line-height: 1;
        }
        
        .timer-unit {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }
        
        .timer-value {
          font-size: 3.5rem;
          font-weight: 200;
          color: #f3f4f6;
          line-height: 1;
          letter-spacing: -0.02em;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          min-width: 80px;
          text-align: center;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          font-variant-numeric: tabular-nums;
        }
        
        .timer-label {
          font-size: 0.875rem;
          color: #94a3b8;
          text-transform: lowercase;
          letter-spacing: 0.05em;
          font-weight: 400;
        }
        
        .timer-warning {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 8px;
          color: #f87171;
          font-size: 0.875rem;
          font-weight: 500;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .warning-icon {
          width: 16px;
          height: 16px;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        /* Responsive design */
        @media (max-width: 768px) {
          .timer-display {
            gap: 1rem;
          }
          
          .timer-value {
            font-size: 2.5rem;
            min-width: 60px;
          }
          
          .timer-label {
            font-size: 0.75rem;
          }
        }
        
        @media (max-width: 480px) {
          .timer-wrapper {
            padding: 1rem;
          }
          
          .timer-display {
            gap: 0.75rem;
          }
          
          .timer-value {
            font-size: 2rem;
            min-width: 50px;
          }
          
          .timer-negative {
            font-size: 2rem;
            margin-right: 0.5rem;
          }
        }
        
        /* Special styling for count up mode */
        ${mode === 'countup' ? `
          .timer-value {
            color: #60a5fa;
          }
        ` : ''}
        
        /* Critical time styling for countdown */
        ${mode === 'countdown' && time <= 60 && time > 0 ? `
          .timer-value {
            color: #ef4444;
            animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        ` : ''}
      `}</style>
    </div>
  )
}
