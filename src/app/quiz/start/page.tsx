import { Suspense } from 'react'
import QuizStartContent from './QuizStartContent'

export default function QuizStartPage() {
  return (
    <Suspense fallback={
      <div className="quiz-container">
        <div className="quiz-content">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading quiz...</p>
          </div>
        </div>
      </div>
    }>
      <QuizStartContent />
    </Suspense>
  )
}
