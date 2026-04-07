import type { LegalSection } from '@/lib/legal'
import { introCollectionSections } from './content/intro-collection'
import { transfersRetentionSections } from './content/transfers-retention'
import { rightsMiscSections } from './content/rights-misc'

export const privacySections: LegalSection[] = [
  ...introCollectionSections,
  ...transfersRetentionSections,
  ...rightsMiscSections,
]
