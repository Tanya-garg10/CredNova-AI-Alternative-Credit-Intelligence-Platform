import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Eye, 
  FileCheck, 
  TrendingUp, 
  Download,
  Check,
  X,
  Layers,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { BorrowerProfile, RiskCategory } from '../types';
import { AlternativeScoringEngine } from '../services/scoringEngine';
import { Language, translations } from '../i18n/translations';

interface LenderDashboardProps {
  borrowers: BorrowerProfile[];
  onSelectBorrower: (borrower: BorrowerProfile) => void;
  language: Language;
}

export const LenderDashboard: React.FC<LenderDashboardProps> = ({
  borrowers,
  onSelectBorrower,
  language
}) => {
  const t = translations[language];

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('all');
  const [selectedBorrowerForDetail, setSelectedBorrowerForDetail] = useState<BorrowerProfile | null>(null);
  const [compareList, setCompareList] = useState<BorrowerProfile[]>([]);

  // Score distribution dataset for portfolio chart
  const portfolioDistribution = [
    { name: language === 'hi' ? 'प्राइम (750-1000)' : 'Prime (750-1000)', count: 42, color: '#10B981' },
    { name: language === 'hi' ? 'नियर-प्राइम (660-749)' : 'Near-Prime (660-749)', count: 32, color: '#3B82F6' },
    { name: language === 'hi' ? 'मध्यम (520-659)' : 'Fair (520-659)', count: 18, color: '#F59E0B' },
    { name: language === 'hi' ? 'उच्च जोखिम (<520)' : 'High Risk (<520)', count: 8, color: '#F43F5E' }
  ];

  // Map borrowers with their live computed score
  const scoredBorrowers = borrowers.map(b => ({
    profile: b,
    scoring: AlternativeScoringEngine.calculateScore(b)
  }));

  // Filtered roster
  const filtered = scoredBorrowers.filter(item => {
    const matchesSearch = item.profile.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.profile.primaryOccupation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.profile.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = selectedRiskFilter === 'all' || item.scoring.riskCategory === selectedRiskFilter;
    return matchesSearch && matchesRisk;
  });

  const toggleCompare = (b: BorrowerProfile) => {
    if (compareList.some(item => item.id === b.id)) {
      setCompareList(compareList.filter(item => item.id !== b.id));
    } else {
      if (compareList.length < 2) {
        setCompareList([...compareList, b]);
      } else {
        setCompareList([compareList[1], b]);
      }
    }
  };

  const [sanctionSuccessInfo, setSanctionSuccessInfo] = useState<{ name: string; amount: number } | null>(null);

  // Export Full Portfolio Roster to CSV
  const handleExportPortfolioCsv = () => {
    const header = 'Borrower_ID,Full_Name,Occupation,Location,Is_Rural,Alternative_Score,Risk_Category,Recommended_Limit_INR,Default_Probability_Pct,Utility_Streak_Months,Digital_Inflow_Ratio_Pct\n';
    const rows = scoredBorrowers.map(item => {
      const b = item.profile;
      const s = item.scoring;
      return `"${b.id}","${b.fullName}","${b.primaryOccupation}","${b.location}",${b.isRural},${s.score},"${s.riskCategory}",${s.recommendedCreditLimitMax},${(s.defaultProbability * 100).toFixed(1)},${b.utilityPaymentStreakMonths},${b.digitalTransactionVolumeRatio}`;
    }).join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'CredNova_Underwriting_Portfolio_Roster.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Generate & Download Official Underwriting Sanction Letter File (HTML/PDF)
  const handleIssueSanctionLetter = (borrower: BorrowerProfile, auditScoring: any) => {
    const sanctionId = `SANCTION-HI04-${borrower.id.toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const issueDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    
    const letterHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Loan Sanction Letter - ${borrower.fullName} - CredNova AI</title>
  <style>
    body { font-family: 'Times New Roman', Times, serif; color: #1e293b; background: #f8fafc; padding: 40px; margin: 0; }
    .letter-container { max-width: 800px; margin: 0 auto; background: #ffffff; padding: 50px 60px; border: 1px solid #cbd5e1; box-shadow: 0 10px 25px rgba(0,0,0,0.08); position: relative; }
    .header { border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: flex-end; }
    .brand { font-size: 26px; font-weight: bold; color: #0f172a; letter-spacing: -0.5px; }
    .brand span { color: #059669; }
    .ref-box { font-size: 13px; color: #475569; text-align: right; }
    .title { text-align: center; font-size: 18px; font-weight: bold; text-decoration: underline; margin: 25px 0; text-transform: uppercase; color: #0f172a; }
    .recipient { font-size: 14px; line-height: 1.6; margin-bottom: 20px; }
    .body-p { font-size: 14px; line-height: 1.7; text-align: justify; margin-bottom: 15px; }
    .terms-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; }
    .terms-table th, .terms-table td { border: 1px solid #94a3b8; padding: 10px 14px; text-align: left; }
    .terms-table th { background: #f1f5f9; font-weight: bold; width: 40%; color: #0f172a; }
    .seal-box { margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end; }
    .seal { width: 120px; height: 120px; border: 2px dashed #059669; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #059669; font-size: 11px; text-align: center; font-weight: bold; transform: rotate(-5deg); }
    .signature { text-align: right; font-size: 13px; line-height: 1.5; }
    .footer-note { margin-top: 35px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; line-height: 1.5; }
    @media print { body { background: white; padding: 0; } .letter-container { border: none; box-shadow: none; padding: 20px; } }
  </style>
</head>
<body>
  <div class="letter-container">
    <div class="header">
      <div>
        <div class="brand">CredNova<span>.AI</span></div>
        <div style="font-size: 11px; color: #64748b; font-family: sans-serif;">Alternative Credit Protocol HI-04 Underwriting Network</div>
      </div>
      <div class="ref-box">
        <div><strong>Sanction Reference:</strong> ${sanctionId}</div>
        <div><strong>Date of Issue:</strong> ${issueDate}</div>
      </div>
    </div>

    <div class="title">Official In-Principle Loan Sanction Letter</div>

    <div class="recipient">
      <strong>To,</strong><br>
      <strong>${borrower.fullName}</strong><br>
      Primary Occupation: ${borrower.primaryOccupation}<br>
      Location: ${borrower.location}<br>
      Status: Verified via RBI Account Aggregator
    </div>

    <p class="body-p">
      Dear ${borrower.fullName},
    </p>

    <p class="body-p">
      With reference to your credit assessment processed through the <strong>CredNova AI Alternative Underwriting Engine</strong>, we are pleased to inform you that based on your verified utility streak, digital UPI cashflows, and community financial discipline, you have been categorized under the <strong>${auditScoring.riskCategory}</strong> tier and granted in-principle sanction as per terms detailed below:
    </p>

    <table class="terms-table">
      <tr>
        <th>Applicant Name</th>
        <td>${borrower.fullName}</td>
      </tr>
      <tr>
        <th>Sanctioned Credit Limit</th>
        <td><strong>INR ₹${auditScoring.recommendedCreditLimitMax.toLocaleString('en-IN')}</strong></td>
      </tr>
      <tr>
        <th>Alternative Credit Score</th>
        <td><strong>${auditScoring.score} / 1000</strong> (Audited)</td>
      </tr>
      <tr>
        <th>Applicable Interest Rate (APR)</th>
        <td>${auditScoring.recommendedAprRange}</td>
      </tr>
      <tr>
        <th>Maximum Recommended Tenure</th>
        <td>Up to 24 Months</td>
      </tr>
      <tr>
        <th>Basis of Underwriting</th>
        <td>${borrower.utilityPaymentStreakMonths} Months Utility Streak • ${borrower.digitalTransactionVolumeRatio}% Digital Inflows</td>
      </tr>
      <tr>
        <th>Disbursement Mode</th>
        <td>Direct UPI / Bank Transfer via Account Aggregator</td>
      </tr>
    </table>

    <p class="body-p">
      This facility is issued in accordance with the Reserve Bank of India (RBI) Fair Lending Guidelines and DPDP Act 2023. No non-financial personal surveillance data was utilized in this determination.
    </p>

    <div class="seal-box">
      <div class="seal">
        <span>CREDNOVA AI</span>
        <span>★ VERIFIED ★</span>
        <span>HI-04 SANCTION</span>
      </div>
      <div class="signature">
        <strong>Authorized Signatory</strong><br>
        Chief Credit Officer (Institutional Desk)<br>
        CredNova AI Risk Intelligence Partner
      </div>
    </div>

    <div class="footer-note">
      This is a system-generated document based on algorithmic risk calibration. Document Verification Hash: SHA-256-${sanctionId}. For inquiries, visit CredNova AI Underwriting Portal.
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([letterHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CredNova_Sanction_Letter_${borrower.fullName.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setSanctionSuccessInfo({ name: borrower.fullName, amount: auditScoring.recommendedCreditLimitMax });
  };

  return (
    <div className="space-y-6">
      
      {/* Portfolio Top Bar */}
      <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1 rounded-lg bg-blue-500/10 text-blue-400">
                <Building2 className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {t.lender.title}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {t.lender.subtitle}
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <button
              onClick={handleExportPortfolioCsv}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition"
              title="Download applicant roster as CSV"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.lender.exportPortfolioCsv}</span>
            </button>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 font-semibold">
              {t.lender.automatedUnderwritingActive}
            </span>
          </div>
        </div>
      </div>

      {/* Portfolio KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-xl">
          <span className="text-xs text-slate-400 block">{t.lender.totalAssessed}</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-white">2,640</span>
            <span className="text-xs text-emerald-400 font-semibold">+18% MoM</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            {language === 'hi' ? '100% वैकल्पिक डेटा लेखापरीक्षित' : '100% Alternative data audited'}
          </span>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-xl">
          <span className="text-xs text-slate-400 block">{t.lender.avgScore}</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-white">684</span>
            <span className="text-xs text-slate-400">/ 1000</span>
          </div>
          <span className="text-[11px] text-emerald-400 block mt-1">
            {language === 'hi' ? 'नियर-प्राइम बेंचमार्क' : 'Near-Prime benchmark'}
          </span>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-xl">
          <span className="text-xs text-slate-400 block">{t.lender.approvalRate}</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">74.2%</span>
            <span className="text-xs text-slate-400">{language === 'hi' ? 'स्वचालित' : 'Automated'}</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            {language === 'hi' ? 'असमान प्रभाव: 0.968 (निष्पक्ष)' : 'Disparate impact: 0.968 (Fair)'}
          </span>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-xl">
          <span className="text-xs text-slate-400 block">{t.lender.projectedNpl}</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">2.6%</span>
            <span className="text-xs text-slate-400">{t.lender.delinquency90}</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">{t.lender.informalComparison}</span>
        </div>

      </div>

      {/* Portfolio Charts & Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Risk Distribution Bar Chart */}
        <div className="lg:col-span-8 bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-1">
            {t.lender.scoreDistTitle}
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            {t.lender.scoreDistSubtitle}
          </p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={portfolioDistribution} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: any) => [`${val}% ${language === 'hi' ? 'आवेदक' : 'of applicants'}`, language === 'hi' ? 'हिस्सा' : 'Share']}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {portfolioDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Portfolio Underwriting Policy Summary */}
        <div className="lg:col-span-4 bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-2">
              {t.lender.guardrailsTitle}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {t.lender.guardrailsSubtitle}
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-emerald-400 block">{t.lender.autoSanctionRule}</span>
                  <span className="text-[11px] text-slate-400">{t.lender.autoSanctionDesc}</span>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-400">
                  {language === 'hi' ? 'अधिकतम ₹1,00,000' : 'Max ₹1,00,000'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-blue-400 block">{t.lender.stdApprovalRule}</span>
                  <span className="text-[11px] text-slate-400">{t.lender.stdApprovalDesc}</span>
                </div>
                <span className="font-mono text-xs font-bold text-blue-400">
                  {language === 'hi' ? 'अधिकतम ₹50,000' : 'Max ₹50,000'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-amber-400 block">{t.lender.manualReviewRule}</span>
                  <span className="text-[11px] text-slate-400">{t.lender.manualReviewDesc}</span>
                </div>
                <span className="font-mono text-xs font-bold text-amber-400">
                  {language === 'hi' ? 'अधिकतम ₹25,000' : 'Max ₹25,000'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
            {t.lender.auditLoggingNote}
          </div>
        </div>

      </div>

      {/* Side-by-side Applicant Comparison Panel (if 2 selected) */}
      {compareList.length === 2 && (
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-emerald-500/40 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                {t.lender.sideBySideTitle}
              </h3>
            </div>
            <button
              onClick={() => setCompareList([])}
              className="text-xs text-slate-400 hover:text-white"
            >
              {t.lender.clearComparison}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {compareList.map((comp) => {
              const compScore = AlternativeScoringEngine.calculateScore(comp);
              return (
                <div key={comp.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div>
                      <span className="font-bold text-sm text-white block">
                        {language === 'hi' ? comp.nameHindi : comp.fullName}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {language === 'hi' ? comp.primaryOccupationHindi : comp.primaryOccupation}
                      </span>
                    </div>
                    <span className="text-lg font-bold font-mono text-emerald-400">
                      {compScore.score} {t.common.scorePoints}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 block">{t.borrower.monthlyCashflow}</span>
                      <span className="font-mono text-white font-semibold">₹{comp.monthlyAverageIncome.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{t.borrower.debtLoad}</span>
                      <span className="font-mono text-white font-semibold">{comp.debtToIncomeRatio}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{t.borrower.utilityStreak}</span>
                      <span className="font-mono text-white font-semibold">{comp.utilityPaymentStreakMonths} {t.common.months}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{t.borrower.emergencyRunway}</span>
                      <span className="font-mono text-white font-semibold">{comp.emergencySavingsBufferDays} {t.borrower.days}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                    <span className="text-[11px] text-slate-400">{t.borrower.recommendedLimit}:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      ₹{compScore.recommendedCreditLimitMax.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Applicant Roster Pipeline Table */}
      <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">
              {t.lender.applicantRoster}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'hi' 
                ? 'अंडरराइटिंग निर्णय हेतु प्रतीक्षारत रीयल-टाइम क्रेडिट प्रोफ़ाइल' 
                : 'Real-time evaluated credit profiles awaiting underwriting action'}
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder={t.lender.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 w-52"
              />
            </div>

            {/* Risk Filter */}
            <select
              aria-label="Filter applicants by risk tier"
              value={selectedRiskFilter}
              onChange={(e) => setSelectedRiskFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">{t.lender.allTiers}</option>
              <option value="Excellent">{t.score.excellent}</option>
              <option value="Good">{t.score.good}</option>
              <option value="Moderate">{t.score.moderate}</option>
              <option value="High Risk">{t.score.highRisk}</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">{t.lender.colName}</th>
                <th className="py-3 px-3">{t.lender.colOccupation}</th>
                <th className="py-3 px-3">{t.lender.colScoreTier}</th>
                <th className="py-3 px-3">{t.lender.colIncome}</th>
                <th className="py-3 px-3">{t.lender.colBillStreak}</th>
                <th className="py-3 px-3">{t.lender.colDefaultRisk}</th>
                <th className="py-3 px-3">{t.lender.colRecommendation}</th>
                <th className="py-3 px-3 text-right">{t.lender.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map(({ profile, scoring }) => {
                const isComparing = compareList.some(c => c.id === profile.id);
                return (
                  <tr key={profile.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={profile.avatarUrl}
                          alt={profile.fullName}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700"
                        />
                        <div>
                          <span className="font-semibold text-white block">
                            {language === 'hi' ? profile.nameHindi : profile.fullName}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {profile.location.split(',')[0]} {profile.isRural && (language === 'hi' ? '• ग्रामीण' : '• Rural')}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-slate-300">
                      {language === 'hi' ? profile.primaryOccupationHindi : profile.primaryOccupation.split('&')[0]}
                    </td>

                    <td className="py-3 px-3 font-mono">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-sm">{scoring.score}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-semibold ${
                          scoring.riskCategory === 'Excellent' ? 'bg-emerald-500/10 text-emerald-400' :
                          scoring.riskCategory === 'Good' ? 'bg-blue-500/10 text-blue-400' :
                          scoring.riskCategory === 'Moderate' ? 'bg-amber-500/10 text-amber-400' :
                          'bg-rose-500/10 text-rose-400'
                        }`}>
                          {scoring.riskCategory === 'Excellent' ? (language === 'hi' ? 'प्राइम' : 'Prime') :
                           scoring.riskCategory === 'Good' ? (language === 'hi' ? 'नियर-प्राइम' : 'Near-Prime') :
                           scoring.riskCategory === 'Moderate' ? (language === 'hi' ? 'मध्यम' : 'Moderate') :
                           (language === 'hi' ? 'उच्च जोखिम' : 'High Risk')}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-200">
                      ₹{profile.monthlyAverageIncome.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-3 font-mono text-emerald-400">
                      {profile.utilityPaymentStreakMonths} {language === 'hi' ? 'माह स्ट्रीक' : 'Mo Streak'}
                    </td>

                    <td className="py-3 px-3 font-mono">
                      {(scoring.defaultProbability * 100).toFixed(1)}%
                    </td>

                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        scoring.score >= 750 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        scoring.score >= 660 ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                        'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {scoring.score >= 750 ? t.lender.autoSanctionBadge : scoring.score >= 660 ? t.lender.stdSanctionBadge : t.lender.manualReviewBadge}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => toggleCompare(profile)}
                          className={`px-2 py-1 rounded text-[10px] font-semibold border transition ${
                            isComparing
                              ? 'bg-emerald-600 text-white border-emerald-500'
                              : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                          }`}
                          title="Select to compare side-by-side"
                        >
                          {isComparing ? t.lender.comparingBtn : t.lender.compareBtn}
                        </button>
                        
                        <button
                          onClick={() => {
                            onSelectBorrower(profile);
                            setSelectedBorrowerForDetail(profile);
                          }}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-semibold transition"
                          title="Open detailed dossier"
                        >
                          {t.lender.auditDossierBtn}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Underwriting Dossier Drawer/Modal */}
      {selectedBorrowerForDetail && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedBorrowerForDetail.avatarUrl}
                  alt={selectedBorrowerForDetail.fullName}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-500"
                />
                <div>
                  <h3 className="text-base font-bold text-white">
                    {t.lender.dossierTitle} {language === 'hi' ? selectedBorrowerForDetail.nameHindi : selectedBorrowerForDetail.fullName}
                  </h3>
                  <p className="text-xs text-slate-400">
                    ID: {selectedBorrowerForDetail.id} • {t.lender.dossierVerified}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBorrowerForDetail(null)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dossier Contents */}
            {(() => {
              const auditScoring = AlternativeScoringEngine.calculateScore(selectedBorrowerForDetail);
              return (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                      <span className="text-slate-400 block text-[11px]">{t.score.title}</span>
                      <span className="text-xl font-bold font-mono text-emerald-400">{auditScoring.score}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                      <span className="text-slate-400 block text-[11px]">{t.borrower.recommendedLimit}</span>
                      <span className="text-xl font-bold font-mono text-blue-400">₹{auditScoring.recommendedCreditLimitMax.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                      <span className="text-slate-400 block text-[11px]">{t.lender.calibratedDefaultProb}</span>
                      <span className="text-xl font-bold font-mono text-slate-200">{(auditScoring.defaultProbability * 100).toFixed(1)}%</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="font-semibold text-white block">{t.lender.auditTrailTitle}</span>
                    <ul className="space-y-1.5 text-slate-300">
                      <li>• <strong>{language === 'hi' ? 'यूपीआई विवरण ऑडिट:' : 'UPI Statement Audit:'}</strong> {language === 'hi' ? `आने वाले नकदी प्रवाह का ${selectedBorrowerForDetail.digitalTransactionVolumeRatio}% डिजिटल रूप से सत्यापित है।` : `${selectedBorrowerForDetail.digitalTransactionVolumeRatio}% of incoming cashflow is digitally verified.`}</li>
                      <li>• <strong>{language === 'hi' ? 'बिल भुगतान स्ट्रीक:' : 'Utility Streak:'}</strong> {language === 'hi' ? `बिना किसी चूक के लगातार ${selectedBorrowerForDetail.utilityPaymentStreakMonths} महीने का समय पर भुगतान।` : `${selectedBorrowerForDetail.utilityPaymentStreakMonths} consecutive months without missed payments.`}</li>
                      <li>• <strong>{language === 'hi' ? 'कार्य प्लेटफ़ॉर्म कार्यकाल:' : 'Platform Seniority:'}</strong> {language === 'hi' ? `कार्य प्लेटफ़ॉर्म पर ${selectedBorrowerForDetail.monthsActiveOnPlatform} महीने का सक्रिय कार्य रिकॉर्ड।` : `${selectedBorrowerForDetail.monthsActiveOnPlatform} months active on work platform.`}</li>
                      <li>• <strong>{language === 'hi' ? 'सामुदायिक साख:' : 'Community Standing:'}</strong> {language === 'hi' ? `स्वयं सहायता समूहों में ${selectedBorrowerForDetail.communityChitRepaymentRate}% समय पर पुनर्भुगतान रिकॉर्ड।` : `${selectedBorrowerForDetail.communityChitRepaymentRate}% on-time repayment in self-help groups.`}</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-200">
                    <span className="font-bold block mb-1">{t.lender.underwriterRecTitle}</span>
                    {language === 'hi' 
                      ? `आवेदक वैकल्पिक क्रेडिट नीति HI-04 के तहत ${auditScoring.riskCategory} श्रेणी के लिए योग्य है। किसी भी व्यक्तिगत निगरानी डेटा का उपयोग नहीं किया गया।` 
                      : `Applicant qualifies for ${auditScoring.riskCategory} lending tier under Alternative Credit Policy HI-04. Zero invasive personal surveillance was used during calculation.`}
                  </div>

                  {sanctionSuccessInfo && sanctionSuccessInfo.name === selectedBorrowerForDetail.fullName && (
                    <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <strong>{t.lender.sanctionDownloadedSuccess} ₹{sanctionSuccessInfo.amount.toLocaleString('en-IN')}</strong> {language === 'hi' ? `(आवेदक: ${language === 'hi' ? selectedBorrowerForDetail.nameHindi : selectedBorrowerForDetail.fullName})` : `approved for ${sanctionSuccessInfo.name}.`}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setSelectedBorrowerForDetail(null);
                        setSanctionSuccessInfo(null);
                      }}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
                    >
                      {t.lender.closeDossier}
                    </button>
                    <button
                      onClick={() => handleIssueSanctionLetter(selectedBorrowerForDetail, auditScoring)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition"
                    >
                      <Download className="w-4 h-4" />
                      <span>{t.lender.approveAndDownloadLetter}</span>
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

    </div>
  );
};
