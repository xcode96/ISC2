// Static CISSP domains data - no database needed!
export const CISSP_DOMAINS = [
  {
    id: 1,
    domain_number: 1,
    name: "Security and Risk Management",
    weight_percentage: 15,
    description: "Covers confidentiality, integrity, and availability concepts; legal, regulatory and compliance issues; professional ethics; and risk management.",
    subdomains: [
      { id: 1, subdomain_number: "1.1", title: "Understand, adhere to, and promote professional ethics" },
      { id: 2, subdomain_number: "1.2", title: "Understand and apply security concepts" },
      { id: 3, subdomain_number: "1.3", title: "Evaluate and apply security governance principles" },
      { id: 4, subdomain_number: "1.4", title: "Determine compliance and other requirements" },
      { id: 5, subdomain_number: "1.5", title: "Understand legal and regulatory issues" },
      { id: 6, subdomain_number: "1.6", title: "Understand requirements for investigation types" },
      { id: 7, subdomain_number: "1.7", title: "Develop, document, and implement security policy" },
      { id: 8, subdomain_number: "1.8", title: "Identify, analyze, and prioritize Business Continuity requirements" },
      { id: 9, subdomain_number: "1.9", title: "Contribute to and enforce personnel security policies" },
      { id: 10, subdomain_number: "1.10", title: "Understand and apply risk management concepts" },
      { id: 11, subdomain_number: "1.11", title: "Understand and apply threat modeling concepts" },
      { id: 12, subdomain_number: "1.12", title: "Apply Supply Chain Risk Management concepts" },
      { id: 13, subdomain_number: "1.13", title: "Establish and maintain a security awareness program" }
    ]
  },
  {
    id: 2,
    domain_number: 2,
    name: "Asset Security",
    weight_percentage: 10,
    description: "Addresses information and asset classification, ownership, privacy protection, retention, and secure asset handling.",
    subdomains: [
      { id: 14, subdomain_number: "2.1", title: "Identify and classify information and assets" },
      { id: 15, subdomain_number: "2.2", title: "Establish information and asset handling requirements" },
      { id: 16, subdomain_number: "2.3", title: "Provision resources securely" },
      { id: 17, subdomain_number: "2.4", title: "Manage data lifecycle" },
      { id: 18, subdomain_number: "2.5", title: "Ensure appropriate asset retention" },
      { id: 19, subdomain_number: "2.6", title: "Determine data security controls" }
    ]
  },
  {
    id: 3,
    domain_number: 3,
    name: "Security Architecture and Engineering",
    weight_percentage: 13,
    description: "Covers the design and implementation of secure architectures, security models, and engineering principles.",
    subdomains: [
      { id: 20, subdomain_number: "3.1", title: "Research, implement and manage engineering processes" },
      { id: 21, subdomain_number: "3.2", title: "Understand the fundamental concepts of security models" },
      { id: 22, subdomain_number: "3.3", title: "Select controls based on systems security requirements" },
      { id: 23, subdomain_number: "3.4", title: "Understand security capabilities of Information Systems" },
      { id: 24, subdomain_number: "3.5", title: "Assess and mitigate vulnerabilities" },
      { id: 25, subdomain_number: "3.6", title: "Understand and apply cryptography" },
      { id: 26, subdomain_number: "3.7", title: "Understand site and facility design secure principles" },
      { id: 27, subdomain_number: "3.8", title: "Design and implement physical security" }
    ]
  },
  {
    id: 4,
    domain_number: 4,
    name: "Communication and Network Security",
    weight_percentage: 13,
    description: "Focuses on network architecture design, secure network components, and secure communication channels.",
    subdomains: [
      { id: 28, subdomain_number: "4.1", title: "Implement secure design principles in network architectures" },
      { id: 29, subdomain_number: "4.2", title: "Secure network components" },
      { id: 30, subdomain_number: "4.3", title: "Implement secure communication channels" },
      { id: 31, subdomain_number: "4.4", title: "Prevent or mitigate network attacks" }
    ]
  },
  {
    id: 5,
    domain_number: 5,
    name: "Identity and Access Management (IAM)",
    weight_percentage: 13,
    description: "Covers physical and logical assets control, identification and authentication, authorization mechanisms, and identity lifecycle management.",
    subdomains: [
      { id: 32, subdomain_number: "5.1", title: "Control physical and logical access to assets" },
      { id: 33, subdomain_number: "5.2", title: "Manage identification and authentication" },
      { id: 34, subdomain_number: "5.3", title: "Federated identity with third-party services" },
      { id: 35, subdomain_number: "5.4", title: "Implement and manage authorization mechanisms" },
      { id: 36, subdomain_number: "5.5", title: "Manage the identity and access provisioning lifecycle" },
      { id: 37, subdomain_number: "5.6", title: "Implement authentication systems" }
    ]
  },
  {
    id: 6,
    domain_number: 6,
    name: "Security Assessment and Testing",
    weight_percentage: 12,
    description: "Addresses assessment and test strategies, security control testing, and security process data collection and analysis.",
    subdomains: [
      { id: 38, subdomain_number: "6.1", title: "Design and validate assessment, test, and audit strategies" },
      { id: 39, subdomain_number: "6.2", title: "Conduct security control testing" },
      { id: 40, subdomain_number: "6.3", title: "Collect security process data" },
      { id: 41, subdomain_number: "6.4", title: "Analyze test output and generate report" },
      { id: 42, subdomain_number: "6.5", title: "Conduct or facilitate security audits" }
    ]
  },
  {
    id: 7,
    domain_number: 7,
    name: "Security Operations",
    weight_percentage: 13,
    description: "Covers foundational concepts, investigations, logging and monitoring, incident management, and preventative measures.",
    subdomains: [
      { id: 43, subdomain_number: "7.1", title: "Understand and comply with investigations" },
      { id: 44, subdomain_number: "7.2", title: "Conduct logging and monitoring activities" },
      { id: 45, subdomain_number: "7.3", title: "Perform Configuration Management" },
      { id: 46, subdomain_number: "7.4", title: "Apply foundational security operations concepts" },
      { id: 47, subdomain_number: "7.5", title: "Apply resource protection" },
      { id: 48, subdomain_number: "7.6", title: "Conduct incident management" },
      { id: 49, subdomain_number: "7.7", title: "Operate and maintain detective and preventative measures" },
      { id: 50, subdomain_number: "7.8", title: "Implement and support patch and vulnerability management" },
      { id: 51, subdomain_number: "7.9", title: "Understand and participate in change management processes" },
      { id: 52, subdomain_number: "7.10", title: "Implement recovery strategies" },
      { id: 53, subdomain_number: "7.11", title: "Implement Disaster Recovery processes" },
      { id: 54, subdomain_number: "7.12", title: "Test Disaster Recovery Plans" },
      { id: 55, subdomain_number: "7.13", title: "Participate in Business Continuity planning" },
      { id: 56, subdomain_number: "7.14", title: "Implement and manage physical security" },
      { id: 57, subdomain_number: "7.15", title: "Address personnel safety and security concerns" }
    ]
  },
  {
    id: 8,
    domain_number: 8,
    name: "Software Development Security",
    weight_percentage: 11,
    description: "Focuses on understanding and integrating security in the software development lifecycle, and secure software deployment.",
    subdomains: [
      { id: 58, subdomain_number: "8.1", title: "Understand and integrate security in SDLC" },
      { id: 59, subdomain_number: "8.2", title: "Identify and apply security controls in software development" },
      { id: 60, subdomain_number: "8.3", title: "Assess the effectiveness of software security" },
      { id: 61, subdomain_number: "8.4", title: "Assess security impact of acquired software" },
      { id: 62, subdomain_number: "8.5", title: "Define and apply secure coding guidelines" }
    ]
  }
]

// Helper function to get domain by ID
export function getDomainById(id: number) {
  return CISSP_DOMAINS.find(d => d.id === id)
}

// Helper function to get domain by number
export function getDomainByNumber(number: number) {
  return CISSP_DOMAINS.find(d => d.domain_number === number)
}

// Helper function to get all subdomains
export function getAllSubdomains() {
  return CISSP_DOMAINS.flatMap(d => d.subdomains)
}

// Helper function to get subdomain by ID
export function getSubdomainById(id: number) {
  for (const domain of CISSP_DOMAINS) {
    const subdomain = domain.subdomains.find(s => s.id === id)
    if (subdomain) return subdomain
  }
  return null
}
