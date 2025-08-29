// /Users/baalsd/smolDEV/CISSP/src/lib/questions/question-parser.ts

import { QuizQuestion } from '@/types/quiz'
import { tagQuestionDomain } from './domain-tagger'
import fs from 'fs'
import path from 'path'

export interface ParsedQuestion {
  id: number
  question_text: string
  options: string[]
  correct_answer: string
  correct_index: number // a=0, b=1, c=2, d=3
  raw_answer: string // Full answer text
  domain_id?: number
  subdomain_id?: number
  domain_confidence?: number
  domain_matches?: string[]
}

/**
 * Parse a single question block from the text file
 */
function parseQuestionBlock(block: string, questionNumber: number, enableDomainTagging: boolean = true): ParsedQuestion | null {
  const lines = block.trim().split('\n').filter(line => line.trim())
  if (lines.length < 6) return null // Need at least question + 4 options + answer
  
  // Extract question text (first line after the number)
  const questionMatch = lines[0].match(/^\d+\.\s+(.+)/)
  if (!questionMatch) return null
  const questionText = questionMatch[1]
  
  // Extract options (next 4 lines or until "Answer:")
  const options: string[] = []
  let answerLineIndex = -1
  
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].startsWith('Answer:')) {
      answerLineIndex = i
      break
    }
    // Match option pattern: a. text or b. text etc
    const optionMatch = lines[i].match(/^([a-d])\.\s+(.+)/)
    if (optionMatch) {
      options.push(optionMatch[2])
    }
  }
  
  if (options.length !== 4 || answerLineIndex === -1) return null
  
  // Extract correct answer
  const answerLine = lines.slice(answerLineIndex).join(' ')
  const answerMatch = answerLine.match(/Answer:\s*([a-d])\.\s+(.+)/)
  if (!answerMatch) return null
  
  const correctLetter = answerMatch[1].toLowerCase()
  const correctIndex = correctLetter.charCodeAt(0) - 'a'.charCodeAt(0)
  const rawAnswer = answerMatch[2]
  
  const parsedQuestion: ParsedQuestion = {
    id: questionNumber,
    question_text: questionText,
    options,
    correct_answer: correctLetter,
    correct_index: correctIndex,
    raw_answer: rawAnswer
  }
  
  // Add domain tagging if enabled
  if (enableDomainTagging) {
    const domainTag = tagQuestionDomain(questionText, options, rawAnswer)
    parsedQuestion.domain_id = domainTag.domain_id
    parsedQuestion.subdomain_id = domainTag.subdomain_id
    parsedQuestion.domain_confidence = domainTag.confidence
    parsedQuestion.domain_matches = domainTag.matches
  }
  
  return parsedQuestion
}

/**
 * Parse questions from a text file
 */
export function parseQuestionsFromText(content: string, enableDomainTagging: boolean = true): ParsedQuestion[] {
  const questions: ParsedQuestion[] = []
  
  // Split by question numbers (1., 2., 3., etc.)
  const questionBlocks = content.split(/(?=^\d+\.\s)/gm).filter(block => block.trim())
  
  for (const block of questionBlocks) {
    // Extract question number from the block
    const numberMatch = block.match(/^(\d+)\./)
    if (!numberMatch) continue
    
    const questionNumber = parseInt(numberMatch[1])
    const parsed = parseQuestionBlock(block, questionNumber, enableDomainTagging)
    if (parsed) {
      questions.push(parsed)
    }
  }
  
  return questions
}

/**
 * Load questions from a file
 */
export async function loadQuestionsFromFile(filePath: string, enableDomainTagging: boolean = true): Promise<ParsedQuestion[]> {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    return parseQuestionsFromText(content, enableDomainTagging)
  } catch (error) {
    console.error(`Error loading questions from ${filePath}:`, error)
    return []
  }
}

/**
 * Load all questions from the public/data directory
 */
export async function loadAllQuestions(enableDomainTagging: boolean = true): Promise<ParsedQuestion[]> {
  const questionsDir = path.join(process.cwd(), 'public', 'data', 'questions')
  const allQuestions: ParsedQuestion[] = []
  
  try {
    const files = fs.readdirSync(questionsDir)
    const questionFiles = files.filter(f => f.startsWith('questions') && f.endsWith('.txt'))
    
    for (const file of questionFiles) {
      const filePath = path.join(questionsDir, file)
      const questions = await loadQuestionsFromFile(filePath, enableDomainTagging)
      
      // Adjust IDs to be unique across all files
      const offset = allQuestions.length
      questions.forEach(q => {
        q.id = offset + q.id
      })
      
      allQuestions.push(...questions)
    }
  } catch (error) {
    console.error('Error loading questions:', error)
  }
  
  return allQuestions
}

/**
 * Convert parsed questions to QuizQuestion format
 */
export function toQuizQuestion(parsed: ParsedQuestion): QuizQuestion {
  return {
    id: parsed.id,
    question_text: parsed.question_text,
    options: parsed.options,
    correct_answer: parsed.correct_answer,
    explanation: `The correct answer is: ${parsed.raw_answer}`,
    difficulty: determineDifficulty(parsed),
    domain_id: parsed.domain_id,
    subdomain_id: parsed.subdomain_id,
    question_type: 'multiple_choice',
    metadata: {
      domain_confidence: parsed.domain_confidence,
      domain_matches: parsed.domain_matches
    }
  }
}

/**
 * Determine question difficulty based on various factors
 */
function determineDifficulty(question: ParsedQuestion): number {
  // Simple heuristic: longer questions and answers tend to be more complex
  const textLength = question.question_text.length + question.raw_answer.length
  
  if (textLength < 150) return 1
  if (textLength < 250) return 2
  if (textLength < 350) return 3
  if (textLength < 450) return 4
  return 5
}

/**
 * Get questions for a specific range
 */
export async function getQuestionRange(start: number, count: number, enableDomainTagging: boolean = true): Promise<QuizQuestion[]> {
  const allQuestions = await loadAllQuestions(enableDomainTagging)
  const selectedQuestions = allQuestions.slice(start - 1, start - 1 + count)
  return selectedQuestions.map(toQuizQuestion)
}

/**
 * Get random questions, optionally filtered by domain
 */
export async function getRandomQuestions(
  count: number, 
  domainId?: number,
  enableDomainTagging: boolean = true
): Promise<QuizQuestion[]> {
  let allQuestions = await loadAllQuestions(enableDomainTagging)
  
  // Filter by domain if specified
  if (domainId) {
    allQuestions = allQuestions.filter(q => q.domain_id === domainId)
  }
  
  // Shuffle and select
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5)
  const selected = shuffled.slice(0, Math.min(count, shuffled.length))
  
  return selected.map(toQuizQuestion)
}

/**
 * Get questions by domain
 */
export async function getQuestionsByDomain(
  domainId: number,
  count?: number,
  enableDomainTagging: boolean = true
): Promise<QuizQuestion[]> {
  const allQuestions = await loadAllQuestions(enableDomainTagging)
  let domainQuestions = allQuestions.filter(q => q.domain_id === domainId)
  
  if (count && count < domainQuestions.length) {
    // Randomly select the specified count
    domainQuestions = domainQuestions
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
  }
  
  return domainQuestions.map(toQuizQuestion)
}

/**
 * Get question statistics by domain
 */
export async function getQuestionStatsByDomain(enableDomainTagging: boolean = true): Promise<Record<number, {
  count: number
  percentage: number
  avgConfidence: number
}>> {
  const allQuestions = await loadAllQuestions(enableDomainTagging)
  const stats: Record<number, { count: number; totalConfidence: number }> = {}
  
  // Initialize stats for domains 1-8
  for (let i = 1; i <= 8; i++) {
    stats[i] = { count: 0, totalConfidence: 0 }
  }
  
  // Count questions per domain
  for (const q of allQuestions) {
    if (q.domain_id) {
      stats[q.domain_id].count++
      stats[q.domain_id].totalConfidence += (q.domain_confidence || 0)
    }
  }
  
  // Calculate percentages
  const total = allQuestions.length
  const result: Record<number, { count: number; percentage: number; avgConfidence: number }> = {}
  
  for (const [domainId, stat] of Object.entries(stats)) {
    result[parseInt(domainId)] = {
      count: stat.count,
      percentage: total > 0 ? Math.round((stat.count / total) * 100) : 0,
      avgConfidence: stat.count > 0 ? Math.round(stat.totalConfidence / stat.count) : 0
    }
  }
  
  return result
}

/**
 * Load questions from a specific file by name
 */
export async function loadQuestionsFromFileName(fileName: string, enableDomainTagging: boolean = true): Promise<QuizQuestion[]> {
  const filePath = path.join(process.cwd(), 'public', 'data', 'questions', fileName)
  const questions = await loadQuestionsFromFile(filePath, enableDomainTagging)
  return questions.map(toQuizQuestion)
}