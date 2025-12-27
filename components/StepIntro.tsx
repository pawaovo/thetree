import React from 'react';
import { Gender, UserProfile } from '../types';

interface Props {
  data: Partial<UserProfile>;
  updateData: (data: Partial<UserProfile>) => void;
  onNext: () => void;
  onAdminClick?: () => void;
}

const StepIntro: React.FC<Props> = ({ data, updateData, onNext, onAdminClick }) => {
  const isValid = data.name && data.gender;

  return (
    <div className="animate-fade-in flex flex-col items-center justify-center min-h-[70vh] text-center max-w-2xl mx-auto relative pb-20">
      {/* Background Image */}
      <div
        className="fixed inset-0 z-0 opacity-30"
        style={{
          backgroundImage: 'url(/1.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="mb-8">
          <div className="w-24 h-24 bg-white/60 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50">
             <svg className="w-12 h-12 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-emerald-950 mb-4 tracking-tight">THE TREE</h1>
          <p className="text-emerald-900/60 text-lg leading-relaxed font-medium">
            "选科如种树。我们提供土壤，你决定方向。"
          </p>
        </div>

        <div className="w-full bg-white/60 backdrop-blur-xl p-8 rounded-[2rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40">
          <div className="space-y-6">
            <div className="text-left">
              <label className="block text-sm font-bold text-emerald-900/80 mb-2 ml-1">
                请为你的树起一个名字
              </label>
              <input
                type="text"
                value={data.name || ''}
                onChange={(e) => updateData({ name: e.target.value })}
                placeholder="例如：知识之树..."
                className="w-full px-5 py-4 rounded-2xl border border-transparent bg-white/50 focus:bg-white focus:border-emerald-200 focus:ring-4 focus:ring-emerald-100/50 outline-none transition-all text-emerald-900 placeholder-emerald-900/30 font-medium shadow-inner"
              />
            </div>

            <div className="text-left">
              <label className="block text-sm font-bold text-emerald-900/80 mb-2 ml-1">
                输入账号
              </label>
              <input
                type="text"
                placeholder="请输入账号..."
                className="w-full px-5 py-4 rounded-2xl border border-transparent bg-white/50 focus:bg-white focus:border-emerald-200 focus:ring-4 focus:ring-emerald-100/50 outline-none transition-all text-emerald-900 placeholder-emerald-900/30 font-medium shadow-inner"
              />
            </div>

            <div className="text-left">
              <label className="block text-sm font-bold text-emerald-900/80 mb-2 ml-1">
                输入密码
              </label>
              <input
                type="password"
                placeholder="请输入密码..."
                className="w-full px-5 py-4 rounded-2xl border border-transparent bg-white/50 focus:bg-white focus:border-emerald-200 focus:ring-4 focus:ring-emerald-100/50 outline-none transition-all text-emerald-900 placeholder-emerald-900/30 font-medium shadow-inner"
              />
            </div>

            <div className="text-left">
              <label className="block text-sm font-bold text-emerald-900/80 mb-2 ml-1">
                这棵树的性别是？
              </label>
              <div className="flex gap-4">
                {[Gender.MALE, Gender.FEMALE].map((g) => (
                  <button
                    key={g}
                    onClick={() => updateData({ gender: g })}
                    className={`flex-1 py-4 rounded-2xl border transition-all font-medium ${
                      data.gender === g
                        ? 'bg-emerald-600 text-white border-transparent shadow-lg shadow-emerald-600/20 transform scale-[1.02]'
                        : 'bg-white/50 text-emerald-900/60 border-transparent hover:bg-white hover:text-emerald-900'
                    }`}
                  >
                    {g === Gender.MALE ? '男孩' : '女孩'}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={onNext}
              disabled={!isValid}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all mt-6 ${
                isValid
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 hover:-translate-y-0.5'
                  : 'bg-emerald-900/5 text-emerald-900/20 cursor-not-allowed'
              }`}
            >
              开始生长 🌱
            </button>
          </div>
        </div>
      </div>

      {/* Admin Button with Container */}
      {onAdminClick && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <button
            onClick={onAdminClick}
            className="group flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl border border-emerald-100 hover:border-emerald-300 transition-all hover:-translate-y-1"
            title="系统统计与管理"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600 group-hover:text-emerald-700 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-sm font-bold text-emerald-900 group-hover:text-emerald-950 transition-colors">
              THE TREE · 生态监测站
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default StepIntro;