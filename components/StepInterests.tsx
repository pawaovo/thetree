import React from 'react';
import { SUBJECT_LIST } from '../constants';
import { UserProfile } from '../types';

interface Props {
  data: Partial<UserProfile>;
  updateData: (data: Partial<UserProfile>) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepInterests: React.FC<Props> = ({ data, updateData, onNext, onBack }) => {
  const selectedSubjects = data.interestedSubjects || [];

  const toggleSubject = (key: string) => {
    if (selectedSubjects.includes(key)) {
      updateData({ interestedSubjects: selectedSubjects.filter(s => s !== key) });
    } else {
      updateData({ interestedSubjects: [...selectedSubjects, key] });
    }
  };

  const isValid = selectedSubjects.length > 0;

  return (
    <div className="animate-fade-in max-w-3xl mx-auto pb-24">
      <h2 className="text-2xl font-bold text-emerald-950 mb-2">光合作用</h2>
      <p className="text-emerald-900/60 mb-6 font-medium">阳光（兴趣）是树木生长的方向。你对哪些领域充满好奇？</p>

      <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] border border-white/60 p-8 space-y-8">
        
        {/* Subject Selection - Tiles */}
        <div>
          <label className="block text-lg font-bold text-emerald-900 mb-4 ml-1">
            感兴趣的学科 <span className="text-sm font-normal text-emerald-900/40">(可多选)</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {SUBJECT_LIST.filter(s => s.type !== 'main').map((sub) => {
              const isSelected = selectedSubjects.includes(sub.key);
              return (
                <button
                  key={sub.key}
                  onClick={() => toggleSubject(sub.key)}
                  className={`py-4 px-5 rounded-2xl font-bold transition-all duration-300 flex items-center justify-between group ${
                    isSelected
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-[1.02]'
                      : 'bg-white text-emerald-900/70 shadow-sm border border-transparent hover:border-emerald-200 hover:scale-[1.01]'
                  }`}
                >
                  <span className="text-lg">{sub.label}</span>
                  {isSelected && (
                    <div className="bg-white/20 rounded-full p-1">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent w-full"></div>

        {/* Major and Career Inputs - Glassy Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-bold text-emerald-900 mb-2 ml-1">
              感兴趣的专业 <span className="text-sm font-normal text-emerald-900/40">(选填)</span>
            </label>
            <input 
              type="text"
              value={data.interestedMajors || ''}
              onChange={(e) => updateData({ interestedMajors: e.target.value })}
              placeholder="例如：计算机、医学、法学..."
              className="w-full px-5 py-4 rounded-2xl border-none bg-white/50 focus:bg-white focus:ring-4 focus:ring-emerald-100/50 outline-none transition-all text-emerald-900 font-medium placeholder-emerald-900/30"
            />
          </div>
          <div>
            <label className="block text-lg font-bold text-emerald-900 mb-2 ml-1">
              向往的职业 <span className="text-sm font-normal text-emerald-900/40">(选填)</span>
            </label>
            <input 
              type="text"
              value={data.interestedCareers || ''}
              onChange={(e) => updateData({ interestedCareers: e.target.value })}
              placeholder="例如：医生、工程师、教师..."
              className="w-full px-5 py-4 rounded-2xl border-none bg-white/50 focus:bg-white focus:ring-4 focus:ring-emerald-100/50 outline-none transition-all text-emerald-900 font-medium placeholder-emerald-900/30"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100/50">
          <button onClick={onBack} className="text-gray-500 hover:text-emerald-900 font-bold px-4 py-2 rounded-lg hover:bg-white/50 transition-colors">
            返回
          </button>
          <button
            onClick={onNext}
            disabled={!isValid}
            className={`px-8 py-3 rounded-2xl font-bold text-lg shadow-xl transition-all ${
              isValid
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-emerald-600/30 hover:-translate-y-0.5'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            下一步
          </button>
        </div>

      </div>
    </div>
  );
};

export default StepInterests;