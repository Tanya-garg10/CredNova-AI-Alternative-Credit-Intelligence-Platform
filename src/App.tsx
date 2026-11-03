/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { BorrowerProfile } from './types';
import { SAMPLE_BORROWERS } from './services/sampleData';
import { AlternativeScoringEngine } from './services/scoringEngine';
import { Language, translations } from './i18n/translations';
import { PageLoader } from './components/PageLoader';
import { PremiumDashboardLayout } from './components/PremiumDashboardLayout';
import { BorrowerDashboard } from './components/BorrowerDashboard';
import { ThreeNeuralSphereView } from './components/ThreeNeuralSphereView';
import { ExplainMyScore } from './components/ExplainMyScore';
import { GigWorkerIntelligence } from './components/GigWorkerIntelligence';
import { LoanSimulator } from './components/LoanSimulator';
import { LenderDashboard } from './components/LenderDashboard';
import { FairnessMonitor } from './components/FairnessMonitor';
import { ProfileEvaluatorModal } from './components/ProfileEvaluatorModal';
import { CreditPassportModal } from './components/CreditPassportModal';
import { ModelMetricsModal } from './components/ModelMetricsModal';
import { AIAdvisorDrawer } from './components/AIAdvisorDrawer';
import { AuthAndOnboardingModal } from './components/AuthAndOnboardingModal';

export default function App() {
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Dashboard Role & Tab State
  const [currentRole, setCurrentRole] = useState<'borrower' | 'lender' | 'auditor'>('borrower');
  const [borrowerTab, setBorrowerTab] = useState<'dashboard' | 'sphere' | 'explain' | 'gig' | 'simulator'>('dashboard');
  const [language, setLanguage] = useState<Language>('en');

  // Borrower Profiles State
  const [borrowers, setBorrowers] = useState<BorrowerProfile[]>(SAMPLE_BORROWERS);
  const [activeProfile, setActiveProfile] = useState<BorrowerProfile>(SAMPLE_BORROWERS[0]);

  // Modals & Drawers State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'onboarding'>('login');
  const [isCustomEvaluatorOpen, setIsCustomEvaluatorOpen] = useState(false);
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  const [isModelMetricsOpen, setIsModelMetricsOpen] = useState(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);

  // Computed scoring for active profile
  const scoringResult = useMemo(() => {
    return AlternativeScoringEngine.calculateScore(activeProfile);
  }, [activeProfile]);

  // Callback when a custom profile is evaluated/created
  const handleProfileCreated = (newProfile: BorrowerProfile) => {
    setBorrowers(prev => [newProfile, ...prev]);
    setActiveProfile(newProfile);
    setCurrentRole('borrower');
    setBorrowerTab('dashboard');
  };

  const handleAuthSuccess = (role: 'borrower' | 'lender') => {
    setCurrentRole(role);
  };

  return (
    <>
      {/* Initial 3D Intelligence Boot Loader */}
      {isPageLoading && (
        <PageLoader 
          durationMs={1000} 
          onComplete={() => setIsPageLoading(false)} 
        />
      )}

      {/* Main Platform & Dashboard Layout (Direct Open) */}
      <PremiumDashboardLayout
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        activeTab={borrowerTab}
        onTabChange={setBorrowerTab}
        language={language}
        onLanguageChange={setLanguage}
        borrowers={borrowers}
        activeProfile={activeProfile}
        onSelectProfile={setActiveProfile}
        scoringResult={scoringResult}
        onOpenCustomEvaluator={() => setIsCustomEvaluatorOpen(true)}
        onOpenPassport={() => setIsPassportOpen(true)}
        onOpenModelMetrics={() => setIsModelMetricsOpen(true)}
        onOpenAdvisor={() => setIsAdvisorOpen(true)}
      >
        {/* Active Operating View */}
        {currentRole === 'borrower' && (
          <>
            {borrowerTab === 'dashboard' && (
              <BorrowerDashboard
                profile={activeProfile}
                scoring={scoringResult}
                language={language}
                onNavigateTab={(tab) => setBorrowerTab(tab)}
                onOpenAdvisor={() => setIsAdvisorOpen(true)}
                onOpenPassport={() => setIsPassportOpen(true)}
              />
            )}

            {borrowerTab === 'sphere' && (
              <ThreeNeuralSphereView
                profile={activeProfile}
                scoring={scoringResult}
                language={language}
                onNavigateTab={(tab) => setBorrowerTab(tab)}
              />
            )}

            {borrowerTab === 'explain' && (
              <ExplainMyScore
                scoring={scoringResult}
                language={language}
              />
            )}

            {borrowerTab === 'gig' && (
              <GigWorkerIntelligence
                profile={activeProfile}
                language={language}
              />
            )}

            {borrowerTab === 'simulator' && (
              <LoanSimulator
                profile={activeProfile}
                scoring={scoringResult}
                language={language}
              />
            )}
          </>
        )}

        {currentRole === 'lender' && (
          <LenderDashboard
            borrowers={borrowers}
            onSelectBorrower={(selected) => {
              setActiveProfile(selected);
            }}
            language={language}
          />
        )}

        {currentRole === 'auditor' && (
          <FairnessMonitor
            language={language}
          />
        )}
      </PremiumDashboardLayout>

      {/* Global Modals & Drawers */}
      <AuthAndOnboardingModal
        isOpen={isAuthModalOpen}
        initialMode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        language={language}
      />

      <ProfileEvaluatorModal
        isOpen={isCustomEvaluatorOpen}
        onClose={() => setIsCustomEvaluatorOpen(false)}
        onProfileCreated={handleProfileCreated}
        language={language}
      />

      <CreditPassportModal
        isOpen={isPassportOpen}
        onClose={() => setIsPassportOpen(false)}
        profile={activeProfile}
        scoring={scoringResult}
        language={language}
      />

      <ModelMetricsModal
        isOpen={isModelMetricsOpen}
        onClose={() => setIsModelMetricsOpen(false)}
        language={language}
      />

      <AIAdvisorDrawer
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
        profile={activeProfile}
        scoring={scoringResult}
        language={language}
      />
    </>
  );
}
