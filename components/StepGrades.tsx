import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ExamRecord, Subject, UserProfile } from '../types';
import { EXAM_TYPES, SUBJECT_LIST } from '../constants';

interface Props {
  data: Partial<UserProfile>;
  updateData: (data: Partial<UserProfile>) => void;
  onNext: () => void;
  onBack: () => void;
}

// Grade Selector Component
const GradeSelector: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedGrade, setExpandedGrade] = useState<string | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node) &&
          dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setExpandedGrade(null);
      }
    };

    const updatePosition = () => {
      if (isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + 8,
          left: rect.left
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        left: rect.left
      });
    }
    setIsOpen(!isOpen);
  };

  const mainGrades = ['A', 'B', 'C', 'D', 'E'];
  const subGrades: Record<string, string[]> = {
    A: ['A1', 'A2', 'A3', 'A4', 'A5'],
    B: ['B1', 'B2', 'B3', 'B4', 'B5'],
    C: ['C1', 'C2', 'C3', 'C4', 'C5'],
    D: ['D1', 'D2', 'D3', 'D4', 'D5'],
  };

  const handleMainGradeClick = (grade: string) => {
    if (grade === 'E') {
      onChange('E');
      setIsOpen(false);
      setExpandedGrade(null);
    } else {
      setExpandedGrade(expandedGrade === grade ? null : grade);
    }
  };

  const handleSubGradeClick = (subGrade: string) => {
    onChange(subGrade);
    setIsOpen(false);
    setExpandedGrade(null);
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="w-20 px-3 py-4 rounded-2xl border-2 border-emerald-100 bg-gradient-to-br from-emerald-50 to-white hover:from-emerald-100 hover:to-emerald-50 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50 outline-none transition-all font-bold text-emerald-700 shadow-sm cursor-pointer text-center"
      >
        {value || '-'}
      </button>
      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          className="fixed w-32 bg-white rounded-2xl shadow-2xl border-2 border-emerald-100 overflow-hidden z-[9999] max-h-64 overflow-y-auto"
          style={{ top: `${position.top}px`, left: `${position.left}px` }}
        >
          {mainGrades.map((grade) => (
            <div key={grade}>
              <button
                type="button"
                onClick={() => handleMainGradeClick(grade)}
                className="w-full px-4 py-2.5 text-left font-bold text-emerald-900 hover:bg-emerald-50 transition-colors flex items-center justify-between"
              >
                {grade}
                {grade !== 'E' && (
                  <svg className={`w-4 h-4 transition-transform ${expandedGrade === grade ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>
              {expandedGrade === grade && subGrades[grade] && (
                <div className="bg-emerald-50/50">
                  {subGrades[grade].map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => handleSubGradeClick(sub)}
                      className="w-full px-6 py-2 text-left text-sm font-medium text-emerald-800 hover:bg-emerald-100 transition-colors"
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>,
        document.body
      )}
    </>
  );
};

const StepGrades: React.FC<Props> = ({ data, updateData, onNext, onBack }) => {
  const [activeTab, setActiveTab] = useState(EXAM_TYPES[0].id);
  const [showImportModal, setShowImportModal] = useState(false);

  // Initialize exams if not present
  const currentExams = data.exams || EXAM_TYPES.map(type => ({
    examName: type.label,
    scores: {},
    subjectGrades: {},
    totalScore: undefined,
    rank: undefined,
    totalStudents: undefined
  }));

  const handleScoreChange = (examIndex: number, subjectKey: string, value: string) => {
    const newExams = [...currentExams];
    const numValue = value === '' ? 0 : parseFloat(value);
    
    if (!newExams[examIndex].scores) newExams[examIndex].scores = {};
    newExams[examIndex].scores[subjectKey] = numValue;
    
    updateData({ exams: newExams });
  };

  const handleMetaChange = (
    examIndex: number,
    field: 'rank' | 'totalStudents' | 'totalScore',
    value: string
  ) => {
    const newExams = [...currentExams];
    const exam = newExams[examIndex];
    const numValue = value === '' ? undefined : parseFloat(value);
    if (field === 'rank') exam.rank = numValue;
    if (field === 'totalStudents') exam.totalStudents = numValue;
    if (field === 'totalScore') exam.totalScore = numValue;
    updateData({ exams: newExams });
  };

  const handleSubjectGradeChange = (examIndex: number, subjectKey: string, grade: string) => {
    const newExams = [...currentExams];
    if (!newExams[examIndex].subjectGrades) newExams[examIndex].subjectGrades = {};
    newExams[examIndex].subjectGrades![subjectKey] = grade;
    updateData({ exams: newExams });
  };

  // Generate Mock Data
  const mockExamsData = useMemo(() => {
    return EXAM_TYPES.map((type, index) => {
      const baseScores: Record<string, number> = {
          [Subject.CHINESE]: 108 + (index * 2),
          [Subject.MATH]: 125 + (index * 5),
          [Subject.ENGLISH]: 118 + (index * 3),
          [Subject.PHYSICS]: 88 + (index * 2),
          [Subject.CHEMISTRY]: 82 + (index * 2),
          [Subject.BIOLOGY]: 85 + index,
          [Subject.HISTORY]: 72 + index,
          [Subject.GEOGRAPHY]: 76,
          [Subject.POLITICS]: 68,
      };

      const subjectGrades: Record<string, string> = {
          [Subject.PHYSICS]: ['A2', 'A1', 'B3'][index],
          [Subject.CHEMISTRY]: ['B1', 'A3', 'A2'][index],
          [Subject.BIOLOGY]: ['A1', 'B2', 'A4'][index],
          [Subject.HISTORY]: ['B3', 'B4', 'C2'][index],
          [Subject.GEOGRAPHY]: ['B2', 'C1', 'B5'][index],
          [Subject.POLITICS]: ['C3', 'B5', 'B4'][index],
      };

      let totalScore = 0;
      Object.values(baseScores).forEach(s => totalScore += s);

      return {
          examName: type.label,
          scores: baseScores,
          subjectGrades: subjectGrades,
          totalScore: totalScore,
          rank: Math.max(1, 120 - (index * 15)),
          totalStudents: 800
      };
    });
  }, []);

  const handleConfirmImport = () => {
    updateData({ exams: mockExamsData });
    setShowImportModal(false);
  };

  const activeExamIndex = EXAM_TYPES.findIndex(e => e.id === activeTab);
  const activeExam = currentExams[activeExamIndex];

  // Validation: Check if required exams have basic data
  const isValid = EXAM_TYPES.filter(t => t.required).every((type, idx) => {
    const exam = currentExams[idx];
    // Simple check: Needs at least rank and some scores
    const hasScores = exam.scores && Object.keys(exam.scores).length > 0;
    return exam.rank && hasScores;
  });

  return (
    <div className="animate-fade-in max-w-4xl mx-auto relative pb-24">
      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-emerald-900/20 backdrop-blur-sm" onClick={() => setShowImportModal(false)}></div>
            <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden flex flex-col max-h-[90vh] border border-white">
                <div className="p-6 border-b border-emerald-100/50 bg-emerald-50/30">
                    <h3 className="text-xl font-bold text-emerald-900">模拟数据预览</h3>
                    <p className="text-sm text-emerald-800/60 mt-1">
                       我们将为你填入演示数据，以便你快速体验。
                    </p>
                </div>
                <div className="p-6 overflow-y-auto">
                    <div className="space-y-4">
                        {mockExamsData.map((exam, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                <div className="flex justify-between text-sm font-bold text-emerald-900 mb-3">
                                    <span>{exam.examName}</span>
                                    <span>Rank: {exam.rank}/{exam.totalStudents}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                    {SUBJECT_LIST.map((sub) => {
                                        const score = exam.scores[sub.key];
                                        const grade = exam.subjectGrades?.[sub.key];
                                        return (
                                            <div key={sub.key} className="bg-gray-50 px-2 py-1.5 rounded-lg">
                                                <div className="font-bold text-gray-700">{sub.label}</div>
                                                <div className="flex items-center justify-between mt-0.5">
                                                    <span className="text-emerald-600 font-medium">{score}</span>
                                                    {grade && <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-bold">{grade}</span>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-4 border-t border-emerald-100/50 bg-gray-50/50 flex justify-end gap-3">
                    <button onClick={() => setShowImportModal(false)} className="px-5 py-2.5 text-gray-500 hover:text-gray-800 font-bold text-sm transition-colors">取消</button>
                    <button onClick={handleConfirmImport} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-lg text-sm font-bold transition-all hover:scale-105 active:scale-95">确认导入</button>
                </div>
            </div>
        </div>
      )}

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-emerald-950 mb-1">养分积累</h2>
            <p className="text-emerald-900/60 text-sm font-medium">输入历史成绩，AI将分析你的学科优势。</p>
          </div>
          <button 
            onClick={() => setShowImportModal(true)}
            className="text-emerald-700 text-sm font-bold hover:bg-white px-4 py-2 rounded-xl border border-emerald-900/10 bg-white/50 backdrop-blur-md transition-all shadow-sm hover:shadow-md"
          >
             ⚡ 导入数据
          </button>
      </div>

      {/* Main Glass Card */}
      <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] border border-white/60 overflow-hidden">
        
        {/* Apple Style Segmented Control Tabs */}
        <div className="p-2">
            <div className="flex bg-gray-100/50 p-1.5 rounded-[1.8rem] overflow-x-auto">
            {EXAM_TYPES.map((type) => {
                const isActive = activeTab === type.id;
                return (
                    <button
                        key={type.id}
                        onClick={() => setActiveTab(type.id)}
                        className={`flex-1 min-w-[120px] py-3 text-sm font-bold rounded-[1.4rem] transition-all duration-300 relative z-10 ${
                            isActive 
                                ? 'bg-white text-emerald-900 shadow-[0_4px_12px_rgba(0,0,0,0.05)]' 
                                : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        {type.label}
                    </button>
                )
            })}
            </div>
        </div>

        {/* Form Content */}
        <div className="p-6 md:p-8">
            {/* Meta Data Row */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <div className="col-span-1">
                   <label className="block text-xs font-bold text-emerald-900/60 mb-2 pl-2">年级排名 (Rank)</label>
                   <input
                      type="number"
                      placeholder="150"
                      value={activeExam.rank || ''}
                      onChange={(e) => handleMetaChange(activeExamIndex, 'rank', e.target.value)}
                      onWheel={(e) => e.currentTarget.blur()}
                      className="w-full px-5 py-3.5 rounded-2xl border-none bg-white focus:bg-white focus:ring-4 focus:ring-emerald-100/50 outline-none transition-all font-mono text-emerald-900 font-bold shadow-inner"
                   />
                </div>
                <div className="col-span-1">
                   <label className="block text-xs font-bold text-emerald-900/60 mb-2 pl-2">年级总人数</label>
                   <input
                      type="number"
                      placeholder="800"
                      value={activeExam.totalStudents || ''}
                      onChange={(e) => handleMetaChange(activeExamIndex, 'totalStudents', e.target.value)}
                      onWheel={(e) => e.currentTarget.blur()}
                      className="w-full px-5 py-3.5 rounded-2xl border-none bg-white focus:bg-white focus:ring-4 focus:ring-emerald-100/50 outline-none transition-all font-mono text-emerald-900 font-bold shadow-inner"
                   />
                </div>
                <div className="col-span-2 md:col-span-1">
                   <div className="h-full flex items-center p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 text-xs text-emerald-800 font-medium leading-relaxed">
                      ℹ️ 选考科目需填写赋分等级
                   </div>
                </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent w-full mb-8"></div>

            {/* Main Subjects */}
            <div className="mb-8">
                <h3 className="text-xs font-bold text-emerald-900/60 mb-4 pl-2">主科</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
                    {SUBJECT_LIST.filter(sub => sub.type === 'main').map((sub) => (
                        <div key={sub.key} className="relative group">
                            <label className="flex justify-between text-sm font-bold text-emerald-950 mb-2 px-1">
                                <span>{sub.label}</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    placeholder="-"
                                    value={activeExam.scores[sub.key] || ''}
                                    onChange={(e) => handleScoreChange(activeExamIndex, sub.key, e.target.value)}
                                    onWheel={(e) => e.currentTarget.blur()}
                                    className={`w-full px-5 py-4 rounded-2xl border outline-none transition-all font-mono text-xl shadow-sm ${
                                        activeExam.scores[sub.key]
                                        ? 'bg-white border-emerald-100 text-emerald-900 shadow-emerald-100'
                                        : 'bg-white/50 border-transparent text-gray-400 focus:bg-white focus:border-emerald-200 focus:shadow-md'
                                    }`}
                                />
                                <span className="absolute right-3 top-2 text-[10px] text-emerald-200 font-black tracking-wider select-none">MAIN</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent w-full mb-8"></div>

            {/* Elective Subjects */}
            <div>
                <h3 className="text-xs font-bold text-emerald-900/60 mb-4 pl-2">选考科目</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                    {SUBJECT_LIST.filter(sub => sub.type === 'sub').map((sub) => (
                        <div key={sub.key} className="relative group">
                            <label className="flex justify-between text-sm font-bold text-emerald-900/80 mb-2 px-1">
                                <span>{sub.label}</span>
                            </label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <input
                                        type="number"
                                        placeholder="-"
                                        value={activeExam.scores[sub.key] || ''}
                                        onChange={(e) => handleScoreChange(activeExamIndex, sub.key, e.target.value)}
                                        onWheel={(e) => e.currentTarget.blur()}
                                        className={`w-full px-5 py-4 rounded-2xl border outline-none transition-all font-mono text-xl shadow-sm ${
                                            activeExam.scores[sub.key]
                                            ? 'bg-white border-emerald-100 text-emerald-900 shadow-emerald-100'
                                            : 'bg-white/50 border-transparent text-gray-400 focus:bg-white focus:border-emerald-200 focus:shadow-md'
                                        }`}
                                    />
                                </div>
                                <GradeSelector
                                    value={activeExam.subjectGrades?.[sub.key] || ''}
                                    onChange={(grade) => handleSubjectGradeChange(activeExamIndex, sub.key, grade)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-between items-center mt-8 px-4">
          <button onClick={onBack} className="text-gray-500 hover:text-emerald-900 font-bold px-4 py-2 rounded-lg hover:bg-white/50 transition-colors">
            上一步
          </button>
          <div className="flex gap-4 items-center">
              <div className="text-xs text-emerald-900/30 hidden md:block font-bold">
                  {isValid ? "数据完整" : "请至少完善前两次考试的排名与分数"}
              </div>
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

export default StepGrades;