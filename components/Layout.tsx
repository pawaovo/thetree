import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  step?: number; // 0: Intro, 1: Grades, 2: Interests, 3: Holland, 4: Loading, 5: Report
}

const BackgroundTree: React.FC<{ stage: number }> = ({ stage }) => {
  // Logic to determine visibility of tree parts based on stage
  // Stage 0 (Intro): Sprout
  // Stage 1 (Grades): Sapling (Trunk start)
  // Stage 2 (Interests): Growing (Trunk + Low Branches)
  // Stage 3 (Holland): Branching (Full Structure)
  // Stage 5 (Report): Blooming (Foliage)

  const isVisible = (minStage: number) => stage >= minStage ? 'opacity-100 scale-100' : 'opacity-0 scale-95';
  const isFoliageVisible = stage >= 5 ? 'opacity-100 scale-100' : 'opacity-0 scale-90';

  // Admin page (step 99) shows full tree
  const currentStage = stage === 99 ? 5 : stage;

  return (
    <div className="fixed bottom-0 left-0 w-full h-full pointer-events-none z-0 flex justify-center items-end overflow-hidden">
      <svg 
        viewBox="0 0 800 600" 
        className="w-full h-auto max-h-[85vh] md:max-h-[90vh] opacity-20 transition-all duration-1000 ease-in-out text-emerald-900 fill-current stroke-current"
        preserveAspectRatio="xMidYBottom"
      >
        <defs>
          <linearGradient id="treeGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#064e3b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Group: Stage 0 - The Seed/Sprout */}
        <g className={`transition-all duration-1000 origin-bottom ${isVisible(0)}`}>
           {/* Ground Line */}
           <path d="M 200 580 Q 400 570 600 580" fill="none" strokeWidth="2" className="opacity-50" />
           {/* Tiny Sprout */}
           <path d="M 400 580 Q 400 560 395 550 Q 380 540 400 530 Q 420 540 405 550 Q 400 560 400 580" fill="currentColor" />
        </g>

        {/* Group: Stage 1 - Main Trunk Growth */}
        <g className={`transition-all duration-1000 delay-100 origin-bottom ${isVisible(1)}`}>
           <path 
             d="M 400 580 C 400 500 420 450 400 350 C 390 300 400 250 400 200" 
             fill="none" 
             strokeWidth="8" 
             strokeLinecap="round"
             className="text-emerald-800"
           />
        </g>

        {/* Group: Stage 2 - Lower Branches */}
        <g className={`transition-all duration-1000 delay-200 origin-center ${isVisible(2)}`}>
           {/* Left Branch Low */}
           <path d="M 405 450 Q 350 420 320 380" fill="none" strokeWidth="4" strokeLinecap="round" />
           {/* Right Branch Low */}
           <path d="M 395 480 Q 450 460 480 420" fill="none" strokeWidth="4" strokeLinecap="round" />
        </g>

        {/* Group: Stage 3 - Upper Branches & Structure */}
        <g className={`transition-all duration-1000 delay-200 origin-center ${isVisible(3)}`}>
           {/* Left Branch High */}
           <path d="M 400 350 Q 320 300 300 220" fill="none" strokeWidth="4" strokeLinecap="round" />
           {/* Right Branch High */}
           <path d="M 400 320 Q 460 280 500 200" fill="none" strokeWidth="4" strokeLinecap="round" />
           {/* Top Splits */}
           <path d="M 400 200 L 380 150" fill="none" strokeWidth="3" strokeLinecap="round" />
           <path d="M 400 200 L 420 150" fill="none" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* Group: Stage 5 (Report) - Foliage/Canopy */}
        <g className={`transition-all duration-1500 delay-500 origin-center ${isFoliageVisible}`}>
           {/* Abstract Leaves/Canopy Circles */}
           <circle cx="300" cy="220" r="40" className="fill-emerald-200 opacity-30" />
           <circle cx="500" cy="200" r="45" className="fill-emerald-200 opacity-30" />
           <circle cx="400" cy="150" r="60" className="fill-emerald-300 opacity-30" />
           <circle cx="350" cy="280" r="30" className="fill-emerald-100 opacity-30" />
           <circle cx="450" cy="280" r="35" className="fill-emerald-100 opacity-30" />
           
           {/* Falling Leaves Effect (Decorative dots) */}
           <circle cx="320" cy="350" r="4" className="fill-emerald-600 opacity-40 animate-pulse" />
           <circle cx="480" cy="320" r="3" className="fill-emerald-600 opacity-40 animate-pulse" style={{animationDelay: '1s'}} />
           <circle cx="400" cy="100" r="5" className="fill-emerald-400 opacity-40 animate-pulse" style={{animationDelay: '0.5s'}} />
        </g>
      </svg>
    </div>
  );
};

const Layout: React.FC<LayoutProps> = ({ children, step = 0 }) => {
  return (
    <div className="min-h-screen bg-[#f2f4f6] relative overflow-x-hidden flex flex-col font-sans text-slate-800">
      
      {/* Abstract Ambient Background (Apple-style blurred orbs) */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-[120px] opacity-60 animate-pulse" style={{animationDuration: '8s'}}></div>
         <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-teal-200/40 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-pulse" style={{animationDuration: '10s', animationDelay: '1s'}}></div>
         <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-blue-100/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-50"></div>
      </div>

      {/* Dynamic Growing Tree Background */}
      <BackgroundTree stage={step} />

      <main className="relative z-10 p-4 md:p-8 flex-grow flex flex-col justify-center">
        {children}
      </main>

      {/* Simple Footer */}
      <footer className="relative z-10 py-6 text-center text-emerald-900/30 text-[10px] font-bold tracking-widest uppercase">
        THE TREE · AI Career Growth System
      </footer>
    </div>
  );
};

export default Layout;