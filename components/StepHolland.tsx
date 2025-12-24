import React, { useState } from 'react';
import { HOLLAND_QUESTIONS } from '../constants';
import { UserProfile } from '../types';

interface Props {
  data: Partial<UserProfile>;
  updateData: (data: Partial<UserProfile>) => void;
  onSubmit: (data?: Partial<UserProfile>) => void;
  onBack: () => void;
}

const StepHolland: React.FC<Props> = ({ data, updateData, onSubmit, onBack }) => {
  // Change state to store numbers (0-5) instead of booleans
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const handleAnswer = (id: number, val: number) => {
    setAnswers(prev => ({ ...prev, [id]: val }));
  };

  const calculateResults = () => {
    const scores: Record<string, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    
    HOLLAND_QUESTIONS.forEach(q => {
      if (answers[q.id] !== undefined) {
        // Sum the scores instead of counting occurrences
        scores[q.type] = (scores[q.type] || 0) + answers[q.id];
      }
    });

    // Sort to get code
    const sortedTypes = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .map(([type]) => type)
      .slice(0, 3)
      .join('');

    const finalData = { hollandScores: scores, hollandCode: sortedTypes };
    
    updateData(finalData);
    onSubmit(finalData);
  };

  const progress = (Object.keys(answers).length / HOLLAND_QUESTIONS.length) * 100;
  const isComplete = Object.keys(answers).length === HOLLAND_QUESTIONS.length;

  return (
    <div className="animate-fade-in max-w-3xl mx-auto pb-32">
      <div className="sticky top-4 z-20 mb-6 bg-white/70 backdrop-blur-xl p-4 rounded-[2rem] shadow-[0_4px_20px_0_rgba(0,0,0,0.05)] border border-white/50 flex items-center justify-between transition-all">
         <div>
            <h2 className="text-xl font-bold text-emerald-950">性格根系</h2>
            <p className="text-xs text-emerald-800 font-medium">
              请根据符合程度打分 (0=完全不符, 5=非常符合)
            </p>
         </div>
         <div className="w-1/3 bg-gray-200/50 rounded-full h-2.5">
            <div className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500 shadow-sm" style={{ width: `${progress}%` }}></div>
         </div>
      </div>

      <div className="space-y-6">
        {HOLLAND_QUESTIONS.map((q) => {
          const currentScore = answers[q.id];
          return (
            <div key={q.id} className="bg-white/60 backdrop-blur-md p-6 rounded-[2rem] shadow-sm border border-white/60 hover:shadow-md hover:bg-white/80 transition-all">
              <p className="text-lg font-bold text-emerald-900 mb-6">{q.text}</p>
              
              {/* 0-5 Scale UI */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center px-1 text-xs text-emerald-900/40 mb-1 font-bold">
                   <span>完全不符 (0)</span>
                   <span>非常符合 (5)</span>
                </div>
                <div className="flex justify-between items-center gap-1 md:gap-3">
                  {[0, 1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      onClick={() => handleAnswer(q.id, score)}
                      className={`
                        w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-200
                        ${currentScore === score 
                          ? 'bg-emerald-600 text-white scale-110 shadow-lg ring-4 ring-emerald-100/50' 
                          : 'bg-white text-emerald-900/40 hover:bg-emerald-50 hover:text-emerald-900 border border-transparent'}
                      `}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {/* Personal Description / Talents Section */}
        <div className="bg-white/60 backdrop-blur-md p-8 rounded-[2rem] shadow-sm border border-white/60 hover:shadow-md transition-all mt-8">
            <label className="block text-lg font-bold text-emerald-950 mb-4">
              最后，说说你的个人特长与自述
            </label>
            <div className="relative">
              <textarea
                value={data.specialTalents || ''}
                onChange={(e) => updateData({ specialTalents: e.target.value })}
                rows={5}
                placeholder={`Hi ${data.name || '同学'}，你有什么特长呢？
比如：我会弹钢琴、我擅长演讲、我是校篮球队的、我喜欢捣鼓机器人代码...
（AI会综合考虑这部分内容为你提供更精准的建议）`}
                className="w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-emerald-400/50 outline-none bg-white/50 focus:bg-white resize-none text-emerald-900 font-medium placeholder-emerald-900/30 transition-colors"
              />
            </div>
        </div>

      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-white/50 flex justify-center items-center gap-4 z-20">
        <button onClick={onBack} className="px-6 py-3 text-gray-500 hover:text-emerald-900 font-bold hover:bg-gray-100/50 rounded-lg transition-colors">
            上一步
        </button>
        <button
          onClick={calculateResults}
          disabled={!isComplete}
          className={`w-full max-w-sm py-4 rounded-2xl font-bold text-lg shadow-lg transition-all ${
            isComplete
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-emerald-600/30 transform hover:-translate-y-1'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isComplete ? '生成我的选科之树' : '请完成所有打分'}
        </button>
      </div>
    </div>
  );
};

export default StepHolland;