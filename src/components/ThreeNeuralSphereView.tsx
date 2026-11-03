import React, { useState } from 'react';
import { 
  Cpu, 
  Sparkles, 
  Zap, 
  Smartphone, 
  Briefcase, 
  ShieldCheck, 
  Users, 
  Layers, 
  HelpCircle,
  Activity,
  ArrowRight
} from 'lucide-react';
import { ThreeIntelligenceSphere } from './ThreeIntelligenceSphere';
import { BorrowerProfile, ScoringResult } from '../types';
import { Language, translations } from '../i18n/translations';

interface ThreeNeuralSphereViewProps {
  profile: BorrowerProfile;
  scoring: ScoringResult;
  language: Language;
  onNavigateTab: (tabKey: 'explain' | 'gig' | 'simulator') => void;
}

export const ThreeNeuralSphereView: React.FC<ThreeNeuralSphereViewProps> = ({
  profile,
  scoring,
  language,
  onNavigateTab
}) => {
  const t = translations[language];
  const [selectedNode, setSelectedNode] = useState<string>('Utility Payment Consistency');

  const nodeDetailsEn: Record<string, { name: string; desc: string; impact: string; weight: string; icon: any }> = {
    'Utility Payment Consistency': {
      name: 'Utility Payment Consistency',
      desc: `${profile.utilityPaymentStreakMonths} consecutive months of flawless electricity, mobile recharge, and proof bill payments without a single late penalty.`,
      impact: '+78 Score Points Contributed',
      weight: '24.8% Model Weight',
      icon: Zap
    },
    'UPI Cashflow Velocity': {
      name: 'UPI Cashflow Velocity',
      desc: `${profile.digitalTransactionVolumeRatio}% of all incoming and outgoing cash flows verified through immutable digital UPI QR merchant ledgers.`,
      impact: '+35 Score Points Contributed',
      weight: '10.0% Model Weight',
      icon: Smartphone
    },
    'Platform Seniority': {
      name: 'Platform Seniority',
      desc: `${profile.monthsActiveOnPlatform} months active verified tenure on partner earning channels (Zomato/Blinkit/Dairy cooperative).`,
      impact: '+48 Score Points Contributed',
      weight: '11.5% Model Weight',
      icon: Briefcase
    },
    'Emergency Savings Cushion': {
      name: 'Emergency Savings Cushion',
      desc: `${profile.emergencySavingsBufferDays} days of basic living expenses retained in liquid micro-deposits, protecting against sudden income shocks.`,
      impact: '+52 Score Points Contributed',
      weight: '18.5% Model Weight',
      icon: ShieldCheck
    },
    'Community SHG Repayment': {
      name: 'Community SHG Repayment',
      desc: `${profile.communityChitRepaymentRate}% on-time repayment history across community self-help groups (SHG) and peer-to-peer micro-finance groups.`,
      impact: '+65 Score Points Contributed',
      weight: '21.2% Model Weight',
      icon: Users
    },
    'Debt-to-Income Discipline': {
      name: 'Debt-to-Income Discipline',
      desc: `Current monthly debt obligations consume only ${profile.debtToIncomeRatio}% of regular revenue, well inside prime safety thresholds (<20%).`,
      impact: '+44 Score Points Contributed',
      weight: '14.0% Model Weight',
      icon: Layers
    }
  };

  const nodeDetailsHi: Record<string, { name: string; desc: string; impact: string; weight: string; icon: any }> = {
    'Utility Payment Consistency': {
      name: 'बिल भुगतान नियमितता',
      desc: `${profile.utilityPaymentStreakMonths} महीने से लगातार बिना किसी पेनल्टी के बिजली, मोबाइल रिचार्ज और आवश्यक बिलों का 100% समय पर भुगतान।`,
      impact: '+78 स्कोर अंक योगदान',
      weight: '24.8% मॉडल भार',
      icon: Zap
    },
    'UPI Cashflow Velocity': {
      name: 'डिजिटल यूपीआई प्रवाह',
      desc: `${profile.digitalTransactionVolumeRatio}% आवक व जावक नकदी प्रवाह सुरक्षित डिजिटल यूपीआई क्यूआर मर्चेंट लेजर से सत्यापित।`,
      impact: '+35 स्कोर अंक योगदान',
      weight: '10.0% मॉडल भार',
      icon: Smartphone
    },
    'Platform Seniority': {
      name: 'प्लेटफॉर्म कार्यकाल व वरिष्ठता',
      desc: `${profile.monthsActiveOnPlatform} महीने से कमाई प्लेटफॉर्म (ज़ोमैटो/ब्लिंकिट/डेयरी) पर सक्रिय और सत्यापित कार्य अनुभव।`,
      impact: '+48 स्कोर अंक योगदान',
      weight: '11.5% मॉडल भार',
      icon: Briefcase
    },
    'Emergency Savings Cushion': {
      name: 'आपातकालीन बचत बफर',
      desc: `${profile.emergencySavingsBufferDays} दिनों का न्यूनतम जीवनयापन खर्च तरल माइक्रो-बचत में सुरक्षित, जो अचानक आय झटकों से बचाता है।`,
      impact: '+52 स्कोर अंक योगदान',
      weight: '18.5% मॉडल भार',
      icon: ShieldCheck
    },
    'Community SHG Repayment': {
      name: 'सामुदायिक SHG पुनर्भुगतान',
      desc: `${profile.communityChitRepaymentRate}% समय पर पुनर्भुगतान का इतिहास स्वयं सहायता समूहों (SHG) व सहकर्मी समूहों में।`,
      impact: '+65 स्कोर अंक योगदान',
      weight: '21.2% मॉडल भार',
      icon: Users
    },
    'Debt-to-Income Discipline': {
      name: 'ऋण-से-आय (DTI) अनुशासन',
      desc: `वर्तमान मासिक ऋण दायित्व नियमित राजस्व का केवल ${profile.debtToIncomeRatio}% हिस्सा लेते हैं, जो सुरक्षित सीमा (<20%) के अंदर है।`,
      impact: '+44 स्कोर अंक योगदान',
      weight: '14.0% मॉडल भार',
      icon: Layers
    }
  };

  const nodeDetails = language === 'hi' ? nodeDetailsHi : nodeDetailsEn;
  const activeDetail = nodeDetails[selectedNode] || nodeDetails['Utility Payment Consistency'];
  const ActiveIcon = activeDetail.icon;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Cpu className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                {t.sphere.title}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {t.sphere.subtitle}
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 text-xs font-mono">
            <span className="text-slate-400">{t.sphere.scoreIntercept}</span>
            <span className="text-emerald-400 font-bold">{scoring.score}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">{t.sphere.status}</span>
            <span className="text-cyan-400 font-bold">{scoring.riskCategory}</span>
          </div>
        </div>
      </div>

      {/* Main 3D Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* The 3D Canvas Box */}
        <div className="lg:col-span-8 glass-card rounded-3xl p-4 md:p-6 border border-slate-800 shadow-2xl relative overflow-hidden h-[480px] md:h-[540px]">
          {/* Subtle ambient corner labels */}
          <div className="absolute top-4 left-4 z-20 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
            {t.sphere.engine}
          </div>
          <div className="absolute top-4 right-4 z-20 text-[10px] font-mono text-emerald-400 bg-slate-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30">
            {t.sphere.clickNode}
          </div>

          <ThreeIntelligenceSphere 
            score={scoring.score} 
            onNodeClick={(name) => setSelectedNode(name)}
          />
        </div>

        {/* Selected Node Telemetry Inspector Panel */}
        <div className="lg:col-span-4 glass-card rounded-3xl p-6 border border-slate-800 shadow-2xl flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                {t.sphere.telemetryNode}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {t.sphere.liveAudited}
              </span>
            </div>

            <div className="mt-4 flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ActiveIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {activeDetail.name}
                </h3>
                <span className="text-xs font-mono text-cyan-400">
                  {activeDetail.weight}
                </span>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2 text-xs">
              <span className="text-[11px] font-mono uppercase text-slate-400 block font-semibold">
                {t.sphere.auditedEvidence}
              </span>
              <p className="text-slate-300 leading-relaxed text-xs">
                {activeDetail.desc}
              </p>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between font-mono text-xs">
                <span className="text-slate-400">{t.sphere.mathAttribution}</span>
                <span className="text-emerald-400 font-bold">{activeDetail.impact}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 pt-4 border-t border-slate-800/80 text-xs">
            <span className="text-slate-400 text-[11px] block">{t.sphere.quickActions}</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onNavigateTab('explain')}
                className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-center font-medium transition"
              >
                {t.sphere.shapBtn}
              </button>
              <button
                onClick={() => onNavigateTab('simulator')}
                className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-center font-bold transition shadow-lg shadow-emerald-600/20"
              >
                {t.sphere.simulateBtn}
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* 6 Credit Vector Pillars Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(nodeDetails).map(([key, data], idx) => {
          const Icon = data.icon;
          const isSelected = selectedNode === key;
          return (
            <div
              key={idx}
              onClick={() => setSelectedNode(key)}
              className={`glass-card p-4 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'border-emerald-500/60 bg-emerald-950/20 ring-1 ring-emerald-500/30'
                  : 'border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-xs text-white">{data.name}</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400">{data.weight}</span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2">
                {data.desc}
              </p>
              <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex justify-between items-center text-[10px] font-mono">
                <span className="text-emerald-400 font-semibold">{data.impact}</span>
                <span className="text-slate-500">{t.sphere.inspect}</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

