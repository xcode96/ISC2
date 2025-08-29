/**
 * Utility functions for handling base paths in both dev and production
 */

// Get the base path for the application
export function getBasePath(): string {
  // Check if we have a base path from Next.js config (injected by GitHub Actions)
  if (typeof window !== 'undefined') {
    // In production on GitHub Pages, detect from the URL
    const { pathname } = window.location
    // If we're on GitHub Pages, the first part of the path is the repo name
    if (window.location.hostname.includes('github.io')) {
      const pathParts = pathname.split('/').filter(Boolean)
      if (pathParts.length > 0 && pathParts[0] === 'cissp-tester') {
        return '/cissp-tester'
      }
    }
  }
  
  // In development or if not on GitHub Pages
  return ''
}

// Get the full path for a resource
export function getResourcePath(path: string): string {
  const basePath = getBasePath()
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${basePath}${normalizedPath}`
}

// Export for use in components
export const BASE_PATH = getBasePath()
