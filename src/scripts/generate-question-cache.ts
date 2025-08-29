// /Users/baalsd/smolDEV/CISSP/src/scripts/generate-question-cache.ts

import { loadAllQuestions } from '../lib/questions/question-parser'
import { CISSP_DOMAINS } from '../data/domains'
import fs from 'fs'
import path from 'path'

interface CachedQuestion {
  id: number
  question_text: string
  options: string[]
  correct_answer: string
  correct_index: number
  explanation: string
  domain_id: number
  subdomain_id?: number
  difficulty: number
  confidence?: number
  keywords?: string[]
}

interface QuestionCache {
  version: string
  generated_at: string
  total_questions: number
  domain_distribution: Record<number, {
    count: number
    percentage: number
    avg_confidence: number
  }>
  questions: CachedQuestion[]
}

/**
 * Generate a cached JSON file with all questions and their domain tags
 */
async function generateQuestionCache() {
  console.log('🚀 Starting question cache generation...\n')
  
  // Load all questions with domain tagging
  const questions = await loadAllQuestions(true)
  console.log(`📚 Loaded ${questions.length} questions with domain tags\n`)
  
  // Calculate domain distribution
  const domainDistribution: Record<number, {
    count: number
    total_confidence: number
    questions: number[]
  }> = {}
  
  // Initialize distribution
  for (let i = 1; i <= 8; i++) {
    domainDistribution[i] = {
      count: 0,
      total_confidence: 0,
      questions: []
    }
  }
  
  // Process questions
  const cachedQuestions: CachedQuestion[] = questions.map(q => {
    const domainId = q.domain_id || 1
    
    // Update distribution
    domainDistribution[domainId].count++
    domainDistribution[domainId].total_confidence += (q.domain_confidence || 0)
    domainDistribution[domainId].questions.push(q.id)
    
    // Determine difficulty based on text length and complexity
    const textLength = q.question_text.length + q.raw_answer.length
    let difficulty = 1
    if (textLength > 150) difficulty = 2
    if (textLength > 250) difficulty = 3
    if (textLength > 350) difficulty = 4
    if (textLength > 450) difficulty = 5
    
    return {
      id: q.id,
      question_text: q.question_text,
      options: q.options,
      correct_answer: q.correct_answer,
      correct_index: q.correct_index,
      explanation: `The correct answer is: ${q.raw_answer}`,
      domain_id: domainId,
      subdomain_id: q.subdomain_id,
      difficulty,
      confidence: q.domain_confidence,
      keywords: q.domain_matches
    }
  })
  
  // Calculate final distribution statistics
  const finalDistribution: Record<number, {
    count: number
    percentage: number
    avg_confidence: number
  }> = {}
  
  for (const [domainId, stats] of Object.entries(domainDistribution)) {
    finalDistribution[parseInt(domainId)] = {
      count: stats.count,
      percentage: Math.round((stats.count / questions.length) * 100),
      avg_confidence: stats.count > 0 
        ? Math.round(stats.total_confidence / stats.count)
        : 0
    }
  }
  
  // Create cache object
  const cache: QuestionCache = {
    version: '1.0.0',
    generated_at: new Date().toISOString(),
    total_questions: questions.length,
    domain_distribution: finalDistribution,
    questions: cachedQuestions
  }
  
  // Save cache to file
  const cachePath = path.join(process.cwd(), 'public', 'data', 'questions-cache.json')
  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2))
  console.log(`💾 Question cache saved to: ${cachePath}\n`)
  
  // Generate domain-specific cache files for optimized loading
  console.log('📂 Generating domain-specific cache files...')
  
  for (const domain of CISSP_DOMAINS) {
    const domainQuestions = cachedQuestions.filter(q => q.domain_id === domain.id)
    
    const domainCache = {
      domain_id: domain.id,
      domain_name: domain.name,
      domain_weight: domain.weight_percentage,
      total_questions: domainQuestions.length,
      generated_at: new Date().toISOString(),
      questions: domainQuestions
    }
    
    const domainCachePath = path.join(
      process.cwd(), 
      'public', 
      'data', 
      `domain-${domain.id}-cache.json`
    )
    
    fs.writeFileSync(domainCachePath, JSON.stringify(domainCache, null, 2))
    console.log(`  ✓ Domain ${domain.id}: ${domainQuestions.length} questions`)
  }
  
  // Display summary
  console.log('\n📊 Cache Generation Summary:')
  console.log('============================\n')
  
  console.table(
    CISSP_DOMAINS.map(domain => {
      const stats = finalDistribution[domain.id]
      return {
        'Domain': `${domain.domain_number}. ${domain.name.substring(0, 30)}...`,
        'Questions': stats.count,
        'Coverage': `${stats.percentage}%`,
        'Target': `${domain.weight_percentage}%`,
        'Confidence': `${stats.avg_confidence}%`
      }
    })
  )
  
  // Generate index file for quick lookups
  const index = {
    version: '1.0.0',
    total_questions: questions.length,
    domains: CISSP_DOMAINS.map(domain => ({
      id: domain.id,
      name: domain.name,
      question_count: finalDistribution[domain.id].count,
      question_ids: domainDistribution[domain.id].questions
    })),
    difficulty_distribution: {
      1: cachedQuestions.filter(q => q.difficulty === 1).length,
      2: cachedQuestions.filter(q => q.difficulty === 2).length,
      3: cachedQuestions.filter(q => q.difficulty === 3).length,
      4: cachedQuestions.filter(q => q.difficulty === 4).length,
      5: cachedQuestions.filter(q => q.difficulty === 5).length,
    },
    low_confidence_questions: cachedQuestions
      .filter(q => q.confidence && q.confidence < 50)
      .map(q => q.id),
    generated_at: new Date().toISOString()
  }
  
  const indexPath = path.join(process.cwd(), 'public', 'data', 'questions-index.json')
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2))
  console.log(`\n📑 Question index saved to: ${indexPath}`)
  
  // Recommendations
  console.log('\n💡 Recommendations:')
  console.log('==================')
  
  const lowConfidenceCount = cachedQuestions.filter(q => 
    q.confidence && q.confidence < 50
  ).length
  
  if (lowConfidenceCount > 0) {
    console.log(`• Review ${lowConfidenceCount} low-confidence questions for manual domain assignment`)
  }
  
  for (const domain of CISSP_DOMAINS) {
    const stats = finalDistribution[domain.id]
    const diff = stats.percentage - domain.weight_percentage
    
    if (Math.abs(diff) > 5) {
      if (diff < 0) {
        const needed = Math.round((domain.weight_percentage / 100) * questions.length) - stats.count
        console.log(`• Domain ${domain.domain_number}: Add ~${needed} more questions (currently ${diff}% below target)`)
      } else {
        console.log(`• Domain ${domain.domain_number}: Consider rebalancing (currently ${diff}% above target)`)
      }
    }
  }
  
  console.log('\n✨ Cache generation complete!')
  console.log('📝 You can now use the cached JSON files for faster question loading')
}

// Run the cache generation
generateQuestionCache().catch(console.error)
