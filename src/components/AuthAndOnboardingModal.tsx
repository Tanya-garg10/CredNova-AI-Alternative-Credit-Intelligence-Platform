import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Smartphone, 
  CheckCircle2, 
  ArrowRight, 
  KeyRound, 
  Building2, 
  User, 
  Sparkles,
  Zap
} from 'lucide-react';
import { Language } from '../i18n/translations';

interface AuthAndOnboardingModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register' | 'onboarding';
  onClose: () => void;
  onSuccess: (role: 'borrower' | 'lender') => void;
  language: Language;
}

export const AuthAndOnboardingModal: React.FC<AuthAndOnboardingModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess,
  language
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'onboarding'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<'borrower' | 'lender'>('borrower');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('7840');
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [isConnectingUpi, setIsConnectingUpi] = useState(false);

  if (!isOpen) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      setOtpSent(true);
    } else {
      if (mode === 'register') {
        setMode('onboarding');
      } else {
        onSuccess(selectedRole);
        onClose();
      }
    }
  };

  const handleFinishOnboarding = () => {
    onSuccess(selectedRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-card rounded-3xl border border-slate-700/80 max-w-md w-full p-6 md:p-8 shadow-2xl relative overflow-hidden text-white">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />

        {/* Modal Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold tracking-tight text-white font-mono">
              CredNova<span className="text-emerald-400">.AI</span> Security
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Auth Mode: Login / Register */}
        {mode !== 'onboarding' ? (
          <div className="mt-5 space-y-5">
            {/* Tab switch */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setMode('login')}
                className={`py-1.5 rounded-lg transition ${
                  mode === 'login' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode('register')}
                className={`py-1.5 rounded-lg transition ${
                  mode === 'register' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Role Select */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setSelectedRole('borrower')}
                className={`p-2.5 rounded-xl border flex items-center space-x-2 transition ${
                  selectedRole === 'borrower'
                    ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-4 h-4" />
                <span className="font-semibold">Borrower</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('lender')}
                className={`p-2.5 rounded-xl border flex items-center space-x-2 transition ${
                  selectedRole === 'lender'
                    ? 'bg-blue-950/40 border-blue-500/60 text-blue-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span className="font-semibold">Lender / NBFC</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">
                  Registered Mobile Number (UPI Linked)
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    id="auth-phone"
                    name="auth-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {otpSent && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-slate-300 font-medium">Enter 4-Digit OTP</label>
                    <span className="text-[10px] text-emerald-400 font-mono">Demo OTP: 7840</span>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      id="auth-otp"
                      name="auth-otp"
                      maxLength={4}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white font-mono tracking-widest text-center text-base focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/25 transition"
              >
                {!otpSent ? 'Send OTP Verification Code' : 'Verify & Continue'}
              </button>
            </form>

            <p className="text-[11px] text-slate-400 text-center">
              🔒 Powered by RBI Account Aggregator & DPDP Act 2023. Zero surveillance data.
            </p>
          </div>
        ) : (
          /* Interactive Onboarding Flow */
          <div className="mt-5 space-y-5">
            {/* Step Indicators */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-slate-800">
              <span className={`font-semibold ${onboardingStep >= 1 ? 'text-emerald-400' : ''}`}>1. Consent</span>
              <span>&rarr;</span>
              <span className={`font-semibold ${onboardingStep >= 2 ? 'text-emerald-400' : ''}`}>2. Account Aggregator</span>
              <span>&rarr;</span>
              <span className={`font-semibold ${onboardingStep >= 3 ? 'text-emerald-400' : ''}`}>3. 3D Score</span>
            </div>

            {onboardingStep === 1 && (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="font-bold text-white block">DPDP Act 2023 Explicit Consent</span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    CredNova AI only pulls financial telemetry (UPI turnover, utility streaks, platform tenure) explicitly authorized by you. We NEVER read SMS inbox, contacts, or location.
                  </p>
                  <div className="flex items-center space-x-2 pt-1 text-emerald-400 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Time-bound, single-purpose, revocable consent</span>
                  </div>
                </div>

                <button
                  onClick={() => setOnboardingStep(2)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition flex items-center justify-center space-x-1.5"
                >
                  <span>Grant Explicit Consent & Proceed</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {onboardingStep === 2 && (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                  <span className="font-bold text-white block">Connect Digital Telemetry</span>
                  <div className="space-y-2 text-[11px]">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span>UPI Statement (PhonePe/GPay)</span>
                      <span className="text-emerald-400 font-mono">Connected ✓</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span>Electricity Board (BESCOM/UPPCL)</span>
                      <span className="text-emerald-400 font-mono">18 Mo Verified ✓</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span>Gig Work Channel (Zomato/Blinkit)</span>
                      <span className="text-cyan-400 font-mono">Active ✓</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setOnboardingStep(3)}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold rounded-xl transition flex items-center justify-center space-x-1.5"
                >
                  <span>Calculate Calibrated 3D Score</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {onboardingStep === 3 && (
              <div className="space-y-4 text-xs text-center">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-emerald-500/40 space-y-2">
                  <span className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <Sparkles className="w-5 h-5" />
                  </span>
                  <span className="text-slate-400 font-mono uppercase text-[10px] block">
                    Alternative Score Ready
                  </span>
                  <div className="text-4xl font-black font-mono text-emerald-400">
                    784
                  </div>
                  <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 inline-block">
                    Prime Risk Tier (Low Risk)
                  </span>
                </div>

                <button
                  onClick={handleFinishOnboarding}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-600/30 transition"
                >
                  Enter Borrower Intelligence Dashboard &rarr;
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
