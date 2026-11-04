import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  Cpu, 
  Lock, 
  Globe, 
  Layers, 
  Users, 
  ChevronRight, 
  Scale, 
  Activity, 
  Zap, 
  Smartphone,
  Play,
  Award
} from 'lucide-react';
import { ThreeIntelligenceSphere } from './ThreeIntelligenceSphere';
import { BorrowerProfile, ScoringResult } from '../types';
import { Language, translations } from '../i18n/translations';

interface CinematicLandingPageProps {
  onLaunchPlatform: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenPassport: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  activeProfile: BorrowerProfile;
  scoringResult: ScoringResult;
}

export const CinematicLandingPage: React.FC<CinematicLandingPageProps> = ({
  onLaunchPlatform,
  onOpenAuth,
  onOpenPassport,
  language,
  onLanguageChange,
  activeProfile,
  scoringResult
}) => {
  const t = translations[language];
  const [selectedSphereNode, setSelectedSphereNode] = useState<string>('Utility Vector');

  // Interactive sandbox slider for quick landing page play
  const [sandboxIncome, setSandboxIncome] = useState<number>(32000);
  const [sandboxUtilityStreak, setSandboxUtilityStreak] = useState<number>(18);
  const [sandboxDti, setSandboxDti] = useState<number>(16);

  const sandboxScore = Math.min(940, Math.max(380, Math.round(
    540 + (sandboxUtilityStreak * 4.2) + (sandboxIncome > 25000 ? 60 : 20) - (sandboxDti * 2.8)
  )));

  return (
    <div className="min-h-screen bg-[#080D18] text-white selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden relative">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      {/* Landing Navigation Header */}
      <nav className="relative z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-300/30">
            <ShieldCheck className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-white">
                CredNova<span className="text-emerald-400">.AI</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] uppercase font-mono font-bold tracking-wider bg-emerald-950/80 text-emerald-300 rounded border border-emerald-500/30">
                HI-04 Unbanked
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono hidden md:block">
              Alternative Credit Intelligence
            </p>
          </div>
        </div>

        {/* Center Quick Links */}
        <div className="hidden lg:flex items-center space-x-6 text-xs font-medium text-slate-300">
          <a href="#sphere-section" className="hover:text-emerald-400 transition">3D Intelligence</a>
          <a href="#how-it-works" className="hover:text-emerald-400 transition">How It Works</a>
          <a href="#comparison" className="hover:text-emerald-400 transition">Legacy vs CredNova</a>
          <a href="#fairness" className="hover:text-emerald-400 transition">Fairness & Ethics</a>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          {/* Language Toggle */}
          <button
            onClick={() => onLanguageChange(language === 'en' ? 'hi' : 'en')}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/80 text-xs font-semibold text-slate-300 hover:text-white transition"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'en' ? 'हिंदी' : 'EN'}</span>
          </button>

          {/* Login Button */}
          <button
            onClick={() => onOpenAuth('login')}
            className="hidden sm:block px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition"
          >
            Sign In
          </button>

          {/* Main CTA */}
          <button
            onClick={onLaunchPlatform}
            className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02]"
          >
            <span>Launch Platform</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </nav>

      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 md:pt-16 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Bold Copy & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            
            {/* Tagline Pill */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-xs font-medium text-emerald-300 shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
              <span>Beyond Credit History. Towards Financial Inclusion.</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Credit Intelligence. <br />
              <span className="text-gradient-neo">Beyond Boundaries.</span>
            </h1>

            {/* Subheading */}
            <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Millions of gig workers, unbanked rural producers, and artisans are unjustly shut out of formal credit due to zero bureau histories. CredNova AI transforms verifiable cashflows, utility payment streaks, and platform tenure into explainable, institutional-grade credit intelligence.
            </p>

            {/* CTAs Row */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <button
                onClick={onLaunchPlatform}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-[1.03]"
              >
                <span>Explore Your Credit Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#comparison"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 text-white font-semibold text-sm flex items-center justify-center space-x-2 transition"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Discover CredNova</span>
              </a>
            </div>

            {/* Trust Highlights */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-left">
              <div>
                <span className="text-lg md:text-xl font-extrabold font-mono text-emerald-400 block">74.2%</span>
                <span className="text-[11px] text-slate-400">Approval Rate</span>
              </div>
              <div>
                <span className="text-lg md:text-xl font-extrabold font-mono text-cyan-400 block">0.884</span>
                <span className="text-[11px] text-slate-400">ROC-AUC Power</span>
              </div>
              <div>
                <span className="text-lg md:text-xl font-extrabold font-mono text-white block">0%</span>
                <span className="text-[11px] text-slate-400">Surveillance Data</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive 3D Sphere & Orbiting Glassmorphism Cards */}
          <div id="sphere-section" className="lg:col-span-6 relative flex items-center justify-center">
            
            {/* The Three.js 3D Sphere */}
            <div className="w-full h-[460px] md:h-[520px] relative z-10">
              <ThreeIntelligenceSphere 
                score={scoringResult.score} 
                onNodeClick={(name) => setSelectedSphereNode(name)}
              />
            </div>

            {/* Orbiting Floating Glass Card 1 (Top Left) */}
            <div className="absolute top-2 left-0 sm:left-4 z-20 glass-card p-3 rounded-2xl hidden sm:flex items-center space-x-3 shadow-xl border border-emerald-500/30 animate-pulse">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-mono block">Utility Streak</span>
                <span className="text-xs font-bold text-white font-mono">18 Mo 100% On-Time</span>
              </div>
            </div>

            {/* Orbiting Floating Glass Card 2 (Bottom Right) */}
            <div className="absolute bottom-6 right-0 sm:right-4 z-20 glass-card p-3 rounded-2xl hidden sm:flex items-center space-x-3 shadow-xl border border-cyan-500/30">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-mono block">UPI Footprint</span>
                <span className="text-xs font-bold text-cyan-300 font-mono">92% Digital Volume</span>
              </div>
            </div>

            {/* Orbiting Floating Glass Card 3 (Bottom Left) */}
            <div className="absolute bottom-4 left-4 z-20 glass-card p-2.5 rounded-xl hidden md:flex items-center space-x-2 border border-slate-700/80">
              <Scale className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-[10px] text-slate-300 font-mono">EEOC 4/5ths Rule Verified</span>
            </div>

          </div>

        </div>
      </section>

      {/* 2. LIVE INTERACTIVE METRIC PLAYGROUND */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/80">
        <div className="glass-card rounded-3xl p-6 md:p-10 border border-slate-800 shadow-2xl">
          
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1">
              Interactive Scoring Simulator
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              See How Alternative Data Elevates Your Score
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-2">
              Adjust monthly earnings, utility bill payment streaks, and debt obligations to witness real-time score calibration in action.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Interactive Sliders */}
            <div className="lg:col-span-7 space-y-6">
              
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-2">
                  <span>Average Monthly Income (UPI / DBT Verified)</span>
                  <span className="font-mono font-bold text-emerald-400">₹{sandboxIncome.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  id="sandbox-income"
                  name="sandbox-income"
                  min={12000}
                  max={75000}
                  step={1000}
                  value={sandboxIncome}
                  onChange={(e) => setSandboxIncome(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-2">
                  <span>Consecutive Utility & Mobile Bill On-Time Streak</span>
                  <span className="font-mono font-bold text-cyan-400">{sandboxUtilityStreak} Months</span>
                </div>
                <input
                  type="range"
                  id="sandbox-utility-streak"
                  name="sandbox-utility-streak"
                  min={1}
                  max={36}
                  step={1}
                  value={sandboxUtilityStreak}
                  onChange={(e) => setSandboxUtilityStreak(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-2">
                  <span>Current Debt-to-Income Obligation (DTI)</span>
                  <span className="font-mono font-bold text-amber-400">{sandboxDti}%</span>
                </div>
                <input
                  type="range"
                  id="sandbox-dti"
                  name="sandbox-dti"
                  min={5}
                  max={55}
                  step={1}
                  value={sandboxDti}
                  onChange={(e) => setSandboxDti(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

            </div>

            {/* Instant Calibrated Output Box */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 to-[#0B1322] p-6 rounded-2xl border border-emerald-500/30 text-center space-y-3 shadow-xl">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Calibrated Alternative Score
              </span>
              <div className="text-5xl font-black font-mono text-emerald-400 drop-shadow-[0_0_20px_rgba(16,214,160,0.4)]">
                {sandboxScore}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                sandboxScore >= 750 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                sandboxScore >= 660 ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {sandboxScore >= 750 ? 'Prime (Low Risk)' : sandboxScore >= 660 ? 'Near-Prime (Good)' : 'Fair Risk Standing'}
              </span>
              <p className="text-xs text-slate-400 pt-2 border-t border-slate-800">
                Qualifies for instant institutional micro-credit cap of ~₹{Math.round(sandboxIncome * 1.8).toLocaleString('en-IN')}.
              </p>
              <button
                onClick={onLaunchPlatform}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition"
              >
                Inspect Full Borrower Dossier
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 3. LEGACY CREDIT BUREAUS VS CREDNOVA AI */}
      <section id="comparison" className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1">
            Systemic Paradigm Shift
          </span>
          <h2 className="text-3xl font-extrabold text-white">
            Traditional Bureaus vs CredNova AI
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-2">
            Why conventional banking algorithms reject 70%+ of informal earners, and how CredNova solves it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Legacy Bureau Card */}
          <div className="p-6 md:p-8 rounded-3xl bg-slate-950/60 border border-rose-500/20 space-y-4">
            <div className="flex items-center space-x-2 text-rose-400">
              <span className="text-lg font-bold">✕</span>
              <h3 className="text-base font-bold text-white">Traditional Credit Bureaus</h3>
            </div>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start space-x-2">
                <span className="text-rose-400 font-bold">•</span>
                <span><strong>Requires Credit Card / Loan History:</strong> Rejects any citizen with zero previous bank borrowings.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-rose-400 font-bold">•</span>
                <span><strong>Penalizes Irregular Gig Income:</strong> Flattens and rejects workers because monthly income oscillates.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-rose-400 font-bold">•</span>
                <span><strong>Ignores Utility Discipline:</strong> 5 years of perfect electricity and telecom payments count for zero points.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-rose-400 font-bold">•</span>
                <span><strong>Black-Box Scoring:</strong> Zero explainability on exact feature weights or rejection reasoning.</span>
              </li>
            </ul>
          </div>

          {/* CredNova AI Card */}
          <div className="p-6 md:p-8 rounded-3xl bg-emerald-950/20 border border-emerald-500/40 space-y-4 shadow-xl">
            <div className="flex items-center space-x-2 text-emerald-400">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">CredNova AI Alternative Intelligence</h3>
            </div>
            <ul className="space-y-3 text-xs text-emerald-100">
              <li className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Cashflow Over Collateral:</strong> Measures live UPI transaction volume and continuous merchant QR turnover.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Protected Gig Seasonality:</strong> Uses Baseline Sustainable Income (BSI) at safe floors rather than penalizing swings.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Utility Streak Attribution:</strong> Automatically awards up to +78 points for clean bill receipts.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Explainable AI (SHAP):</strong> Mathematical waterfall attribution for every single point of score impact.</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* 4. ETHICAL AI & PRIVACY ARCHITECTURE */}
      <section id="fairness" className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/80">
        <div className="glass-card rounded-3xl p-8 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center space-x-2 text-purple-400 text-xs font-mono font-bold">
              <Lock className="w-4 h-4" />
              <span>Zero Surveillance Guarantee</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white">
              No Phone Scraping. No SMS Reading. No Discrimination.
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Predatory apps spy on user contacts, private SMS, and live GPS to determine creditworthiness. CredNova strictly complies with the RBI Account Aggregator protocol and India’s DPDP Act 2023. We audit our model for demographic parity across rural, gender, and gig cohorts.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={onLaunchPlatform}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition text-center"
            >
              Audit Fairness Metrics
            </button>
            <button
              onClick={onOpenPassport}
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition text-center"
            >
              Download Sample Passport
            </button>
          </div>
        </div>
      </section>

      {/* Landing Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-8 text-xs text-slate-400 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white">CredNova AI</span>
            <span>—</span>
            <span>HI-04 Alternative Credit Scoring for the Unbanked</span>
          </div>
          <div className="flex items-center space-x-4 text-slate-500 font-mono text-[11px]">
            <span>Calibrated Gradient Boost ML</span>
            <span>•</span>
            <span>EEOC Compliant</span>
            <span>•</span>
            <span>Account Aggregator Framework</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
