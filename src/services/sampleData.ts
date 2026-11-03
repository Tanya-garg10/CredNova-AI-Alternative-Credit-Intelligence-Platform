import { BorrowerProfile } from '../types';

export const SAMPLE_BORROWERS: BorrowerProfile[] = [
  {
    id: 'borrower-01',
    fullName: 'Ramesh Kumar',
    nameHindi: 'रमेश कुमार',
    age: 29,
    location: 'Bengaluru, Karnataka',
    state: 'Karnataka',
    isRural: false,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    employmentType: 'gig_delivery',
    primaryOccupation: 'Quick Commerce & Food Delivery Partner',
    primaryOccupationHindi: 'क्विक कॉमर्स और फूड डिलीवरी पार्टनर',
    monthlyAverageIncome: 34500,
    incomeStabilityIndex: 84,
    emergencySavingsBufferDays: 45,
    debtToIncomeRatio: 14.5,
    digitalTransactionVolumeRatio: 92,
    monthsActiveOnPlatform: 22,
    totalMicroLoansTaken: 3,
    repaidMicroLoansOnTime: 3,
    utilityPaymentStreakMonths: 18,
    communityChitRepaymentRate: 98,
    consentGiven: true,
    consentTimestamp: '2026-10-15T11:20:00Z',
    cashflows: [
      { month: 'Jun', income: 32000, expenses: 21000, savings: 11000, utilityPaidOnTime: true, rentPaidOnTime: true },
      { month: 'Jul', income: 33500, expenses: 22400, savings: 11100, utilityPaidOnTime: true, rentPaidOnTime: true },
      { month: 'Aug', income: 38200, expenses: 24000, savings: 14200, utilityPaidOnTime: true, rentPaidOnTime: true },
      { month: 'Sep', income: 36000, expenses: 23100, savings: 12900, utilityPaidOnTime: true, rentPaidOnTime: true },
      { month: 'Oct', income: 39500, expenses: 25000, savings: 14500, utilityPaidOnTime: true, rentPaidOnTime: true },
      { month: 'Nov', income: 35000, expenses: 22500, savings: 12500, utilityPaidOnTime: true, rentPaidOnTime: true }
    ],
    incomeSources: [
      { platformName: 'Zomato Rider Fleet', category: 'Food Logistics', tenureMonths: 22, averageMonthlyEarnings: 21500, ratingOrFeedback: 4.88, verifiedVia: 'PLATFORM_API' },
      { platformName: 'Blinkit Instant Delivery', category: 'Grocery Logistics', tenureMonths: 14, averageMonthlyEarnings: 13000, ratingOrFeedback: 4.92, verifiedVia: 'UPI_STATEMENT' }
    ],
    utilityRecords: [
      { providerType: 'Electricity', monthsTracked: 18, onTimePayments: 18, latePayments: 0, averageBillAmount: 950 },
      { providerType: 'Mobile_Postpaid', monthsTracked: 18, onTimePayments: 18, latePayments: 0, averageBillAmount: 499 },
      { providerType: 'LPG_Gas', monthsTracked: 12, onTimePayments: 12, latePayments: 0, averageBillAmount: 880 },
      { providerType: 'Broadband', monthsTracked: 12, onTimePayments: 12, latePayments: 0, averageBillAmount: 699 }
    ]
  },
  {
    id: 'borrower-02',
    fullName: 'Sunita Devi',
    nameHindi: 'सुनीता देवी',
    age: 38,
    location: 'Barabanki District, Uttar Pradesh',
    state: 'Uttar Pradesh',
    isRural: true,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    employmentType: 'rural_agriculture',
    primaryOccupation: 'Dairy Farmer & SHG Micro-Enterprise Leader',
    primaryOccupationHindi: 'डेयरी कृषक और स्वयं सहायता समूह (SHG) प्रमुख',
    monthlyAverageIncome: 27800,
    incomeStabilityIndex: 88,
    emergencySavingsBufferDays: 52,
    debtToIncomeRatio: 8.2,
    digitalTransactionVolumeRatio: 76,
    monthsActiveOnPlatform: 36,
    totalMicroLoansTaken: 2,
    repaidMicroLoansOnTime: 2,
    utilityPaymentStreakMonths: 24,
    communityChitRepaymentRate: 100,
    consentGiven: true,
    consentTimestamp: '2026-10-18T09:45:00Z',
    cashflows: [
      { month: 'Jun', income: 26000, expenses: 16500, savings: 9500, utilityPaidOnTime: true, rentPaidOnTime: true },
      { month: 'Jul', income: 27500, expenses: 17000, savings: 10500, utilityPaidOnTime: true, rentPaidOnTime: true },
      { month: 'Aug', income: 29000, expenses: 18200, savings: 10800, utilityPaidOnTime: true, rentPaidOnTime: true },
      { month: 'Sep', income: 28200, expenses: 17500, savings: 10700, utilityPaidOnTime: true, rentPaidOnTime: true },
      { month: 'Oct', income: 31000, expenses: 19000, savings: 12000, utilityPaidOnTime: true, rentPaidOnTime: true },
      { month: 'Nov', income: 27000, expenses: 16800, savings: 10200, utilityPaidOnTime: true, rentPaidOnTime: true }
    ],
    incomeSources: [
      { platformName: 'Amul Dairy Cooperative Direct Credit', category: 'Dairy Procurement', tenureMonths: 36, averageMonthlyEarnings: 22000, ratingOrFeedback: 4.95, verifiedVia: 'UPI_STATEMENT' },
      { platformName: 'Prerna SHG Craft Collective', category: 'Rural Micro-Enterprise', tenureMonths: 24, averageMonthlyEarnings: 5800, ratingOrFeedback: 5.0, verifiedVia: 'AGGREGATOR_CONSENT' }
    ],
    utilityRecords: [
      { providerType: 'Electricity', monthsTracked: 24, onTimePayments: 24, latePayments: 0, averageBillAmount: 620 },
      { providerType: 'LPG_Gas', monthsTracked: 18, onTimePayments: 18, latePayments: 0, averageBillAmount: 850 },
      { providerType: 'Water', monthsTracked: 12, onTimePayments: 12, latePayments: 0, averageBillAmount: 180 }
    ]
  },
  {
    id: 'borrower-03',
    fullName: 'Arif Ansari',
    nameHindi: 'आरिफ अंसारी',
    age: 34,
    location: 'Jaipur, Rajasthan',
    state: 'Rajasthan',
    isRural: false,
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    employmentType: 'micro_artisan',
    primaryOccupation: 'Custom Apparel Artisan & Boutique Tailor',
    primaryOccupationHindi: 'कस्टम परिधान कारीगर और बुटीक दर्जी',
    monthlyAverageIncome: 42000,
    incomeStabilityIndex: 72,
    emergencySavingsBufferDays: 60,
    debtToIncomeRatio: 16.0,
    digitalTransactionVolumeRatio: 84,
    monthsActiveOnPlatform: 28,
    totalMicroLoansTaken: 4,
    repaidMicroLoansOnTime: 4,
    utilityPaymentStreakMonths: 15,
    communityChitRepaymentRate: 94,
    consentGiven: true,
    consentTimestamp: '2026-10-12T14:10:00Z',
    cashflows: [
      { month: 'Jun', income: 31000, expenses: 22000, savings: 9000, utilityPaidOnTime: true, rentPaidOnTime: true },
      { month: 'Jul', income: 33000, expenses: 23000, savings: 10000, utilityPaidOnTime: true, rentPaidOnTime: true },
      { month: 'Aug', income: 38000, expenses: 24500, savings: 13500, utilityPaidOnTime: true, rentPaidOnTime: true },
      { month: 'Sep', income: 49000, expenses: 28000, savings: 21000, utilityPaidOnTime: true, rentPaidOnTime: true },
      { month: 'Oct', income: 64000, expenses: 35000, savings: 29000, utilityPaidOnTime: true, rentPaidOnTime: true },
      { month: 'Nov', income: 45000, expenses: 26000, savings: 19000, utilityPaidOnTime: true, rentPaidOnTime: true }
    ],
    incomeSources: [
      { platformName: 'Direct UPI Merchant QR (PhonePe)', category: 'Artisan Retail', tenureMonths: 28, averageMonthlyEarnings: 34000, ratingOrFeedback: 4.8, verifiedVia: 'UPI_STATEMENT' },
      { platformName: 'B2B Tailoring Job Contracts', category: 'Garment Subcontracting', tenureMonths: 16, averageMonthlyEarnings: 8000, verifiedVia: 'UPI_STATEMENT' }
    ],
    utilityRecords: [
      { providerType: 'Electricity', monthsTracked: 20, onTimePayments: 19, latePayments: 1, averageBillAmount: 1850 },
      { providerType: 'Mobile_Postpaid', monthsTracked: 18, onTimePayments: 18, latePayments: 0, averageBillAmount: 599 },
      { providerType: 'Broadband', monthsTracked: 14, onTimePayments: 14, latePayments: 0, averageBillAmount: 799 }
    ]
  },
  {
    id: 'borrower-04',
    fullName: 'Vignesh Murugan',
    nameHindi: 'विग्नेश मुरुगन',
    age: 31,
    location: 'Chennai, Tamil Nadu',
    state: 'Tamil Nadu',
    isRural: false,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    employmentType: 'gig_rideshare',
    primaryOccupation: 'Rideshare Driver & Parcel Courier',
    primaryOccupationHindi: 'राइडशेयर ड्राइवर और पार्सल कूरियर',
    monthlyAverageIncome: 38500,
    incomeStabilityIndex: 61,
    emergencySavingsBufferDays: 18,
    debtToIncomeRatio: 31.0,
    digitalTransactionVolumeRatio: 88,
    monthsActiveOnPlatform: 14,
    totalMicroLoansTaken: 2,
    repaidMicroLoansOnTime: 1,
    utilityPaymentStreakMonths: 8,
    communityChitRepaymentRate: 85,
    consentGiven: true,
    consentTimestamp: '2026-10-22T16:30:00Z',
    cashflows: [
      { month: 'Jun', income: 41000, expenses: 33000, savings: 8000, utilityPaidOnTime: true, rentPaidOnTime: true },
      { month: 'Jul', income: 36000, expenses: 31000, savings: 5000, utilityPaidOnTime: false, rentPaidOnTime: true },
      { month: 'Aug', income: 39500, expenses: 34000, savings: 5500, utilityPaidOnTime: true, rentPaidOnTime: true },
      { month: 'Sep', income: 34000, expenses: 30500, savings: 3500, utilityPaidOnTime: true, rentPaidOnTime: true },
      { month: 'Oct', income: 42000, expenses: 36000, savings: 6000, utilityPaidOnTime: true, rentPaidOnTime: true },
      { month: 'Nov', income: 39000, expenses: 33500, savings: 5500, utilityPaidOnTime: true, rentPaidOnTime: true }
    ],
    incomeSources: [
      { platformName: 'Ola Cabs Fleet', category: 'Urban Mobility', tenureMonths: 14, averageMonthlyEarnings: 27000, ratingOrFeedback: 4.82, verifiedVia: 'PLATFORM_API' },
      { platformName: 'Porter Intercity Logistics', category: 'Goods Transit', tenureMonths: 8, averageMonthlyEarnings: 11500, ratingOrFeedback: 4.75, verifiedVia: 'UPI_STATEMENT' }
    ],
    utilityRecords: [
      { providerType: 'Electricity', monthsTracked: 12, onTimePayments: 10, latePayments: 2, averageBillAmount: 1420 },
      { providerType: 'Mobile_Postpaid', monthsTracked: 14, onTimePayments: 12, latePayments: 2, averageBillAmount: 649 }
    ]
  },
  {
    id: 'borrower-05',
    fullName: 'Kavita Soren',
    nameHindi: 'कविता सोरेन',
    age: 24,
    location: 'Ranchi Hinterland, Jharkhand',
    state: 'Jharkhand',
    isRural: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    employmentType: 'freelance_digital',
    primaryOccupation: 'Digital Data Annotator & Handloom Artisan',
    primaryOccupationHindi: 'डिजिटल डेटा एनोटेटर और हथकरघा कारीगर',
    monthlyAverageIncome: 19500,
    incomeStabilityIndex: 68,
    emergencySavingsBufferDays: 28,
    debtToIncomeRatio: 5.0,
    digitalTransactionVolumeRatio: 72,
    monthsActiveOnPlatform: 7,
    totalMicroLoansTaken: 0,
    repaidMicroLoansOnTime: 0,
    utilityPaymentStreakMonths: 7,
    communityChitRepaymentRate: 92,
    consentGiven: true,
    consentTimestamp: '2026-10-25T13:00:00Z',
    cashflows: [
      { month: 'Jun', income: 16000, expenses: 11500, savings: 4500, utilityPaidOnTime: true, rentPaidOnTime: true },
      { month: 'Jul', income: 17500, expenses: 12000, savings: 5500, utilityPaidOnTime: true, rentPaidOnTime: true },
      { month: 'Aug', income: 18200, expenses: 12800, savings: 5400, utilityPaidOnTime: true, rentPaidOnTime: true },
      { month: 'Sep', income: 21000, expenses: 14000, savings: 7000, utilityPaidOnTime: true, rentPaidOnTime: true },
      { month: 'Oct', income: 24000, expenses: 15500, savings: 8500, utilityPaidOnTime: true, rentPaidOnTime: true },
      { month: 'Nov', income: 20300, expenses: 13500, savings: 6800, utilityPaidOnTime: true, rentPaidOnTime: true }
    ],
    incomeSources: [
      { platformName: 'Karya AI Micro-tasks', category: 'Voice & Data Labeling', tenureMonths: 7, averageMonthlyEarnings: 12500, ratingOrFeedback: 4.96, verifiedVia: 'PLATFORM_API' },
      { platformName: 'Jharkhand Handloom Co-op', category: 'Tribal Weaving', tenureMonths: 12, averageMonthlyEarnings: 7000, verifiedVia: 'UPI_STATEMENT' }
    ],
    utilityRecords: [
      { providerType: 'Electricity', monthsTracked: 7, onTimePayments: 7, latePayments: 0, averageBillAmount: 410 },
      { providerType: 'Mobile_Postpaid', monthsTracked: 7, onTimePayments: 7, latePayments: 0, averageBillAmount: 299 }
    ]
  },
  {
    id: 'borrower-06',
    fullName: 'Manoj Yadav',
    nameHindi: 'मनोज यादव',
    age: 42,
    location: 'Patna Outskirts, Bihar',
    state: 'Bihar',
    isRural: false,
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    employmentType: 'informal_retail',
    primaryOccupation: 'Daily Wage Loading Contractor & Informal Retail',
    primaryOccupationHindi: 'दैनिक मजदूरी लोडिंग ठेकेदार व फुटकर विक्रेता',
    monthlyAverageIncome: 21000,
    incomeStabilityIndex: 38,
    emergencySavingsBufferDays: 6,
    debtToIncomeRatio: 48.0,
    digitalTransactionVolumeRatio: 35,
    monthsActiveOnPlatform: 5,
    totalMicroLoansTaken: 3,
    repaidMicroLoansOnTime: 1,
    utilityPaymentStreakMonths: 2,
    communityChitRepaymentRate: 60,
    consentGiven: true,
    consentTimestamp: '2026-10-02T10:15:00Z',
    cashflows: [
      { month: 'Jun', income: 18000, expenses: 17500, savings: 500, utilityPaidOnTime: false, rentPaidOnTime: true },
      { month: 'Jul', income: 23000, expenses: 22000, savings: 1000, utilityPaidOnTime: true, rentPaidOnTime: false },
      { month: 'Aug', income: 15000, expenses: 16000, savings: -1000, utilityPaidOnTime: false, rentPaidOnTime: false },
      { month: 'Sep', income: 24000, expenses: 22500, savings: 1500, utilityPaidOnTime: true, rentPaidOnTime: true },
      { month: 'Oct', income: 26000, expenses: 25000, savings: 1000, utilityPaidOnTime: false, rentPaidOnTime: true },
      { month: 'Nov', income: 19000, expenses: 18800, savings: 200, utilityPaidOnTime: true, rentPaidOnTime: true }
    ],
    incomeSources: [
      { platformName: 'Mandi Cash Daily Wages', category: 'Manual Logistics', tenureMonths: 5, averageMonthlyEarnings: 15000, verifiedVia: 'SELF_DECLARED' },
      { platformName: 'Tea Stall Evening Counter', category: 'Micro Retail', tenureMonths: 4, averageMonthlyEarnings: 6000, verifiedVia: 'UPI_STATEMENT' }
    ],
    utilityRecords: [
      { providerType: 'Electricity', monthsTracked: 6, onTimePayments: 3, latePayments: 3, averageBillAmount: 580 },
      { providerType: 'Mobile_Postpaid', monthsTracked: 6, onTimePayments: 4, latePayments: 2, averageBillAmount: 349 }
    ]
  }
];
