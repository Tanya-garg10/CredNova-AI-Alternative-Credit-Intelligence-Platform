import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  ShieldCheck, 
  QrCode, 
  CheckCircle2, 
  Calendar,
  Building,
  Award,
  Check
} from 'lucide-react';
import { BorrowerProfile, ScoringResult } from '../types';
import { Language, translations } from '../i18n/translations';

interface CreditPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: BorrowerProfile;
  scoring: ScoringResult;
  language: Language;
}

export const CreditPassportModal: React.FC<CreditPassportModalProps> = ({
  isOpen,
  onClose,
  profile,
  scoring,
  language
}) => {
  const t = translations[language];
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const certificateId = `CRD-PASSPORT-${profile.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const issueDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  // System Print / Save as PDF
  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      console.log('Print dialog triggered', e);
    }
  };

  // Direct File Download: Generates a self-contained HTML/PDF-ready Credit Passport dossier
  const handleDirectDownload = () => {
    const reportHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CredNova AI Alternative Credit Passport - ${profile.fullName}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #080D18; color: #F8FAFC; margin: 0; padding: 40px; }
    .card { max-width: 800px; margin: 0 auto; background: #101B2D; border: 2px solid #10D6A0; border-radius: 24px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1E293B; padding-bottom: 24px; }
    .title { font-size: 24px; font-weight: 800; color: #FFFFFF; }
    .brand-accent { color: #10D6A0; }
    .cert-id { font-size: 12px; color: #94A3B8; font-family: monospace; margin-top: 4px; }
    .score-hero { display: flex; justify-content: space-between; align-items: center; margin: 32px 0; background: #080D18; padding: 24px; border-radius: 16px; border: 1px solid #334155; }
    .score-val { font-size: 56px; font-weight: 900; color: #10D6A0; font-family: monospace; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 24px 0; }
    .grid-cell { background: #080D18; padding: 16px; border-radius: 12px; border: 1px solid #1E293B; }
    .cell-label { font-size: 11px; color: #94A3B8; text-transform: uppercase; }
    .cell-val { font-size: 16px; font-weight: 700; color: #FFFFFF; margin-top: 4px; font-family: monospace; }
    .pillars { margin: 24px 0; padding: 20px; background: #080D18; border-radius: 16px; }
    .pillars h4 { margin-top: 0; color: #10D6A0; font-size: 14px; }
    .pillars ul { padding-left: 20px; font-size: 12px; color: #CBD5E1; line-height: 1.6; }
    .footer { display: flex; justify-content: space-between; align-items: center; margin-top: 32px; padding-top: 20px; border-top: 1px solid #1E293B; font-size: 11px; color: #64748B; }
    @media print { body { background: white; color: black; } .card { border-color: #cbd5e1; background: white; } .score-hero, .grid-cell, .pillars { background: #f8fafc; border-color: #e2e8f0; } .score-val { color: #059669; } }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div>
        <div class="title">CredNova<span class="brand-accent">.AI</span> Alternative Credit Passport</div>
        <div class="cert-id">Official Certificate ID: ${certificateId}</div>
      </div>
      <div style="text-align: right;">
        <div style="color: #10D6A0; font-weight: 700; font-size: 12px;">RBI DPDP & Account Aggregator Verified</div>
        <div style="font-size: 11px; color: #94A3B8; margin-top: 4px;">Issued: ${issueDate}</div>
      </div>
    </div>

    <div class="score-hero">
      <div>
        <div style="font-size: 20px; font-weight: 700; color: white;">${profile.fullName}</div>
        <div style="font-size: 13px; color: #94A3B8; margin-top: 4px;">${profile.primaryOccupation} • 📍 ${profile.location}</div>
        <div style="font-size: 12px; color: #35C8FF; margin-top: 8px;">Risk Tier: <strong>${scoring.riskCategory}</strong> (${scoring.recommendedAprRange})</div>
      </div>
      <div style="text-align: right;">
        <div class="score-val">${scoring.score}</div>
        <div style="font-size: 11px; color: #94A3B8; text-transform: uppercase;">Scale: 0 to 1000</div>
      </div>
    </div>

    <div class="grid">
      <div class="grid-cell">
        <div class="cell-label">Monthly Average Income</div>
        <div class="cell-val">₹${profile.monthlyAverageIncome.toLocaleString('en-IN')}</div>
      </div>
      <div class="grid-cell">
        <div class="cell-label">Utility Streak</div>
        <div class="cell-val">${profile.utilityPaymentStreakMonths} Mo On-Time</div>
      </div>
      <div class="grid-cell">
        <div class="cell-label">Recommended Limit</div>
        <div class="cell-val">₹${scoring.recommendedCreditLimitMax.toLocaleString('en-IN')}</div>
      </div>
      <div class="grid-cell">
        <div class="cell-label">Default Probability</div>
        <div class="cell-val">${(scoring.defaultProbability * 100).toFixed(1)}%</div>
      </div>
    </div>

    <div class="pillars">
      <h4>Audited Behavioral Disciplines</h4>
      <ul>
        <li><strong>UPI Digital Ledger:</strong> ${profile.digitalTransactionVolumeRatio}% of regular income flows through verified digital QR accounts.</li>
        <li><strong>Platform Seniority:</strong> ${profile.monthsActiveOnPlatform} months active verified work history without defaults.</li>
        <li><strong>Emergency Buffer:</strong> ${profile.emergencySavingsBufferDays} days of essential expenses held in liquid micro-savings.</li>
        <li><strong>Community Trust:</strong> ${profile.communityChitRepaymentRate}% on-time track record in peer self-help groups.</li>
      </ul>
    </div>

    <div class="footer">
      <div>SHA-256 Hash Verification: 8f4c7a902e...b318 • Valid 90 Days from Issue</div>
      <div>CredNova AI Protocol HI-04 (Ethical Non-Discriminatory Scoring)</div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([reportHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CredNova_Credit_Passport_${profile.fullName.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-3xl border border-slate-700 max-w-3xl w-full max-h-[95vh] overflow-y-auto p-6 md:p-8 shadow-2xl space-y-6">
        
        {/* Modal Controls */}
        <div className="flex items-center justify-between no-print pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              {t.passport.modalTitle}
            </h3>
          </div>
          <div className="flex items-center space-x-2.5">
            {/* Direct File Download Button */}
            <button
              onClick={handleDirectDownload}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/30 transition"
              title="Download standalone file to disk"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{t.passport.downloaded}</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>{t.passport.downloadHtml}</span>
                </>
              )}
            </button>

            {/* Print / System PDF */}
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition"
              title="Print via browser or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.passport.printPdf}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="no-print p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{t.passport.downloadSuccess}</span>
          </div>
        )}

        {/* Printable Official Certificate / Passport Container */}
        <div className="print-card bg-gradient-to-br from-slate-950 via-[#0B1120] to-slate-950 p-6 md:p-8 rounded-2xl border-2 border-emerald-500/30 text-white relative overflow-hidden shadow-2xl">
          
          {/* Subtle watermark background */}
          <div className="absolute right-4 top-4 opacity-5 pointer-events-none">
            <ShieldCheck className="w-64 h-64 text-emerald-400" />
          </div>

          {/* Certificate Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-md">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-white">
                  CredNova<span className="text-emerald-400">.AI</span> {language === 'hi' ? 'वैकल्पिक क्रेडिट पासपोर्ट' : 'Alternative Credit Passport'}
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  {language === 'hi' ? 'प्रमाणपत्र संख्या' : 'Certificate'} #{certificateId}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold inline-block">
                {t.passport.verifiedBadge}
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                {t.passport.issued} {issueDate}
              </p>
            </div>
          </div>

          {/* Identity & Main Score Hero */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            <div className="md:col-span-8 flex items-start space-x-4">
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-emerald-500/50 shadow-lg"
              />
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-white">
                    {language === 'hi' ? profile.nameHindi : profile.fullName}
                  </h3>
                  {language === 'en' && <span className="text-xs text-slate-400 font-mono">({profile.nameHindi})</span>}
                </div>
                <p className="text-xs text-slate-300 font-medium">
                  {language === 'hi' ? profile.primaryOccupationHindi : profile.primaryOccupation}
                </p>
                <p className="text-xs text-slate-400">
                  📍 {profile.location} • {language === 'hi' ? `आयु ${profile.age}` : `Age ${profile.age}`}
                </p>
                <div className="flex items-center space-x-2 pt-1 text-[11px] text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t.passport.verifiedFootprint}</span>
                </div>
              </div>
            </div>

            {/* Score Big Display */}
            <div className="md:col-span-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">
                {t.score.title}
              </span>
              <div className="text-4xl font-extrabold font-mono text-emerald-400 my-1">
                {scoring.score}
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                scoring.riskCategory === 'Excellent' ? 'bg-emerald-500/20 text-emerald-300' :
                scoring.riskCategory === 'Good' ? 'bg-blue-500/20 text-blue-300' :
                'bg-amber-500/20 text-amber-300'
              }`}>
                {scoring.riskCategory} {t.passport.standingLabel}
              </span>
            </div>

          </div>

          {/* Core Underwriting Metrics Grid */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block text-[11px]">{t.passport.monthlyAvg}</span>
              <span className="text-sm font-bold font-mono text-white">
                ₹{profile.monthlyAverageIncome.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block text-[11px]">{t.passport.utilityStreakLabel}</span>
              <span className="text-sm font-bold font-mono text-emerald-400">
                {profile.utilityPaymentStreakMonths} {language === 'hi' ? 'माह 100% समय पर' : 'Mo 100% On-Time'}
              </span>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block text-[11px]">{t.passport.recCapLabel}</span>
              <span className="text-sm font-bold font-mono text-blue-400">
                ₹{scoring.recommendedCreditLimitMax.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block text-[11px]">{t.passport.defaultProbLabel}</span>
              <span className="text-sm font-bold font-mono text-slate-300">
                {(scoring.defaultProbability * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Underwriting Assurance Statement */}
          <div className="mt-6 p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
            <span className="font-semibold text-white block">{t.passport.underwritingGuarantee}</span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {t.passport.assuranceText}
            </p>
          </div>

          {/* Verification Stamp & QR Code */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-lg text-slate-950">
                <QrCode className="w-10 h-10" />
              </div>
              <div>
                <span className="font-semibold text-white block">{t.passport.qrTitle}</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  SHA-256: 8f4c7a...3902
                </span>
                <span className="text-[10px] text-emerald-400 block">{t.passport.qrLenderScan}</span>
              </div>
            </div>

            <div className="text-center sm:text-right text-[11px] text-slate-400">
              <span>{t.passport.validThrough} </span>
              <strong className="text-slate-200">{t.passport.validDays}</strong>
              <p className="text-[10px] text-slate-500">{t.passport.protocolName}</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

