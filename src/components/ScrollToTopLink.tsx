'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

interface ScrollToTopLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  [key: string]: any
}

export default function ScrollToTopLink({ href, children, className, ...props }: ScrollToTopLinkProps) {
  const router = useRouter()
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    
    // Aggressively scroll to top using multiple methods
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    
    // Use requestAnimationFrame to ensure it happens after navigation
    requestAnimationFrame(() => {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    })
    
    // Then navigate
    router.push(href)
  }
  
  return (
    <Link 
      href={href} 
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  )
}