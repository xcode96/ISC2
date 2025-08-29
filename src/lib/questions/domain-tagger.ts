// /Users/baalsd/smolDEV/CISSP/src/lib/questions/domain-tagger.ts

import { CISSP_DOMAINS } from '@/data/domains'

// Domain keyword mappings for automatic tagging
const DOMAIN_KEYWORDS: Record<number, string[]> = {
  // Domain 1: Security and Risk Management (15%)
  1: [
    'risk management', 'risk assessment', 'risk analysis', 'risk appetite', 'risk mitigation',
    'cia triad', 'confidentiality', 'integrity', 'availability',
    'professional ethics', 'code of ethics', 'ethical',
    'compliance', 'regulatory', 'legal', 'gdpr', 'hipaa', 'sox', 'pci-dss',
    'governance', 'security policy', 'security program', 'policies and procedures',
    'security framework', 'security strategy', 'security charter',
    'scoping', 'tailoring', 'baseline', // Moved from Domain 2
    'personnel security', 'security awareness', 'security training', 'awareness training',
    'supply chain', 'vendor management', 'third-party',
    'due diligence', 'due care', 'liability', 'negligence',
    'privacy', 'data protection', 'personally identifiable information', 'pii'
  ],

  // Domain 2: Asset Security (10%)
  2: [
    'asset classification', 'data classification', 'information classification',
    'data handling', 'data retention', 'data disposal', 'data destruction',
    'data lifecycle', 'information lifecycle', 'cradle to grave',
    'data ownership', 'data custodian', 'data steward', 'data controller',
    'privacy protection', 'data privacy', 'data masking', 'tokenization',
    'data remanence', 'secure disposal', 'degaussing', 'shredding',
    'media sanitization', 'data wiping', 'secure deletion',
    'data states', 'data at rest', 'data in transit', 'data in use', 'data in motion',
    'labeling', 'marking', 'asset inventory', 'asset management',
    'data protection', 'data security', 'data sensitivity'
  ],

  // Domain 3: Security Architecture and Engineering (13%)
  3: [
    'security architecture', 'security design', 'secure design principles',
    'defense in depth', 'layered security', 'security zones',
    'security models', 'bell-lapadula', 'biba', 'clark-wilson', 'brewer-nash',
    'trusted computing base', 'tcb', 'reference monitor', 'security kernel',
    'cryptography', 'encryption', 'decryption', 'symmetric', 'asymmetric',
    'pki', 'public key infrastructure', 'digital certificate', 'certificate authority', 'ca',
    'digital signature', 'hash', 'hashing', 'md5', 'sha', 'aes', 'rsa', 'des', '3des',
    'key management', 'key escrow', 'key recovery', 'key exchange',
    'physical security', 'environmental controls', 'hvac', 'fire suppression',
    'secure facility', 'data center', 'mantrap', 'bollards', 'fencing',
    'cctv', 'surveillance', 'motion detection', 'physical intrusion',
    'cdn', 'content delivery network', 'load balancing', 'proxy', 'reverse proxy', // Moved from Domain 4
    'security engineering', 'security controls', 'technical controls'
  ],

  // Domain 4: Communication and Network Security (13%)
  4: [
    'network security', 'network architecture', 'osi model', 'tcp/ip',
    'firewall', 'dmz', 'demilitarized zone', 'network segmentation', 'microsegmentation',
    'vpn', 'virtual private network', 'ipsec', 'ssl', 'tls', 'secure sockets layer',
    'ids', 'ips', 'intrusion detection', 'intrusion prevention',
    'nids', 'nips', 'hids', 'hips', 'honeypot', 'honeynet',
    'wireless security', 'wifi', 'wpa', 'wep', 'wpa2', 'wpa3', '802.11',
    'bluetooth', 'nfc', 'rfid', 'zigbee',
    'network protocols', 'http', 'https', 'ftp', 'ssh', 'telnet', 'smtp', 'dns',
    'network attacks', 'dos', 'ddos', 'denial of service', 'man-in-the-middle', 'mitm',
    'packet sniffing', 'arp spoofing', 'dns poisoning', 'session hijacking',
    'secure communication', 'end-to-end encryption', 'transport encryption',
    'network topology', 'vlan', 'routing', 'switching'
  ],

  // Domain 5: Identity and Access Management (13%)
  5: [
    'identity management', 'access management', 'iam', 'identity and access',
    'authentication', 'authorization', 'accounting', 'aaa',
    'multi-factor', 'mfa', '2fa', 'two-factor', 'biometric', 'fingerprint', 'facial recognition',
    'single sign-on', 'sso', 'saml', 'oauth', 'openid', 'kerberos', 'ldap',
    'access control', 'rbac', 'role-based', 'dac', 'mac', 'abac',
    'mandatory access control', 'discretionary access control', 'attribute-based',
    'privilege', 'least privilege', 'need to know', 'separation of duties',
    'privileged access', 'pam', 'privileged account', 'service account',
    'identity lifecycle', 'provisioning', 'deprovisioning', 'user provisioning',
    'identity federation', 'federated identity', 'identity provider', 'idp',
    'access control list', 'acl', 'permission', 'entitlement',
    'password', 'passphrase', 'credential', 'token', 'smart card'
  ],

  // Domain 6: Security Assessment and Testing (12%)
  6: [
    'security assessment', 'security testing', 'security audit',
    'penetration testing', 'pentest', 'red team', 'blue team', 'purple team',
    'vulnerability scanning', 'vulnerability assessment', 'security scanning',
    'vulnerability', 'exploit', 'zero-day', // Moved from Domain 3
    'code review', 'static analysis', 'sast', 'dynamic analysis', 'dast',
    'security metrics', 'kpi', 'key performance indicator', 
    'compliance testing', 'compliance audit', 'audit trail', 'audit log',
    'test coverage', 'test methodology', 'test plan', 'test report',
    'tabletop exercise', 'security exercise', 'security drill',
    'security control testing', 'control assessment', 'control validation',
    'security monitoring metrics', 'continuous assessment',
    'log analysis', 'log review', 'log management', // Monitoring for assessment purposes
    'security testing', 'application testing', 'system testing' // Security testing aspects
  ],

  // Domain 7: Security Operations (13%)
  7: [
    'security operations', 'soc', 'security operations center',
    'incident response', 'incident management', 'incident handling', 'csirt',
    'incident response plan', 'irp', 'incident lifecycle', 'incident classification',
    'forensics', 'digital forensics', 'chain of custody', 'evidence handling',
    'malware', 'virus', 'trojan', 'worm', 'ransomware', 'spyware', 'rootkit',
    'antivirus', 'anti-malware', 'endpoint security', 'edr', 'xdr',
    'patch deployment', 'operational patching', // Patch deployment is operations
    'change management', 'change control', 'configuration management',
    'backup', 'recovery', 'restore', 'rto', 'rpo', 'recovery time', 'recovery point',
    'business continuity execution', 'disaster recovery execution', 'restoration', // Operational BCP/DR
    'event management', 'security event', 'security incident',
    'continuous monitoring', 'real-time monitoring', 'operational monitoring',
    'threat hunting', 'threat detection', 'anomaly detection',
    'threat intelligence operations', 'threat response', // Operational threat intelligence
    'physical security operations', 'guard', 'badge', 'visitor management',
    'siem', 'security information event management', 'soar' // Moved from Domain 6
  ],

  // Domain 8: Software Development Security (11%)
  8: [
    'sdlc', 'software development lifecycle', 'secure sdlc', 'ssdlc',
    'secure coding', 'secure programming', 'coding standards', 'code quality',
    'owasp', 'owasp top 10', 'web application security', 'application security',
    'sql injection', 'xss', 'cross-site scripting', 'csrf', 'buffer overflow',
    'input validation', 'output encoding', 'parameterized queries',
    'devops', 'devsecops', 'ci/cd', 'continuous integration', 'continuous deployment',
    'api security', 'rest api', 'soap', 'web services', 'microservices',
    'code analysis', 'static code analysis', 'dynamic code analysis',
    'software composition', 'open source', 'third-party libraries', 'dependencies',
    'secure deployment', 'release management', 'version control', 'git',
    'waf', 'web application firewall', 'rasp', 'runtime protection',
    'software requirements', 'design patterns', 'software architecture',
    'agile', 'waterfall', 'spiral model', 'development methodology'
  ]
}

// Enhanced keyword matching with weights
interface KeywordMatch {
  domain_id: number
  score: number
  matches: string[]
}

/**
 * Analyze question text and determine the most likely CISSP domain
 */
export function tagQuestionDomain(questionText: string, options: string[], answer?: string): {
  domain_id: number
  subdomain_id?: number
  confidence: number
  matches: string[]
} {
  const fullText = `${questionText} ${options.join(' ')} ${answer || ''}`.toLowerCase()
  
  const domainScores: KeywordMatch[] = []
  
  // Check each domain's keywords
  for (const [domainId, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
    let score = 0
    const matches: string[] = []
    
    for (const keyword of keywords) {
      const keywordLower = keyword.toLowerCase()
      
      // Check for exact phrase match (higher weight)
      if (fullText.includes(keywordLower)) {
        score += 3
        matches.push(keyword)
      }
      
      // Check for individual word matches (lower weight)
      const words = keywordLower.split(' ')
      for (const word of words) {
        if (word.length > 3 && fullText.includes(word)) {
          score += 1
        }
      }
    }
    
    if (score > 0) {
      domainScores.push({
        domain_id: parseInt(domainId),
        score,
        matches
      })
    }
  }
  
  // Sort by score and get the best match
  domainScores.sort((a, b) => b.score - a.score)
  
  if (domainScores.length === 0) {
    // Default to Domain 1 if no matches found
    return {
      domain_id: 1,
      confidence: 0,
      matches: []
    }
  }
  
  const bestMatch = domainScores[0]
  const secondBest = domainScores[1]
  
  // Calculate confidence based on score difference
  let confidence = Math.min(100, (bestMatch.score / 10) * 100)
  
  // Reduce confidence if scores are close
  if (secondBest && (secondBest.score / bestMatch.score) > 0.8) {
    confidence *= 0.7
  }
  
  // Try to determine subdomain (simplified - you may want to expand this)
  const subdomain_id = determineSubdomain(bestMatch.domain_id, bestMatch.matches)
  
  return {
    domain_id: bestMatch.domain_id,
    subdomain_id,
    confidence: Math.round(confidence),
    matches: bestMatch.matches
  }
}

/**
 * Determine subdomain based on domain and specific keyword matches
 */
function determineSubdomain(domain_id: number, matches: string[]): number | undefined {
  // This is a simplified implementation
  // You could expand this with more specific subdomain keyword mappings
  
  const domain = CISSP_DOMAINS.find(d => d.id === domain_id)
  if (!domain || domain.subdomains.length === 0) {
    return undefined
  }
  
  // For now, return undefined to let you manually review and assign subdomains
  // You can expand this function with more specific logic
  return undefined
}

/**
 * Batch tag multiple questions
 */
export function tagQuestionsBatch(questions: Array<{
  question_text: string
  options: string[]
  correct_answer?: string
  raw_answer?: string
}>): Array<{
  domain_id: number
  subdomain_id?: number
  confidence: number
  matches: string[]
}> {
  return questions.map(q => 
    tagQuestionDomain(
      q.question_text, 
      q.options, 
      q.raw_answer || q.correct_answer
    )
  )
}

/**
 * Get domain statistics for a set of tagged questions
 */
export function getDomainStatistics(
  taggedQuestions: Array<{ domain_id: number; confidence: number }>
): Record<number, { count: number; avgConfidence: number; percentage: number }> {
  const stats: Record<number, { count: number; totalConfidence: number }> = {}
  
  // Initialize stats for all domains
  for (const domain of CISSP_DOMAINS) {
    stats[domain.id] = { count: 0, totalConfidence: 0 }
  }
  
  // Count questions per domain
  for (const q of taggedQuestions) {
    stats[q.domain_id].count++
    stats[q.domain_id].totalConfidence += q.confidence
  }
  
  // Calculate final statistics
  const total = taggedQuestions.length
  const result: Record<number, { count: number; avgConfidence: number; percentage: number }> = {}
  
  for (const [domainId, stat] of Object.entries(stats)) {
    result[parseInt(domainId)] = {
      count: stat.count,
      avgConfidence: stat.count > 0 ? Math.round(stat.totalConfidence / stat.count) : 0,
      percentage: total > 0 ? Math.round((stat.count / total) * 100) : 0
    }
  }
  
  return result
}

/**
 * Generate a report of domain tagging results
 */
export function generateTaggingReport(
  questions: Array<{
    id: number
    question_text: string
    domain_id: number
    confidence: number
    matches: string[]
  }>
): string {
  const stats = getDomainStatistics(questions)
  
  let report = 'CISSP Question Domain Tagging Report\n'
  report += '=====================================\n\n'
  
  report += 'Domain Distribution:\n'
  report += '-------------------\n'
  
  for (const domain of CISSP_DOMAINS) {
    const stat = stats[domain.id]
    report += `Domain ${domain.domain_number}: ${domain.name}\n`
    report += `  Questions: ${stat.count} (${stat.percentage}%)\n`
    report += `  Target Weight: ${domain.weight_percentage}%\n`
    report += `  Avg Confidence: ${stat.avgConfidence}%\n`
    report += `  Difference: ${stat.percentage - domain.weight_percentage}%\n\n`
  }
  
  report += '\nLow Confidence Questions (< 50%):\n'
  report += '--------------------------------\n'
  
  const lowConfidence = questions.filter(q => q.confidence < 50)
  for (const q of lowConfidence.slice(0, 10)) {
    report += `Q${q.id}: ${q.question_text.substring(0, 60)}...\n`
    report += `  Domain: ${q.domain_id}, Confidence: ${q.confidence}%\n`
  }
  
  if (lowConfidence.length > 10) {
    report += `\n... and ${lowConfidence.length - 10} more low confidence questions\n`
  }
  
  return report
}
