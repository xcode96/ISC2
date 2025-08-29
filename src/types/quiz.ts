export interface QuizQuestion {
  id: number
  question_text: string
  options: string[]
  correct_answer: string
  explanation?: string
  difficulty?: number
  domain_id?: number
  subdomain_id?: number
  question_type?: string
  metadata?: Record<string, any>
}

export interface QuizAttempt {
  id?: number
  user_id?: string
  domain_id?: number
  questions_attempted: QuizAnswerRecord[]
  total_questions: number
  correct_answers: number
  score: number
  time_spent: number
  created_at?: string
}

export interface QuizAnswerRecord {
  question_id: number
  user_answer: string
  is_correct: boolean
  time_spent: number
}

export interface QuizSession {
  questions: QuizQuestion[]
  currentQuestionIndex: number
  answers: Record<number, string>
  startTime: number
  timeSpent: number
  isCompleted: boolean
  showResults: boolean
}

export interface QuizConfig {
  domainId?: number
  subdomainId?: number
  questionCount: number
  difficulty?: number[]
  timeLimit?: number
  shuffleQuestions?: boolean
  shuffleAnswers?: boolean
}

export interface QuizStats {
  totalAttempts: number
  averageScore: number
  bestScore: number
  totalTimeSpent: number
  domainScores: Record<number, {
    attempts: number
    averageScore: number
    bestScore: number
  }>
}

export interface Domain {
  id: number
  domain_number: number
  name: string
  description?: string
  weight_percentage?: number
  created_at?: string
}

export interface Subdomain {
  id: number
  domain_id: number
  subdomain_number: string
  title: string
  content?: string
  key_concepts?: string[]
  created_at?: string
}