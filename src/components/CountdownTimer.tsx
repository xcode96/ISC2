'use client'

import React, { useEffect, useState } from 'react'

interface CountdownTimerProps {
  timeRemaining: number // in seconds
  timeLimit: number // total time in seconds
  onTimeUp?: () => void
  className?: string
}

export default function CountdownTimer({ 
  timeRemaining, 
  timeLimit, 
  onTimeUp,
  className = ''
}: CountdownTimerProps) {
  const [isWarning, setIsWarning] = useState(false)
  const [isPulsing, setIsPulsing] = useState(false)
  
  // Calculate progress percentage (inverted for countdown)
  const progress = Math.max(0, Math.min(100, (timeRemaining / timeLimit) * 100))
  
  // Format time display
  const hours = Math.floor(timeRemaining / 3600)
  const minutes = Math.floor((timeRemaining % 3600) / 60)
  const seconds = timeRemaining % 60
  
  // Determine color based on time remaining
  const getTimerColor = () => {
    if (progress <= 10) return '#ef4444' // red
    if (progress <= 25) return '#f97316' // orange
    if (progress <= 50) return '#f59e0b' // yellow
    return '#10b981' // green
  }
  
  useEffect(() => {
    // Warning state when less than 5 minutes
    setIsWarning(timeRemaining <= 300)
    
    // Pulsing animation for last minute
    setIsPulsing(timeRemaining <= 60)
    
    // Call onTimeUp when timer reaches 0
    if (timeRemaining === 0 && onTimeUp) {
      onTimeUp()
    }
  }, [timeRemaining, onTimeUp])
  
  const circumference = 2 * Math.PI * 90 // radius = 90
  const strokeDashoffset = circumference - (progress / 100) * circumference
  
  return (
    <div className={`countdown-timer-container ${className}`}>
      <div className={`countdown-timer ${isWarning ? 'warning' : ''} ${isPulsing ? 'pulsing' : ''}`}>
        <svg className="countdown-svg" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            className="countdown-bg"
            cx="100"
            cy="100"
            r="90"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            className="countdown-progress"
            cx="100"
            cy="100"
            r="90"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              stroke: getTimerColor(),
              transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease'
            }}
          />
          {/* Inner decorative circles */}
          <circle
            className="countdown-inner"
            cx="100"
            cy="100"
            r="82"
            strokeWidth="1"
            fill="none"
            stroke="rgba(148, 163, 184, 0.2)"
          />
          <circle
            className="countdown-inner"
            cx="100"
            cy="100"
            r="98"
            strokeWidth="1"
            fill="none"
            stroke="rgba(148, 163, 184, 0.2)"
          />
        </svg>
        
        <div className="countdown-display">
          <div className="countdown-time">
            {hours > 0 && (
              <>
                <span className="time-value">{hours.toString().padStart(2, '0')}</span>
                <span className="time-separator">:</span>
              </>
            )}
            <span className="time-value">{minutes.toString().padStart(2, '0')}</span>
            <span className="time-separator">:</span>
            <span className="time-value">{seconds.toString().padStart(2, '0')}</span>
          </div>
          <div className="countdown-label">
            {isWarning ? 'Hurry Up!' : 'Time Remaining'}
          </div>
        </div>
        
        {/* Warning indicator */}
        {isWarning && (
          <div className="warning-indicator">
            <svg className="warning-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      
      {/* Time segments indicator */}
      <div className="time-segments">
        <div className={`segment ${progress > 75 ? 'active' : ''}`}>
          <span className="segment-label">75%</span>
        </div>
        <div className={`segment ${progress > 50 ? 'active' : ''}`}>
          <span className="segment-label">50%</span>
        </div>
        <div className={`segment ${progress > 25 ? 'active' : ''}`}>
          <span className="segment-label">25%</span>
        </div>
      </div>
    </div>
  )
}