'use client'

import BuyMeACoffee from './BuyMeACoffee'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">CISSP Study Platform</h3>
          <p className="footer-description">
            Free, community-driven CISSP exam preparation. 
            900+ practice questions. No signup required.
          </p>
          <p className="footer-tagline">
            Built by security professionals, for security professionals.
          </p>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-subtitle">Quick Links</h4>
          <div className="footer-links">
            <Link href="/quiz" className="footer-link">
              Practice Quiz
            </Link>
            <Link href="/domains" className="footer-link">
              Study Domains
            </Link>
            <Link href="/progress" className="footer-link">
              Your Progress
            </Link>
          </div>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-subtitle">Support This Project</h4>
          <p className="support-text">
            Help keep this resource free for everyone
          </p>
          <BuyMeACoffee />
        </div>
      </div>
      
      <style jsx>{`
        .site-footer {
          background: linear-gradient(180deg, rgba(17, 24, 39, 0.5) 0%, rgba(17, 24, 39, 0.9) 100%);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 3rem 1rem 2rem;
          margin-top: 4rem;
          backdrop-filter: blur(10px);
        }
        
        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 3rem;
        }
        
        .footer-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .footer-title {
          font-size: 1.25rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }
        
        .footer-subtitle {
          font-size: 0.875rem;
          font-weight: 600;
          color: #e5e7eb;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }
        
        .footer-description {
          color: #9ca3af;
          font-size: 0.875rem;
          line-height: 1.6;
        }
        
        .footer-tagline {
          color: #6b7280;
          font-size: 0.813rem;
          font-style: italic;
        }
        
        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .footer-link {
          color: #9ca3af;
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .footer-link:hover {
          color: #667eea;
        }
        
        .footer-link::before {
          content: '→';
          opacity: 0;
          transform: translateX(-10px);
          transition: all 0.2s ease;
        }
        
        .footer-link:hover::before {
          opacity: 1;
          transform: translateX(0);
        }
        
        .support-text {
          color: #9ca3af;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }
        
        @media (max-width: 768px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: 2rem;
            text-align: center;
          }
          
          .footer-section {
            align-items: center;
          }
          
          .footer-links {
            align-items: center;
          }
          
          .footer-link::before {
            display: none;
          }
        }
      `}</style>
    </footer>
  )
}
