import QuizSelection from '@/components/QuizSelection'
import Link from 'next/link'
import './quiz.css'

// Complete list of all 8 CISSP domains with subdomains (static data)
const CISSP_DOMAINS = [
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

export default function QuizPage() {
  // Use static domains data - no database needed!
  const displayDomains = CISSP_DOMAINS

  return (
    <div className="quiz-container">
      <Link href="/" className="back-to-home">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        <span>To Frontpage</span>
      </Link>
      
      <div className="quiz-content">
        <div className="quiz-header">
          <h1>CISSP Practice Quiz</h1>
          <p>Test your knowledge with practice questions from all 8 CISSP domains. 
            Choose a specific domain or take a comprehensive mixed quiz.</p>
        </div>
        
        <QuizSelection domains={displayDomains} />
      </div>
    </div>
  )
}
