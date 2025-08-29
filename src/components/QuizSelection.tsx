'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Domain, Subdomain, QuizConfig } from '@/types/quiz'
import { cn } from '@/lib/utils'
import QuestionProgress from '@/components/QuestionProgress'

interface QuizSelectionProps {
  domains: (Domain & { subdomains: Subdomain[] })[]
}

export default function QuizSelection({ domains }: QuizSelectionProps) {
  const router = useRouter()
  const [selectedDomain, setSelectedDomain] = useState<number | null>(null)
  const [selectedSubdomains, setSelectedSubdomains] = useState<number[]>([])
  const [questionCount, setQuestionCount] = useState(30)
  const [difficulty, setDifficulty] = useState<number[]>([1, 2, 3, 4, 5])
  const [timeLimit, setTimeLimit] = useState<number>(0)
  const [shuffleQuestions, setShuffleQuestions] = useState(true)
  const [shuffleAnswers, setShuffleAnswers] = useState(true)
  // Question source is handled internally, not exposed in UI

  const handleDomainSelect = (domainId: number) => {
    if (selectedDomain === domainId) {
      setSelectedDomain(null)
      setSelectedSubdomains([])
    } else {
      setSelectedDomain(domainId)
      setSelectedSubdomains([])
    }
  }

  const handleSubdomainToggle = (subdomainId: number) => {
    setSelectedSubdomains(prev => 
      prev.includes(subdomainId) 
        ? prev.filter(id => id !== subdomainId)
        : [...prev, subdomainId]
    )
  }

  const handleDifficultyToggle = (level: number) => {
    setDifficulty(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level)
        : [...prev, level].sort()
    )
  }

  const startQuiz = (preset?: 'quick' | 'full') => {
    const params = new URLSearchParams()
    
    if (preset === 'quick') {
      params.set('count', '30')
      params.set('shuffle', 'true')
      params.set('shuffleAnswers', 'true')
    } else if (preset === 'full') {
      params.set('count', '150')
      params.set('timeLimit', '10800')
      params.set('shuffle', 'true')
      params.set('shuffleAnswers', 'true')
    } else {
      // Custom quiz
      if (selectedDomain) params.set('domain', selectedDomain.toString())
      if (selectedSubdomains.length > 0) params.set('subdomains', selectedSubdomains.join(','))
      params.set('count', questionCount.toString())
      if (difficulty.length < 5) params.set('difficulty', difficulty.join(','))
      if (timeLimit > 0) params.set('timeLimit', timeLimit.toString())
      params.set('shuffle', shuffleQuestions.toString())
      params.set('shuffleAnswers', shuffleAnswers.toString())
    }

    router.push(`/quiz/start?${params.toString()}`)
  }

  const canStartQuiz = questionCount > 0 && difficulty.length > 0

  return (
    <div className="quiz-selection-container">
      {/* Question Progress Tracker */}
      <QuestionProgress />
      
      {/* Quick Start Options */}
      <div className="quick-start-grid">
        <div className="quick-start-card">
          <div className="quick-start-card-content">
            <div className="card-icon card-icon-blue">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="card-title">Quick Practice</h3>
            <p className="card-description">30 random questions from all 900 available</p>
          </div>
          <button onClick={() => startQuiz('quick')}>
            Start Now
          </button>
        </div>

        <div className="quick-start-card">
          <div className="quick-start-card-content">
            <div className="card-icon card-icon-green">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="card-title">Full Exam Prep</h3>
            <p className="card-description">150 questions, 3 hour time limit</p>
          </div>
          <button onClick={() => startQuiz('full')}>
            Start Exam
          </button>
        </div>

        <div className="quick-start-card">
          <div className="quick-start-card-content">
            <div className="card-icon card-icon-purple">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="card-title">Custom Quiz</h3>
            <p className="card-description">Customize your practice session</p>
          </div>
          <button
            className="quiz-button-secondary"
            onClick={() => {
              document.getElementById('custom-options')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Customize
          </button>
        </div>
      </div>

      {/* Custom Quiz Configuration */}
      <div id="custom-options" className="custom-settings">
        <h2 className="settings-title">Custom Quiz Settings</h2>
        
        <div className="settings-grid">
          {/* Domain Selection */}
          <div className="domain-selection">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              <h3 className="section-title text-white text-lg font-semibold">Domain Selection</h3>
            </div>
            
            <h4 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Choose Domain <span className="text-xs text-gray-500 normal-case tracking-normal">(Optional)</span></h4>
            <div className="domain-list">
              <button
                onClick={() => handleDomainSelect(0)}
                className={cn(
                  "domain-button",
                  selectedDomain === null && "selected"
                )}
              >
                <div className="domain-info">
                  <span className="domain-name">All Domains (Mixed)</span>
                </div>
              </button>
              
              {domains.map((domain) => (
                <button
                  key={domain.id}
                  onClick={() => handleDomainSelect(domain.id)}
                  className={cn(
                    "domain-button",
                    selectedDomain === domain.id && "selected"
                  )}
                >
                  <div className="domain-info">
                    <span className="domain-name">
                      Domain {domain.domain_number}: {domain.name}
                    </span>
                    <span className="domain-weight">
                      {domain.weight_percentage}%
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Subdomain Selection */}
            {selectedDomain && selectedDomain > 0 && (domains.find(d => d.id === selectedDomain)?.subdomains?.length ?? 0) > 0 && (
              <div className="subdomains-section">
                <h4 className="subdomain-title">
                  Subdomains (Optional)
                </h4>
                <div className="subdomain-list">
                  {domains
                    .find(d => d.id === selectedDomain)
                    ?.subdomains?.map((subdomain) => (
                    <label key={subdomain.id} className="subdomain-item">
                      <input
                        type="checkbox"
                        checked={selectedSubdomains.includes(subdomain.id)}
                        onChange={() => handleSubdomainToggle(subdomain.id)}
                        className="subdomain-checkbox"
                      />
                      <span>
                        {subdomain.subdomain_number}: {subdomain.title}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quiz Settings */}
          <div className="settings-controls">
            {/* Question Count */}
            <div className="slider-control">
              <label className="slider-label">
                Number of Questions: <span className="slider-value">{questionCount}</span>
              </label>
              <input
                type="range"
                min="5"
                max="150"
                step="5"
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                className="custom-slider"
              />
              <div className="slider-marks">
                <span>5</span>
                <span>75</span>
                <span>150</span>
              </div>
            </div>

            {/* Difficulty Selection */}
            <div>
              <label className="section-title">
                Difficulty Levels
              </label>
              <div className="difficulty-buttons">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => handleDifficultyToggle(level)}
                    className={cn(
                      "difficulty-btn",
                      difficulty.includes(level) && (
                        level <= 2 ? "active-easy" :
                        level <= 4 ? "active-medium" :
                        "active-hard"
                      )
                    )}
                  >
                    Level {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Limit */}
            <div className="slider-control">
              <label className="slider-label">
                Time Limit: <span className="slider-value">
                  {timeLimit === 0 ? 'No limit' : 
                   timeLimit < 3600 ? `${Math.round(timeLimit / 60)} minutes` :
                   `${(timeLimit / 3600).toFixed(1)} hours`}
                </span>
              </label>
              <input
                type="range"
                min="0"
                max="10800"
                step="900"
                value={timeLimit}
                onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                className="custom-slider"
              />
              <div className="slider-marks">
                <span>No limit</span>
                <span>1.5 hrs</span>
                <span>3 hrs</span>
              </div>
            </div>

            {/* Additional Options */}
            <div className="additional-options">
              <label className="option-checkbox">
                <input
                  type="checkbox"
                  checked={shuffleQuestions}
                  onChange={(e) => setShuffleQuestions(e.target.checked)}
                />
                <span>Shuffle questions</span>
              </label>
              
              <label className="option-checkbox">
                <input
                  type="checkbox"
                  checked={shuffleAnswers}
                  onChange={(e) => setShuffleAnswers(e.target.checked)}
                />
                <span>Shuffle answer choices</span>
              </label>
            </div>
          </div>
        </div>

        {/* Start Quiz Button */}
        <div className="start-button-container">
          <button
            onClick={() => startQuiz()}
            disabled={!canStartQuiz}
            className="start-quiz-button"
          >
            Start Custom Quiz ({questionCount} questions)
          </button>
        </div>
      </div>
    </div>
  )
}