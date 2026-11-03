import React, { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';

interface PageLoaderProps {
  onComplete?: () => void;
  durationMs?: number;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  onComplete,
  durationMs = 1500
}) => {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const current = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgress(current);

      if (current >= 100) {
        clearInterval(interval);
        setIsFading(true);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 350);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [durationMs, onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 bg-[#080D18] flex flex-col items-center justify-center p-4 transition-opacity duration-300 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* 3D-inspired concentric rotating rings */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
        
        {/* Inner cyan ring */}
        <div className="absolute inset-2 rounded-full border border-cyan-500/30 border-b-cyan-400 animate-[spin_1.5s_linear_infinite_reverse]" />

        {/* Center Emblem */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/30">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Brand Title */}
      <div className="mt-8 text-center space-y-1">
        <h2 className="text-xl font-extrabold tracking-tight text-white">
          CredNova<span className="text-emerald-400">.AI</span>
        </h2>
        <p className="text-xs text-slate-400 font-mono">
          Initializing 3D Neural Alternative Credit Engine...
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mt-6 w-52 bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
        <div
          className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-75"
          style={{ width: `${progress}%` }}
        />
      </div>

      <span className="text-[11px] font-mono text-emerald-400 mt-2">
        {progress}%
      </span>
    </div>
  );
};
