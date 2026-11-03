import React from 'react';
import { 
  ShieldCheck, 
  User, 
  Building2, 
  Scale, 
  Globe, 
  FileText, 
  Cpu, 
  UserPlus
} from 'lucide-react';
import { BorrowerProfile } from '../types';
import { Language, translations } from '../i18n/translations';

interface HeaderProps {
  currentRole: 'borrower' | 'lender' | 'auditor';
  onRoleChange: (role: 'borrower' | 'lender' | 'auditor') => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  borrowers: BorrowerProfile[];
  activeProfile: BorrowerProfile;
  onSelectProfile: (profile: BorrowerProfile) => void;
  onOpenCustomEvaluator: () => void;
  onOpenPassport: () => void;
  onOpenModelMetrics: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  language,
  onLanguageChange,
  borrowers,
  activeProfile,
  onSelectProfile,
  onOpenCustomEvaluator,
  onOpenPassport,
  onOpenModelMetrics
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 bg-[#0B1120]/95 backdrop-blur-md border-b border-slate-800/80 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-white">
                  CredNova<span className="text-emerald-400">.AI</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-semibold tracking-wider bg-emerald-950/60 text-emerald-400 rounded-md border border-emerald-500/30">
                  HI-04 Unbanked Inclusion
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden md:block">
                {t.app.tagline}
              </p>
            </div>
          </div>

          {/* Role Navigation Switcher */}
          <div className="hidden lg:flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => onRoleChange('borrower')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'borrower'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{t.nav.roleBorrower}</span>
            </button>
            <button
              onClick={() => onRoleChange('lender')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'lender'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{t.nav.roleLender}</span>
            </button>
            <button
              onClick={() => onRoleChange('auditor')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'auditor'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{t.nav.roleAuditor}</span>
            </button>
          </div>

          {/* Profile Switcher & Actions */}
          <div className="flex items-center space-x-2.5">
            {/* Quick Profile Dropdown */}
            <div className="relative">
              <select
                aria-label="Select Borrower Profile"
                value={activeProfile.id}
                onChange={(e) => {
                  const found = borrowers.find(b => b.id === e.target.value);
                  if (found) onSelectProfile(found);
                }}
                className="bg-slate-900 border border-slate-700/80 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium cursor-pointer"
              >
                {borrowers.map((b) => (
                  <option key={b.id} value={b.id}>
                    {language === 'hi' ? b.nameHindi : b.fullName} ({b.primaryOccupation.split('&')[0].trim()})
                  </option>
                ))}
              </select>
            </div>

            {/* Test Custom Profile Button */}
            <button
              onClick={onOpenCustomEvaluator}
              title={t.nav.evaluateNew}
              className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700 text-slate-200 rounded-lg text-xs font-medium transition"
            >
              <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden xl:inline">{t.nav.evaluateNew}</span>
            </button>

            {/* Download/Print Passport Button */}
            <button
              onClick={onOpenPassport}
              title={t.nav.creditPassport}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs font-semibold transition"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t.nav.creditPassport}</span>
            </button>

            {/* ML Architecture Modal Button */}
            <button
              onClick={onOpenModelMetrics}
              title={t.nav.modelMetrics}
              className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition"
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
            </button>

            {/* Language Toggle */}
            <button
              onClick={() => onLanguageChange(language === 'en' ? 'hi' : 'en')}
              className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-semibold text-slate-300 hover:text-white transition"
              title="Toggle English / हिंदी"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'en' ? 'हिंदी' : 'EN'}</span>
            </button>

          </div>
        </div>

        {/* Mobile Role Switcher Bar */}
        <div className="flex lg:hidden items-center justify-around py-2 border-t border-slate-800/60">
          <button
            onClick={() => onRoleChange('borrower')}
            className={`flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-medium ${
              currentRole === 'borrower' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            <User className="w-3 h-3" />
            <span>Borrower</span>
          </button>
          <button
            onClick={() => onRoleChange('lender')}
            className={`flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-medium ${
              currentRole === 'lender' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            <Building2 className="w-3 h-3" />
            <span>Lender</span>
          </button>
          <button
            onClick={() => onRoleChange('auditor')}
            className={`flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-medium ${
              currentRole === 'auditor' ? 'bg-purple-600 text-white' : 'text-slate-400'
            }`}
          >
            <Scale className="w-3 h-3" />
            <span>Fairness</span>
          </button>
        </div>

      </div>
    </header>
  );
};
