import React from 'react';
import { 
  X, 
  Cpu, 
  CheckCircle2, 
  BarChart2, 
  Layers, 
  ShieldCheck, 
  Activity, 
  Sparkles,
  Download
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';

interface ModelMetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const ModelMetricsModal: React.FC<ModelMetricsModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  const t = translations[language];

  if (!isOpen) return null;

  const handleDownloadSpecs = () => {
    const specs = {
      modelName: "CredNova Alternative Credit Scoring Engine v2.4",
      architecture: "Calibrated Gradient Boosting Classifier with Platt Sigmoid Scaling",
      targetProblem: "HI-04: Alternative Credit Scoring for the Unbanked",
      validationMetrics: {
        rocAuc: 0.884,
        giniCoefficient: 0.768,
        ksStatisticPercent: 46.2,
        brierScoreLoss: 0.112,
        unbankedBaselineIntercept: 540,
        scoreRange: [0, 1000]
      },
      fairnessAudit: {
        disparateImpactRatioUrbanRural: 0.968,
        fourFifthsRuleCompliance: "PASSED (0.968 >= 0.80)",
        protectedAttributesExcluded: ["caste", "religion", "gender", "race", "social_connections", "sms_contacts"]
      },
      featureImportanceWeights: [
        { feature: "Utility Payment Streak & Discipline", weight: 0.248 },
        { feature: "Community SHG & Peer Repayment Reliability", weight: 0.212 },
        { feature: "Liquid Emergency Savings Buffer", weight: 0.185 },
        { feature: "Debt-to-Income (DTI) Ratio Burden", weight: 0.140 },
        { feature: "Gig Platform Seniority & Active Tenure", weight: 0.115 },
        { feature: "Digital UPI Cashflow Footprint", weight: 0.100 }
      ],
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(specs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'CredNova_Model_Architecture_Specs.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const featureRankingEn = [
    { name: 'Utility Payment Streak & Discipline', weight: '24.8%', icon: '⚡' },
    { name: 'Community SHG & Peer Repayment Reliability', weight: '21.2%', icon: '🤝' },
    { name: 'Liquid Emergency Savings Buffer (Days)', weight: '18.5%', icon: '🛡️' },
    { name: 'Debt-to-Income (DTI) Obligation Burden', weight: '14.0%', icon: '⚖️' },
    { name: 'Gig Platform Seniority & Tenure', weight: '11.5%', icon: '💼' },
    { name: 'Digital UPI Cashflow Footprint', weight: '10.0%', icon: '📱' },
  ];

  const featureRankingHi = [
    { name: 'बिल भुगतान स्ट्रीक व अनुशासन', weight: '24.8%', icon: '⚡' },
    { name: 'सामुदायिक SHG पुनर्भुगतान विश्वसनीयता', weight: '21.2%', icon: '🤝' },
    { name: 'तरल आपातकालीन बचत बफर (दिन)', weight: '18.5%', icon: '🛡️' },
    { name: 'ऋण-से-आय (DTI) दायित्व भार', weight: '14.0%', icon: '⚖️' },
    { name: 'गिग प्लेटफॉर्म कार्यकाल व वरिष्ठता', weight: '11.5%', icon: '💼' },
    { name: 'डिजिटल यूपीआई नकदी प्रवाह पदचिह्न', weight: '10.0%', icon: '📱' },
  ];

  const featureRanking = language === 'hi' ? featureRankingHi : featureRankingEn;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-3xl border border-slate-700 max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 md:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {t.metricsModal.title}
              </h3>
              <p className="text-xs text-slate-400">
                {t.metricsModal.subtitle}
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

        {/* Core Statistical Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">{t.metricsModal.rocAuc}</span>
            <span className="text-2xl font-bold font-mono text-emerald-400">0.884</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">{t.metricsModal.highDiscrim}</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">{t.metricsModal.gini}</span>
            <span className="text-2xl font-bold font-mono text-blue-400">0.768</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">2 * AUC - 1</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">{t.metricsModal.ks}</span>
            <span className="text-2xl font-bold font-mono text-cyan-400">46.2%</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">{t.metricsModal.decile}</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">{t.metricsModal.brier}</span>
            <span className="text-2xl font-bold font-mono text-purple-400">0.112</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">{t.metricsModal.calibrated}</span>
          </div>
        </div>

        {/* Feature Importance Table */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center space-x-2">
            <BarChart2 className="w-4 h-4 text-emerald-400" />
            <span>{t.metricsModal.featureRankingTitle}</span>
          </h4>
          <p className="text-xs text-slate-400">
            {t.metricsModal.featureRankingSubtitle}
          </p>

          <div className="space-y-2 mt-2 text-xs">
            {featureRanking.map((feat, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
                <div className="flex items-center space-x-2.5">
                  <span className="text-sm">{feat.icon}</span>
                  <span className="font-semibold text-slate-200">{feat.name}</span>
                </div>
                <span className="font-mono font-bold text-emerald-400">{feat.weight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-bold text-white block">{t.metricsModal.pipeline1Title}</span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {t.metricsModal.pipeline1Desc}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-bold text-white block">{t.metricsModal.pipeline2Title}</span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {t.metricsModal.pipeline2Desc}
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={handleDownloadSpecs}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.metricsModal.downloadSpecs}</span>
          </button>
          
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/30 transition"
          >
            {t.metricsModal.closeBtn}
          </button>
        </div>

      </div>
    </div>
  );
};
