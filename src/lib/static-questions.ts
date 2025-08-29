// Client-side question loader for static deployment - JSON version
import { QuizQuestion } from '@/types/quiz'
import { shuffleArray } from '@/lib/utils'
import { getResourcePath } from '@/lib/base-path'
import { 
  getSeenQuestions, 
  addSeenQuestions, 
  clearSeenQuestions, 
  shouldResetSeenQuestions 
} from '@/lib/question-tracker'

export interface ParsedQuestion {
  id: number
  question_text: string
  options: string[]
  correct_answer: string
  correct_index?: number
  explanation: string
  difficulty: number
  domain_id?: number
  subdomain_id?: number
  question_type: string
  metadata?: any
  confidence?: number
  keywords?: string[]
}

let cachedQuestions: ParsedQuestion[] | null = null
let cachePromise: Promise<ParsedQuestion[]> | null = null

/**
 * Load all questions from cached JSON
 */
export async function loadAllQuestions(): Promise<ParsedQuestion[]> {
  // Return cached questions if available
  if (cachedQuestions) {
    return cachedQuestions
  }
  
  // If already loading, return the same promise to avoid duplicate requests
  if (cachePromise) {
    return cachePromise
  }
  
  // Start loading process
  cachePromise = loadQuestionsFromJSON()
  
  try {
    cachedQuestions = await cachePromise
    return cachedQuestions
  } finally {
    cachePromise = null
  }
}

/**
 * Load questions from JSON file
 */
async function loadQuestionsFromJSON(): Promise<ParsedQuestion[]> {
  try {
    // Load from the questions-cache.json file
    const response = await fetch(getResourcePath('/data/questions-cache.json'))
    if (!response.ok) {
      throw new Error(`Failed to load questions: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    
    // Extract questions array from the cache structure
    const questions: ParsedQuestion[] = data.questions || []
    
    // Validate and ensure all questions have required fields
    const validatedQuestions = questions.map((q, index) => {
      // Ensure correct_answer is a single letter
      let correctAnswer = q.correct_answer
      if (correctAnswer && correctAnswer.length > 1) {
        // If it's the full answer text, convert to letter
        const correctIndex = q.correct_index ?? q.options.findIndex(opt => opt === correctAnswer)
        if (correctIndex >= 0 && correctIndex < 4) {
          correctAnswer = String.fromCharCode('a'.charCodeAt(0) + correctIndex)
        }
      }
      
      return {
        ...q,
        id: q.id || index + 1,
        correct_answer: correctAnswer || 'a',
        domain_id: q.domain_id || Math.floor(index / 113) + 1,
        subdomain_id: q.subdomain_id || ((q.domain_id || 1) * 10 + 1),
        difficulty: q.difficulty || Math.floor(Math.random() * 5) + 1,
        question_type: q.question_type || 'multiple_choice',
        explanation: q.explanation || `The correct answer is: ${q.options[q.correct_index || 0]}`,
        options: q.options || ['Option A', 'Option B', 'Option C', 'Option D']
      }
    })
    
    console.log(`Loaded ${validatedQuestions.length} questions from JSON cache`)
    return validatedQuestions
    
  } catch (error) {
    console.error('Error loading questions from JSON:', error)
    
    // Fallback: Try loading individual domain files
    return loadQuestionsFromDomainFiles()
  }
}

/**
 * Fallback: Load questions from individual domain JSON files
 */
async function loadQuestionsFromDomainFiles(): Promise<ParsedQuestion[]> {
  console.log('Falling back to individual domain JSON files...')
  const allQuestions: ParsedQuestion[] = []
  
  // Try loading each domain JSON file
  for (let domain = 1; domain <= 8; domain++) {
    try {
      const response = await fetch(getResourcePath(`/data/domain-${domain}-cache.json`))
      if (!response.ok) continue
      
      const domainData = await response.json()
      const questions = domainData.questions || domainData || []
      
      questions.forEach((q: any) => {
        // Ensure correct_answer is a single letter
        let correctAnswer = q.correct_answer
        if (correctAnswer && correctAnswer.length > 1) {
          const correctIndex = q.correct_index ?? q.options.findIndex((opt: string) => opt === correctAnswer)
          if (correctIndex >= 0 && correctIndex < 4) {
            correctAnswer = String.fromCharCode('a'.charCodeAt(0) + correctIndex)
          }
        }
        
        allQuestions.push({
          ...q,
          id: q.id || allQuestions.length + 1,
          correct_answer: correctAnswer || 'a',
          domain_id: q.domain_id || domain,
          difficulty: q.difficulty || Math.floor(Math.random() * 5) + 1,
          question_type: q.question_type || 'multiple_choice'
        })
      })
      
      console.log(`Loaded ${questions.length} questions from domain ${domain}`)
    } catch (error) {
      console.error(`Error loading domain ${domain}:`, error)
    }
  }
  
  if (allQuestions.length === 0) {
    throw new Error('No questions could be loaded from any source')
  }
  
  console.log(`Total loaded from domain files: ${allQuestions.length} questions`)
  return allQuestions
}

/**
 * Convert to QuizQuestion format
 */
function toQuizQuestion(parsed: ParsedQuestion): QuizQuestion {
  return {
    id: parsed.id,
    question_text: parsed.question_text,
    options: parsed.options,
    correct_answer: parsed.correct_answer,
    explanation: parsed.explanation,
    difficulty: parsed.difficulty,
    domain_id: parsed.domain_id,
    subdomain_id: parsed.subdomain_id,
    question_type: parsed.question_type,
    metadata: parsed.metadata || {}
  }
}

/**
 * Get random questions without repetition
 */
export async function getRandomQuestions(count: number): Promise<QuizQuestion[]> {
  const allQuestions = await loadAllQuestions()
  
  if (allQuestions.length === 0) {
    throw new Error('No questions available')
  }
  
  const seenQuestions = getSeenQuestions()
  
  // Filter out seen questions
  let availableQuestions = allQuestions.filter(q => !seenQuestions.has(q.id))
  
  // If not enough unseen questions, reset and use all questions
  if (availableQuestions.length < count) {
    console.log(`Not enough unseen questions (${availableQuestions.length}/${count}). Resetting seen questions.`)
    clearSeenQuestions()
    availableQuestions = allQuestions
  }
  
  // Check if we should reset based on percentage seen
  if (shouldResetSeenQuestions(allQuestions.length)) {
    console.log('80% of questions seen. Resetting for fresh experience.')
    clearSeenQuestions()
    availableQuestions = allQuestions
  }
  
  // Shuffle and select
  const shuffled = shuffleArray([...availableQuestions])
  const selected = shuffled.slice(0, Math.min(count, shuffled.length))
  
  // Track these questions as seen
  const selectedIds = selected.map(q => q.id)
  addSeenQuestions(selectedIds)
  
  return selected.map(toQuizQuestion)
}

/**
 * Get questions with filters and no repetition
 */
export async function getFilteredQuestions(
  count: number,
  domainId?: number,
  subdomainIds?: number[],
  difficulty?: number[],
  shuffle: boolean = true,
  shuffleAnswers: boolean = true
): Promise<QuizQuestion[]> {
  const allQuestions = await loadAllQuestions()
  
  if (allQuestions.length === 0) {
    throw new Error('No questions available')
  }
  
  const seenQuestions = getSeenQuestions()
  
  // Apply filters
  let filtered = allQuestions
  
  if (domainId && domainId > 0) {
    filtered = filtered.filter(q => q.domain_id === domainId)
  }
  
  if (subdomainIds && subdomainIds.length > 0) {
    filtered = filtered.filter(q => q.subdomain_id && subdomainIds.includes(q.subdomain_id))
  }
  
  if (difficulty && difficulty.length > 0) {
    filtered = filtered.filter(q => difficulty.includes(q.difficulty))
  }
  
  // Remove seen questions
  const originalFilteredCount = filtered.length
  filtered = filtered.filter(q => !seenQuestions.has(q.id))
  
  // If not enough unseen questions after filtering, include some seen questions
  if (filtered.length < count) {
    console.log(`Not enough unseen questions in filtered set (${filtered.length}/${count}).`)
    
    // Get seen questions that match the filters
    const seenButFiltered = allQuestions.filter(q => {
      if (!seenQuestions.has(q.id)) return false
      if (domainId && domainId > 0 && q.domain_id !== domainId) return false
      if (subdomainIds && subdomainIds.length > 0 && (!q.subdomain_id || !subdomainIds.includes(q.subdomain_id))) return false
      if (difficulty && difficulty.length > 0 && !difficulty.includes(q.difficulty)) return false
      return true
    })
    
    // If we have enough seen questions to fill the gap, randomly select from them
    if (seenButFiltered.length > 0) {
      const needed = count - filtered.length
      const additionalQuestions = shuffleArray(seenButFiltered).slice(0, needed)
      filtered = [...filtered, ...additionalQuestions]
      console.log(`Added ${additionalQuestions.length} previously seen questions to meet count requirement.`)
    }
  }
  
  // Check if we should reset based on percentage seen
  if (shouldResetSeenQuestions(originalFilteredCount)) {
    console.log('80% of filtered questions seen. Consider resetting for fresh experience.')
  }
  
  // Shuffle if requested
  if (shuffle) {
    filtered = shuffleArray(filtered)
  }
  
  // Select requested count
  const selected = filtered.slice(0, Math.min(count, filtered.length))
  
  // Track these questions as seen
  const selectedIds = selected.map(q => q.id)
  addSeenQuestions(selectedIds)
  
  // Convert to QuizQuestion format
  let questions = selected.map(toQuizQuestion)
  
  // Shuffle answers if requested
  if (shuffleAnswers) {
    questions = questions.map(q => {
      const correctAnswerText = q.options[q.correct_answer.charCodeAt(0) - 'a'.charCodeAt(0)]
      const shuffledOptions = shuffleArray([...q.options])
      const newCorrectIndex = shuffledOptions.indexOf(correctAnswerText)
      
      return {
        ...q,
        options: shuffledOptions,
        correct_answer: String.fromCharCode('a'.charCodeAt(0) + newCorrectIndex)
      }
    })
  }
  
  return questions
}

/**
 * Load static domains data
 */
export async function loadDomains() {
  // CISSP Domains with subdomains (static data)
  return [
    {
      id: 1,
      domain_number: 1,
      name: 'Security and Risk Management',
      weight_percentage: 15,
      subdomains: [
        { id: 11, subdomain_number: '1.1', title: 'Understand professional ethics', domain_id: 1 },
        { id: 12, subdomain_number: '1.2', title: 'Understand security concepts', domain_id: 1 },
        { id: 13, subdomain_number: '1.3', title: 'Evaluate and apply security governance', domain_id: 1 },
        { id: 14, subdomain_number: '1.4', title: 'Understand legal and regulatory issues', domain_id: 1 },
        { id: 15, subdomain_number: '1.5', title: 'Understand risk management', domain_id: 1 }
      ]
    },
    {
      id: 2,
      domain_number: 2,
      name: 'Asset Security',
      weight_percentage: 10,
      subdomains: [
        { id: 21, subdomain_number: '2.1', title: 'Identify and classify assets', domain_id: 2 },
        { id: 22, subdomain_number: '2.2', title: 'Establish information handling requirements', domain_id: 2 },
        { id: 23, subdomain_number: '2.3', title: 'Provision resources securely', domain_id: 2 },
        { id: 24, subdomain_number: '2.4', title: 'Manage data lifecycle', domain_id: 2 }
      ]
    },
    {
      id: 3,
      domain_number: 3,
      name: 'Security Architecture and Engineering',
      weight_percentage: 13,
      subdomains: [
        { id: 31, subdomain_number: '3.1', title: 'Research security models', domain_id: 3 },
        { id: 32, subdomain_number: '3.2', title: 'Select controls based on requirements', domain_id: 3 },
        { id: 33, subdomain_number: '3.3', title: 'Understand security capabilities', domain_id: 3 },
        { id: 34, subdomain_number: '3.4', title: 'Assess security architectures', domain_id: 3 }
      ]
    },
    {
      id: 4,
      domain_number: 4,
      name: 'Communication and Network Security',
      weight_percentage: 13,
      subdomains: [
        { id: 41, subdomain_number: '4.1', title: 'Apply secure network architecture', domain_id: 4 },
        { id: 42, subdomain_number: '4.2', title: 'Secure network components', domain_id: 4 },
        { id: 43, subdomain_number: '4.3', title: 'Implement secure channels', domain_id: 4 },
        { id: 44, subdomain_number: '4.4', title: 'Prevent network attacks', domain_id: 4 }
      ]
    },
    {
      id: 5,
      domain_number: 5,
      name: 'Identity and Access Management (IAM)',
      weight_percentage: 13,
      subdomains: [
        { id: 51, subdomain_number: '5.1', title: 'Control physical and logical access', domain_id: 5 },
        { id: 52, subdomain_number: '5.2', title: 'Manage identification and authentication', domain_id: 5 },
        { id: 53, subdomain_number: '5.3', title: 'Federated identity management', domain_id: 5 },
        { id: 54, subdomain_number: '5.4', title: 'Manage authorization', domain_id: 5 }
      ]
    },
    {
      id: 6,
      domain_number: 6,
      name: 'Security Assessment and Testing',
      weight_percentage: 12,
      subdomains: [
        { id: 61, subdomain_number: '6.1', title: 'Design assessment strategies', domain_id: 6 },
        { id: 62, subdomain_number: '6.2', title: 'Conduct security assessments', domain_id: 6 },
        { id: 63, subdomain_number: '6.3', title: 'Collect security process data', domain_id: 6 },
        { id: 64, subdomain_number: '6.4', title: 'Analyze test output', domain_id: 6 }
      ]
    },
    {
      id: 7,
      domain_number: 7,
      name: 'Security Operations',
      weight_percentage: 13,
      subdomains: [
        { id: 71, subdomain_number: '7.1', title: 'Understand security operations', domain_id: 7 },
        { id: 72, subdomain_number: '7.2', title: 'Conduct logging and monitoring', domain_id: 7 },
        { id: 73, subdomain_number: '7.3', title: 'Perform incident management', domain_id: 7 },
        { id: 74, subdomain_number: '7.4', title: 'Operate security infrastructure', domain_id: 7 }
      ]
    },
    {
      id: 8,
      domain_number: 8,
      name: 'Software Development Security',
      weight_percentage: 11,
      subdomains: [
        { id: 81, subdomain_number: '8.1', title: 'Integrate security in SDLC', domain_id: 8 },
        { id: 82, subdomain_number: '8.2', title: 'Identify security controls', domain_id: 8 },
        { id: 83, subdomain_number: '8.3', title: 'Assess software security', domain_id: 8 },
        { id: 84, subdomain_number: '8.4', title: 'Secure software environments', domain_id: 8 }
      ]
    }
  ]
}
