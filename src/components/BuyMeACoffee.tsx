'use client'

import { useState } from 'react'

export default function BuyMeACoffee() {
  const [showTooltip, setShowTooltip] = useState(false)
  
  return (
    <div className="buy-me-coffee-container">
      <div 
        className="relative inline-block"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <a
          href="https://buymeacoffee.com/kylemanley"
          target="_blank"
          rel="noopener noreferrer"
          className="buy-me-coffee-button"
          aria-label="Support this project on Buy Me a Coffee"
        >
          <span className="coffee-icon">☕</span>
          <span className="button-text">Buy Me a Coffee</span>
        </a>
        
        {showTooltip && (
          <div className="coffee-tooltip">
            Found this helpful? Support the development of free CISSP study resources! 
            Your contribution helps keep this tool free for everyone. 🙏
          </div>
        )}
      </div>
      
      <style jsx>{`
        .buy-me-coffee-container {
          display: inline-block;
        }
        
        .buy-me-coffee-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 9999px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          position: relative;
          overflow: hidden;
        }
        
        .buy-me-coffee-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }
        
        .buy-me-coffee-button:active {
          transform: translateY(0);
        }
        
        .coffee-icon {
          font-size: 18px;
          animation: wiggle 2s ease-in-out infinite;
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        
        .button-text {
          letter-spacing: 0.5px;
        }
        
        .coffee-tooltip {
          position: absolute;
          bottom: calc(100% + 12px);
          left: 50%;
          transform: translateX(-50%);
          background: rgba(17, 24, 39, 0.95);
          color: #f3f4f6;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 13px;
          line-height: 1.5;
          width: 280px;
          text-align: center;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          z-index: 1000;
          animation: fadeIn 0.2s ease-in-out;
          pointer-events: none;
        }
        
        .coffee-tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 6px solid transparent;
          border-top-color: rgba(17, 24, 39, 0.95);
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        
        /* Responsive adjustments */
        @media (max-width: 640px) {
          .buy-me-coffee-button {
            padding: 8px 16px;
            font-size: 13px;
          }
          
          .coffee-icon {
            font-size: 16px;
          }
          
          .coffee-tooltip {
            width: 240px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  )
}
