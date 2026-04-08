import type { LegalSection } from '@/lib/legal'
import { introSections } from './content/intro'
import { billingAndConductSections } from './content/billing'
import { legalProtectionSections } from './content/legal-protections'
import { boilerplateSections } from './content/boilerplate'

export const termsSections: LegalSection[] = [
  ...introSections,
  ...billingAndConductSections,
  ...legalProtectionSections,
  ...boilerplateSections,
]
