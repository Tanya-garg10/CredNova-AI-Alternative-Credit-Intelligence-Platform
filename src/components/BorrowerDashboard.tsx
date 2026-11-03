import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Zap, 
  Smartphone, 
  Flame, 
  Droplet, 
  Wifi, 
  Users, 
  Sparkles, 
  Calculator, 
  ShieldCheck, 
  ArrowRight, 
  Layers, 
  Calendar, 
  Activity, 
  FileText,
  Clock,
  Compass,
  Cpu,
  Download,
  Award
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { BorrowerProfile, ScoringResult } from '../types';
import { Language, translations } from '../i18n/translations';

interface BorrowerDashboardProps {
  profile: BorrowerProfile;
  scoring: ScoringResult;
  language: Language;
  onNavigateTab: (tabKey: 'explain' | 'gig' | 'simulator' | 'sphere') => void;
  onOpenAdvisor: () => void;
  onOpenPassport?: () => void;
}

export const BorrowerDashboard: React.FC<BorrowerDashboardProps> = ({
  profile,
  scoring,
  language,
  onNavigateTab,
  onOpenAdvisor,
  onOpenPassport
}) => {
  const t = translations[language];

  // Helper for utility icons
  const getUtilityIcon = (type: string) => {
    switch (type) {
      case 'Electricity': return <Zap className="w-4 h-4 text-amber-400" />;
      case 'Mobile_Postpaid': return <Smartphone className="w-4 h-4 text-emerald-400" />;
      case 'LPG_Gas': return <Flame className="w-4 h-4 text-rose-400" />;
      case 'Water': return <Droplet className="w-4 h-4 text-cyan-400" />;
      case 'Broadband': return <Wifi className="w-4 h-4 text-purple-400" />;
      default: return <Zap className="w-4 h-4 text-slate-400" />;
    }
  };

  // Average monthly savings calculation
  const avgMonthlySavings = Math.round(
    profile.cashflows.reduce((sum, c) => sum + c.savings, 0) / (profile.cashflows.length || 1)
  );

  // SVG Radial Arc calculations for Score Card
  const minScore = 0;
  const maxScore = 1000;
  const clampedScore = Math.max(minScore, Math.min(maxScore, scoring.score));
  const scorePercent = clampedScore / maxScore;
  const radius = 80;
  const circumference = Math.PI * radius; // Half-circle
  const strokeDashoffset = circumference * (1 - scorePercent);

  // Status colors & localized tier
  let tierColor = '#10D6A0';
  let tierLabel = t.borrower.primeTier;
  let tierBadge = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  if (scoring.score >= 750) {
    tierColor = '#10D6A0';
    tierLabel = t.borrower.primeTier;
    tierBadge = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  } else if (scoring.score >= 660) {
    tierColor = '#35C8FF';
    tierLabel = t.borrower.nearPrimeTier;
    tierBadge = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
  } else if (scoring.score >= 520) {
    tierColor = '#F59E0B';
    tierLabel = t.borrower.fairTier;
    tierBadge = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  } else {
    tierColor = '#F43F5E';
    tierLabel = t.borrower.cautiousTier;
    tierBadge = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* 1. TOP EXECUTIVE WELCOME & KEY HIGHLIGHTS BAR */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left: Applicant Identity */}
        <div className="flex items-center space-x-4">
          <img
            src={profile.avatarUrl}
            alt={profile.fullName}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/50 shadow-md"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                {language === 'hi' ? profile.nameHindi : profile.fullName}
              </h1>
              <span className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              {language === 'hi' ? profile.primaryOccupationHindi : profile.primaryOccupation}
            </p>
            <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1">
              <span>📍 {profile.location}</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">{t.borrower.dpdpConsent}</span>
              {profile.isRural && (
                <>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">{t.borrower.ruralCohort}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {onOpenPassport && (
            <button
              onClick={onOpenPassport}
              className="flex items-center space-x-2 px-3.5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-xs font-semibold text-emerald-300 hover:text-white transition shadow-sm"
              title={language === 'hi' ? 'आधिकारिक क्रेडिट पासपोर्ट डाउनलोड करें' : 'Download official Credit Passport dossier'}
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>{t.borrower.creditPassportPdf}</span>
            </button>
          )}

          <button
            onClick={() => onNavigateTab('sphere')}
            className="flex items-center space-x-2 px-3.5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 transition"
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>{t.borrower.threeSphereButton}</span>
          </button>

          <button
            onClick={onOpenAdvisor}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-700/20 transition"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>{t.borrower.aiCoachButton}</span>
          </button>
        </div>

      </div>

      {/* 2. MAIN 2-COLUMN BALANCED FINTECH LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: HERO SCORE & CASHFLOW DYNAMICS (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Hero Alternative Score Card */}
          <div className="glass-card rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
            
            {/* Header of Score Card */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div>
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  {t.borrower.alternativeCreditIntelligence}
                </span>
                <span className="text-xs text-slate-500">
                  {t.borrower.welcomeSubtitle}
                </span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${tierBadge}`}>
                {tierLabel}
              </span>
            </div>

            {/* Score Numerical & Radial Display */}
            <div className="my-6 flex flex-col sm:flex-row items-center justify-around gap-6">
              
              {/* Semi-circle SVG Arc */}
              <div className="relative w-56 h-32 flex items-end justify-center">
                <svg className="w-56 h-32 overflow-visible" viewBox="0 0 200 110">
                  <path
                    d="M 15 100 A 85 85 0 0 1 185 100"
                    fill="none"
                    stroke="#101B2D"
                    strokeWidth="14"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 15 100 A 85 85 0 0 1 185 100"
                    fill="none"
                    stroke={tierColor}
                    strokeWidth="14"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>

                <div className="absolute bottom-1 flex flex-col items-center text-center">
                  <span className="text-4xl md:text-5xl font-black font-mono tracking-tight text-white">
                    {scoring.score}
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                    {t.score.scale}
                  </span>
                </div>
              </div>

              {/* Sanction Guidance Box */}
              <div className="space-y-3 w-full sm:w-auto">
                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-left">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">{t.borrower.recommendedLimit}</span>
                  <span className="text-xl font-extrabold font-mono text-emerald-400">
                    ₹{scoring.recommendedCreditLimitMax.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-left">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">{t.borrower.indicativeApr}</span>
                  <span className="text-sm font-bold font-mono text-cyan-400">
                    {scoring.recommendedAprRange}
                  </span>
                </div>
              </div>

            </div>

            {/* 4 Health Pillars Horizontal Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-slate-800/80 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
                <span className="text-slate-400 block text-[10px] font-sans">{t.borrower.utilityStreak}</span>
                <span className="font-bold text-white text-xs">{profile.utilityPaymentStreakMonths} {t.borrower.moStanding}</span>
                <span className="text-[10px] text-emerald-400 block">+78 {t.common.scorePoints}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
                <span className="text-slate-400 block text-[10px] font-sans">{t.borrower.digitalUpi}</span>
                <span className="font-bold text-white text-xs">{profile.digitalTransactionVolumeRatio}% {t.borrower.volume}</span>
                <span className="text-[10px] text-cyan-400 block">+35 {t.common.scorePoints}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
                <span className="text-slate-400 block text-[10px] font-sans">{t.borrower.communityShg}</span>
                <span className="font-bold text-white text-xs">{profile.communityChitRepaymentRate}% {t.borrower.standing}</span>
                <span className="text-[10px] text-purple-400 block">+65 {t.common.scorePoints}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
                <span className="text-slate-400 block text-[10px] font-sans">{t.borrower.debtLoad}</span>
                <span className="font-bold text-emerald-400 text-xs">{profile.debtToIncomeRatio}% {t.borrower.healthy}</span>
                <span className="text-[10px] text-emerald-400 block">+44 {t.common.scorePoints}</span>
              </div>
            </div>

            {/* Footer Link to XAI */}
            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">{t.borrower.zeroBlackBox}</span>
              <button
                onClick={() => onNavigateTab('explain')}
                className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center space-x-1"
              >
                <span>{t.borrower.explainMyScoreShap}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Cashflow Dynamics Bar Chart */}
          <div className="glass-card rounded-3xl p-6 md:p-8 border border-slate-800 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <span>{t.borrower.monthlyCashflow}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {t.borrower.audited6Months}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t.borrower.cashflowSubtitle}
                </p>
              </div>

              <div className="flex items-center space-x-3 text-xs font-mono">
                <span className="flex items-center space-x-1 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
                  <span>{t.borrower.incomeLabel}</span>
                </span>
                <span className="flex items-center space-x-1 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-600 inline-block" />
                  <span>{t.borrower.expensesLabel}</span>
                </span>
                <span className="flex items-center space-x-1 text-teal-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-teal-400 inline-block" />
                  <span>{t.borrower.savingsLabel}</span>
                </span>
              </div>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={profile.cashflows} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} tickFormatter={(val) => `₹${val / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                    formatter={(val: any) => [`₹${Number(val || 0).toLocaleString('en-IN')}`, '']}
                  />
                  <Bar dataKey="income" name={t.borrower.incomeLabel} fill="#10D6A0" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name={t.borrower.expensesLabel} fill="#475569" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="savings" name={t.borrower.savingsLabel} fill="#0D9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
              <div>
                {t.borrower.avgSurplus} <strong className="text-emerald-400 font-mono">+₹{avgMonthlySavings.toLocaleString('en-IN')}</strong>
              </div>
              <button
                onClick={() => onNavigateTab('gig')}
                className="text-cyan-400 hover:underline font-semibold font-mono text-[11px] self-start sm:self-auto"
              >
                {t.borrower.inspectGig}
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: PROOFS, STABILITY & SCORE BOOSTER (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Alternative Proofs: Bill Payment Consistency */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">
                  {t.borrower.verifiableProofs}
                </h3>
                <p className="text-xs text-slate-400">
                  {profile.utilityPaymentStreakMonths} {t.borrower.continuousStreak}
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {t.borrower.onTimeBadge}
              </span>
            </div>

            <div className="space-y-2.5">
              {profile.utilityRecords.map((rec, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      {getUtilityIcon(rec.providerType)}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-200 block">
                        {rec.providerType.replace('_', ' ')}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {rec.monthsTracked} {t.borrower.auditedAvg} ₹{rec.averageBillAmount}
                      </span>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span className="font-bold text-emerald-400 block">
                      {rec.onTimePayments} / {rec.monthsTracked}
                    </span>
                    <span className="text-[10px] text-slate-500 font-sans">{t.borrower.zeroPenalty}</span>
                  </div>
                </div>
              ))}

              {/* Community SHG Callout */}
              <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-emerald-200 block">
                      {t.borrower.communityStanding}
                    </span>
                    <span className="text-[11px] text-emerald-400/80">
                      {t.borrower.peerSavings}
                    </span>
                  </div>
                </div>
                <span className="text-sm font-bold text-emerald-400 font-mono">
                  {profile.communityChitRepaymentRate}%
                </span>
              </div>
            </div>
          </div>

          {/* Financial Stability & Seasonality Cushion */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">
                {t.borrower.stabilityBuffer}
              </h3>
              <span className="text-xs font-mono text-cyan-400">
                Score: {scoring.financialStabilityIndex}/100
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>{t.borrower.emergencyRunway}</span>
                  <span className="font-mono font-bold text-white">{profile.emergencySavingsBufferDays} {t.borrower.days}</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${Math.min(100, profile.emergencySavingsBufferDays * 1.8)}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-[11px] space-y-1">
                <div className="flex items-center justify-between text-slate-300">
                  <span>{t.borrower.gigProtection}</span>
                  <span className="text-emerald-400 font-bold font-mono">{t.borrower.protectedPts}</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  {t.borrower.gigProtectionDesc}
                </p>
              </div>
            </div>
          </div>

          {/* 90-Day Score Improvement Card */}
          <div className="glass-card rounded-3xl p-6 border border-emerald-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  {t.borrower.scoreBoosterAction}
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {t.borrower.targetPts}
              </span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed">
              {language === 'hi'
                ? scoring.actionableRoadmap[0]?.actionHindi
                : scoring.actionableRoadmap[0]?.action}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => onNavigateTab('simulator')}
                className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 transition"
              >
                <Calculator className="w-3.5 h-3.5 text-blue-400" />
                <span>{t.borrower.simulateLoan}</span>
              </button>

              <button
                onClick={() => onNavigateTab('explain')}
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-600/20 transition"
              >
                <span>{t.borrower.fullRoadmap}</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

