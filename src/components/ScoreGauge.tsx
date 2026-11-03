import React from 'react';
import { RiskCategory } from '../types';

interface ScoreGaugeProps {
  score: number;
  category: RiskCategory;
  percentile?: number;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, category, percentile = 74 }) => {
  // Angle calculations for semi-circle arc (180 degrees, from -180 to 0 or 180 to 360)
  const minScore = 0;
  const maxScore = 1000;
  const clampedScore = Math.max(minScore, Math.min(maxScore, score));
  const percentage = (clampedScore - minScore) / (maxScore - minScore);
  
  // Circumference for r = 85
  const radius = 85;
  const circumference = Math.PI * radius; // Half-circle perimeter
  const strokeDashoffset = circumference * (1 - percentage);

  // Color selection
  let strokeColor = '#10B981'; // emerald
  let badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  let tierLabel = 'Prime Tier';
  
  if (score >= 750) {
    strokeColor = '#10B981';
    badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    tierLabel = 'Prime (Low Risk)';
  } else if (score >= 660) {
    strokeColor = '#3B82F6';
    badgeBg = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    tierLabel = 'Near-Prime (Good)';
  } else if (score >= 520) {
    strokeColor = '#F59E0B';
    badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    tierLabel = 'Fair (Moderate Risk)';
  } else {
    strokeColor = '#F43F5E';
    badgeBg = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    tierLabel = 'High Risk';
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-64 h-36 flex items-end justify-center">
        <svg className="w-64 h-36 overflow-visible" viewBox="0 0 200 110">
          <defs>
            <linearGradient id="scoreArcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F43F5E" />
              <stop offset="35%" stopColor="#F59E0B" />
              <stop offset="70%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
          
          {/* Background Track Arc */}
          <path
            d="M 15 100 A 85 85 0 0 1 185 100"
            fill="none"
            stroke="#1E293B"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Active Score Arc */}
          <path
            d="M 15 100 A 85 85 0 0 1 185 100"
            fill="none"
            stroke={strokeColor}
            strokeWidth="14"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Display */}
        <div className="absolute bottom-1 flex flex-col items-center text-center">
          <span className="text-4xl font-extrabold tracking-tight text-white font-mono">
            {clampedScore}
          </span>
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
            out of 1000
          </span>
        </div>
      </div>

      <div className="mt-2 flex flex-col items-center space-y-1.5">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badgeBg}`}>
          {tierLabel}
        </span>
        <p className="text-xs text-slate-400">
          Ranked in the top <span className="font-semibold text-slate-200">{percentile}%</span> of unbanked applicants
        </p>
      </div>

      <div className="w-full mt-4 flex justify-between text-[11px] text-slate-500 px-4 border-t border-slate-800/80 pt-2">
        <span>300 (Subprime)</span>
        <span>600 (Fair)</span>
        <span>750+ (Prime)</span>
      </div>
    </div>
  );
};
