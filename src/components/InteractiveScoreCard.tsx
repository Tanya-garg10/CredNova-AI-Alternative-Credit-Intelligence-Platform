import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  Sparkles, 
  HelpCircle, 
  Zap, 
  Smartphone, 
  Users, 
  Layers, 
  AlertCircle 
} from 'lucide-react';
import { ScoringResult, RiskCategory } from '../types';

interface InteractiveScoreCardProps {
  score: number;
  scoring: ScoringResult;
  onExploreFactors?: () => void;
}

export const InteractiveScoreCard: React.FC<InteractiveScoreCardProps> = ({
  score,
  scoring,
  onExploreFactors
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [hoveredFactor, setHoveredFactor] = useState<string | null>(null);

  // Smooth counting animation on score change or initial mount
  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1400; // ms
    const target = score;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(easedProgress * target));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [score]);

  // Radius for outer and inner progress rings
  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedScore / 1000) * circumference;

  // Secondary ring: Financial Stability Index
  const stabilityRadius = 54;
  const stabilityCircumference = stabilityRadius * 2 * Math.PI;
  const stabilityDashoffset = stabilityCircumference - (scoring.financialStabilityIndex / 100) * stabilityCircumference;

  // Color selection
  let tierColor = '#10D6A0';
  let tierLabel = 'Prime Standing';
  let tierBadge = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  
  if (score >= 750) {
    tierColor = '#10D6A0';
    tierLabel = 'Prime (Low Risk)';
    tierBadge = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  } else if (score >= 660) {
    tierColor = '#35C8FF';
    tierLabel = 'Near-Prime (Good)';
    tierBadge = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
  } else if (score >= 520) {
    tierColor = '#F59E0B';
    tierLabel = 'Fair (Moderate Risk)';
    tierBadge = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  } else {
    tierColor = '#F43F5E';
    tierLabel = 'High Risk';
    tierBadge = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  }

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden transition-all duration-300">
      
      {/* Background ambient radial glow */}
      <div 
        className="absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: tierColor }}
      />

      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Alternative Credit Score Vector
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Calibrated Multi-Parameter Intelligence (Scale: 0 – 1000)
            </p>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${tierBadge}`}>
          {tierLabel}
        </span>
      </div>

      {/* Center 3D-inspired concentric circular gauge */}
      <div className="my-6 flex flex-col md:flex-row items-center justify-around gap-6">
        
        {/* Circular SVG Rings */}
        <div className="relative w-56 h-56 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 200 200">
            {/* Outer Track */}
            <circle
              stroke="#101B2D"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx="100"
              cy="100"
            />
            {/* Outer Score Ring */}
            <circle
              stroke={tierColor}
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={`${circumference} ${circumference}`}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx="100"
              cy="100"
              className="transition-all duration-700 ease-out"
            />

            {/* Inner Stability Track */}
            <circle
              stroke="#0B1322"
              fill="transparent"
              strokeWidth={6}
              r={stabilityRadius}
              cx="100"
              cy="100"
            />
            {/* Inner Stability Ring */}
            <circle
              stroke="#35C8FF"
              fill="transparent"
              strokeWidth={6}
              strokeDasharray={`${stabilityCircumference} ${stabilityCircumference}`}
              style={{ strokeDashoffset: stabilityDashoffset }}
              strokeLinecap="round"
              r={stabilityRadius}
              cx="100"
              cy="100"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Center Numerical readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-4xl md:text-5xl font-black font-mono tracking-tight text-white drop-shadow-md">
              {animatedScore}
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mt-0.5">
              out of 1000
            </span>
            <span className="text-[11px] font-semibold text-cyan-400 font-mono mt-1">
              Stability: {scoring.financialStabilityIndex}%
            </span>
          </div>
        </div>

        {/* Dynamic Metric Pillars */}
        <div className="flex-1 space-y-3 w-full">
          <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
            
            <div 
              onMouseEnter={() => setHoveredFactor('utility')}
              onMouseLeave={() => setHoveredFactor(null)}
              className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 transition cursor-pointer"
            >
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span className="flex items-center space-x-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Utility Streak</span>
                </span>
                <span className="text-emerald-400 font-bold">+78 pts</span>
              </div>
              <div className="mt-1 text-sm font-bold text-white font-mono">18 Mo 100%</div>
            </div>

            <div 
              onMouseEnter={() => setHoveredFactor('upi')}
              onMouseLeave={() => setHoveredFactor(null)}
              className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/40 transition cursor-pointer"
            >
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span className="flex items-center space-x-1">
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Digital UPI</span>
                </span>
                <span className="text-cyan-400 font-bold">+35 pts</span>
              </div>
              <div className="mt-1 text-sm font-bold text-white font-mono">92% Volume</div>
            </div>

            <div 
              onMouseEnter={() => setHoveredFactor('shg')}
              onMouseLeave={() => setHoveredFactor(null)}
              className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-purple-500/40 transition cursor-pointer"
            >
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span className="flex items-center space-x-1">
                  <Users className="w-3.5 h-3.5 text-purple-400" />
                  <span>Community SHG</span>
                </span>
                <span className="text-purple-400 font-bold">+65 pts</span>
              </div>
              <div className="mt-1 text-sm font-bold text-white font-mono">98% Record</div>
            </div>

            <div 
              onMouseEnter={() => setHoveredFactor('dti')}
              onMouseLeave={() => setHoveredFactor(null)}
              className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 transition cursor-pointer"
            >
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span className="flex items-center space-x-1">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Existing DTI</span>
                </span>
                <span className="text-emerald-400 font-bold">+44 pts</span>
              </div>
              <div className="mt-1 text-sm font-bold text-emerald-400 font-mono">14.5% Safe</div>
            </div>

          </div>

          {/* Contextual Factor Explanation Bubble */}
          <div className="p-3 rounded-2xl bg-[#080D18]/90 border border-slate-800 text-xs text-slate-300">
            {hoveredFactor === 'utility' && (
              <span className="text-emerald-300">
                ⚡ <strong>Utility Streak:</strong> 18 consecutive months of zero-delay payments on electricity & mobile postpaid proof bills.
              </span>
            )}
            {hoveredFactor === 'upi' && (
              <span className="text-cyan-300">
                📱 <strong>Digital UPI Volume:</strong> 92% of all customer transactions flow through immutable digital QR ledgers.
              </span>
            )}
            {hoveredFactor === 'shg' && (
              <span className="text-purple-300">
                🤝 <strong>Community SHG:</strong> Exemplary micro-savings participation in local women and artisan collectives.
              </span>
            )}
            {hoveredFactor === 'dti' && (
              <span className="text-emerald-300">
                ⚖️ <strong>Low Debt Burden:</strong> Existing monthly obligations absorb only 14.5% of regular income.
              </span>
            )}
            {!hoveredFactor && (
              <span className="text-slate-400 flex items-center justify-between">
                <span>Hover over any metric pillar to inspect feature attributions</span>
                {onExploreFactors && (
                  <button 
                    onClick={onExploreFactors}
                    className="text-emerald-400 hover:underline font-semibold font-sans text-[11px]"
                  >
                    View All &rarr;
                  </button>
                )}
              </span>
            )}
          </div>
        </div>

      </div>

      {/* Recommended Loan Cap & APR Guidance Footnote */}
      <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <span className="text-slate-400 text-[11px] block">Recommended Micro-Cap</span>
          <span className="text-base font-bold text-emerald-400 font-mono">
            ₹{scoring.recommendedCreditLimitMax.toLocaleString('en-IN')}
          </span>
        </div>
        <div>
          <span className="text-slate-400 text-[11px] block">Indicative APR Range</span>
          <span className="text-base font-bold text-cyan-400 font-mono">
            {scoring.recommendedAprRange}
          </span>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <span className="text-slate-400 text-[11px] block">Calibrated Default Prob</span>
          <span className="text-base font-bold text-white font-mono">
            {(scoring.defaultProbability * 100).toFixed(1)}%
          </span>
        </div>
      </div>

    </div>
  );
};
