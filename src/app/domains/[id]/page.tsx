import { cisspDomains } from '@/lib/utils/cissp-data'
import { notFound } from 'next/navigation'
import DomainDetailClient from './DomainDetailClient'

interface DomainDetailPageProps {
  params: {
    id: string
  }
}

// Generate static params for all 8 domains
export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
    { id: '7' },
    { id: '8' },
  ]
}

export default function DomainDetailPage({ params }: DomainDetailPageProps) {
  const domainId = parseInt(params.id)
  const domain = cisspDomains.find(d => d.domain_number === domainId)
  
  if (!domain) {
    notFound()
  }

  return <DomainDetailClient domain={domain} domainId={domainId} />
}
