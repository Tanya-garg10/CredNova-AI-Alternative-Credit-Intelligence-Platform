import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle, 
  Info, 
  Lightbulb, 
  TrendingUp, 
  Sparkles, 
  Calendar,
  Layers
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell, 
  ReferenceLine,
  CartesianGrid
} from 'recharts';
import { ScoringResult, FeatureContribution } from '../types';
import { Language, translations } from '../i18n/translations';

interface ExplainMyScoreProps {
  scoring: ScoringResult;
  language: Language;
}

export const ExplainMyScore: React.FC<ExplainMyScoreProps> = ({ scoring, language }) => {
  const t = translations[language];
  const [selectedFeature, setSelectedFeature] = useState<FeatureContribution | null>(
    scoring.featureContributions[0] || null
  );

  const baseScore = 540;
  const positiveFactors = scoring.featureContributions.filter(f => f.impactScore > 0);
  const negativeFactors = scoring.featureContributions.filter(f => f.impactScore < 0);

  // Data for SHAP-style Waterfall Attribution Chart
  interface WaterfallPoint {
    name: string;
    fullName?: string;
    points: number;
    isBase?: boolean;
    isPositive?: boolean;
    isTotal?: boolean;
  }

  const waterfallData: WaterfallPoint[] = [
    { name: language === 'hi' ? 'आधारभूत अपेक्षा' : 'Baseline Expectation', points: baseScore, isBase: true },
    ...scoring.featureContributions.map(f => ({
      name: language === 'hi' ? f.featureNameHindi.split(' ')[0] : f.featureName.split(' ')[0],
      fullName: language === 'hi' ? f.featureNameHindi : f.featureName,
      points: f.impactScore,
      isPositive: f.impactScore > 0
    })),
    { name: language === 'hi' ? 'अंतिम स्कोर' : 'Final Score', points: scoring.score, isTotal: true }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {t.xai.title}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {t.xai.subtitle}
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800">
            <div>
              <span className="text-[11px] text-slate-400 block">{t.xai.baselineValue}</span>
              <span className="text-sm font-bold font-mono text-slate-300">{baseScore}</span>
            </div>
            <div className="text-slate-600 font-bold">&rarr;</div>
            <div>
              <span className="text-[11px] text-emerald-400 block">{t.xai.netAttribution}</span>
              <span className="text-sm font-bold font-mono text-emerald-400">
                {scoring.score - baseScore >= 0 ? `+${scoring.score - baseScore}` : `${scoring.score - baseScore}`} {t.common.scorePoints}
              </span>
            </div>
            <div className="text-slate-600 font-bold">&rarr;</div>
            <div>
              <span className="text-[11px] text-white block">{t.xai.finalScore}</span>
              <span className="text-sm font-bold font-mono text-white">{scoring.score}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-slate-950/50 rounded-xl border border-slate-800/80 text-xs text-slate-400 flex items-center space-x-2">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{t.xai.noBlackBox}</span>
        </div>
      </div>

      {/* SHAP Feature Contribution Waterfall Visualization */}
      <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">
              {t.xai.waterfallTitle}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'hi' 
                ? 'आधारभूत अपेक्षा से प्रत्येक बिंदु के विचलन को स्पष्ट रूप से दर्शाने वाला योगात्मक SHAP चार्ट' 
                : 'Additive SHAP decomposition explaining every single point deviation from baseline unbanked expectation'}
            </p>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <span className="flex items-center space-x-1 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
              <span>{t.xai.positiveImpact}</span>
            </span>
            <span className="flex items-center space-x-1 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block" />
              <span>{t.xai.riskDrag}</span>
            </span>
            <span className="flex items-center space-x-1 text-blue-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block" />
              <span>{t.xai.scorePillars}</span>
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={waterfallData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                formatter={(val: any) => [`${Number(val || 0) > 0 ? `+${val}` : val} ${t.common.scorePoints}`, language === 'hi' ? 'स्कोर प्रभाव' : 'Score Impact']}
              />
              <ReferenceLine y={0} stroke="#475569" />
              <Bar dataKey="points" radius={[4, 4, 0, 0]}>
                {waterfallData.map((entry, index) => {
                  let color = '#3B82F6';
                  if (entry.isBase || entry.isTotal) color = '#3B82F6';
                  else if (entry.isPositive) color = '#10B981';
                  else color = '#F43F5E';
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Columns: Positive Factors vs Negative Factors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Positive Factors Column */}
        <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-xl">
          <div className="flex items-center space-x-2 text-emerald-400 mb-4 pb-3 border-b border-slate-800">
            <ArrowUpRight className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white">
              {t.xai.positiveImpacts}
            </h3>
          </div>

          <div className="space-y-3">
            {positiveFactors.map((feat, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedFeature(feat)}
                className={`p-3.5 rounded-xl border transition cursor-pointer ${
                  selectedFeature?.featureKey === feat.featureKey
                    ? 'bg-emerald-950/30 border-emerald-500/50 ring-1 ring-emerald-500/30'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    {language === 'hi' ? feat.featureNameHindi : feat.featureName}
                  </span>
                  <span className="text-xs font-bold font-mono text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                    +{feat.impactScore} {t.common.scorePoints}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-2">
                  {language === 'hi' ? feat.explanationHindi : feat.explanation}
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                  <span>{t.xai.auditedEvidence} <strong className="text-slate-200">{feat.rawValue}</strong></span>
                  <span className="text-emerald-400 font-medium">{t.xai.clickToInspect}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Negative Factors Column */}
        <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-xl">
          <div className="flex items-center space-x-2 text-rose-400 mb-4 pb-3 border-b border-slate-800">
            <ArrowDownRight className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white">
              {t.xai.negativeImpacts}
            </h3>
          </div>

          <div className="space-y-3">
            {negativeFactors.length > 0 ? (
              negativeFactors.map((feat, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedFeature(feat)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    selectedFeature?.featureKey === feat.featureKey
                      ? 'bg-rose-950/30 border-rose-500/50 ring-1 ring-rose-500/30'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      {language === 'hi' ? feat.featureNameHindi : feat.featureName}
                    </span>
                    <span className="text-xs font-bold font-mono text-rose-400 px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20">
                      {feat.impactScore} {t.common.scorePoints}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2">
                    {language === 'hi' ? feat.explanationHindi : feat.explanation}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                    <span>{t.xai.observedMetric} <strong className="text-slate-200">{feat.rawValue}</strong></span>
                    <span className="text-rose-400 font-medium">{t.xai.actionRecommended}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-400 text-xs">
                {t.xai.noPenalties}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Selected Feature Deep Dive Inspector & Action Plan */}
      {selectedFeature && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-6 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold text-white">
                {t.xai.deepDive} {language === 'hi' ? selectedFeature.featureNameHindi : selectedFeature.featureName}
              </h4>
            </div>
            <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold font-mono ${
              selectedFeature.impactScore >= 0
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
              {selectedFeature.impactScore >= 0 ? `+${selectedFeature.impactScore}` : selectedFeature.impactScore} {t.common.scorePoints}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-400 block font-semibold mb-1">{t.xai.mathAttributionRationale}</span>
              <p className="text-slate-300 leading-relaxed">
                {language === 'hi' ? selectedFeature.explanationHindi : selectedFeature.explanation}
              </p>
            </div>

            <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-500/30">
              <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold mb-1">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{t.xai.actionableImprovementStep}</span>
              </div>
              <p className="text-emerald-200 leading-relaxed">
                {language === 'hi' ? selectedFeature.recommendationHindi : selectedFeature.recommendation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actionable 90-Day Score Improvement Roadmap */}
      <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              {t.xai.actionPlanTitle}
            </h3>
          </div>
          <span className="text-xs text-emerald-400 font-medium font-mono">
            {t.xai.potentialGain}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scoring.actionableRoadmap.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400">
                    {language === 'hi' ? `${item.targetDays} दिन माइलस्टोन` : `Day ${item.targetDays} Milestone`}
                  </span>
                  <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    +{item.expectedScoreGain} {t.common.scorePoints}
                  </span>
                </div>
                <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                  {language === 'hi' ? item.actionHindi : item.action}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center text-[11px] text-slate-400">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mr-1" />
                <span>{t.xai.autoVerifiedUpi}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
