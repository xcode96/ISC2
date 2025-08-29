// src/lib/pdf-export.ts
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

interface PDFExportOptions {
  filename?: string
  title?: string
  metadata?: {
    score?: number
    date?: string
    timeSpent?: number
    questionsCount?: number
  }
  excludeSelectors?: string[]
  scale?: number
  format?: 'a4' | 'letter'
  orientation?: 'portrait' | 'landscape'
}

/**
 * Enhanced PDF export utility for quiz results
 */
export class PDFExporter {
  private defaultOptions: PDFExportOptions = {
    scale: 2,
    format: 'a4',
    orientation: 'portrait',
    excludeSelectors: [
      '.results-actions',
      '.btn-download-pdf',
      '.download-pdf-section',
      'button',
      '.no-print'
    ]
  }

  /**
   * Generate and download PDF from HTML element
   */
  async exportToPDF(
    element: HTMLElement,
    options: PDFExportOptions = {}
  ): Promise<void> {
    const config = { ...this.defaultOptions, ...options }
    
    try {
      // Show loading state
      this.showLoadingState()
      
      // Clone and prepare element
      const clone = await this.prepareElement(element, config)
      
      // Generate canvas
      const canvas = await this.generateCanvas(clone, config)
      
      // Create PDF
      await this.createPDF(canvas, config)
      
      // Cleanup
      this.cleanup(clone)
      this.hideLoadingState()
      
    } catch (error) {
      console.error('PDF export failed:', error)
      this.hideLoadingState()
      this.showError('Failed to generate PDF. Please try again.')
      throw error
    }
  }

  /**
   * Prepare element for PDF generation
   */
  private async prepareElement(
    element: HTMLElement,
    config: PDFExportOptions
  ): Promise<HTMLElement> {
    // Clone the element
    const clone = element.cloneNode(true) as HTMLElement
    
    // Remove excluded elements
    config.excludeSelectors?.forEach(selector => {
      clone.querySelectorAll(selector).forEach(el => el.remove())
    })
    
    // Add PDF-specific styles
    this.applyPDFStyles(clone, config)
    
    // Add metadata if provided
    if (config.metadata) {
      this.addMetadata(clone, config.metadata)
    }
    
    // Temporarily add to DOM for rendering
    clone.style.position = 'absolute'
    clone.style.left = '-9999px'
    clone.style.width = element.offsetWidth + 'px'
    document.body.appendChild(clone)
    
    // Wait for images to load
    await this.waitForImages(clone)
    
    return clone
  }

  /**
   * Apply PDF-specific styles
   */
  private applyPDFStyles(element: HTMLElement, config: PDFExportOptions): void {
    // Set background and colors for better PDF rendering
    element.style.background = '#ffffff'
    element.style.color = '#1e293b'
    element.style.padding = '40px'
    
    // Fix gradient text
    element.querySelectorAll('[style*="background-clip"]').forEach(el => {
      const htmlEl = el as HTMLElement
      htmlEl.style.webkitTextFillColor = '#1e293b'
      htmlEl.style.color = '#1e293b'
    })
    
    // Style cards
    element.querySelectorAll('.result-card, .domain-card, .recommendation-card').forEach(card => {
      const htmlCard = card as HTMLElement
      htmlCard.style.background = '#f8fafc'
      htmlCard.style.border = '2px solid #e2e8f0'
      htmlCard.style.boxShadow = 'none'
    })
    
    // Style progress bars
    element.querySelectorAll('.progress-bg').forEach(progress => {
      const svgEl = progress as SVGElement
      svgEl.style.stroke = '#e2e8f0'
    })
    
    // Add header if title provided
    if (config.title) {
      const header = document.createElement('div')
      header.style.cssText = `
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 30px;
        color: #1e293b;
        padding-bottom: 10px;
        border-bottom: 2px solid #e2e8f0;
      `
      header.textContent = config.title
      element.insertBefore(header, element.firstChild)
    }
  }

  /**
   * Add metadata footer
   */
  private addMetadata(element: HTMLElement, metadata: any): void {
    const footer = document.createElement('div')
    footer.style.cssText = `
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e2e8f0;
      text-align: center;
      font-size: 12px;
      color: #64748b;
    `
    
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    
    let footerText = `Generated on ${date}`
    
    if (metadata.score !== undefined) {
      footerText += ` | Score: ${metadata.score}%`
    }
    
    if (metadata.questionsCount !== undefined) {
      footerText += ` | Questions: ${metadata.questionsCount}`
    }
    
    if (metadata.timeSpent !== undefined) {
      const minutes = Math.floor(metadata.timeSpent / 60)
      const seconds = metadata.timeSpent % 60
      footerText += ` | Time: ${minutes}:${seconds.toString().padStart(2, '0')}`
    }
    
    footer.textContent = footerText
    element.appendChild(footer)
  }

  /**
   * Wait for all images to load
   */
  private async waitForImages(element: HTMLElement): Promise<void> {
    const images = Array.from(element.querySelectorAll('img'))
    const promises = images.map(img => {
      if (img.complete) return Promise.resolve()
      return new Promise(resolve => {
        img.onload = resolve
        img.onerror = resolve
      })
    })
    await Promise.all(promises)
  }

  /**
   * Generate canvas from element
   */
  private async generateCanvas(
    element: HTMLElement,
    config: PDFExportOptions
  ): Promise<HTMLCanvasElement> {
    return await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: config.scale,
      logging: false,
      useCORS: true,
      allowTaint: true,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    })
  }

  /**
   * Create PDF from canvas
   */
  private async createPDF(
    canvas: HTMLCanvasElement,
    config: PDFExportOptions
  ): Promise<void> {
    const imgData = canvas.toDataURL('image/png')
    
    // Calculate dimensions
    const format = config.format || 'a4'
    const orientation = config.orientation || 'portrait'
    const pdf = new jsPDF(orientation, 'mm', format)
    
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = pageWidth - 20 // 10mm margins
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    let heightLeft = imgHeight
    let position = 10 // Top margin
    
    // Add first page
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
    heightLeft -= (pageHeight - 20) // Account for margins
    
    // Add additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight + 10
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
      heightLeft -= (pageHeight - 20)
    }
    
    // Generate filename
    const filename = config.filename || this.generateFilename(config.metadata)
    
    // Save PDF
    pdf.save(filename)
  }

  /**
   * Generate default filename
   */
  private generateFilename(metadata?: any): string {
    const date = new Date().toISOString().split('T')[0]
    let filename = `CISSP_Quiz_Results_${date}`
    
    if (metadata?.score !== undefined) {
      filename += `_Score_${metadata.score}%`
    }
    
    return `${filename}.pdf`
  }

  /**
   * Cleanup cloned element
   */
  private cleanup(element: HTMLElement): void {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element)
    }
  }

  /**
   * Show loading state
   */
  private showLoadingState(): void {
    // Create loading overlay
    const overlay = document.createElement('div')
    overlay.id = 'pdf-export-loading'
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `
    
    const spinner = document.createElement('div')
    spinner.style.cssText = `
      width: 60px;
      height: 60px;
      border: 4px solid #ffffff;
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    `
    
    const style = document.createElement('style')
    style.textContent = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `
    
    overlay.appendChild(spinner)
    document.head.appendChild(style)
    document.body.appendChild(overlay)
  }

  /**
   * Hide loading state
   */
  private hideLoadingState(): void {
    const overlay = document.getElementById('pdf-export-loading')
    if (overlay) {
      overlay.remove()
    }
  }

  /**
   * Show error message
   */
  private showError(message: string): void {
    const toast = document.createElement('div')
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #ef4444;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      z-index: 10001;
      animation: slideIn 0.3s ease-out;
    `
    toast.textContent = message
    
    document.body.appendChild(toast)
    
    setTimeout(() => {
      toast.remove()
    }, 5000)
  }
}

// Export singleton instance
export const pdfExporter = new PDFExporter()

// React hook for PDF export
export function usePDFExport() {
  const exportToPDF = async (
    elementRef: React.RefObject<HTMLElement>,
    options?: PDFExportOptions
  ) => {
    if (!elementRef.current) {
      console.error('Element ref is not available')
      return
    }
    
    await pdfExporter.exportToPDF(elementRef.current, options)
  }
  
  return { exportToPDF }
}