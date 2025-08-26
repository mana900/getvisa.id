export interface VisaType {
  id: string
  country: string
  countryCode: string
  flag: string
  visaType: string
  price: number
  processingTime: string
  duration: string
  validity: string
  isActive: boolean
  overview: {
    description: string
    features: string[]
    guaranteedDate: string
  }
  eligibility: string[]
  timeline: {
    step: string
    time: string
    description: string
  }[]
  documents: string[]
  faqs: {
    question: string
    answer: string
  }[]
  createdAt: string
  updatedAt: string
}

// Mock visa types data - in a real app, this would come from a headless CMS
export const visaTypes: VisaType[] = [
  {
    id: '1',
    country: 'Thailand',
    countryCode: 'thailand',
    flag: '🇹🇭',
    visaType: 'Tourist Visa (TR)',
    price: 45,
    processingTime: '3-5 business days',
    duration: '60 days',
    validity: '3 months',
    isActive: true,
    overview: {
      description: 'Thailand Tourist Visa allows visitors to enter Thailand for tourism purposes. This single-entry visa is perfect for travelers planning to explore Thailand\'s beautiful beaches, temples, and vibrant culture.',
      features: ['Electronic visa', 'No appointment required', 'No physical documents'],
      guaranteedDate: '25 October',
    },
    eligibility: [
      'Valid passport with at least 6 months validity',
      'Proof of accommodation in Thailand',
      'Return flight ticket',
      'Bank statement showing sufficient funds',
      'Passport-sized photograph',
    ],
    timeline: [
      { step: 'Application Submission', time: '5 minutes', description: 'Complete online application form' },
      { step: 'Document Review', time: '1-2 days', description: 'Our team reviews your documents' },
      { step: 'Embassy Processing', time: '2-3 days', description: 'Embassy processes your application' },
      { step: 'Visa Delivery', time: 'Same day', description: 'Receive your visa via email' },
    ],
    documents: [
      'Passport copy (main page)',
      'Recent passport-sized photograph',
      'Flight itinerary',
      'Hotel booking confirmation',
      'Bank statement (last 3 months)',
      'Travel insurance (recommended)',
    ],
    faqs: [
      {
        question: 'How long is the visa valid?',
        answer: 'The Thailand Tourist Visa is valid for 3 months from the date of issue, allowing a stay of up to 60 days.',
      },
      {
        question: 'Can I extend my stay?',
        answer: 'Yes, you can extend your stay for an additional 30 days at any immigration office in Thailand for a fee of 1,900 THB.',
      },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    country: 'United Kingdom',
    countryCode: 'uk',
    flag: '🇬🇧',
    visaType: 'Standard Visitor Visa',
    price: 115,
    processingTime: '15-20 business days',
    duration: '6 months',
    validity: '10 years',
    isActive: true,
    overview: {
      description: 'UK Standard Visitor Visa allows you to visit the UK for tourism, business, or to see family and friends. This visa is suitable for short-term visits.',
      features: ['Multiple entry allowed', 'Online application', 'Biometric appointment required'],
      guaranteedDate: '15 November',
    },
    eligibility: [
      'Valid passport',
      'Proof of funds to support your stay',
      'Evidence of accommodation',
      'Return travel arrangements',
      'No criminal record',
    ],
    timeline: [
      { step: 'Online Application', time: '30 minutes', description: 'Complete the online form' },
      { step: 'Biometric Appointment', time: '1 day', description: 'Attend biometric appointment' },
      { step: 'Processing', time: '15-20 days', description: 'UKVI processes your application' },
      { step: 'Decision', time: '1 day', description: 'Receive visa decision' },
    ],
    documents: [
      'Current passport',
      'Previous passports',
      'Bank statements',
      'Employment letter',
      'Travel itinerary',
      'Accommodation proof',
    ],
    faqs: [
      {
        question: 'How long can I stay?',
        answer: 'You can stay for up to 6 months on a Standard Visitor Visa.',
      },
      {
        question: 'Can I work on this visa?',
        answer: 'No, you cannot work on a Standard Visitor Visa. It is only for tourism, business meetings, or visiting family.',
      },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    id: '3',
    country: 'Canada',
    countryCode: 'canada',
    flag: '🇨🇦',
    visaType: 'Business Single Entry',
    price: 185,
    processingTime: '10-15 business days',
    duration: '6 months',
    validity: '10 years',
    isActive: true,
    overview: {
      description: 'Canada Business Single Entry Visa allows business travelers to enter Canada once for business meetings, conferences, and commercial activities.',
      features: ['Single entry only', 'Business purpose', 'Online application available'],
      guaranteedDate: '30 November',
    },
    eligibility: [
      'Valid passport with 6+ months validity',
      'Business invitation letter',
      'Proof of business relationship',
      'Financial documents',
      'Travel itinerary',
    ],
    timeline: [
      { step: 'Online Application', time: '45 minutes', description: 'Complete business visa application' },
      { step: 'Document Review', time: '3-5 days', description: 'Embassy reviews business documents' },
      { step: 'Processing', time: '7-10 days', description: 'Visa processing at Canadian embassy' },
      { step: 'Decision', time: '1-2 days', description: 'Receive visa decision' },
    ],
    documents: [
      'Valid passport',
      'Business invitation letter',
      'Company registration documents',
      'Bank statements (6 months)',
      'Travel insurance',
      'Flight itinerary',
    ],
    faqs: [
      {
        question: 'Can I extend this visa?',
        answer: 'Business single entry visas cannot be extended. You must apply for a new visa.',
      },
      {
        question: 'Can I bring family members?',
        answer: 'Family members need to apply for separate visitor visas.',
      },
    ],
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  },
  {
    id: '4',
    country: 'Canada',
    countryCode: 'canada',
    flag: '🇨🇦',
    visaType: 'Business Multi Entry',
    price: 285,
    processingTime: '15-20 business days',
    duration: '6 months per entry',
    validity: '10 years',
    isActive: true,
    overview: {
      description: 'Canada Business Multi Entry Visa allows multiple entries to Canada for business purposes over the validity period.',
      features: ['Multiple entries allowed', 'Long-term validity', 'Business purpose'],
      guaranteedDate: '5 December',
    },
    eligibility: [
      'Valid passport with 6+ months validity',
      'Strong business ties',
      'Proof of frequent business travel',
      'Financial stability documentation',
      'Travel history to Canada or other countries',
    ],
    timeline: [
      { step: 'Online Application', time: '60 minutes', description: 'Complete detailed business application' },
      { step: 'Document Review', time: '5-7 days', description: 'Thorough review of business documents' },
      { step: 'Processing', time: '10-15 days', description: 'Extended processing for multi-entry' },
      { step: 'Decision', time: '2-3 days', description: 'Final visa decision' },
    ],
    documents: [
      'Valid passport',
      'Business invitation letters',
      'Company financial statements',
      'Personal bank statements (12 months)',
      'Travel insurance',
      'Previous visa copies (if any)',
      'Employment verification letter',
    ],
    faqs: [
      {
        question: 'How many times can I enter Canada?',
        answer: 'You can enter Canada multiple times during the visa validity period.',
      },
      {
        question: 'What if my business plans change?',
        answer: 'You can use the visa for other business purposes within the allowed activities.',
      },
    ],
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  },
  {
    id: '5',
    country: 'Canada',
    countryCode: 'canada',
    flag: '🇨🇦',
    visaType: 'Tourist Single Entry',
    price: 125,
    processingTime: '7-12 business days',
    duration: '6 months',
    validity: '10 years',
    isActive: true,
    overview: {
      description: 'Canada Tourist Single Entry Visa is perfect for travelers visiting Canada for leisure, sightseeing, and visiting family or friends.',
      features: ['Single entry', 'Tourism and leisure', 'Family visits allowed'],
      guaranteedDate: '28 November',
    },
    eligibility: [
      'Valid passport',
      'Proof of ties to home country',
      'Sufficient funds for stay',
      'Travel itinerary',
      'No criminal background',
    ],
    timeline: [
      { step: 'Online Application', time: '30 minutes', description: 'Submit tourist visa application' },
      { step: 'Document Review', time: '2-3 days', description: 'Review of tourist documents' },
      { step: 'Processing', time: '5-8 days', description: 'Standard tourist visa processing' },
      { step: 'Decision', time: '1 day', description: 'Visa approval notification' },
    ],
    documents: [
      'Valid passport',
      'Bank statements (3 months)',
      'Employment letter',
      'Travel itinerary',
      'Hotel bookings or invitation letter',
      'Travel insurance',
    ],
    faqs: [
      {
        question: 'Can I work while on a tourist visa?',
        answer: 'No, tourist visas do not allow any form of employment in Canada.',
      },
      {
        question: 'Can I visit family with this visa?',
        answer: 'Yes, visiting family and friends is allowed with a tourist visa.',
      },
    ],
    createdAt: '2024-01-06T00:00:00Z',
    updatedAt: '2024-01-22T00:00:00Z'
  },
  {
    id: '6',
    country: 'Canada',
    countryCode: 'canada',
    flag: '🇨🇦',
    visaType: 'Transit Visa',
    price: 75,
    processingTime: '5-8 business days',
    duration: '48 hours',
    validity: '2 years',
    isActive: true,
    overview: {
      description: 'Canada Transit Visa allows travelers to pass through Canada while traveling to another destination. Required for certain nationalities.',
      features: ['Short-term transit', 'Airport transit allowed', 'Quick processing'],
      guaranteedDate: '25 November',
    },
    eligibility: [
      'Valid passport',
      'Onward ticket to final destination',
      'Visa for final destination (if required)',
      'No intention to leave airport area',
    ],
    timeline: [
      { step: 'Online Application', time: '15 minutes', description: 'Quick transit application' },
      { step: 'Document Review', time: '1-2 days', description: 'Fast-track document review' },
      { step: 'Processing', time: '3-5 days', description: 'Expedited transit processing' },
      { step: 'Decision', time: 'Same day', description: 'Quick visa decision' },
    ],
    documents: [
      'Valid passport',
      'Flight itinerary showing transit',
      'Visa for final destination',
      'Proof of accommodation at final destination',
    ],
    faqs: [
      {
        question: 'Can I leave the airport during transit?',
        answer: 'Transit visas are typically for airport transit only. Leaving may require a visitor visa.',
      },
      {
        question: 'How long can I stay in transit?',
        answer: 'Transit visas are usually valid for up to 48 hours.',
      },
    ],
    createdAt: '2024-01-07T00:00:00Z',
    updatedAt: '2024-01-23T00:00:00Z'
  }
]

export const getVisaTypes = (): VisaType[] => {
  return visaTypes.filter(visa => visa.isActive)
}

export const getAllVisaTypes = (): VisaType[] => {
  return visaTypes
}

export const getVisaTypesByCountry = (countryCode: string): VisaType[] => {
  return visaTypes.filter(visa => visa.countryCode === countryCode && visa.isActive)
}

export const getVisaTypeByCountry = (countryCode: string): VisaType | undefined => {
  return visaTypes.find(visa => visa.countryCode === countryCode && visa.isActive)
}

export const getVisaById = (id: string): VisaType | undefined => {
  return visaTypes.find(visa => visa.id === id)
}

export const getCountriesWithVisas = (): { country: string, countryCode: string, flag: string, count: number, activeCount: number }[] => {
  const countryMap = new Map()
  
  visaTypes.forEach(visa => {
    const key = visa.countryCode
    if (!countryMap.has(key)) {
      countryMap.set(key, {
        country: visa.country,
        countryCode: visa.countryCode,
        flag: visa.flag,
        count: 0,
        activeCount: 0
      })
    }
    const data = countryMap.get(key)
    data.count++
    if (visa.isActive) data.activeCount++
  })
  
  return Array.from(countryMap.values()).sort((a, b) => a.country.localeCompare(b.country))
}

export const createVisaType = (visaData: Omit<VisaType, 'id' | 'createdAt' | 'updatedAt'>): VisaType => {
  const newVisa: VisaType = {
    ...visaData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  visaTypes.push(newVisa)
  return newVisa
}

export const updateVisaType = (id: string, updates: Partial<VisaType>): VisaType | undefined => {
  const index = visaTypes.findIndex(visa => visa.id === id)
  if (index === -1) return undefined
  
  visaTypes[index] = {
    ...visaTypes[index],
    ...updates,
    updatedAt: new Date().toISOString()
  }
  return visaTypes[index]
}

export const deleteVisaType = (id: string): boolean => {
  const index = visaTypes.findIndex(visa => visa.id === id)
  if (index === -1) return false
  
  visaTypes.splice(index, 1)
  return true
}