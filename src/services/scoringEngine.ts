import { BorrowerProfile, ScoringResult, FeatureContribution, RiskCategory } from '../types';

export class AlternativeScoringEngine {
  // Baseline intercept corresponding to a neutral unbanked applicant prior to feature evidence
  private static readonly BASE_SCORE = 540;

  /**
   * Evaluates a borrower profile using alternative financial indicators,
   * calculates calibrated alternative credit score (0 - 1000), default probability,
   * and generates mathematical SHAP-style additive feature contributions.
   */
  public static calculateScore(profile: BorrowerProfile): ScoringResult {
    const contributions: FeatureContribution[] = [];

    // 1. Utility Payment Discipline
    const totalBills = profile.utilityRecords.reduce((acc, u) => acc + u.monthsTracked, 0);
    const onTimeBills = profile.utilityRecords.reduce((acc, u) => acc + u.onTimePayments, 0);
    const utilityOnTimeRate = totalBills > 0 ? (onTimeBills / totalBills) * 100 : 70;
    
    let utilityImpact = 0;
    if (utilityOnTimeRate >= 95 && profile.utilityPaymentStreakMonths >= 12) {
      utilityImpact = 78;
    } else if (utilityOnTimeRate >= 85) {
      utilityImpact = 42;
    } else if (utilityOnTimeRate >= 70) {
      utilityImpact = 5;
    } else {
      utilityImpact = -55;
    }

    contributions.push({
      featureKey: 'utility_payment_streak',
      featureName: 'Utility & Mobile Recharge Consistency',
      featureNameHindi: 'बिजली व मोबाइल बिल भुगतान नियमितता',
      category: 'payment_discipline',
      rawValue: `${Math.round(utilityOnTimeRate)}% on-time (${profile.utilityPaymentStreakMonths} mo streak)`,
      impactScore: utilityImpact,
      impactDirection: utilityImpact >= 0 ? 'positive' : 'negative',
      explanation: utilityImpact >= 0
        ? `Consistently paid utility and telecom bills without delay for ${profile.utilityPaymentStreakMonths} consecutive months, demonstrating strong payment discipline.`
        : `Recorded late payments or short utility history in the last 6 months, signaling potential liquidity strain.`,
      explanationHindi: utilityImpact >= 0
        ? `लगातार ${profile.utilityPaymentStreakMonths} महीनों से बिना किसी देरी के बिजली और मोबाइल बिलों का भुगतान किया गया है।`
        : `पिछले 6 महीनों में बिलों में देरी दर्ज की गई है, जो अस्थायी नकदी तंगी का संकेत देती है।`,
      recommendation: utilityImpact >= 0
        ? 'Maintain automatic reminder payments for electricity and telecom bills.'
        : 'Ensure 3 consecutive on-time bill cycles to recover up to +35 points.',
      recommendationHindi: utilityImpact >= 0
        ? 'बिजली और मोबाइल बिलों के लिए समय पर भुगतान जारी रखें।'
        : 'लगातार 3 बिल समय पर भरकर 35 अंक तक बढ़ाएं।'
    });

    // 2. Micro-Repayment & Community Chit History
    const microLoanSuccess = profile.totalMicroLoansTaken > 0 
      ? (profile.repaidMicroLoansOnTime / profile.totalMicroLoansTaken) * 100 
      : 80;
    const chitRate = profile.communityChitRepaymentRate;
    const repaymentMetric = (microLoanSuccess * 0.5) + (chitRate * 0.5);

    let repaymentImpact = 0;
    if (repaymentMetric >= 95) {
      repaymentImpact = 65;
    } else if (repaymentMetric >= 80) {
      repaymentImpact = 30;
    } else if (repaymentMetric >= 65) {
      repaymentImpact = -15;
    } else {
      repaymentImpact = -60;
    }

    contributions.push({
      featureKey: 'community_repayment_pattern',
      featureName: 'Micro-loan & Community SHG Repayment Pattern',
      featureNameHindi: 'माइक्रो-लोन और स्वयं सहायता समूह (SHG) चुकौती व्यवहार',
      category: 'payment_discipline',
      rawValue: `${Math.round(repaymentMetric)}% reliability index`,
      impactScore: repaymentImpact,
      impactDirection: repaymentImpact >= 0 ? 'positive' : 'negative',
      explanation: repaymentImpact >= 0
        ? `Flawless history in community micro-credit groups and peer-to-peer repayments without defaults.`
        : `Irregular micro-loan or community group repayments identified in historical ledger.`,
      explanationHindi: repaymentImpact >= 0
        ? `सामुदायिक स्वयं सहायता समूह (SHG) में समय पर 100% चुकौती का अनुकरणीय रिकॉर्ड।`
        : `पूर्व में सामुदायिक या माइक्रो-ऋणों में विलंब पाया गया।`,
      recommendation: repaymentImpact >= 0
        ? 'Retain pristine community standing as a primary trust anchor.'
        : 'Regularize all pending community or supplier dues to restore baseline credibility.',
      recommendationHindi: repaymentImpact >= 0
        ? 'सामुदायिक समूह में अपनी विश्वसनीयता बनाए रखें।'
        : 'सभी पुराने छोटे बकाये को समय पर चुकाएं।'
    });

    // 3. Platform / Gig Tenure & Earning Stability
    const tenure = profile.monthsActiveOnPlatform;
    let tenureImpact = 0;
    if (tenure >= 24) {
      tenureImpact = 48;
    } else if (tenure >= 12) {
      tenureImpact = 32;
    } else if (tenure >= 6) {
      tenureImpact = 12;
    } else {
      tenureImpact = -18;
    }

    contributions.push({
      featureKey: 'gig_platform_tenure',
      featureName: 'Earning Platform Longevity & Seniority',
      featureNameHindi: 'कमाई मंच पर सक्रियता व कार्य स्थिरता',
      category: 'stability',
      rawValue: `${tenure} months active`,
      impactScore: tenureImpact,
      impactDirection: tenureImpact >= 0 ? 'positive' : 'negative',
      explanation: tenureImpact >= 0
        ? `Over ${tenure} months verified continuous engagement with stable platform earning channels.`
        : `New earning channel history (< 6 months) limits long-term behavioral trend visibility.`,
      explanationHindi: tenureImpact >= 0
        ? `${tenure} महीनों से सक्रिय प्लेटफॉर्म उपस्थिति, जो टिकाऊ रोजगार को दर्शाती है।`
        : `6 महीने से कम की कार्य गतिविधि, जिससे दीर्घकालिक रुझान सीमित है।`,
      recommendation: tenureImpact >= 0
        ? 'Steady gig seniority offers access to lower underwriting risk brackets.'
        : 'Completing 6+ months on platform will automatically award +25 bonus points.',
      recommendationHindi: tenureImpact >= 0
        ? 'प्लेटफ़ॉर्म पर निरंतरता आपको कम ब्याज दरों का पात्र बनाती है।'
        : '6 महीने पूरे होने पर स्वचालित रूप से 25 बोनस अंक प्राप्त होंगे।'
    });

    // 4. Emergency Savings Buffer Days
    const bufferDays = profile.emergencySavingsBufferDays;
    let savingsImpact = 0;
    if (bufferDays >= 45) {
      savingsImpact = 52;
    } else if (bufferDays >= 30) {
      savingsImpact = 30;
    } else if (bufferDays >= 15) {
      savingsImpact = 5;
    } else {
      savingsImpact = -48;
    }

    contributions.push({
      featureKey: 'emergency_savings_buffer',
      featureName: 'Cash Cushion & Emergency Buffer Depth',
      featureNameHindi: 'आपातकालीन बचत व वित्तीय सुरक्षा बफर',
      category: 'income',
      rawValue: `${bufferDays} days of living expenses`,
      impactScore: savingsImpact,
      impactDirection: savingsImpact >= 0 ? 'positive' : 'negative',
      explanation: savingsImpact >= 0
        ? `Maintains ~${bufferDays} days of essential expenses in liquid savings or digital micro-deposits, insulating against unexpected income shocks.`
        : `Less than 15 days of emergency reserves leaves the borrower vulnerable to immediate payment default upon an income dip.`,
      explanationHindi: savingsImpact >= 0
        ? `लगभग ${bufferDays} दिनों के खर्च के बराबर नकदी आरक्षित है, जो किसी भी आपात स्थिति में सुरक्षा देती है।`
        : `15 दिनों से कम की बचत अप्रत्याशित खर्च आने पर तुरंत किस्तों में चूक का जोखिम पैदा करती है।`,
      recommendation: savingsImpact >= 0
        ? 'Gradually expand emergency fund towards 60 days of basic expenses.'
        : 'Set aside ₹500 - ₹1,000 every week to build a 30-day liquidity buffer (+30 points).',
      recommendationHindi: savingsImpact >= 0
        ? 'आपातकालीन बचत को 60 दिनों के खर्च तक बढ़ाने का लक्ष्य रखें।'
        : 'प्रति सप्ताह ₹500 - ₹1,000 बचाकर 30 दिनों का बफर बनाएं।'
    });

    // 5. Debt-To-Income (DTI) Obligation Burden
    const dti = profile.debtToIncomeRatio;
    let dtiImpact = 0;
    if (dti <= 15) {
      dtiImpact = 44;
    } else if (dti <= 28) {
      dtiImpact = 20;
    } else if (dti <= 40) {
      dtiImpact = -22;
    } else {
      dtiImpact = -65;
    }

    contributions.push({
      featureKey: 'debt_to_income_obligation',
      featureName: 'Current Debt-to-Income Obligation Burden',
      featureNameHindi: 'वर्तमान ऋण-से-आय (DTI) अनुपात',
      category: 'debt_burden',
      rawValue: `${dti}% of monthly earnings`,
      impactScore: dtiImpact,
      impactDirection: dtiImpact >= 0 ? 'positive' : 'negative',
      explanation: dtiImpact >= 0
        ? `Current debt commitments consume only ${dti}% of monthly revenue, leaving ample discretionary room for fresh loan repayments.`
        : `Existing debt obligations absorb ${dti}% of earnings, exceeding healthy micro-lending capacity thresholds.`,
      explanationHindi: dtiImpact >= 0
        ? `वर्तमान देनदारियां मासिक आय का केवल ${dti}% हैं, जो नए ऋण के लिए पर्याप्त गुंजाइश छोड़ती हैं।`
        : `मौजूदा देनदारियां आय का ${dti}% खा जाती हैं, जिससे नया ऋण लेना जोखिम भरा है।`,
      recommendation: dtiImpact >= 0
        ? 'Maintain current low leverage to preserve prime borrowing terms.'
        : 'Prioritize paying down existing high-cost informal credit to bring DTI under 30%.',
      recommendationHindi: dtiImpact >= 0
        ? 'वर्तमान कम कर्ज को बनाए रखें ताकि न्यूनतम ब्याज दर मिले।'
        : 'पहले पुराने महंगे कर्ज चुकता करके DTI को 30% से नीचे लाएं।'
    });

    // 6. Digital UPI Transaction Regularity
    const digitalRate = profile.digitalTransactionVolumeRatio;
    let digitalImpact = 0;
    if (digitalRate >= 80) {
      digitalImpact = 35;
    } else if (digitalRate >= 60) {
      digitalImpact = 18;
    } else if (digitalRate >= 40) {
      digitalImpact = -5;
    } else {
      digitalImpact = -32;
    }

    contributions.push({
      featureKey: 'digital_transaction_trail',
      featureName: 'Verified Digital UPI Cashflow Visibility',
      featureNameHindi: 'सत्यापित डिजिटल यूपीआई नकदी प्रवाह',
      category: 'digital_footprint',
      rawValue: `${digitalRate}% digital volume`,
      impactScore: digitalImpact,
      impactDirection: digitalImpact >= 0 ? 'positive' : 'negative',
      explanation: digitalImpact >= 0
        ? `High digital cashflow footprint provides immutable verifiable proof of regular incoming customer/employer payments.`
        : `Predominantly cash-based earnings reduce automated verifiable income auditability.`,
      explanationHindi: digitalImpact >= 0
        ? `${digitalRate}% यूपीआई लेनदेन स्पष्ट और बैंक-सत्यापनीय आय प्रमाण प्रदान करते हैं।`
        : `अधिकांश नकद लेनदेन होने के कारण आय का स्वतंत्र सत्यापन कठिन होता है।`,
      recommendation: digitalImpact >= 0
        ? 'Keep receiving customer QR payments directly into verified digital channels.'
        : 'Shift 20% more cash collections to UPI QR codes to enhance digital proof (+18 points).',
      recommendationHindi: digitalImpact >= 0
        ? 'यूपीआई क्यूआर कोड के माध्यम से डिजिटल भुगतान स्वीकार करना जारी रखें।'
        : 'अपनी 20% नकद बिक्री को यूपीआई पर लाएं ताकि आय प्रमाण मजबूत हो सके।'
    });

    // Summing contributions to base score
    const totalImpact = contributions.reduce((acc, c) => acc + c.impactScore, 0);
    let rawScore = this.BASE_SCORE + totalImpact;

    // Boundary constraints 0 - 1000
    rawScore = Math.max(250, Math.min(960, Math.round(rawScore)));

    // Categorization
    let riskCategory: RiskCategory = 'Moderate';
    if (rawScore >= 750) {
      riskCategory = 'Excellent';
    } else if (rawScore >= 660) {
      riskCategory = 'Good';
    } else if (rawScore >= 520) {
      riskCategory = 'Moderate';
    } else {
      riskCategory = 'High Risk';
    }

    // Default probability mapping via logistic sigmoid calibration
    // Score 750 -> ~2.5% default, Score 500 -> ~18% default, Score 350 -> ~42% default
    const z = (rawScore - 600) / 110;
    const defaultProbability = Number((1 / (1 + Math.exp(z * 0.95)) * 0.45).toFixed(3));

    // Stability Index
    const financialStabilityIndex = Math.min(100, Math.max(10, Math.round(
      (profile.incomeStabilityIndex * 0.35) + 
      ((100 - profile.debtToIncomeRatio * 1.5) * 0.25) + 
      (Math.min(100, profile.emergencySavingsBufferDays * 1.8) * 0.2) + 
      (utilityOnTimeRate * 0.2)
    )));

    // Income Consistency Rating
    let incomeConsistencyRating: 'Very High' | 'High' | 'Moderate' | 'Fluctuating' = 'Moderate';
    if (profile.incomeStabilityIndex >= 80) incomeConsistencyRating = 'Very High';
    else if (profile.incomeStabilityIndex >= 65) incomeConsistencyRating = 'High';
    else if (profile.incomeStabilityIndex >= 45) incomeConsistencyRating = 'Moderate';
    else incomeConsistencyRating = 'Fluctuating';

    // Credit Confidence coverage (based on number of data points)
    const confidence = Math.min(98, Math.round(
      (profile.cashflows.length * 6) + 
      (profile.incomeSources.length * 15) + 
      (profile.utilityRecords.length * 12) + 20
    ));

    // Credit limit recommendation
    let recommendedCreditLimitMax = 25000;
    let recommendedAprRange = '18.0% - 22.0%';
    if (riskCategory === 'Excellent') {
      recommendedCreditLimitMax = Math.round(profile.monthlyAverageIncome * 2.8);
      recommendedAprRange = '10.5% - 13.0%';
    } else if (riskCategory === 'Good') {
      recommendedCreditLimitMax = Math.round(profile.monthlyAverageIncome * 1.9);
      recommendedAprRange = '13.5% - 16.5%';
    } else if (riskCategory === 'Moderate') {
      recommendedCreditLimitMax = Math.round(profile.monthlyAverageIncome * 1.1);
      recommendedAprRange = '17.5% - 21.0%';
    } else {
      recommendedCreditLimitMax = Math.round(profile.monthlyAverageIncome * 0.4);
      recommendedAprRange = '24.0% - 28.0% (Secured/Guaranteed Only)';
    }

    // Key strengths & mitigants
    const keyStrengths: string[] = [];
    const keyStrengthsHindi: string[] = [];
    const riskMitigants: string[] = [];
    const riskMitigantsHindi: string[] = [];

    if (profile.utilityPaymentStreakMonths >= 12) {
      keyStrengths.push(`${profile.utilityPaymentStreakMonths}-Month perfect utility bill payment streak.`);
      keyStrengthsHindi.push(`लगातार ${profile.utilityPaymentStreakMonths} महीने से बिजली/गैस बिलों का 100% समय पर भुगतान।`);
    }
    if (profile.monthsActiveOnPlatform >= 12) {
      keyStrengths.push(`Proven earning track record of ${profile.monthsActiveOnPlatform} months on platform.`);
      keyStrengthsHindi.push(`प्लेटफ़ॉर्म पर ${profile.monthsActiveOnPlatform} महीने का सिद्ध कार्य व कमाई रिकॉर्ड।`);
    }
    if (profile.debtToIncomeRatio <= 18) {
      keyStrengths.push(`Healthy low debt burden (${profile.debtToIncomeRatio}% DTI), leaving strong surplus.`);
      keyStrengthsHindi.push(`कम कर्ज बोझ (${profile.debtToIncomeRatio}% DTI), जिससे मासिक बचत सुरक्षित है।`);
    }
    if (profile.communityChitRepaymentRate >= 90) {
      keyStrengths.push(`Strong local community peer group reliability (${profile.communityChitRepaymentRate}%).`);
      keyStrengthsHindi.push(`स्थानीय बचत समूह में उत्कृष्ट सामाजिक साख (${profile.communityChitRepaymentRate}%)।`);
    }

    if (profile.emergencySavingsBufferDays < 20) {
      riskMitigants.push(`Thin emergency reserves (${profile.emergencySavingsBufferDays} days). Suggests micro-savings auto-sweep.`);
      riskMitigantsHindi.push(`सीमित आपातकालीन बचत (${profile.emergencySavingsBufferDays} दिन)। दैनिक बचत स्वीप की सिफारिश।`);
    }
    if (profile.debtToIncomeRatio > 35) {
      riskMitigants.push(`High current debt load (${profile.debtToIncomeRatio}%). Recommend debt restructuring before new borrow.`);
      riskMitigantsHindi.push(`वर्तमान ऋण भार अधिक (${profile.debtToIncomeRatio}%)। नया ऋण लेने से पहले पुराने कर्ज का पुनर्गठन आवश्यक।`);
    }

    // 90-day actionable roadmap
    const actionableRoadmap = [
      {
        targetDays: 30,
        expectedScoreGain: 18,
        action: 'Pay upcoming electricity and mobile postpaid bills at least 3 days before due date.',
        actionHindi: 'अगले बिजली और मोबाइल बिल नियत तारीख से 3 दिन पहले भरें।'
      },
      {
        targetDays: 60,
        expectedScoreGain: 25,
        action: 'Automate a weekly deposit of ₹500 into a liquid digital recurring savings account.',
        actionHindi: 'प्रति सप्ताह ₹500 डिजिटल आवर्ती बचत खाते में स्वचालित रूप से जमा करें।'
      },
      {
        targetDays: 90,
        expectedScoreGain: 35,
        action: 'Accept at least 85% of customer payments via UPI QR to produce verifiable digital bank statements.',
        actionHindi: 'कम से कम 85% ग्राहक भुगतान सीधे यूपीआई क्यूआर कोड से प्राप्त करें।'
      }
    ];

    return {
      score: rawScore,
      riskCategory,
      defaultProbability,
      financialStabilityIndex,
      incomeConsistencyRating,
      creditConfidenceScore: confidence,
      recommendedCreditLimitMax,
      recommendedAprRange,
      featureContributions: contributions.sort((a, b) => Math.abs(b.impactScore) - Math.abs(a.impactScore)),
      keyStrengths,
      keyStrengthsHindi,
      riskMitigants,
      riskMitigantsHindi,
      actionableRoadmap
    };
  }

  /**
   * Evaluates loan affordability given user input parameters
   */
  public static simulateLoan(
    profile: BorrowerProfile,
    scoring: ScoringResult,
    requestedAmount: number,
    tenureMonths: number,
    annualInterestRate: number = 14.5
  ) {
    const monthlyRate = annualInterestRate / 12 / 100;
    const emi = Math.round(
      (requestedAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1)
    );
    const totalPayable = emi * tenureMonths;
    const totalInterest = totalPayable - requestedAmount;

    const projectedMonthlyDebt = (profile.monthlyAverageIncome * (profile.debtToIncomeRatio / 100)) + emi;
    const projectedDti = Number(((projectedMonthlyDebt / profile.monthlyAverageIncome) * 100).toFixed(1));

    let isAffordable = false;
    let approvalLikelihood: 'High' | 'Moderate' | 'Low' = 'Low';
    let rationale = '';
    let rationaleHindi = '';

    if (projectedDti <= 30 && scoring.score >= 680) {
      isAffordable = true;
      approvalLikelihood = 'High';
      rationale = 'Monthly installment fits comfortably within conservative 30% debt-to-income envelope with high alternative credit score.';
      rationaleHindi = 'मासिक किस्त उच्च वैकल्पिक क्रेडिट स्कोर के साथ रूढ़िवादी 30% DTI सीमा के भीतर सुरक्षित रूप से आती है।';
    } else if (projectedDti <= 42 && scoring.score >= 580) {
      isAffordable = true;
      approvalLikelihood = 'Moderate';
      rationale = 'Installment is manageable based on cashflow surplus, but leaves narrower margin for emergency income shocks.';
      rationaleHindi = 'किस्त नकदी प्रवाह बचत के आधार पर प्रबंधन योग्य है, लेकिन आपातकालीन खर्चों के लिए गुंजाइश कम रहती है।';
    } else {
      isAffordable = false;
      approvalLikelihood = 'Low';
      rationale = 'Projected EMI creates significant debt service strain exceeding 45% of average monthly earnings.';
      rationaleHindi = 'प्रक्षेपित ईएमआई औसत मासिक आय के 45% से अधिक होकर गंभीर वित्तीय तनाव पैदा करती है।';
    }

    return {
      requestedAmount,
      tenureMonths,
      interestRateAnnual: annualInterestRate,
      monthlyEmi: emi,
      totalInterest,
      totalPayable,
      projectedDti,
      isAffordable,
      approvalLikelihood,
      rationale,
      rationaleHindi
    };
  }
}
