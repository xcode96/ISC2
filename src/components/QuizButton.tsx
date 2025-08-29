'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface QuizButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'answer' | 'correct' | 'incorrect' | 'selected'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: React.ReactNode
}

const QuizButton = forwardRef<HTMLButtonElement, QuizButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-300 ease-out
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-75
      transform hover:scale-105 active:scale-95
      shadow-lg hover:shadow-xl
      position-relative overflow-hidden text-center
      before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full
      before:bg-gradient-to-r before:opacity-0 before:transition-opacity before:duration-300
      hover:before:opacity-20
    `
    
    const variants = {
      primary: `
        bg-gradient-to-r from-blue-600 to-purple-600 text-white
        hover:from-blue-700 hover:to-purple-700
        focus:ring-blue-500
        before:from-white before:to-white
        shadow-blue-500/25 hover:shadow-blue-500/40
      `,
      secondary: `
        bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300
        hover:from-gray-200 hover:to-gray-300 hover:border-gray-400
        focus:ring-gray-500
        before:from-gray-600 before:to-gray-700
        shadow-gray-500/20 hover:shadow-gray-500/30
      `,
      answer: `
        bg-white text-gray-800 border-2 border-gray-300
        hover:border-blue-400 hover:bg-blue-50
        focus:ring-blue-500 focus:border-blue-500
        before:from-blue-400 before:to-blue-600
        shadow-gray-500/20 hover:shadow-blue-500/30
        transition-all duration-200
      `,
      selected: `
        bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-2 border-blue-400
        focus:ring-blue-500
        before:from-blue-400 before:to-blue-600
        shadow-blue-500/30
      `,
      correct: `
        bg-gradient-to-r from-green-500 to-emerald-600 text-white border-2 border-green-400
        focus:ring-green-500
        before:from-white before:to-white
        shadow-green-500/40
      `,
      incorrect: `
        bg-gradient-to-r from-red-500 to-rose-600 text-white border-2 border-red-400
        focus:ring-red-500
        before:from-white before:to-white
        shadow-red-500/40
      `
    }

    const sizes = {
      sm: 'h-9 px-4 text-sm min-w-[80px]',
      md: 'h-11 px-6 py-2 text-base min-w-[120px]',
      lg: 'h-14 px-8 py-3 text-lg min-w-[140px]'
    }

    const disabledStyles = disabled || isLoading 
      ? 'opacity-50 cursor-not-allowed hover:scale-100 active:scale-100 shadow-none hover:shadow-none'
      : ''

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          disabledStyles,
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        <span className="relative z-10">{children}</span>
      </button>
    )
  }
)

QuizButton.displayName = 'QuizButton'

export default QuizButton