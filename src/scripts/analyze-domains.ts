// /Users/baalsd/smolDEV/CISSP/src/scripts/analyze-domains.ts

import { loadAllQuestions, getQuestionStatsByDomain } from '../lib/questions/question-parser'
import { CISSP_DOMAINS } from '../data/domains'
import { generateTaggingReport } from '../lib/questions/domain-tagger'
import fs from 'fs'
import path from 'path'

/**
 * Analyze all questions and generate domain tagging report
 */
async function analyzeQuestionDomains() {
  console.log('🔍 Loading and analyzing all CISSP questions...\n')
  
  // Load all questions with domain tagging
  const questions = await loadAllQuestions(true)
  console.log(`📚 Loaded ${questions.length} questions\n`)
  
  // Get statistics by domain
  const stats = await getQuestionStatsByDomain(true)
  
  // Display domain distribution
  console.log('📊 Domain Distribution Analysis:')
  console.log('================================\n')
  
  const tableData: any[] = []
  
  for (const domain of CISSP_DOMAINS) {
    const stat = stats[domain.id] || { count: 0, percentage: 0, avgConfidence: 0 }
    const difference = stat.percentage - domain.weight_percentage
    
    tableData.push({
      'Domain': `${domain.domain_number}. ${domain.name}`,
      'Questions': stat.count,
      'Current %': `${stat.percentage}%`,
      'Target %': `${domain.weight_percentage}%`,
      'Diff': `${difference > 0 ? '+' : ''}${difference}%`,
      'Confidence': `${stat.avgConfidence}%`
    })
  }
  
  console.table(tableData)
  
  // Find questions with low confidence
  const lowConfidenceQuestions = questions.filter(q => 
    q.domain_confidence && q.domain_confidence < 50
  )
  
  console.log(`\n⚠️  Low Confidence Questions: ${lowConfidenceQuestions.length} (${Math.round(lowConfidenceQuestions.length / questions.length * 100)}%)`)
  
  if (lowConfidenceQuestions.length > 0) {
    console.log('\nSample low confidence questions:')
    console.log('---------------------------------')
    
    for (const q of lowConfidenceQuestions.slice(0, 5)) {
      console.log(`\nQ${q.id}: "${q.question_text.substring(0, 80)}..."`)
      console.log(`  Domain: ${q.domain_id}, Confidence: ${q.domain_confidence}%`)
      if (q.domain_matches && q.domain_matches.length > 0) {
        console.log(`  Matches: ${q.domain_matches.slice(0, 3).join(', ')}`)
      }
    }
  }
  
  // Find questions with high confidence
  const highConfidenceQuestions = questions.filter(q => 
    q.domain_confidence && q.domain_confidence >= 80
  )
  
  console.log(`\n✅ High Confidence Questions: ${highConfidenceQuestions.length} (${Math.round(highConfidenceQuestions.length / questions.length * 100)}%)`)
  
  // Generate detailed report
  const report = generateTaggingReport(
    questions.map(q => ({
      id: q.id,
      question_text: q.question_text,
      domain_id: q.domain_id || 1,
      confidence: q.domain_confidence || 0,
      matches: q.domain_matches || []
    }))
  )
  
  // Save report to file
  const reportPath = path.join(process.cwd(), 'domain-analysis-report.txt')
  fs.writeFileSync(reportPath, report)
  console.log(`\n📄 Detailed report saved to: ${reportPath}`)
  
  // Export tagged questions to JSON for review/manual correction
  const taggedQuestionsPath = path.join(process.cwd(), 'public', 'data', 'tagged-questions.json')
  const taggedData = questions.map(q => ({
    id: q.id,
    question_text: q.question_text,
    domain_id: q.domain_id,
    subdomain_id: q.subdomain_id,
    confidence: q.domain_confidence,
    matches: q.domain_matches
  }))
  
  fs.writeFileSync(taggedQuestionsPath, JSON.stringify(taggedData, null, 2))
  console.log(`💾 Tagged questions exported to: ${taggedQuestionsPath}`)
  
  // Recommendations
  console.log('\n📋 Recommendations:')
  console.log('==================')
  
  for (const domain of CISSP_DOMAINS) {
    const stat = stats[domain.id] || { count: 0, percentage: 0 }
    const difference = stat.percentage - domain.weight_percentage
    
    if (Math.abs(difference) > 5) {
      const needed = Math.round((domain.weight_percentage / 100) * questions.length) - stat.count
      if (needed > 0) {
        console.log(`• Domain ${domain.domain_number}: Add ${needed} more questions to reach target weight`)
      } else {
        console.log(`• Domain ${domain.domain_number}: Consider moving ${Math.abs(needed)} questions to other domains`)
      }
    }
  }
  
  console.log('\n✨ Analysis complete!')
}

// Run the analysis
analyzeQuestionDomains().catch(console.error)
