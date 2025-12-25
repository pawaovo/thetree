import React, { useState, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, Cell, PieChart, Pie
} from 'recharts';

interface Props {
  onBack: () => void;
}

// Simulated data map for interactivity
const INTERACTIVE_DATA: Record<string, {
  careers: { name: string; value: number; color: string }[];
  cases: { id: string; year: number; rec: string; major: string; status: string; score: string }[];
}> = {
  '物化生': {
    careers: [
      { name: '工程技术', value: 35, color: '#059669' },
      { name: '临床医学', value: 25, color: '#10b981' },
      { name: '计算机/AI', value: 20, color: '#34d399' },
      { name: '基础科研', value: 20, color: '#6ee7b7' },
    ],
    cases: [
      { id: '#8821', year: 2020, rec: '物化生', major: '临床医学 (985)', status: '三甲医院规培', score: '完美' },
      { id: '#5119', year: 2023, rec: '物化生', major: '计算机科学', status: '本科在读', score: '完美' },
      { id: '#8812', year: 2021, rec: '物化生', major: '土木工程', status: '转行中', score: '中等' },
      { id: '#6631', year: 2022, rec: '物化生', major: '电子信息', status: '读研深造', score: '高度' },
      { id: '#9901', year: 2019, rec: '物化生', major: '生物科学', status: '博士在读', score: '高度' },
      { id: '#1234', year: 2024, rec: '物化生', major: '人工智能', status: '大一新生', score: '完美' },
      { id: '#2255', year: 2020, rec: '物化生', major: '口腔医学', status: '牙科医生', score: '完美' },
      { id: '#3341', year: 2021, rec: '物化生', major: '自动化', status: '国企工程师', score: '高度' },
      { id: '#4412', year: 2022, rec: '物化生', major: '应用物理', status: '出国深造', score: '高度' },
      { id: '#5599', year: 2023, rec: '物化生', major: '软件工程', status: '互联网实习', score: '完美' },
      { id: '#6677', year: 2019, rec: '物化生', major: '化学工程', status: '化工厂技术员', score: '中等' },
      { id: '#7788', year: 2024, rec: '物化生', major: '微电子', status: '大一新生', score: '完美' },
      { id: '#8899', year: 2022, rec: '物化生', major: '生物医学工程', status: '读研深造', score: '高度' },
      { id: '#1010', year: 2020, rec: '物化生', major: '机械设计', status: '车企研发', score: '高度' },
      { id: '#2020', year: 2023, rec: '物化生', major: '数据科学', status: '本科在读', score: '完美' },
      { id: '#3030', year: 2021, rec: '物化生', major: '环境科学', status: '环保局', score: '中等' },
    ]
  },
  '物化地': {
    careers: [
      { name: '建筑规划', value: 30, color: '#059669' },
      { name: '资源环境', value: 25, color: '#10b981' },
      { name: '工程类', value: 25, color: '#34d399' },
      { name: '其他', value: 20, color: '#6ee7b7' },
    ],
    cases: [
      { id: '#7741', year: 2021, rec: '物化地', major: '城乡规划', status: '建筑设计院', score: '高度' },
      { id: '#3321', year: 2022, rec: '物化地', major: '测绘工程', status: '国企单位', score: '中等' },
      { id: '#1199', year: 2023, rec: '物化地', major: '地理科学', status: '本科在读', score: '高度' },
      { id: '#5611', year: 2020, rec: '物化地', major: '土木工程', status: '施工单位', score: '中等' },
      { id: '#2234', year: 2024, rec: '物化地', major: '智能建造', status: '大一新生', score: '完美' },
      { id: '#9988', year: 2019, rec: '物化地', major: '风景园林', status: '设计工作室', score: '高度' },
      { id: '#8877', year: 2021, rec: '物化地', major: '地质工程', status: '勘探队', score: '高度' },
      { id: '#7766', year: 2022, rec: '物化地', major: 'GIS地理信息', status: '读研深造', score: '完美' },
      { id: '#6655', year: 2023, rec: '物化地', major: '房地产管理', status: '本科在读', score: '中等' },
      { id: '#5544', year: 2020, rec: '物化地', major: '给排水工程', status: '市政设计院', score: '高度' },
      { id: '#4433', year: 2024, rec: '物化地', major: '遥感科学', status: '大一新生', score: '高度' },
      { id: '#3322', year: 2019, rec: '物化地', major: '城市管理', status: '公务员', score: '高度' },
      { id: '#2211', year: 2022, rec: '物化地', major: '建筑学', status: '读研深造', score: '完美' },
    ]
  },
  '史政地': {
    careers: [
      { name: '法学/律师', value: 40, color: '#059669' },
      { name: '教育/教师', value: 25, color: '#10b981' },
      { name: '公务员', value: 20, color: '#34d399' },
      { name: '新闻传媒', value: 15, color: '#6ee7b7' },
    ],
    cases: [
       { id: '#9332', year: 2021, rec: '史政地', major: '法学 (211)', status: '律所实习', score: '高度' },
       { id: '#2211', year: 2020, rec: '史政地', major: '汉语言文学', status: '中学教师', score: '完美' },
       { id: '#4455', year: 2023, rec: '史政地', major: '新闻学', status: '本科在读', score: '中等' },
       { id: '#1001', year: 2019, rec: '史政地', major: '历史学', status: '博物馆', score: '完美' },
       { id: '#3399', year: 2024, rec: '史政地', major: '网络与新媒体', status: '大一新生', score: '高度' },
       { id: '#4488', year: 2022, rec: '史政地', major: '思想政治教育', status: '保研', score: '完美' },
       { id: '#5577', year: 2021, rec: '史政地', major: '社会学', status: 'NGO组织', score: '高度' },
       { id: '#6666', year: 2020, rec: '史政地', major: '广播电视编导', status: '电视台', score: '高度' },
       { id: '#7755', year: 2023, rec: '史政地', major: '知识产权', status: '本科在读', score: '高度' },
       { id: '#8844', year: 2019, rec: '史政地', major: '考古学', status: '研究院', score: '完美' },
       { id: '#9933', year: 2024, rec: '史政地', major: '哲学', status: '大一新生', score: '中等' },
       { id: '#0022', year: 2022, rec: '史政地', major: '小学教育', status: '实习教师', score: '高度' },
       { id: '#1111', year: 2021, rec: '史政地', major: '行政管理', status: '考公上岸', score: '高度' },
    ]
  },
  '物生政': {
    careers: [
      { name: '公共卫生', value: 30, color: '#059669' },
      { name: '生物制药', value: 25, color: '#10b981' },
      { name: '法学(知产)', value: 20, color: '#34d399' },
      { name: '行政管理', value: 25, color: '#6ee7b7' },
    ],
    cases: [
       { id: '#6522', year: 2022, rec: '物生政', major: '公共卫生', status: '读研深造', score: '中等' },
       { id: '#1231', year: 2021, rec: '物生政', major: '药学', status: '药企研发', score: '高度' },
       { id: '#8999', year: 2023, rec: '物生政', major: '行政管理', status: '本科在读', score: '中等' },
       { id: '#7711', year: 2020, rec: '物生政', major: '护理学', status: '三甲护士', score: '完美' },
       { id: '#6622', year: 2024, rec: '物生政', major: '预防医学', status: '大一新生', score: '高度' },
       { id: '#5533', year: 2019, rec: '物生政', major: '生物技术', status: '考研二战', score: '中等' },
       { id: '#4444', year: 2022, rec: '物生政', major: '社会工作', status: '社工机构', score: '高度' },
       { id: '#3355', year: 2023, rec: '物生政', major: '食品科学', status: '本科在读', score: '高度' },
       { id: '#2266', year: 2021, rec: '物生政', major: '园艺', status: '农业公司', score: '中等' },
       { id: '#1177', year: 2020, rec: '物生政', major: '知识产权', status: '法务专员', score: '高度' },
    ]
  }
};

const AdminDashboard: React.FC<Props> = ({ onBack }) => {
  // State for interactivity
  const [selectedGroup, setSelectedGroup] = useState<string>('物化生');
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  // 1. Trend Data: Accuracy over years
  const trendData = [
    { year: '2019', users: 1200, accuracy: 76 },
    { year: '2020', users: 2400, accuracy: 82 },
    { year: '2021', users: 3800, accuracy: 85 },
    { year: '2022', users: 5600, accuracy: 88 },
    { year: '2023', users: 8900, accuracy: 91 },
    { year: '2024', users: 12450, accuracy: 93.5 },
  ];

  // 2. Subject Divergence: Recommended vs Actual Choice
  const divergenceData = [
    { name: '物化生', recommended: 45, actual: 42 },
    { name: '物化地', recommended: 20, actual: 25 },
    { name: '史政地', recommended: 15, actual: 12 },
    { name: '物生政', recommended: 10, actual: 15 },
    { name: '其他组合', recommended: 10, actual: 6 },
  ];

  // Derived data based on selection
  const currentDetails = useMemo(() => {
    return INTERACTIVE_DATA[selectedGroup] || INTERACTIVE_DATA['物化生'];
  }, [selectedGroup]);

  // Filter cases by year
  const filteredCases = useMemo(() => {
    let cases = currentDetails.cases;
    if (selectedYear) {
      cases = cases.filter(c => c.year.toString() === selectedYear);
    }
    // Sort by year desc
    return cases.sort((a, b) => b.year - a.year);
  }, [currentDetails, selectedYear]);

  // Handler for Bar Chart Click (Groups)
  const handleBarClick = (state: any) => {
    if (state && state.activeLabel) {
      const name = state.activeLabel;
      if (INTERACTIVE_DATA[name]) {
        setSelectedGroup(name);
        // We keep the selectedYear if it exists, to allow cross-filtering
      }
    }
  };

  // Handler for Area Chart Click (Years)
  const handleAreaClick = (state: any) => {
    if (state && state.activeLabel) {
       // Toggle year selection
       const year = state.activeLabel;
       if (selectedYear === year) {
         setSelectedYear(null);
       } else {
         setSelectedYear(year);
       }
    }
  };

  return (
    <div className="animate-fade-in pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-emerald-950">THE TREE · 生态监测站</h2>
          <p className="text-emerald-800 font-medium">长期追踪数据：从种子建议到果实成熟的全周期分析</p>
        </div>
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-white/50 text-emerald-800 font-bold rounded-xl shadow hover:bg-white transition-colors border border-white/60 backdrop-blur-md"
        >
          返回首页
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: '累计服务学生', value: '12,450', sub: '人次', trend: '+12% YoY' },
          { label: '选科建议采纳率', value: '89.2', sub: '%', trend: '+2.4% YoY' },
          { label: '高考专业匹配度', value: '93.5', sub: '%', trend: 'AI预测准确性' },
          { label: '就业满意度追踪', value: '4.8', sub: '/5.0', trend: '毕业生反馈' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white/60 backdrop-blur-lg p-6 rounded-[2rem] shadow-sm border border-white/60 hover:bg-white/80 transition-all">
            <div className="text-sm text-emerald-900/60 mb-1 font-semibold">{stat.label}</div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-emerald-900">{stat.value}</span>
              <span className="text-xs text-emerald-700/60 font-medium">{stat.sub}</span>
            </div>
            <div className="mt-2 text-xs font-bold text-emerald-700 bg-emerald-100/40 inline-block px-2 py-1 rounded border border-emerald-100/30">
              {stat.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Chart 1: Evolution of Accuracy (Interactive Year) */}
        <div 
          className={`bg-white/60 backdrop-blur-lg rounded-[2.5rem] p-6 shadow-xl border transition-all cursor-pointer ${
            selectedYear ? 'border-emerald-300 ring-2 ring-emerald-200/50' : 'border-white/60 hover:border-white'
          }`}
        >
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-emerald-950">AI 预测准确度演变</h3>
              <p className="text-xs text-emerald-800/60 font-medium">点击年份节点，筛选下方个案数据</p>
            </div>
            {selectedYear && (
              <span className="px-2 py-1 bg-emerald-100/70 text-emerald-900 text-xs rounded font-bold animate-fade-in backdrop-blur-md border border-emerald-200/50">
                筛选年份: {selectedYear}
              </span>
            )}
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} onClick={handleAreaClick}>
                <defs>
                  <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis 
                  dataKey="year" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={({ x, y, payload }) => (
                    <text x={x} y={y} dy={16} textAnchor="middle" fill={payload.value === selectedYear ? '#059669' : '#4b5563'} fontSize={12} fontWeight={payload.value === selectedYear ? 'bold' : 'normal'}>
                      {payload.value}
                    </text>
                  )} 
                />
                <YAxis domain={[60, 100]} axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                />
                <Area 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="#059669" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorAcc)" 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Rec vs Actual (Interactive Group) */}
        <div 
           className={`bg-white/60 backdrop-blur-lg rounded-[2.5rem] p-6 shadow-xl border transition-all cursor-pointer ${
            selectedGroup ? 'border-emerald-300 ring-2 ring-emerald-200/50' : 'border-white/60 hover:border-white'
          }`}
        >
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-emerald-950">选科偏差分析</h3>
              <p className="text-xs text-emerald-800/60 font-medium">点击柱状图，查看不同组合的就业流向</p>
            </div>
            <div className="px-2 py-1 bg-emerald-100/70 backdrop-blur-md text-emerald-900 text-xs rounded font-bold border border-emerald-200/50">
              当前组合: {selectedGroup}
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={divergenceData} barGap={0} onClick={handleBarClick}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={({ x, y, payload }) => (
                    <text x={x} y={y} dy={16} textAnchor="middle" fill={payload.value === selectedGroup ? '#059669' : '#4b5563'} fontSize={11} fontWeight={payload.value === selectedGroup ? 'bold' : 'normal'}>
                      {payload.value}
                    </text>
                  )}
                />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 12}} />
                <Tooltip cursor={{fill: 'rgba(16,185,129,0.1)'}} contentStyle={{borderRadius: '16px', border: 'none', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Legend iconType="circle" />
                <Bar name="系统推荐" dataKey="recommended" fill="#34d399" radius={[4, 4, 0, 0]} barSize={20}>
                  {divergenceData.map((entry, index) => (
                    <Cell key={`cell-rec-${index}`} fill={entry.name === selectedGroup ? '#059669' : '#34d399'} />
                  ))}
                </Bar>
                <Bar name="实际选择" dataKey="actual" fill="#065f46" radius={[4, 4, 0, 0]} barSize={20}>
                   {divergenceData.map((entry, index) => (
                    <Cell key={`cell-act-${index}`} fill={entry.name === selectedGroup ? '#022c22' : '#065f46'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Outcome Analysis Section (DYNAMIC) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
        
        {/* Career Distribution Pie */}
        <div className="bg-white/60 backdrop-blur-lg rounded-[2.5rem] p-6 shadow-xl border border-white/60 lg:col-span-1 transition-all duration-300">
          <h3 className="text-lg font-bold text-emerald-950 mb-2">"{selectedGroup}" 组合流向追踪</h3>
          <p className="text-xs text-emerald-800/60 mb-6 font-medium">该组合学生大学毕业后的实际行业分布</p>
          <div className="h-64 relative">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={currentDetails.careers}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {currentDetails.careers.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '16px', border: 'none', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                </PieChart>
             </ResponsiveContainer>
             {/* Center Text */}
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <span className="text-2xl font-black text-emerald-800">Top1</span>
                <div className="text-xs text-emerald-800/60 font-medium">{currentDetails.careers[0].name}</div>
             </div>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {currentDetails.careers.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1 text-xs text-emerald-900/80 font-medium">
                <span className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></span>
                {item.name}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tracking List (DYNAMIC & FILTERED) */}
        <div className="bg-white/60 backdrop-blur-lg rounded-[2.5rem] p-6 shadow-xl border border-white/60 lg:col-span-2 transition-all duration-300">
           <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-bold text-emerald-950">
                  "{selectedGroup}" 个案追踪日志 
                  {selectedYear && <span className="ml-2 text-emerald-600">({selectedYear}年)</span>}
                </h3>
                <p className="text-xs text-emerald-800/60 font-medium">显示该组合下的真实学生发展路径</p>
              </div>
              <span className="text-xs text-emerald-800 bg-emerald-50/50 px-2 py-1 rounded border border-emerald-100/20 font-bold">
                共 {filteredCases.length} 条数据
              </span>
           </div>
           
           <div className="overflow-x-auto min-h-[300px] max-h-[500px]">
             {filteredCases.length > 0 ? (
               <table className="w-full text-left text-sm">
                 <thead className="sticky top-0 bg-white/40 backdrop-blur-md">
                   <tr className="text-emerald-800/60 border-b border-gray-200/30">
                     <th className="pb-3 font-bold pl-2">学生ID</th>
                     <th className="pb-3 font-bold">推荐年份</th>
                     <th className="pb-3 font-bold">系统建议</th>
                     <th className="pb-3 font-bold">实际录取专业</th>
                     <th className="pb-3 font-bold">当前状态</th>
                     <th className="pb-3 font-bold text-right pr-2">匹配评价</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100/30">
                   {filteredCases.map((row, idx) => (
                     <tr key={idx} className="group hover:bg-white/50 transition-colors">
                       <td className="py-4 text-emerald-950 font-mono font-bold pl-2">{row.id}</td>
                       <td className="py-4 text-emerald-800/70">{row.year}</td>
                       <td className="py-4 font-bold text-emerald-800">{row.rec}</td>
                       <td className="py-4 text-emerald-700 font-medium">{row.major}</td>
                       <td className="py-4 text-emerald-800/80">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/40 text-emerald-900 border border-white/40 backdrop-blur-sm">
                            {row.status}
                          </span>
                       </td>
                       <td className="py-4 text-right pr-2">
                         <span className={`text-xs font-bold px-2 py-1 rounded backdrop-blur-sm ${
                           row.score === '完美' ? 'bg-emerald-100/50 text-emerald-800' :
                           row.score === '高度' ? 'bg-blue-50/50 text-blue-700' : 'bg-orange-50/50 text-orange-700'
                         }`}>
                           {row.score}
                         </span>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             ) : (
               <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                 <svg className="w-12 h-12 mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                 </svg>
                 <p>{selectedYear}年暂无"{selectedGroup}"组合的追踪数据</p>
                 <button onClick={() => setSelectedYear(null)} className="mt-2 text-emerald-600 text-sm hover:underline">
                   查看所有年份
                 </button>
               </div>
             )}
           </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;