import React, { useState } from 'react';
import Layout from './components/Layout';
import StepIntro from './components/StepIntro';
import StepGrades from './components/StepGrades';
import StepInterests from './components/StepInterests';
import StepHolland from './components/StepHolland';
import Report from './components/Report';
import LoadingAnalysis from './components/LoadingAnalysis';
import AdminDashboard from './components/AdminDashboard';
import { UserProfile, AIAnalysisResult } from './types';
import { generateSelectionAdvice } from './services/geminiService';

enum Step {
  INTRO = 0,
  GRADES = 1,
  INTERESTS = 2,
  HOLLAND = 3,
  LOADING = 4,
  REPORT = 5,
  ADMIN = 99 // Special step for stats page
}

const App: React.FC = () => {
  const [step, setStep] = useState<Step>(Step.INTRO);
  const [userData, setUserData] = useState<Partial<UserProfile>>({});
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateUserData = (data: Partial<UserProfile>) => {
    setUserData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (step === Step.ADMIN) {
        setStep(Step.INTRO);
    } else {
        setStep(prev => prev - 1);
    }
  };

  const handleFinalSubmit = async (finalData?: Partial<UserProfile>) => {
    setStep(Step.LOADING);
    
    const completeData = { ...userData, ...finalData };

    try {
      if (!completeData.name || !completeData.exams || !completeData.hollandCode) {
        console.error("Missing Data Debug:", completeData);
        throw new Error("Missing critical data (Name, Exams, or Holland Code)");
      }

      const result = await generateSelectionAdvice(completeData as UserProfile);
      setAiResult(result);
      setStep(Step.REPORT);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "AI 分析服务暂时不可用或数据不完整，请稍后重试。");
      setStep(Step.HOLLAND); // Go back to allow retry
    }
  };

  const handleRestart = () => {
    setUserData({});
    setAiResult(null);
    setStep(Step.INTRO);
  };

  const renderStep = () => {
    switch (step) {
      case Step.INTRO:
        return <StepIntro data={userData} updateData={updateUserData} onNext={handleNext} onAdminClick={() => setStep(Step.ADMIN)} />;
      case Step.GRADES:
        return <StepGrades data={userData} updateData={updateUserData} onNext={handleNext} onBack={handleBack} />;
      case Step.INTERESTS:
        return <StepInterests data={userData} updateData={updateUserData} onNext={handleNext} onBack={handleBack} />;
      case Step.HOLLAND:
        return <StepHolland data={userData} updateData={updateUserData} onSubmit={handleFinalSubmit} onBack={handleBack} />;
      case Step.LOADING:
        return <LoadingAnalysis />;
      case Step.REPORT:
        return aiResult ? <Report user={userData as UserProfile} result={aiResult} onRestart={handleRestart} /> : null;
      case Step.ADMIN:
        return <AdminDashboard onBack={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <Layout step={step}>
      {error && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[100] animate-fade-in-up w-[90%] max-w-md">
            <div className="bg-white/80 backdrop-blur-xl border border-red-200 text-red-800 px-6 py-4 rounded-2xl shadow-2xl flex items-start gap-3">
                <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                    <h3 className="font-bold text-sm mb-1">遇到一点问题</h3>
                    <p className="text-xs opacity-80 leading-relaxed">{error}</p>
                </div>
                <button 
                    onClick={() => setError(null)} 
                    className="text-red-400 hover:text-red-700 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
      )}
      {renderStep()}
    </Layout>
  );
};

export default App;