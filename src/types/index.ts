export type RiskCategory = 'Excellent' | 'Good' | 'Moderate' | 'High Risk';

export type EmploymentType = 
  | 'gig_delivery' 
  | 'gig_rideshare' 
  | 'rural_agriculture' 
  | 'micro_artisan' 
  | 'informal_retail' 
  | 'freelance_digital';

export interface MonthlyCashflow {
  month: string;
  income: number;
  expenses: number;
  savings: number;
  utilityPaidOnTime: boolean;
  rentPaidOnTime: boolean;
}

export interface IncomeSource {
  platformName: string;
  category: string;
  tenureMonths: number;
  averageMonthlyEarnings: number;
  ratingOrFeedback?: number;
  verifiedVia: 'UPI_STATEMENT' | 'PLATFORM_API' | 'AGGREGATOR_CONSENT' | 'SELF_DECLARED';
}

export interface UtilityHistory {
  providerType: 'Electricity' | 'Water' | 'Mobile_Postpaid' | 'LPG_Gas' | 'Broadband';
  monthsTracked: number;
  onTimePayments: number;
  latePayments: number;
  averageBillAmount: number;
}

export interface BorrowerProfile {
  id: string;
  fullName: string;
  nameHindi: string;
  age: number;
  location: string;
  state: string;
  isRural: boolean;
  avatarUrl: string;
  employmentType: EmploymentType;
  primaryOccupation: string;
  primaryOccupationHindi: string;
  monthlyAverageIncome: number;
  incomeStabilityIndex: number; // 0 - 100
  emergencySavingsBufferDays: number;
  debtToIncomeRatio: number; // percentage, e.g. 18%
  digitalTransactionVolumeRatio: number; // 0 - 100% of transactions via UPI/digital
  monthsActiveOnPlatform: number;
  totalMicroLoansTaken: number;
  repaidMicroLoansOnTime: number;
  utilityPaymentStreakMonths: number;
  communityChitRepaymentRate: number; // % on-time in local community savings groups
  cashflows: MonthlyCashflow[];
  incomeSources: IncomeSource[];
  utilityRecords: UtilityHistory[];
  consentGiven: boolean;
  consentTimestamp: string;
}

export interface FeatureContribution {
  featureKey: string;
  featureName: string;
  featureNameHindi: string;
  category: 'income' | 'payment_discipline' | 'stability' | 'debt_burden' | 'digital_footprint';
  rawValue: string | number;
  impactScore: number; // points contributed to score (positive or negative)
  impactDirection: 'positive' | 'negative' | 'neutral';
  explanation: string;
  explanationHindi: string;
  recommendation: string;
  recommendationHindi: string;
}

export interface ScoringResult {
  score: number; // 0 - 1000
  riskCategory: RiskCategory;
  defaultProbability: number; // 0.00 to 1.00
  financialStabilityIndex: number; // 0 - 100
  incomeConsistencyRating: 'Very High' | 'High' | 'Moderate' | 'Fluctuating';
  creditConfidenceScore: number; // 0 - 100% data coverage
  recommendedCreditLimitMax: number; // e.g. ₹65,000
  recommendedAprRange: string; // e.g. "12.5% - 15.0%"
  featureContributions: FeatureContribution[];
  keyStrengths: string[];
  keyStrengthsHindi: string[];
  riskMitigants: string[];
  riskMitigantsHindi: string[];
  actionableRoadmap: {
    targetDays: number;
    expectedScoreGain: number;
    action: string;
    actionHindi: string;
  }[];
}

export interface GigIncomeAnalytics {
  baselineSustainableIncome: number;
  monthlyIncomeVariance: number;
  coefficientOfVariation: number;
  seasonalityDetected: boolean;
  seasonalPeakMonths: string[];
  seasonalTroughMonths: string[];
  diversificationScore: number; // 0 - 100
  fairnessMitigationApplied: boolean;
  fairnessAdjustmentScore: number;
}

export interface FairnessGroupMetric {
  groupName: string;
  totalApplicants: number;
  approvalRate: number;
  averageScore: number;
  disparateImpactRatio: number; // 4/5ths rule benchmark >= 0.80
  status: 'Compliant' | 'Requires Review';
}

export interface LoanAffordabilityScenario {
  requestedAmount: number;
  tenureMonths: number;
  interestRateAnnual: number;
  monthlyEmi: number;
  totalInterest: number;
  totalPayable: number;
  projectedDti: number;
  isAffordable: boolean;
  approvalLikelihood: 'High' | 'Moderate' | 'Low';
  rationale: string;
  rationaleHindi?: string;
}
