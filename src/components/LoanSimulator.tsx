import React, { useState } from 'react';
import { 
  Calculator, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  Percent, 
  Calendar, 
  Layers, 
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import { BorrowerProfile, ScoringResult } from '../types';
import { AlternativeScoringEngine } from '../services/scoringEngine';
import { Language, translations } from '../i18n/translations';

interface LoanSimulatorProps {
  profile: BorrowerProfile;
  scoring: ScoringResult;
  language: Language;
}

export const LoanSimulator: React.FC<LoanSimulatorProps> = ({ profile, scoring, language }) => {
  const t = translations[language];

  // Simulator state
  const [amount, setAmount] = useState<number>(30000);
  const [tenure, setTenure] = useState<number>(12);
  const [apr, setApr] = useState<number>(14.5);

  const simulation = AlternativeScoringEngine.simulateLoan(profile, scoring, amount, tenure, apr);

  // Export Amortization Schedule to CSV
  const handleExportAmortizationSchedule = () => {
    const monthlyRate = (apr / 100) / 12;
    const emi = simulation.monthlyEmi;
    let balance = amount;

    const headers = 'Month,Opening_Balance_INR,Monthly_EMI_INR,Principal_Repaid_INR,Interest_Paid_INR,Closing_Balance_INR\n';
    const rows: string[] = [];

    for (let m = 1; m <= tenure; m++) {
      const interest = Math.round(balance * monthlyRate);
      const principal = Math.min(balance, emi - interest);
      const closing = Math.max(0, balance - principal);

      rows.push(`${m},${Math.round(balance)},${emi},${principal},${interest},${closing}`);
      balance = closing;
    }

    const csvContent = headers + rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CredNova_Amortization_Schedule_${amount}INR_${tenure}Months.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Scenarios for quick comparison
  const scenarioTenures = [6, 12, 18, 24];
  const scenarios = scenarioTenures.map(ten => 
    AlternativeScoringEngine.simulateLoan(profile, scoring, amount, ten, apr)
  );

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Calculator className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {t.simulator.title}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {t.simulator.subtitle}
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">{t.simulator.borrowerCreditCap}</span>
            <span className="text-sm font-bold font-mono text-emerald-400">
              {t.common.currency}{scoring.recommendedCreditLimitMax.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Controls vs Real-time EMI Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Controls Slider Panel */}
        <div className="lg:col-span-7 bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
          
          {/* Desired Amount Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">
                {t.simulator.desiredAmount}
              </label>
              <span className="text-base font-extrabold font-mono text-emerald-400">
                {t.common.currency}{amount.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min={5000}
              max={150000}
              step={2500}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>{t.common.currency}5,000</span>
              <span>{t.common.currency}75,000</span>
              <span>{t.common.currency}1,50,000</span>
            </div>
          </div>

          {/* Repayment Duration Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">
                {t.simulator.repaymentDuration}
              </label>
              <span className="text-base font-extrabold font-mono text-blue-400">
                {tenure} {t.common.months}
              </span>
            </div>
            <input
              type="range"
              min={3}
              max={36}
              step={1}
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>3 {t.common.months}</span>
              <span>12 {t.common.months}</span>
              <span>24 {t.common.months}</span>
              <span>36 {t.common.months}</span>
            </div>
          </div>

          {/* Indicative Interest Rate (APR) Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">
                {t.simulator.indicativeAprSlider}
              </label>
              <span className="text-base font-extrabold font-mono text-cyan-400">
                {apr.toFixed(1)}% {language === 'hi' ? 'वार्षिक' : 'p.a.'}
              </span>
            </div>
            <input
              type="range"
              min={10.0}
              max={28.0}
              step={0.5}
              value={apr}
              onChange={(e) => setApr(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>10.0% ({language === 'hi' ? 'प्राइम' : 'Prime'})</span>
              <span>18.0% ({language === 'hi' ? 'नियर-प्राइम' : 'Near-Prime'})</span>
              <span>28.0% ({language === 'hi' ? 'सबप्राइम' : 'Subprime'})</span>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-2 text-xs">
            <span className="text-slate-400 self-center mr-1 text-[11px]">{t.simulator.quickScenarios}</span>
            <button
              onClick={() => { setAmount(15000); setTenure(6); setApr(13.5); }}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition"
            >
              {t.simulator.scenario1}
            </button>
            <button
              onClick={() => { setAmount(45000); setTenure(12); setApr(14.5); }}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition"
            >
              {t.simulator.scenario2}
            </button>
            <button
              onClick={() => { setAmount(85000); setTenure(18); setApr(15.0); }}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition"
            >
              {t.simulator.scenario3}
            </button>
          </div>

        </div>

        {/* Real-time Calculation Result Card */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              {t.simulator.estimatedMonthlyOutflow}
            </span>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-4xl font-extrabold font-mono text-white">
                {t.common.currency}{simulation.monthlyEmi.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-400">{t.common.perMonth}</span>
            </div>

            {/* Affordability Gauge Badge */}
            <div className="mt-4 p-3 rounded-xl border flex items-center space-x-3 text-xs bg-slate-950/80 border-slate-800">
              {simulation.approvalLikelihood === 'High' && (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-emerald-400 block">{t.simulator.highAffordable}</span>
                    <span className="text-slate-400 text-[11px]">
                      {language === 'hi' 
                        ? `ईएमआई नियमित मासिक कमाई का केवल ${simulation.projectedDti}% लेती है।`
                        : `EMI absorbs only ${simulation.projectedDti}% of regular monthly earnings.`}
                    </span>
                  </div>
                </>
              )}
              {simulation.approvalLikelihood === 'Moderate' && (
                <>
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-bold text-amber-400 block">{t.simulator.moderateAffordable}</span>
                    <span className="text-slate-400 text-[11px]">
                      {language === 'hi'
                        ? `अनुशासित बजट के साथ प्रबंधन योग्य (${simulation.projectedDti}% DTI)।`
                        : `Manageable with disciplined budgeting (${simulation.projectedDti}% DTI).`}
                    </span>
                  </div>
                </>
              )}
              {simulation.approvalLikelihood === 'Low' && (
                <>
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                  <div>
                    <span className="font-bold text-rose-400 block">{t.simulator.stretchedAffordable}</span>
                    <span className="text-slate-400 text-[11px]">
                      {language === 'hi'
                        ? `भारी चुकौती तनाव (${simulation.projectedDti}% DTI)। लंबी अवधि पर विचार करें।`
                        : `Heavy repayment strain (${simulation.projectedDti}% DTI). Consider longer tenure.`}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Financial Breakdown Table */}
            <div className="mt-5 space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800/80 text-slate-400">
                <span>{t.simulator.principalBorrowed}</span>
                <span className="font-mono text-slate-200">{t.common.currency}{amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80 text-slate-400">
                <span>{t.simulator.totalInterest}</span>
                <span className="font-mono text-amber-400">{t.common.currency}{simulation.totalInterest.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80 text-slate-400">
                <span>{t.simulator.totalPayable}</span>
                <span className="font-mono text-emerald-400 font-bold">{t.common.currency}{simulation.totalPayable.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1.5 text-slate-400">
                <span>{t.simulator.projectedCombinedDti}</span>
                <span className={`font-mono font-bold ${
                  simulation.projectedDti <= 30 ? 'text-emerald-400' : simulation.projectedDti <= 45 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {simulation.projectedDti}%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
            {language === 'hi' && simulation.rationaleHindi ? simulation.rationaleHindi : simulation.rationale}
          </div>
        </div>

      </div>

      {/* Scenario Comparison Table */}
      <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">
              {language === 'hi' 
                ? `${t.common.currency}${amount.toLocaleString('en-IN')} के लिए विभिन्न अवधियों में परिदृश्य तुलना`
                : `${t.simulator.scenarioComparisonTitle} for ${t.common.currency}${amount.toLocaleString('en-IN')}`}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.simulator.scenarioComparisonSubtitle}
            </p>
          </div>
          <button
            onClick={handleExportAmortizationSchedule}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold self-start sm:self-auto transition"
            title="Download month-by-month repayment amortization schedule as CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.simulator.exportAmortizationCsv}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">{t.simulator.tableTenure}</th>
                <th className="py-2.5 px-3">{t.simulator.tableEmi}</th>
                <th className="py-2.5 px-3">{t.simulator.tableInterest}</th>
                <th className="py-2.5 px-3">{t.simulator.tableOutflow}</th>
                <th className="py-2.5 px-3">{t.simulator.tableDti}</th>
                <th className="py-2.5 px-3">{t.simulator.tableAffordability}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {scenarios.map((sc, idx) => (
                <tr key={idx} className={sc.tenureMonths === tenure ? 'bg-emerald-950/20' : 'hover:bg-slate-800/30'}>
                  <td className="py-2.5 px-3 font-semibold text-slate-200">
                    {sc.tenureMonths} {t.common.months} {sc.tenureMonths === tenure && <span className="text-emerald-400 font-sans text-[10px] ml-1">{t.simulator.selectedTag}</span>}
                  </td>
                  <td className="py-2.5 px-3 text-white font-bold">{t.common.currency}{sc.monthlyEmi.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3 text-amber-400">{t.common.currency}{sc.totalInterest.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3 text-slate-200">{t.common.currency}{sc.totalPayable.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3 text-slate-300">{sc.projectedDti}%</td>
                  <td className="py-2.5 px-3 font-sans">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      sc.approvalLikelihood === 'High' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      sc.approvalLikelihood === 'Moderate' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {sc.approvalLikelihood === 'High' 
                        ? (language === 'hi' ? 'उच्च संभावना' : 'High Likelihood')
                        : sc.approvalLikelihood === 'Moderate'
                        ? (language === 'hi' ? 'मध्यम संभावना' : 'Moderate Likelihood')
                        : (language === 'hi' ? 'कम संभावना' : 'Low Likelihood')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Regulatory Transparency Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-start space-x-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-200 block font-semibold mb-0.5">
            {t.simulator.affirmationTitle}
          </strong>
          {t.simulator.disclaimer}
        </div>
      </div>

    </div>
  );
};
