'use client'

import { useState } from 'react'

export default function TestQuestionsPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  const testQuestionSet = async (fileNumber: string, label: string) => {
    setLoading(true)
    setError(null)
    setResults(null)
    setSelectedFile(label)

    try {
      const response = await fetch(`/api/quiz/text-questions?file=${fileNumber}&count=5&shuffle=false`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Test Question Sets</h1>
        
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Test Buttons</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            <button
              onClick={() => testQuestionSet('1', 'Questions 1-100')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Test Set 1 (1-100)
            </button>
            <button
              onClick={() => testQuestionSet('2', 'Questions 100-200')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Test Set 2 (100-200)
            </button>
            <button
              onClick={() => testQuestionSet('3', 'Questions 200-300')}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              Test Set 3 (200-300)
            </button>
            <button
              onClick={() => testQuestionSet('4', 'Questions 300-400')}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
            >
              Test Set 4 (300-400)
            </button>
            <button
              onClick={() => testQuestionSet('5', 'Questions 400-500')}
              className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition"
            >
              Test Set 5 (400-500)
            </button>
            <button
              onClick={() => testQuestionSet('6', 'Questions 500-600')}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Test Set 6 (500-600)
            </button>
            <button
              onClick={() => testQuestionSet('7', 'Questions 600-700')}
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
            >
              Test Set 7 (600-700)
            </button>
            <button
              onClick={() => testQuestionSet('8', 'Questions 700-800')}
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
            >
              Test Set 8 (700-800)
            </button>
            <button
              onClick={() => testQuestionSet('9', 'Questions 800-900')}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Test Set 9 (800-900)
            </button>
          </div>
        </div>

        {loading && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading questions...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 backdrop-blur-sm rounded-xl p-6 mb-6">
            <h3 className="text-red-400 font-semibold mb-2">Error</h3>
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {results && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-green-400 font-semibold mb-4">✅ {selectedFile} Loaded Successfully!</h3>
            
            <div className="mb-4 p-4 bg-slate-700/50 rounded">
              <p className="text-gray-300">
                <span className="font-semibold">Total Available:</span> {results.total_available}
              </p>
              <p className="text-gray-300">
                <span className="font-semibold">Questions Returned:</span> {results.returned}
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-semibold">Sample Questions:</h4>
              {results.questions?.slice(0, 3).map((q: any, index: number) => (
                <div key={q.id} className="p-4 bg-slate-700/50 rounded">
                  <p className="text-blue-300 font-semibold mb-2">Question {q.id}:</p>
                  <p className="text-gray-300 mb-2">{q.question_text}</p>
                  <div className="ml-4 space-y-1">
                    {q.options?.map((opt: string, i: number) => (
                      <p key={i} className="text-gray-400 text-sm">
                        {String.fromCharCode(97 + i)}. {opt}
                      </p>
                    ))}
                  </div>
                  <p className="text-green-400 text-sm mt-2">
                    Correct: {q.correct_answer.toUpperCase()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
