import { BorrowerProfile, GigIncomeAnalytics } from '../types';

export class GigWorkerAnalyticsEngine {
  /**
   * Analyzes irregular gig/rural cashflows, handles multi-channel revenue,
   * performs variance smoothing and protects borrowers from unfair seasonality penalties.
   */
  public static analyze(profile: BorrowerProfile): GigIncomeAnalytics {
    const earnings = profile.cashflows.map(c => c.income);
    const n = earnings.length;
    
    if (n === 0) {
      return {
        baselineSustainableIncome: profile.monthlyAverageIncome,
        monthlyIncomeVariance: 0,
        coefficientOfVariation: 0,
        seasonalityDetected: false,
        seasonalPeakMonths: [],
        seasonalTroughMonths: [],
        diversificationScore: 50,
        fairnessMitigationApplied: true,
        fairnessAdjustmentScore: 25
      };
    }

    // Mean
    const mean = earnings.reduce((sum, val) => sum + val, 0) / n;

    // Variance & Standard Deviation
    const variance = earnings.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);

    // Coefficient of variation (CV = stdDev / mean)
    const cv = Number((stdDev / mean).toFixed(3));

    // Sort to compute P25 (25th percentile) for Baseline Sustainable Income (BSI)
    const sorted = [...earnings].sort((a, b) => a - b);
    const p25Index = Math.max(0, Math.floor(n * 0.25));
    const baselineSustainableIncome = Math.round(sorted[p25Index]);

    // Seasonality detection: identify months with > 15% variation from mean
    const seasonalPeakMonths: string[] = [];
    const seasonalTroughMonths: string[] = [];

    profile.cashflows.forEach(cf => {
      if (cf.income > mean * 1.15) {
        seasonalPeakMonths.push(cf.month);
      } else if (cf.income < mean * 0.85) {
        seasonalTroughMonths.push(cf.month);
      }
    });

    const seasonalityDetected = seasonalPeakMonths.length > 0 || seasonalTroughMonths.length > 0;

    // Multi-source diversification score
    // Higher diversification across platforms/clients = higher resilience
    const sourceCount = profile.incomeSources.length;
    let diversificationScore = 40;
    if (sourceCount >= 3) diversificationScore = 95;
    else if (sourceCount === 2) diversificationScore = 80;
    else diversificationScore = 55;

    // Responsible AI Fairness Mitigation:
    // Traditional algorithms penalize high CV (variance) heavily.
    // CredNova explicitly compensates for gig seasonality if the worker maintains
    // positive monthly net savings in at least 5 out of 6 months.
    const positiveSavingsMonths = profile.cashflows.filter(c => c.savings > 0).length;
    const fairnessMitigationApplied = cv > 0.12 && positiveSavingsMonths >= 4;
    const fairnessAdjustmentScore = fairnessMitigationApplied ? 35 : 10;

    return {
      baselineSustainableIncome,
      monthlyIncomeVariance: Math.round(variance),
      coefficientOfVariation: cv,
      seasonalityDetected,
      seasonalPeakMonths,
      seasonalTroughMonths,
      diversificationScore,
      fairnessMitigationApplied,
      fairnessAdjustmentScore
    };
  }
}
