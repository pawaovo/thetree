import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { AIAnalysisResult, UserProfile, Recommendation } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface Props {
  user: UserProfile;
  result: AIAnalysisResult;
  onRestart: () => void;
}

// Configuration
const PARTICLE_COUNT = 320; 
const CONNECTION_DISTANCE = 100;
const MOUSE_RADIUS = 220; 
const CLONE_COUNT = 2; // Number of cloned items on each side for infinite loop

// Theme Colors (Emerald, Teal, Amber)
const PALETTE = [
  'rgba(16, 185, 129, alpha)', // Emerald 500
  'rgba(52, 211, 153, alpha)', // Emerald 400
  'rgba(20, 184, 166, alpha)', // Teal 500
  'rgba(251, 191, 36, alpha)',  // Amber 300 (Sunlight accent)
];

class OrganicParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  originX: number;
  originY: number;
  size: number;
  baseColor: string;
  baseAlpha: number;
  angle: number; 
  
  // Interactive state
  highlight: number = 0; // 0 to 1

  constructor(w: number, h: number) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.originX = this.x;
    this.originY = this.y;
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = (Math.random() - 0.5) * 0.6;
    this.size = Math.random() * 2.5 + 1; 
    this.baseColor = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    this.baseAlpha = Math.random() * 0.5 + 0.15;
    this.angle = Math.random() * Math.PI * 2;
  }

  update(
    w: number, 
    h: number, 
    targets: { x: number, y: number }[], 
    phase: 'flow' | 'focus', 
    mouseX: number, 
    mouseY: number
  ) {
    // 1. Organic Flow (Horizontal Drift with Wave)
    const flowX = Math.sin(this.y * 0.003 + this.angle) * 0.4 + 0.15; 
    const flowY = Math.cos(this.x * 0.003 + this.angle) * 0.3;

    if (phase === 'flow') {
        this.x += this.vx + flowX;
        this.y += this.vy + flowY;
    } 
    else if (phase === 'focus') {
        // Find nearest point on the "Galaxy River"
        let nearestDist = Infinity;
        let nearestTarget = targets[0];

        for (const t of targets) {
            const dx = t.x - this.x;
            const dy = t.y - this.y;
            const d = dx*dx + dy*dy;
            if (d < nearestDist) {
                nearestDist = d;
                nearestTarget = t;
            }
        }
        
        if (nearestTarget && nearestDist < 80000) { 
            const dx = nearestTarget.x - this.x;
            const dy = nearestTarget.y - this.y;
            this.x += dx * 0.01 + flowX; 
            this.y += dy * 0.01 + flowY;
        } else {
             this.x += this.vx + flowX;
             this.y += this.vy + flowY;
        }
    }

    // 2. Mouse Interaction
    if (mouseX > 0 && mouseY > 0) {
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const distSq = dx*dx + dy*dy;
        const radiusSq = MOUSE_RADIUS * MOUSE_RADIUS;
        
        if (distSq < radiusSq) {
            const dist = Math.sqrt(distSq);
            const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
            const angle = Math.atan2(dy, dx);
            
            this.x += Math.cos(angle) * force * 3;
            this.y += Math.sin(angle) * force * 3;
            this.highlight = Math.min(this.highlight + 0.1, 1);
        } else {
            this.highlight = Math.max(this.highlight - 0.03, 0);
        }
    } else {
        this.highlight = Math.max(this.highlight - 0.03, 0);
    }

    // Seamless Wrap
    if (this.x > w + 50) this.x = -50;
    if (this.x < -50) this.x = w + 50;
    if (this.y > h + 50) this.y = -50;
    if (this.y < -50) this.y = h + 50;

    this.angle += 0.015;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    
    const highlightEffect = this.highlight * 0.5; 
    const breath = Math.sin(this.angle) * 0.1;
    const finalAlpha = Math.min(1, this.baseAlpha + highlightEffect + breath);
    
    const scale = 1 + (this.highlight * 0.6); 
    const finalSize = this.size * scale;

    const color = this.baseColor.replace('alpha', finalAlpha.toString());
    ctx.fillStyle = color;
    
    ctx.arc(this.x, this.y, finalSize, 0, Math.PI * 2);
    ctx.fill();

    if (this.highlight > 0.5) {
        ctx.shadowColor = this.baseColor.replace('alpha', '0.6');
        ctx.shadowBlur = 10 * this.highlight;
        ctx.fill();
        ctx.shadowBlur = 0; 
    }
  }
}

const Report: React.FC<Props> = ({ user, result, onRestart }) => {
  const [showContent, setShowContent] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1, y: -1 });

  // Carousel State
  // We start at CLONE_COUNT which is the first "Real" item index in the extended array
  const [activeIndex, setActiveIndex] = useState(CLONE_COUNT);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // Controls transition duration (false = snap, true = smooth)
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, cardWidth: 0 });
  
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const hollandData = Object.entries(user.hollandScores).map(([subject, A]) => ({
    subject,
    A,
    fullMark: 10 
  }));

  // Prepare Extended List for Infinite Loop
  const extendedRecommendations = useMemo(() => {
    const list = result.recommendations;
    if (list.length === 0) return [];
    
    const leftClones = list.slice(-CLONE_COUNT).map((item, i) => ({ ...item, uniqueKey: `left-${i}` }));
    const realItems = list.map((item, i) => ({ ...item, uniqueKey: `real-${i}` }));
    const rightClones = list.slice(0, CLONE_COUNT).map((item, i) => ({ ...item, uniqueKey: `right-${i}` }));

    return [...leftClones, ...realItems, ...rightClones];
  }, [result.recommendations]);

  const realCount = result.recommendations.length;

  const getRealIndex = (extIndex: number) => {
    if (extIndex < CLONE_COUNT) {
      return realCount - (CLONE_COUNT - extIndex);
    } else if (extIndex >= CLONE_COUNT + realCount) {
      return extIndex - (CLONE_COUNT + realCount);
    } else {
      return extIndex - CLONE_COUNT;
    }
  };

  const handleNext = useCallback(() => {
    if (activeIndex >= extendedRecommendations.length - 1) return;
    setIsAnimating(true);
    setActiveIndex((prev) => prev + 1);
  }, [activeIndex, extendedRecommendations.length]);

  const handlePrev = useCallback(() => {
    if (activeIndex <= 0) return;
    setIsAnimating(true);
    setActiveIndex((prev) => prev - 1);
  }, [activeIndex]);

  const goToRealIndex = (idx: number) => {
    setIsAnimating(true);
    setActiveIndex(CLONE_COUNT + idx);
    setIsPaused(true);
  };

  const handleTransitionEnd = () => {
    if (activeIndex < CLONE_COUNT) {
      const offset = CLONE_COUNT - activeIndex;
      const newIndex = (CLONE_COUNT + realCount) - offset;
      
      setIsAnimating(false); 
      setActiveIndex(newIndex);
    } else if (activeIndex >= CLONE_COUNT + realCount) {
      const offset = activeIndex - (CLONE_COUNT + realCount);
      const newIndex = CLONE_COUNT + offset;
      
      setIsAnimating(false);
      setActiveIndex(newIndex);
    }
  };

  // Auto-play Logic
  useEffect(() => {
    if (!showContent) return;
    
    if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);

    if (!isPaused) {
      autoPlayTimerRef.current = setInterval(() => {
        handleNext();
      }, 5000);
    }

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [showContent, isPaused, handleNext]);

  // Layout Calculation
  useEffect(() => {
    const handleResize = () => {
        const w = window.innerWidth;
        const cardW = w < 768 ? w * 0.85 : 650; 
        setWindowDimensions({ width: w, cardWidth: cardW });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Canvas Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const setSize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };
    setSize();

    const particles: OrganicParticle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new OrganicParticle(width, height));
    }

    let animationId: number;
    let startTime = Date.now();
    let phase: 'flow' | 'focus' = 'flow';
    let isMounted = true;

    const getTargets = () => {
        const targets: {x: number, y: number}[] = [];
        const points = 30; 
        const startX = -width * 0.1;
        const endX = width * 1.1;
        const step = (endX - startX) / points;
        const centerY = height * 0.6; 
        const amplitude = height * 0.12; 

        for(let i=0; i <= points; i++) {
             const x = startX + (i * step);
             const normalizedX = (x / width) * (Math.PI * 2); 
             const yOffset = Math.sin(normalizedX) * amplitude;
             targets.push({ x, y: centerY + yOffset });
        }
        return targets;
    };

    const render = () => {
        if (!isMounted || !ctx) return;

        const elapsed = Date.now() - startTime;
        if (elapsed < 2000) {
            phase = 'flow';
        } else {
            phase = 'focus';
            if (!showContent && elapsed > 1800) setShowContent(true);
        }

        ctx.clearRect(0, 0, width, height);
        
        const targets = getTargets();

        particles.forEach(p => {
            p.update(width, height, targets, phase, mouseRef.current.x, mouseRef.current.y);
            p.draw(ctx);
        });

        // Connections
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)'; 
        ctx.lineWidth = 0.5;

        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                
                if (Math.abs(dx) > CONNECTION_DISTANCE || Math.abs(dy) > CONNECTION_DISTANCE) continue;

                const distSq = dx*dx + dy*dy;
                if (distSq < CONNECTION_DISTANCE * CONNECTION_DISTANCE) {
                    if (p1.highlight > 0.1 && p2.highlight > 0.1) {
                        ctx.strokeStyle = `rgba(52, 211, 153, ${0.1 + (p1.highlight * 0.2)})`;
                        ctx.beginPath(); 
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                        ctx.beginPath(); 
                        ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
                    } else {
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                    }
                }
            }
        }
        ctx.stroke();

        animationId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => setSize();
    const handleMouseMove = (e: MouseEvent) => {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        mouseRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      isMounted = false;
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [showContent]);

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.targetTouches.length > 0) {
        touchStartX.current = e.targetTouches[0].clientX;
        setIsPaused(true);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.changedTouches.length > 0) {
        touchEndX.current = e.changedTouches[0].clientX;
        const diff = touchStartX.current - touchEndX.current;
        
        if (Math.abs(diff) > 50) { // Threshold
            if (diff > 0) {
                handleNext();
            } else {
                handlePrev();
            }
        }
    }
  };

  const CARD_GAP = 24;
  const getCarouselStyle = () => {
      if (!windowDimensions.width) return {};
      
      const { width, cardWidth } = windowDimensions;
      const centerOffset = (width - cardWidth) / 2;
      const shift = activeIndex * (cardWidth + CARD_GAP);
      const translateX = centerOffset - shift;

      return { 
          transform: `translateX(${translateX}px)`,
          transition: isAnimating ? 'transform 500ms cubic-bezier(0.25, 0.8, 0.25, 1)' : 'none'
      };
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-auto z-0" 
      />

      {/* Intro Overlay */}
      <div 
        className={`fixed inset-0 flex items-center justify-center pointer-events-none z-20 transition-all duration-1000 ${showContent ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'}`}
      >
        <div className="text-center bg-white/40 backdrop-blur-md p-10 rounded-[3rem] shadow-[0_8px_32px_rgba(16,185,129,0.1)] border border-white/60">
            <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500/10 rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            </div>
            <h2 className="text-3xl font-black text-emerald-950 mb-2 tracking-tight">
                方案生成完毕
            </h2>
            <p className="text-emerald-800/60 font-medium">性格代码 {user.hollandCode} • 已为您规划 {result.recommendations.length} 条路径</p>
        </div>
      </div>

      {/* Main Content */}
      <div 
        className={`relative z-10 flex flex-col flex-1 transition-all duration-1000 transform ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        
        {/* Header Summary */}
        <div className="bg-white/70 backdrop-blur-xl p-8 rounded-b-[3rem] shadow-xl shadow-emerald-900/5 mb-6 relative overflow-hidden border-b border-white/50 mx-4 md:mx-auto max-w-5xl mt-4">
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row gap-8 items-center">
               <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/50 text-emerald-800 text-xs font-bold mb-3 border border-emerald-100">
                     <span>AI 分析完成</span>
                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>
                  <h1 className="text-4xl font-black mb-3 text-emerald-950 tracking-tight">{user.name} 的未来树</h1>
                  <p className="text-emerald-900/70 leading-relaxed font-medium text-lg">
                    "{result.studentSummary}"
                  </p>
               </div>
               <div className="w-32 h-32 md:w-40 md:h-40 bg-white/50 rounded-full p-2 border border-emerald-100 shadow-inner flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="65%" data={hollandData}>
                      <PolarGrid stroke="#d1fae5" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#059669', fontSize: 9, fontWeight: 'bold' }} />
                      <Radar name="Holland" dataKey="A" stroke="#10b981" strokeWidth={3} fill="#34d399" fillOpacity={0.4} />
                    </RadarChart>
                  </ResponsiveContainer>
               </div>
            </div>
          </div>
        </div>

        {/* Carousel Area */}
        <div className="flex-1 flex flex-col justify-center pb-8 min-h-[500px] overflow-hidden">
           <div 
             className="relative w-full h-full flex flex-col justify-center"
             onMouseEnter={() => setIsPaused(true)}
             onMouseLeave={() => setIsPaused(false)}
             onTouchStart={handleTouchStart}
             onTouchEnd={handleTouchEnd}
           >
              <div 
                className="flex items-center will-change-transform" 
                style={getCarouselStyle()}
                onTransitionEnd={handleTransitionEnd}
              >
                {extendedRecommendations.map((rec, idx) => {
                  const isActive = idx === activeIndex;
                  // Dynamic unique key for the extended list
                  const itemKey = (rec as any).uniqueKey || idx;

                  return (
                    <div 
                        key={itemKey} 
                        className="flex-shrink-0 transition-none"
                        style={{ width: windowDimensions.cardWidth, marginRight: CARD_GAP }}
                    >
                         <div 
                            onClick={() => { 
                                setIsAnimating(true);
                                setActiveIndex(idx); 
                                setIsPaused(true); 
                            }}
                            className={`
                                h-full transition-all duration-500 cursor-pointer origin-center
                                ${isActive 
                                    ? 'scale-100 opacity-100 blur-0 z-10' 
                                    : 'scale-90 opacity-40 blur-[2px] hover:opacity-60 grayscale-[30%] z-0'
                                }
                            `}
                         >
                             <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-[0_8px_40px_rgba(0,0,0,0.03)] border border-white/60 overflow-hidden h-full flex flex-col relative group hover:border-emerald-200/50 transition-colors">
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-100 via-emerald-300 to-emerald-100 opacity-50"></div>
                                <div className="p-6 md:p-10 flex flex-col h-full">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                      <div>
                                        <span className="text-xs font-black text-emerald-500/60 uppercase tracking-widest mb-2 block">
                                          推荐方案 {String(getRealIndex(idx) + 1).padStart(2, '0')}
                                        </span>
                                        <div className="flex gap-3 items-baseline">
                                          {rec.subjects.map(sub => (
                                            <span key={sub} className="text-4xl md:text-5xl font-black text-emerald-950 tracking-tight">{sub}</span>
                                          ))}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3 bg-gradient-to-br from-emerald-50 to-white px-5 py-3 rounded-2xl border border-emerald-100 shadow-sm">
                                        <div className="text-4xl font-black text-emerald-600">{rec.score}</div>
                                        <div className="text-[10px] font-bold text-emerald-800/50 leading-tight uppercase text-right">匹配<br/>指数</div>
                                      </div>
                                    </div>

                                    <p className="text-emerald-900/80 leading-relaxed font-medium bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100/50 mb-8 flex-grow">
                                        <span className="block text-xs font-bold text-emerald-900/40 uppercase mb-2">核心推荐理由</span>
                                        {rec.reason}
                                    </p>

                                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900/40 uppercase tracking-wide">
                                                <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                                                推荐专业方向
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                              {rec.path.majors.highProb.map(m => (
                                                <span key={m} className="px-3 py-1.5 bg-emerald-100 text-emerald-900 rounded-xl text-sm font-bold border border-emerald-200">{m}</span>
                                              ))}
                                              {rec.path.majors.medProb.slice(0,3).map(m => (
                                                <span key={m} className="px-3 py-1.5 bg-white text-gray-500 rounded-xl text-sm font-medium border border-gray-100">{m}</span>
                                              ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900/40 uppercase tracking-wide">
                                                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                                                未来职业发展
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                              {rec.path.careers.highRel.map(c => (
                                                <span key={c} className="px-3 py-1.5 bg-blue-50 text-blue-800 rounded-xl text-sm font-bold border border-blue-100">{c}</span>
                                              ))}
                                              {rec.path.careers.potential.slice(0,3).map(c => (
                                                <span key={c} className="px-3 py-1.5 bg-white text-gray-400 rounded-xl text-sm font-medium border border-gray-100">{c}</span>
                                              ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Arrows */}
              <button 
                onClick={() => { setIsPaused(true); handlePrev(); }}
                className="absolute top-1/2 left-2 md:left-8 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white text-emerald-900 rounded-full shadow-lg flex items-center justify-center transition-all z-20 hover:scale-110 border border-emerald-100/50 hidden md:flex backdrop-blur-md"
              >
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                 </svg>
              </button>
              <button 
                onClick={() => { setIsPaused(true); handleNext(); }}
                className="absolute top-1/2 right-2 md:right-8 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white text-emerald-900 rounded-full shadow-lg flex items-center justify-center transition-all z-20 hover:scale-110 border border-emerald-100/50 hidden md:flex backdrop-blur-md"
              >
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                 </svg>
              </button>
           </div>

           {/* Pagination Dots */}
           <div className="flex justify-center gap-3 mt-8 relative z-20">
              {result.recommendations.map((_, realIdx) => {
                 const currentRealIndex = getRealIndex(activeIndex);
                 const isDotActive = currentRealIndex === realIdx;
                 return (
                    <button 
                      key={realIdx}
                      onClick={() => goToRealIndex(realIdx)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        isDotActive 
                          ? 'w-10 bg-emerald-500 shadow-lg shadow-emerald-500/30' 
                          : 'w-2.5 bg-emerald-200 hover:bg-emerald-300'
                      }`}
                      aria-label={`Go to slide ${realIdx + 1}`}
                    />
                 );
              })}
           </div>
           
           <div className="text-center mt-8 relative z-20">
              <button 
                onClick={onRestart}
                className="group relative px-8 py-3 bg-white/80 backdrop-blur-sm text-emerald-900 font-bold rounded-2xl shadow-lg shadow-emerald-900/5 hover:shadow-emerald-900/10 transition-all border border-transparent hover:border-emerald-200 hover:-translate-y-1 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  重新开始探索
                </span>
                <div className="absolute inset-0 bg-emerald-50 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Report;