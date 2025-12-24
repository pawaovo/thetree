import React from 'react';

const LoadingAnalysis: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white/70 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-8 transition-all">
      <div className="relative w-32 h-32 mb-8">
         {/* Simple CSS Tree Growing Animation */}
         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-16 bg-amber-800/80 rounded-b-lg backdrop-blur-sm"></div>
         <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-emerald-500/80 rounded-full animate-pulse backdrop-blur-sm shadow-lg"></div>
         <div className="absolute bottom-16 left-1/2 -translate-x-3/4 w-20 h-20 bg-emerald-400/80 rounded-full animate-bounce backdrop-blur-sm shadow-lg" style={{ animationDuration: '2s' }}></div>
         <div className="absolute bottom-16 left-1/2 translate-x-[-20%] w-20 h-20 bg-emerald-600/80 rounded-full animate-bounce backdrop-blur-sm shadow-lg" style={{ animationDelay: '0.5s', animationDuration: '2.2s' }}></div>
      </div>
      
      <h2 className="text-3xl font-black text-emerald-950 mb-4 animate-pulse drop-shadow-sm">正在汲取数据养分...</h2>
      <p className="text-emerald-900/90 text-center max-w-md bg-white/40 p-6 rounded-2xl backdrop-blur-md border border-white/50 shadow-lg font-bold">
        AI正在分析你的霍兰德代码、学科优势与兴趣倾向，为你培育专属的未来之树。
      </p>
    </div>
  );
};

export default LoadingAnalysis;