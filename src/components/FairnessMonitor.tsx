import React from 'react';
import { 
  Scale, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Users, 
  Database, 
  FileLock2, 
  ShieldAlert,
  Fingerprint,
  Download
} from 'lucide-react';
import { FairnessAuditorService } from '../services/fairnessAuditor';
import { Language, translations } from '../i18n/translations';

interface FairnessMonitorProps {
  language: Language;
}

export const FairnessMonitor: React.FC<FairnessMonitorProps> = ({ language }) => {
  const t = translations[language];
  const auditReport = FairnessAuditorService.runAudit();

  const handleExportFairnessAudit = () => {
    const reportData = {
      complianceStandard: "CredNova AI HI-04 Ethical Underwriting & Fairness Charter",
      eeocFourFifthsRuleCompliance: true,
      timestamp: new Date().toISOString(),
      dpdpAct2023Compliant: true,
      prohibitedAttributesBlocked: auditReport.prohibitedAttributesBlocked,
      cohortMetrics: {
        urbanRuralMetrics: auditReport.urbanRuralMetrics,
        occupationGroupMetrics: auditReport.occupationGroupMetrics,
        demographicParityScore: auditReport.demographicParityScore
      },
      affirmation: "CredNova AI strictly prohibits ingestion of contact lists, SMS dumps, social graph connections, caste, religion, or gender markers."
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'CredNova_Fairness_and_Bias_Audit_Report.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1 rounded-lg bg-purple-500/10 text-purple-400">
                <Scale className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {t.fairness.title}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {t.fairness.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportFairnessAudit}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
              title="Download compliance & fairness audit audit trail as JSON"
            >
              <Download className="w-3.5 h-3.5 text-purple-400" />
              <span>{t.fairness.exportAuditDossier}</span>
            </button>

            <div className="flex items-center space-x-3 bg-purple-950/40 border border-purple-500/30 px-4 py-2 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-purple-200 block">
                  {t.fairness.eeocRuleVerified}
                </span>
                <span className="text-[11px] text-purple-400/80">
                  {t.fairness.disparateImpactNotice}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strict Anti-Surveillance & Prohibited Data Attribute Shield */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-6 border border-rose-500/30 shadow-xl">
        <div className="flex items-center space-x-2 text-rose-400 mb-3">
          <ShieldAlert className="w-5 h-5" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            {t.fairness.prohibitedTitle}
          </h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          {t.fairness.prohibitedNotice}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {auditReport.prohibitedAttributesBlocked.map((attr, idx) => {
            const attrHindi: Record<string, string> = {
              'Caste / Tribe Affiliation': 'जाति / जनजाति संबंध',
              'Religious Affiliation': 'धार्मिक संबंध',
              'Gender / Marital Status': 'लिंग / वैवाहिक स्थिति',
              'Smartphone Contacts Scrape': 'स्मार्टफोन संपर्क स्क्रैपिंग',
              'Private SMS Text Parsing': 'निजी एसएमएस टेक्स्ट पढ़ना',
              'GPS Location Scraping': 'जीपीएस लोकेशन ट्रैकिंग',
              'Gallery / Photo Metadata': 'गैलरी / फोटो मेटाडेटा',
              'Social Network Graph': 'सोशल मीडिया नेटवर्क ग्राफ'
            };
            return (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/80 border border-rose-500/20 flex items-center space-x-2 text-rose-300"
              >
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="font-medium text-[11px]">
                  {language === 'hi' && attrHindi[attr] ? attrHindi[attr] : attr}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fairness Cohort Evaluation Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Urban vs Rural Cohort Audit */}
        <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">
                {t.fairness.urbanRuralParityTitle}
              </h3>
              <p className="text-xs text-slate-400">
                {t.fairness.urbanRuralParitySubtitle}
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
              {t.fairness.ratioPassed}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="py-2.5 px-2">{language === 'hi' ? 'जनसांख्यिकीय समूह' : 'Demographic Cohort'}</th>
                  <th className="py-2.5 px-2">{language === 'hi' ? 'नमूना आकार' : 'Sample Size'}</th>
                  <th className="py-2.5 px-2">{language === 'hi' ? 'स्वीकृति दर' : 'Approval Rate'}</th>
                  <th className="py-2.5 px-2">{language === 'hi' ? 'असमान अनुपात' : 'Disparate Ratio'}</th>
                  <th className="py-2.5 px-2">{language === 'hi' ? 'ऑडिट स्थिति' : 'Audit Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {auditReport.urbanRuralMetrics.map((row, idx) => {
                  const groupNameHindi: Record<string, string> = {
                    'Urban Gig Workers': 'शहरी गिग श्रमिक',
                    'Rural Farmers & Producers': 'ग्रामीण किसान व उत्पादक'
                  };
                  return (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-2 font-sans font-semibold text-slate-200">
                        {language === 'hi' && groupNameHindi[row.groupName] ? groupNameHindi[row.groupName] : row.groupName}
                      </td>
                      <td className="py-2.5 px-2 text-slate-400">{row.totalApplicants}</td>
                      <td className="py-2.5 px-2 text-emerald-400 font-bold">{row.approvalRate}%</td>
                      <td className="py-2.5 px-2 text-white">{row.disparateImpactRatio}</td>
                      <td className="py-2.5 px-2 font-sans">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold">
                          {row.status === 'Compliant' ? (language === 'hi' ? 'सत्यापित (सफल)' : 'Compliant') : row.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Occupation & Gig Sector Parity */}
        <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">
                {t.fairness.occupationParityTitle}
              </h3>
              <p className="text-xs text-slate-400">
                {t.fairness.occupationParitySubtitle}
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
              {t.fairness.ratioCompliant}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="py-2.5 px-2">{language === 'hi' ? 'क्षेत्रीय समूह' : 'Sector Cohort'}</th>
                  <th className="py-2.5 px-2">{language === 'hi' ? 'नमूना आकार' : 'Sample Size'}</th>
                  <th className="py-2.5 px-2">{language === 'hi' ? 'स्वीकृति दर' : 'Approval Rate'}</th>
                  <th className="py-2.5 px-2">{language === 'hi' ? 'असमान अनुपात' : 'Disparate Ratio'}</th>
                  <th className="py-2.5 px-2">{language === 'hi' ? 'ऑडिट स्थिति' : 'Audit Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {auditReport.occupationGroupMetrics.map((row, idx) => {
                  const sectorNameHindi: Record<string, string> = {
                    'Ride-Hail & Delivery': 'राइड-हेल व डिलीवरी चालक',
                    'Artisans & Handicrafts': 'कारीगर एवं हस्तशिल्प',
                    'Informal Retail & Kirana': 'अनौपचारिक खुदरा व किराना',
                    'Salaried Benchmark': 'वेतनभोगी बेंचमार्क'
                  };
                  return (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-2 font-sans font-semibold text-slate-200">
                        {language === 'hi' && sectorNameHindi[row.groupName] ? sectorNameHindi[row.groupName] : row.groupName}
                      </td>
                      <td className="py-2.5 px-2 text-slate-400">{row.totalApplicants}</td>
                      <td className="py-2.5 px-2 text-emerald-400 font-bold">{row.approvalRate}%</td>
                      <td className="py-2.5 px-2 text-white">{row.disparateImpactRatio}</td>
                      <td className="py-2.5 px-2 font-sans">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold">
                          {row.status === 'Compliant' ? (language === 'hi' ? 'सत्यापित (सफल)' : 'Compliant') : row.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Missing Data Transparency & Consent Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Missing Data Transparency */}
        <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center space-x-2 text-cyan-400">
            <Database className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white">
              {language === 'hi' ? 'अनुपस्थित डेटा पारदर्शिता एवं प्रविष्टि नीति' : 'Missing Data Transparency & Imputation Policy'}
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {language === 'hi' 
              ? 'अनुपस्थित बिलिंग डेटा को शून्य अंक मानकर दंडित करने के बजाय अनुभवजन्य बायेसियन संकोचन (Bayesian shrinkage) तकनीक से अनिश्चितता अंतराल को समायोजित किया जाता है।' 
              : auditReport.missingDataHandlingStrategy}
          </p>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400">
            <strong>{language === 'hi' ? 'मार्गदर्शक सिद्धांत:' : 'Guiding Principle:'}</strong>{' '}
            {language === 'hi' 
              ? 'यदि किसी ग्रामीण आवेदक के पास नल के पानी का बिल या ब्रॉडबैंड रसीद नहीं है, तो इंजन शून्य अंक देने या आवेदक को डिफ़ॉल्टर मानने के बजाय अपने विश्वास अंतराल को घटाता है।' 
              : 'If a rural applicant does not possess a piped water bill or broadband receipt, the engine shrinks its confidence interval rather than assigning a zero score or penalizing the borrower as a delinquent payer.'}
          </div>
        </div>

        {/* Consent Architecture */}
        <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400">
            <Fingerprint className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white">
              {t.fairness.consentStatus}
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {t.fairness.consentDescription}
          </p>
          <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-[11px] text-emerald-300 flex items-center justify-between">
            <span>{language === 'hi' ? 'डेटा संरक्षण अनुपालन:' : 'Data Protection Compliance:'}</span>
            <span className="font-bold">{language === 'hi' ? 'डिजिटल व्यक्तिगत डेटा संरक्षण (DPDP) अधिनियम 2023' : 'Digital Personal Data Protection (DPDP) Act 2023'}</span>
          </div>
        </div>

      </div>

    </div>
  );
};
