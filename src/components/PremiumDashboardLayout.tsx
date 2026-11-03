import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  Briefcase, 
  Calculator, 
  Building2, 
  Scale, 
  ChevronLeft, 
  ChevronRight, 
  Bell, 
  FileText, 
  Cpu, 
  UserPlus, 
  Globe, 
  LogOut, 
  ShieldCheck, 
  CheckCircle2, 
  Zap, 
  X,
  ExternalLink,
  SlidersHorizontal,
  Home
} from 'lucide-react';
import { BorrowerProfile, ScoringResult } from '../types';
import { Language, translations } from '../i18n/translations';

interface PremiumDashboardLayoutProps {
  currentRole: 'borrower' | 'lender' | 'auditor';
  onRoleChange: (role: 'borrower' | 'lender' | 'auditor') => void;
  activeTab: 'dashboard' | 'sphere' | 'explain' | 'gig' | 'simulator';
  onTabChange: (tab: 'dashboard' | 'sphere' | 'explain' | 'gig' | 'simulator') => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  borrowers: BorrowerProfile[];
  activeProfile: BorrowerProfile;
  onSelectProfile: (profile: BorrowerProfile) => void;
  scoringResult: ScoringResult;
  onOpenCustomEvaluator: () => void;
  onOpenPassport: () => void;
  onOpenModelMetrics: () => void;
  onOpenAdvisor: () => void;
  children: React.ReactNode;
}

export const PremiumDashboardLayout: React.FC<PremiumDashboardLayoutProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  language,
  onLanguageChange,
  borrowers,
  activeProfile,
  onSelectProfile,
  scoringResult,
  onOpenCustomEvaluator,
  onOpenPassport,
  onOpenModelMetrics,
  onOpenAdvisor,
  children
}) => {
  const t = translations[language];
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Live Simulated Telemetry Events
  const liveEventsEn = [
    { id: 1, title: 'UPI Ledger Inflow Verified', desc: '₹34,500 monthly cashflow verified via RBI Account Aggregator', time: '2m ago', type: 'success' },
    { id: 2, title: 'Electricity Streak Extended', desc: 'BESCOM on-time bill payment recorded (+12 credit points)', time: '14m ago', type: 'pts' },
    { id: 3, title: 'Fairness Audit Passed', desc: 'Urban vs Rural disparate impact ratio verified at 0.968', time: '1h ago', type: 'audit' }
  ];

  const liveEventsHi = [
    { id: 1, title: 'यूपीआई नकदी प्रवाह सत्यापित', desc: 'आरबीआई खाता एग्रीगेटर द्वारा ₹34,500 मासिक प्रवाह सत्यापित', time: '2 मिनट पहले', type: 'success' },
    { id: 2, title: 'बिजली बिल स्ट्रीक आगे बढ़ी', desc: 'समय पर बिल भुगतान दर्ज (+12 क्रेडिट अंक)', time: '14 मिनट पहले', type: 'pts' },
    { id: 3, title: 'निष्पक्षता ऑडिट सफल', desc: 'शहरी बनाम ग्रामीण असमान प्रभाव अनुपात 0.968 पर सत्यापित', time: '1 घंटा पहले', type: 'audit' }
  ];

  const liveEvents = language === 'hi' ? liveEventsHi : liveEventsEn;

  return (
    <div className="min-h-screen bg-[#080D18] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-[#080D18]/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left: Brand Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 ring-1 ring-emerald-300/40">
              <ShieldCheck className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-black tracking-tight text-white font-mono">
                  CredNova<span className="text-emerald-400">.AI</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  {t.layout.dpdpBadge}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono hidden md:block">
                {t.layout.tagline}
              </p>
            </div>
          </div>

          {/* Center: Active Profile Quick Selector */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 rounded-xl px-2.5 py-1">
              <img
                src={activeProfile.avatarUrl}
                alt={activeProfile.fullName}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-emerald-500"
              />
              <select
                aria-label="Select Borrower Profile"
                value={activeProfile.id}
                onChange={(e) => {
                  const found = borrowers.find(b => b.id === e.target.value);
                  if (found) onSelectProfile(found);
                }}
                className="bg-transparent text-xs text-white font-medium focus:outline-none cursor-pointer"
              >
                {borrowers.map((b) => (
                  <option key={b.id} value={b.id} className="bg-slate-900 text-white">
                    {language === 'hi' ? b.nameHindi : b.fullName} ({language === 'hi' ? (b.primaryOccupationHindi || b.primaryOccupation).split('&')[0].trim() : b.primaryOccupation.split('&')[0].trim()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2">
            
            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 relative transition"
                title="Telemetry Activity Notifications"
              >
                <Bell className="w-4 h-4 text-cyan-400" />
                <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-1.5 right-1.5" />
              </button>

              {/* Notifications Floating Drawer */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-2xl p-4 z-50 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-bold text-white">{t.layout.liveFeed}</span>
                    <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-white">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="mt-3 space-y-2.5">
                    {liveEvents.map((ev) => (
                      <div key={ev.id} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-[11px]">{ev.title}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{ev.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">{ev.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Passport Modal Button */}
            <button
              onClick={onOpenPassport}
              className="hidden sm:flex items-center space-x-1 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-semibold transition"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t.layout.creditPassport}</span>
            </button>

            {/* Language Toggle */}
            <button
              onClick={() => onLanguageChange(language === 'en' ? 'hi' : 'en')}
              className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'en' ? 'हिंदी' : 'EN'}</span>
            </button>

          </div>

        </div>
      </header>

      {/* Main Layout: Collapsible Sidebar + Content Viewport */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        
        {/* Collapsible Glass Sidebar */}
        <aside 
          className={`glass-panel rounded-3xl p-4 transition-all duration-300 flex flex-col justify-between shrink-0 shadow-2xl ${
            isSidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          {/* Top Section */}
          <div className="space-y-6">
            
            {/* Sidebar Toggle Button */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              {!isSidebarCollapsed && (
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  {t.layout.navTitle}
                </span>
              )}
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white transition mx-auto"
                title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              >
                {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            </div>

            {/* View / Role Switchers */}
            <div className="space-y-1.5">
              {!isSidebarCollapsed && (
                <span className="text-[10px] font-mono uppercase text-slate-500 block px-2">
                  {t.layout.operatingView}
                </span>
              )}

              <button
                onClick={() => onRoleChange('borrower')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-2xl text-xs font-semibold transition ${
                  currentRole === 'borrower'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-300 shrink-0" />
                {!isSidebarCollapsed && <span>{t.nav.roleBorrower}</span>}
              </button>

              <button
                onClick={() => onRoleChange('lender')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-2xl text-xs font-semibold transition ${
                  currentRole === 'lender'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Building2 className="w-4 h-4 text-blue-300 shrink-0" />
                {!isSidebarCollapsed && <span>{t.nav.roleLender}</span>}
              </button>

              <button
                onClick={() => onRoleChange('auditor')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-2xl text-xs font-semibold transition ${
                  currentRole === 'auditor'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Scale className="w-4 h-4 text-purple-300 shrink-0" />
                {!isSidebarCollapsed && <span>{t.nav.roleAuditor}</span>}
              </button>
            </div>

            {/* Borrower Tabs (when in borrower view) */}
            {currentRole === 'borrower' && (
              <div className="space-y-1 pt-4 border-t border-slate-800/80">
                {!isSidebarCollapsed && (
                  <span className="text-[10px] font-mono uppercase text-slate-500 block px-2">
                    {t.layout.intelligenceModules}
                  </span>
                )}

                <button
                  onClick={() => onTabChange('dashboard')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                    activeTab === 'dashboard'
                      ? 'bg-slate-800 text-white border border-slate-700'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  {!isSidebarCollapsed && <span>{t.layout.dashboardOverview}</span>}
                </button>

                <button
                  onClick={() => onTabChange('sphere')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                    activeTab === 'sphere'
                      ? 'bg-slate-800 text-white border border-slate-700'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  {!isSidebarCollapsed && <span>{t.layout.neuralSphere}</span>}
                </button>

                <button
                  onClick={() => onTabChange('explain')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                    activeTab === 'explain'
                      ? 'bg-slate-800 text-white border border-slate-700'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  {!isSidebarCollapsed && <span>{t.layout.explainScore}</span>}
                </button>

                <button
                  onClick={() => onTabChange('gig')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                    activeTab === 'gig'
                      ? 'bg-slate-800 text-white border border-slate-700'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  {!isSidebarCollapsed && <span>{t.layout.gigIncome}</span>}
                </button>

                <button
                  onClick={() => onTabChange('simulator')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                    activeTab === 'simulator'
                      ? 'bg-slate-800 text-white border border-slate-700'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Calculator className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  {!isSidebarCollapsed && <span>{t.layout.loanSimulator}</span>}
                </button>
              </div>
            )}

            {/* Quick Actions */}
            <div className="space-y-1.5 pt-4 border-t border-slate-800/80">
              <button
                onClick={onOpenCustomEvaluator}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900/60 transition"
                title={t.layout.testCustom}
              >
                <UserPlus className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                {!isSidebarCollapsed && <span>{t.layout.testCustom}</span>}
              </button>

              <button
                onClick={onOpenModelMetrics}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900/60 transition"
                title={t.layout.mlArch}
              >
                <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                {!isSidebarCollapsed && <span>{t.layout.mlArch}</span>}
              </button>
            </div>

          </div>

          {/* Bottom Sidebar: AI Coach Trigger */}
          <div className="pt-4 border-t border-slate-800/80">
            <button
              onClick={onOpenAdvisor}
              className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-700/20 transition"
            >
              <Sparkles className="w-4 h-4 text-emerald-200 shrink-0" />
              {!isSidebarCollapsed && <span>{t.layout.aiCoach}</span>}
            </button>
          </div>
        </aside>


        {/* Viewport Content Area */}
        <main className="flex-1 overflow-x-hidden space-y-6">
          {children}
        </main>

      </div>

    </div>
  );
};
