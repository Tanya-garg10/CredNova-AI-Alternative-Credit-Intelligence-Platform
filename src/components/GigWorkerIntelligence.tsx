import React from 'react';
import { 
  Briefcase, 
  TrendingUp, 
  ShieldCheck, 
  AlertCircle, 
  Layers, 
  CheckCircle2, 
  Compass, 
  Calendar,
  Percent
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { BorrowerProfile } from '../types';
import { GigWorkerAnalyticsEngine } from '../services/gigWorkerAnalytics';
import { Language, translations } from '../i18n/translations';

interface GigWorkerIntelligenceProps {
  profile: BorrowerProfile;
  language: Language;
}

export const GigWorkerIntelligence: React.FC<GigWorkerIntelligenceProps> = ({ profile, language }) => {
  const t = translations[language];
  const analytics = GigWorkerAnalyticsEngine.analyze(profile);

  // Income sources pie data
  const pieColors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'];
  const pieData = profile.incomeSources.map((src) => ({
    name: src.platformName,
    value: src.averageMonthlyEarnings,
    category: src.category,
    tenure: src.tenureMonths
  }));

  // Trend data with baseline sustainable income threshold
  const chartData = profile.cashflows.map(cf => ({
    month: cf.month,
    income: cf.income,
    baseline: analytics.baselineSustainableIncome,
    savings: cf.savings
  }));

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Briefcase className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {t.gig.title}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {t.gig.subtitle}
            </p>
          </div>

          {/* Fairness Seasonality Shield Badge */}
          <div className="flex items-center space-x-3 bg-emerald-950/40 border border-emerald-500/30 px-4 py-2.5 rounded-xl">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="text-xs font-bold text-emerald-200 block">
                {t.gig.fairnessMitigation}
              </span>
              <span className="text-[11px] text-emerald-400/80">
                {language === 'hi' 
                  ? `+${analytics.fairnessAdjustmentScore} अंक मौसमी कटौती से सुरक्षा`
                  : `+${analytics.fairnessAdjustmentScore} pts protection against seasonal gig deductions`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Tiles: Sustainable Baseline, Volatility, Diversification */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Baseline Sustainable Income (BSI) */}
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300">{t.gig.sustainableIncome}</span>
              <span className="p-1 rounded-md bg-blue-500/10 text-blue-400 text-[10px] font-bold">{t.gig.p25Floor}</span>
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold font-mono text-white">
                {t.common.currency}{analytics.baselineSustainableIncome.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-400">{t.common.perMonth}</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800/80">
            {t.gig.conservativeFloorDesc}
          </p>
        </div>

        {/* Monthly Income Volatility */}
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300">{t.gig.varianceTitle}</span>
              <Percent className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold font-mono text-white">
                {(analytics.coefficientOfVariation * 100).toFixed(1)}%
              </span>
              <span className="text-xs text-slate-400">
                {language === 'hi' ? 'परिवर्तनशीलता गुणांक (CV)' : 'coeff of variation (CV)'}
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs">
            <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
              analytics.coefficientOfVariation <= 0.15 
                ? 'bg-emerald-500/10 text-emerald-400' 
                : 'bg-amber-500/10 text-amber-400'
            }`}>
              {analytics.coefficientOfVariation <= 0.15 ? t.gig.mildVariation : t.gig.typicalSeasonality}
            </span>
          </div>
        </div>

        {/* Income Stream Diversification */}
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300">{t.gig.diversificationTitle}</span>
              <Layers className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold font-mono text-white">
                {analytics.diversificationScore}
              </span>
              <span className="text-xs text-slate-400">{language === 'hi' ? '/ 100 बहु-चैनल' : '/ 100 Multi-Channel'}</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800/80">
            {language === 'hi' 
              ? `${profile.incomeSources.length} अलग-अलग सत्यापित राजस्व स्रोतों द्वारा समर्थित।`
              : `Backed by ${profile.incomeSources.length} distinct verified revenue streams.`}
          </p>
        </div>

      </div>

      {/* Seasonal Curve vs Baseline Safe Floor Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-8 bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">
                {t.gig.trajectoryTitle}
              </h3>
              <p className="text-xs text-slate-400">
                {t.gig.trajectorySubtitle}
              </p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center space-x-1 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
                <span>{t.gig.totalMonthlyEarnings}</span>
              </span>
              <span className="flex items-center space-x-1 text-blue-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block" />
                <span>{t.gig.bsiSafeFloor}</span>
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeArea" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: any) => [`₹${Number(val || 0).toLocaleString('en-IN')}`, '']}
                />
                <Area type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#incomeArea)" name={t.gig.totalMonthlyEarnings} />
                <Area type="step" dataKey="baseline" stroke="#3B82F6" strokeWidth={2} strokeDasharray="4 4" fill="none" name={t.gig.bsiSafeFloor} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Multi-Source Channel Breakdown Pie */}
        <div className="lg:col-span-4 bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">
              {t.gig.multiSource}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {t.gig.multiSourceSubtitle}
            </p>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(val: any) => [`₹${Number(val || 0).toLocaleString('en-IN')}`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 mt-2">
              {profile.incomeSources.map((src, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pieColors[idx % pieColors.length] }} />
                    <span className="font-semibold text-slate-200">{src.platformName}</span>
                  </div>
                  <span className="font-mono text-emerald-400">
                    {t.common.currency}{src.averageMonthlyEarnings.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>{t.gig.verifiedTenure}</span>
            <span className="text-slate-200 font-semibold">{profile.monthsActiveOnPlatform} {t.gig.continuous}</span>
          </div>
        </div>

      </div>

      {/* Seasonality Detection Note */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-white block font-semibold mb-0.5">
            {t.gig.whyTitle}
          </strong>
          {t.gig.whyDesc}
        </div>
      </div>

    </div>
  );
};
