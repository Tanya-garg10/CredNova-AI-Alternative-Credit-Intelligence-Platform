import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  UserPlus, 
  Sparkles, 
  FileText, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { BorrowerProfile, EmploymentType } from '../types';
import { Language, translations } from '../i18n/translations';

interface ProfileEvaluatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileCreated: (profile: BorrowerProfile) => void;
  language: Language;
}

export const ProfileEvaluatorModal: React.FC<ProfileEvaluatorModalProps> = ({
  isOpen,
  onClose,
  onProfileCreated,
  language
}) => {
  const t = translations[language];

  // Custom Profile Form State
  const [fullName, setFullName] = useState('Pooja Sharma');
  const [nameHindi, setNameHindi] = useState('पूजा शर्मा');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('gig_delivery');
  const [primaryOccupation, setPrimaryOccupation] = useState('E-Commerce Delivery Rider & Freelance Baker');
  const [location, setLocation] = useState('Lucknow, Uttar Pradesh');
  const [monthlyIncome, setMonthlyIncome] = useState<number>(32000);
  const [utilityStreakMonths, setUtilityStreakMonths] = useState<number>(14);
  const [emergencyBufferDays, setEmergencyBufferDays] = useState<number>(35);
  const [dtiRatio, setDtiRatio] = useState<number>(18);
  const [digitalVolumeRatio, setDigitalVolumeRatio] = useState<number>(85);
  const [monthsOnPlatform, setMonthsOnPlatform] = useState<number>(16);
  const [communityChitRate, setCommunityChitRate] = useState<number>(95);
  const [isRural, setIsRural] = useState<boolean>(false);

  // CSV upload state
  const [csvFileName, setCsvFileName] = useState<string | null>(null);
  const [csvSuccessMessage, setCsvSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Function to download a realistic sample CSV template
  const handleDownloadSampleCsv = () => {
    const csvContent = `Month,Inflow_UPI,Living_Expenses,Net_Savings,Utility_Bills_Paid_OnTime,Rent_Paid_OnTime
Jun,34000,21500,12500,TRUE,TRUE
Jul,35500,22000,13500,TRUE,TRUE
Aug,38000,23400,14600,TRUE,TRUE
Sep,36500,22800,13700,TRUE,TRUE
Oct,41000,25000,16000,TRUE,TRUE
Nov,37000,23100,13900,TRUE,TRUE`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'crednova_sample_unbanked_cashflow.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          const lines = text.trim().split('\n');
          const dataRows = lines.slice(1);
          let totalInflow = 0;
          let validMonths = 0;

          dataRows.forEach(row => {
            const cols = row.split(',');
            if (cols.length >= 2) {
              const inflow = parseFloat(cols[1]);
              if (!isNaN(inflow) && inflow > 0) {
                totalInflow += inflow;
                validMonths++;
              }
            }
          });

          const calculatedAvg = validMonths > 0 ? Math.round(totalInflow / validMonths) : 36000;
          setMonthlyIncome(calculatedAvg);
          setFullName(`Applicant (${file.name.replace('.csv', '')})`);
          setUtilityStreakMonths(validMonths > 0 ? validMonths * 3 : 18);
          setEmergencyBufferDays(40);
          setDtiRatio(16);
          setDigitalVolumeRatio(92);
          setMonthsOnPlatform(validMonths > 0 ? validMonths * 3 : 18);
          setCsvSuccessMessage(`Successfully parsed ${dataRows.length} months of verified cashflows! Computed Average Monthly Inflow: ₹${calculatedAvg.toLocaleString('en-IN')}`);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newProfile: BorrowerProfile = {
      id: `custom-${Date.now()}`,
      fullName,
      nameHindi: nameHindi || fullName,
      age: 28,
      location,
      state: 'Uttar Pradesh',
      isRural,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      employmentType,
      primaryOccupation,
      primaryOccupationHindi: primaryOccupation,
      monthlyAverageIncome: Number(monthlyIncome),
      incomeStabilityIndex: 82,
      emergencySavingsBufferDays: Number(emergencyBufferDays),
      debtToIncomeRatio: Number(dtiRatio),
      digitalTransactionVolumeRatio: Number(digitalVolumeRatio),
      monthsActiveOnPlatform: Number(monthsOnPlatform),
      totalMicroLoansTaken: 2,
      repaidMicroLoansOnTime: 2,
      utilityPaymentStreakMonths: Number(utilityStreakMonths),
      communityChitRepaymentRate: Number(communityChitRate),
      consentGiven: true,
      consentTimestamp: new Date().toISOString(),
      cashflows: [
        { month: 'Jun', income: monthlyIncome * 0.92, expenses: monthlyIncome * 0.65, savings: monthlyIncome * 0.27, utilityPaidOnTime: true, rentPaidOnTime: true },
        { month: 'Jul', income: monthlyIncome * 0.95, expenses: monthlyIncome * 0.67, savings: monthlyIncome * 0.28, utilityPaidOnTime: true, rentPaidOnTime: true },
        { month: 'Aug', income: monthlyIncome * 1.05, expenses: monthlyIncome * 0.70, savings: monthlyIncome * 0.35, utilityPaidOnTime: true, rentPaidOnTime: true },
        { month: 'Sep', income: monthlyIncome * 1.0, expenses: monthlyIncome * 0.68, savings: monthlyIncome * 0.32, utilityPaidOnTime: true, rentPaidOnTime: true },
        { month: 'Oct', income: monthlyIncome * 1.15, expenses: monthlyIncome * 0.74, savings: monthlyIncome * 0.41, utilityPaidOnTime: true, rentPaidOnTime: true },
        { month: 'Nov', income: monthlyIncome, expenses: monthlyIncome * 0.66, savings: monthlyIncome * 0.34, utilityPaidOnTime: true, rentPaidOnTime: true }
      ],
      incomeSources: [
        { platformName: 'Primary Platform Earning', category: 'Logistics / Trade', tenureMonths: monthsOnPlatform, averageMonthlyEarnings: monthlyIncome * 0.75, verifiedVia: 'UPI_STATEMENT' },
        { platformName: 'Secondary Craft & Direct Sales', category: 'Micro Enterprise', tenureMonths: 8, averageMonthlyEarnings: monthlyIncome * 0.25, verifiedVia: 'UPI_STATEMENT' }
      ],
      utilityRecords: [
        { providerType: 'Electricity', monthsTracked: utilityStreakMonths, onTimePayments: utilityStreakMonths, latePayments: 0, averageBillAmount: 750 },
        { providerType: 'Mobile_Postpaid', monthsTracked: utilityStreakMonths, onTimePayments: utilityStreakMonths, latePayments: 0, averageBillAmount: 499 }
      ]
    };

    onProfileCreated(newProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border border-slate-700 max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400">
              <UserPlus className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">
                {t.evaluator.title}
              </h3>
              <p className="text-xs text-slate-400">
                {t.evaluator.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CSV Upload Section */}
        <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-200 flex items-center space-x-1.5">
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.evaluator.uploadTitle}</span>
            </span>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleDownloadSampleCsv}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition"
                title="Download sample unbanked cashflow CSV file"
              >
                <FileText className="w-3 h-3 text-cyan-400" />
                <span>{t.evaluator.sampleCsv}</span>
              </button>
              <label className="px-3 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center space-x-1">
                <span>{t.evaluator.chooseCsv}</span>
                <input type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
              </label>
            </div>
          </div>

          {csvFileName && (
            <p className="text-xs text-emerald-400 flex items-center space-x-1 mt-1 font-mono">
              <Check className="w-3.5 h-3.5" />
              <span>{t.evaluator.loaded} {csvFileName}</span>
            </p>
          )}

          {csvSuccessMessage && (
            <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-300">
              {csvSuccessMessage}
            </div>
          )}
        </div>

        {/* Manual Input Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-medium block mb-1">{t.evaluator.fullName}</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">{t.evaluator.occupation}</label>
              <input
                type="text"
                value={primaryOccupation}
                onChange={(e) => setPrimaryOccupation(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-slate-300 font-medium block mb-1">{t.evaluator.monthlyIncome}</label>
              <input
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                min={5000}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">{t.evaluator.utilityStreak}</label>
              <input
                type="number"
                value={utilityStreakMonths}
                onChange={(e) => setUtilityStreakMonths(Number(e.target.value))}
                min={0}
                max={48}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">{t.evaluator.emergencyBuffer}</label>
              <input
                type="number"
                value={emergencyBufferDays}
                onChange={(e) => setEmergencyBufferDays(Number(e.target.value))}
                min={0}
                max={120}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-slate-300 font-medium block mb-1">{t.evaluator.dtiRatio}</label>
              <input
                type="number"
                value={dtiRatio}
                onChange={(e) => setDtiRatio(Number(e.target.value))}
                min={0}
                max={70}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">{t.evaluator.digitalVolume}</label>
              <input
                type="number"
                value={digitalVolumeRatio}
                onChange={(e) => setDigitalVolumeRatio(Number(e.target.value))}
                min={0}
                max={100}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">{t.evaluator.platformTenure}</label>
              <input
                type="number"
                value={monthsOnPlatform}
                onChange={(e) => setMonthsOnPlatform(Number(e.target.value))}
                min={1}
                max={60}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="ruralCohortCheck"
              checked={isRural}
              onChange={(e) => setIsRural(e.target.checked)}
              className="rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-0"
            />
            <label htmlFor="ruralCohortCheck" className="text-slate-300 cursor-pointer">
              {t.evaluator.ruralCohort}
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-600/30 flex items-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.evaluator.evaluateBtn}</span>
            </button>
          </div>
        </form>

      </div>
    </div>

  );
};
