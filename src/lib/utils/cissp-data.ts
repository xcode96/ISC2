// src/lib/utils/cissp-data.ts
export const cisspDomains = [
  {
    domain_number: 1,
    name: "Security and Risk Management",
    weight_percentage: 15,
    subdomains: [
      {
        subdomain_number: "1.1",
        title: "Understand, adhere to, and promote professional ethics",
        key_concepts: ["ISC2 Code of Professional Ethics", "Organizational code of ethics"]
      },
      {
        subdomain_number: "1.2",
        title: "Understand and apply security concepts",
        key_concepts: ["CIA triad", "Authenticity", "Nonrepudiation", "5 Pillars of Information Security"]
      },
      {
        subdomain_number: "1.3",
        title: "Evaluate and apply security governance principles",
        key_concepts: ["Business alignment", "Organizational processes", "Security control frameworks", "ISO", "NIST", "COBIT", "SABSA", "PCI", "FedRAMP", "Due care/due diligence"]
      },
      {
        subdomain_number: "1.4",
        title: "Understand legal, regulatory, and compliance issues",
        key_concepts: ["Cybercrimes", "Data breaches", "Licensing", "IP requirements", "Import/export controls", "Transborder data flow", "GDPR", "CCPA", "Industry standards"]
      },
      {
        subdomain_number: "1.5",
        title: "Understand requirements for investigation types",
        key_concepts: ["Administrative", "Criminal", "Civil", "Regulatory", "Industry standards"]
      },
      {
        subdomain_number: "1.6",
        title: "Develop, document, and implement security policy, standards, procedures, and guidelines",
        key_concepts: ["Policy development", "Standards", "Procedures", "Guidelines"]
      },
      {
        subdomain_number: "1.7",
        title: "Identify, analyze, assess, prioritize, and implement Business Continuity requirements",
        key_concepts: ["Business impact analysis", "External dependencies"]
      },
      {
        subdomain_number: "1.8",
        title: "Contribute to and enforce personnel security policies and procedures",
        key_concepts: ["Candidate screening", "Employment agreements", "Onboarding", "Transfers", "Termination", "Vendor controls"]
      },
      {
        subdomain_number: "1.9",
        title: "Understand and apply risk management concepts",
        key_concepts: ["Threat identification", "Vulnerability identification", "Risk analysis", "Risk response", "Control types", "Continuous monitoring", "Risk frameworks"]
      },
      {
        subdomain_number: "1.10",
        title: "Understand and apply threat modeling concepts and methodologies",
        key_concepts: ["Threat modeling", "Methodologies"]
      },
      {
        subdomain_number: "1.11",
        title: "Apply Supply Chain Risk Management (SCRM) concepts",
        key_concepts: ["Product tampering", "Counterfeits", "Implants", "Third-party assessment", "Minimum security requirements", "Software bill of materials"]
      },
      {
        subdomain_number: "1.12",
        title: "Establish and maintain a security awareness, education, and training program",
        key_concepts: ["Social engineering", "Phishing", "Security champions", "Gamification", "Emerging technologies", "Program effectiveness"]
      }
    ]
  },
  {
    domain_number: 2,
    name: "Asset Security",
    weight_percentage: 10,
    subdomains: [
      {
        subdomain_number: "2.1",
        title: "Identify and classify information and assets",
        key_concepts: ["Data classification", "Asset classification"]
      },
      {
        subdomain_number: "2.2",
        title: "Establish information and asset handling requirements",
        key_concepts: ["Handling requirements"]
      },
      {
        subdomain_number: "2.3",
        title: "Provision information and assets securely",
        key_concepts: ["Information ownership", "Asset ownership", "Asset inventory", "Asset management"]
      },
      {
        subdomain_number: "2.4",
        title: "Manage data lifecycle",
        key_concepts: ["Data roles", "Data collection", "Data location", "Data maintenance", "Data retention", "Data remanence", "Data destruction"]
      },
      {
        subdomain_number: "2.5",
        title: "Ensure appropriate asset retention",
        key_concepts: ["End of Life (EOL)", "End of Support"]
      },
      {
        subdomain_number: "2.6",
        title: "Determine data security controls and compliance requirements",
        key_concepts: ["Data states", "In use", "In transit", "At rest", "Scoping", "Tailoring", "DRM", "DLP", "CASB"]
      }
    ]
  },
  {
    domain_number: 3,
    name: "Security Architecture and Engineering",
    weight_percentage: 13,
    subdomains: [
      {
        subdomain_number: "3.1",
        title: "Research, implement and manage engineering processes using secure design principles",
        key_concepts: ["Threat modeling", "Least privilege", "Defense in depth", "Secure defaults", "Fail securely", "Segregation of Duties", "Keep it simple", "Zero trust", "Privacy by design", "Shared responsibility", "SASE"]
      },
      {
        subdomain_number: "3.2",
        title: "Understand the fundamental concepts of security models",
        key_concepts: ["Biba", "Star Model", "Bell-LaPadula"]
      },
      {
        subdomain_number: "3.3",
        title: "Select controls based upon systems security requirements",
        key_concepts: ["Control selection", "Security requirements"]
      },
      {
        subdomain_number: "3.4",
        title: "Understand security capabilities of Information Systems",
        key_concepts: ["Memory protection", "TPM", "Encryption/decryption"]
      },
      {
        subdomain_number: "3.5",
        title: "Assess and mitigate vulnerabilities of security architectures",
        key_concepts: ["Client-based systems", "Server-based systems", "Database systems", "Cryptographic systems", "ICS", "Cloud-based systems", "Distributed systems", "IoT", "Microservices", "Containerization", "Serverless", "Embedded systems", "HPC", "Edge computing", "Virtualized systems"]
      },
      {
        subdomain_number: "3.6",
        title: "Select and determine cryptographic solutions",
        key_concepts: ["Cryptographic life cycle", "Keys", "Algorithm selection", "Symmetric", "Asymmetric", "Elliptic curves", "Quantum", "PKI"]
      },
      {
        subdomain_number: "3.7",
        title: "Understand methods of cryptanalytic attacks",
        key_concepts: ["Brute force", "Ciphertext only", "Known plaintext", "Frequency analysis", "Chosen ciphertext", "Implementation attacks", "Side-channel", "Fault injection", "Timing", "MITM", "Pass the hash", "Kerberos exploitation", "Ransomware"]
      },
      {
        subdomain_number: "3.8",
        title: "Apply security principles to site and facility design",
        key_concepts: ["Site design", "Facility design"]
      },
      {
        subdomain_number: "3.9",
        title: "Design site and facility security controls",
        key_concepts: ["Wiring closets", "Server rooms", "Data centers", "Media storage", "Evidence storage", "Restricted areas", "HVAC", "Environmental issues", "Fire suppression", "Power redundancy"]
      },
      {
        subdomain_number: "3.10",
        title: "Manage the information system lifecycle",
        key_concepts: ["Requirements analysis", "Architectural design", "Development", "Integration", "Verification", "Validation", "Deployment", "Operations", "Maintenance", "Retirement", "Disposal"]
      }
    ]
  },
  {
    domain_number: 4,
    name: "Communication and Network Security",
    weight_percentage: 13,
    subdomains: [
      {
        subdomain_number: "4.1",
        title: "Apply secure design principles in network architectures",
        key_concepts: ["OSI model", "TCP/IP", "IPv4", "IPv6", "IPSec", "SSH", "SSL/TLS", "Converged protocols", "iSCSI", "VoIP", "Traffic flows", "Physical segmentation", "Logical segmentation", "VLANs", "VPNs", "Micro-segmentation", "Zero trust", "Edge networks", "Wireless networks", "Cellular networks", "4G", "5G", "CDN", "SDN", "VPC", "Network monitoring"]
      },
      {
        subdomain_number: "4.2",
        title: "Secure network components",
        key_concepts: ["Infrastructure operation", "Redundant power", "Transmission media", "NAC systems", "Endpoint security"]
      },
      {
        subdomain_number: "4.3",
        title: "Implement secure communication channels according to design",
        key_concepts: ["Voice", "Video", "Collaboration", "Remote access", "Data communications", "Third-party connectivity"]
      }
    ]
  },
  {
    domain_number: 5,
    name: "Identity and Access Management (IAM)",
    weight_percentage: 13,
    subdomains: [
      {
        subdomain_number: "5.1",
        title: "Control physical and logical access to assets",
        key_concepts: ["Information", "Systems", "Devices", "Facilities", "Applications", "Services"]
      },
      {
        subdomain_number: "5.2",
        title: "Design identification and authentication strategy",
        key_concepts: ["Groups", "Roles", "AAA", "MFA", "Passwordless", "Session management", "Identity proofing", "FIM", "Credential management", "SSO", "Just-In-Time"]
      },
      {
        subdomain_number: "5.3",
        title: "Federated identity with a third-party service",
        key_concepts: ["On-premise", "Cloud", "Hybrid"]
      },
      {
        subdomain_number: "5.4",
        title: "Implement and manage authorization mechanisms",
        key_concepts: ["RBAC", "Rule based", "MAC", "DAC", "ABAC", "Risk based", "Policy enforcement"]
      },
      {
        subdomain_number: "5.5",
        title: "Manage the identity and access provisioning lifecycle",
        key_concepts: ["Account access review", "Provisioning", "Deprovisioning", "Role definition", "Privilege escalation", "Service accounts"]
      },
      {
        subdomain_number: "5.6",
        title: "Implement authentication systems",
        key_concepts: ["Authentication systems"]
      }
    ]
  },
  {
    domain_number: 6,
    name: "Security Assessment and Testing",
    weight_percentage: 12,
    subdomains: [
      {
        subdomain_number: "6.1",
        title: "Design and validate assessment, test, and audit strategies",
        key_concepts: ["Internal", "External", "Third-party", "Location based testing"]
      },
      {
        subdomain_number: "6.2",
        title: "Conduct security control testing",
        key_concepts: ["Vulnerability assessment", "Penetration testing", "Red team", "Blue team", "Purple team", "Log reviews", "Synthetic transactions", "Code review", "Misuse case testing", "Coverage analysis", "Interface testing", "Breach attack simulations", "Compliance checks"]
      },
      {
        subdomain_number: "6.3",
        title: "Collect security process data",
        key_concepts: ["Account management", "Management review", "KPIs", "Risk indicators", "Backup verification", "Training", "DR", "BC"]
      },
      {
        subdomain_number: "6.4",
        title: "Analyze test output and generate report",
        key_concepts: ["Remediation", "Exception handling", "Ethical disclosure"]
      },
      {
        subdomain_number: "6.5",
        title: "Conduct or facilitate security audits",
        key_concepts: ["Internal audits", "External audits", "Third-party audits", "Location based audits"]
      }
    ]
  },
  {
    domain_number: 7,
    name: "Security Operations",
    weight_percentage: 13,
    subdomains: [
      {
        subdomain_number: "7.1",
        title: "Understand and comply with investigations",
        key_concepts: ["Evidence collection", "Evidence handling", "Reporting", "Documentation", "Investigative techniques", "Digital forensics", "Artifacts"]
      },
      {
        subdomain_number: "7.2",
        title: "Conduct logging and monitoring activities",
        key_concepts: ["IDPS", "SIEM", "Continuous monitoring", "Egress monitoring", "Log management", "Threat intelligence", "Threat feeds", "Threat hunting", "UEBA"]
      },
      {
        subdomain_number: "7.3",
        title: "Perform Configuration Management",
        key_concepts: ["Provisioning", "Baselining", "Automation"]
      },
      {
        subdomain_number: "7.4",
        title: "Apply foundational security operations concepts",
        key_concepts: ["Need-to-know", "Least privilege", "Separation of Duties", "Privileged account management", "Job rotation", "SLA"]
      },
      {
        subdomain_number: "7.5",
        title: "Apply resource protection",
        key_concepts: ["Media management", "Media protection", "Data at rest", "Data in transit"]
      },
      {
        subdomain_number: "7.6",
        title: "Conduct incident management",
        key_concepts: ["Detection", "Response", "Mitigation", "Reporting", "Recovery", "Remediation", "Lessons learned"]
      },
      {
        subdomain_number: "7.7",
        title: "Operate and maintain detection and preventative measures",
        key_concepts: ["Firewalls", "NGFW", "WAF", "IDS", "IPS", "Whitelisting", "Blacklisting", "Third-party services", "Sandboxing", "Honeypots", "Anti-malware", "ML/AI tools"]
      },
      {
        subdomain_number: "7.8",
        title: "Implement and support patch and vulnerability management",
        key_concepts: ["Patch management", "Vulnerability management"]
      },
      {
        subdomain_number: "7.9",
        title: "Understand and participate in change management processes",
        key_concepts: ["Change management"]
      },
      {
        subdomain_number: "7.10",
        title: "Implement recovery strategies",
        key_concepts: ["Backup storage", "Cloud storage", "Recovery sites", "Cold sites", "Hot sites", "Multiple processing sites", "System resilience", "HA", "QoS", "Fault tolerance"]
      },
      {
        subdomain_number: "7.11",
        title: "Implement Disaster Recovery processes",
        key_concepts: ["Response", "Personnel", "Communications", "Assessment", "Restoration", "Training", "Lessons learned"]
      },
      {
        subdomain_number: "7.12",
        title: "Test Disaster Recovery Plans",
        key_concepts: ["Read-through", "Tabletop", "Walkthrough", "Simulation", "Parallel", "Full interruption", "Communications"]
      },
      {
        subdomain_number: "7.13",
        title: "Participate in Business Continuity planning and exercises",
        key_concepts: ["BC planning", "BC exercises"]
      },
      {
        subdomain_number: "7.14",
        title: "Implement and manage physical security",
        key_concepts: ["Perimeter security", "Internal security controls"]
      },
      {
        subdomain_number: "7.15",
        title: "Address personnel safety and security concerns",
        key_concepts: ["Travel", "Security training", "Insider threat", "Social media", "2FA fatigue", "Emergency management", "Duress"]
      }
    ]
  },
  {
    domain_number: 8,
    name: "Software Development Security",
    weight_percentage: 11,
    subdomains: [
      {
        subdomain_number: "8.1",
        title: "Understand and integrate security in the SDLC",
        key_concepts: ["Agile", "Waterfall", "DevOps", "DevSecOps", "Scaled Agile", "CMM", "SAMM", "Operations", "Maintenance", "Change management", "IPT"]
      },
      {
        subdomain_number: "8.2",
        title: "Identify and apply security controls in software development ecosystems",
        key_concepts: ["Programming languages", "Libraries", "Tool sets", "IDE", "Runtime", "CI/CD", "Software CM", "Code repositories", "SAST", "DAST", "Software composition analysis", "IAST"]
      },
      {
        subdomain_number: "8.3",
        title: "Assess the effectiveness of software security",
        key_concepts: ["Auditing", "Logging changes", "Risk analysis", "Risk mitigation"]
      },
      {
        subdomain_number: "8.4",
        title: "Assess security impact of acquired software",
        key_concepts: ["COTS", "Open source", "Third-party", "Managed services", "Cloud services", "SaaS", "IaaS", "PaaS"]
      },
      {
        subdomain_number: "8.5",
        title: "Define and apply secure coding guidelines and standards",
        key_concepts: ["Security weaknesses", "Vulnerabilities", "API security", "Secure coding practices", "Software-defined security"]
      }
    ]
  }
];