import { HollandQuestion, Subject } from "./types";

export const SUBJECT_LIST = [
  { key: Subject.CHINESE, label: '语文', type: 'main' },
  { key: Subject.MATH, label: '数学', type: 'main' },
  { key: Subject.ENGLISH, label: '英语', type: 'main' },
  { key: Subject.PHYSICS, label: '物理', type: 'sub' },
  { key: Subject.CHEMISTRY, label: '化学', type: 'sub' },
  { key: Subject.BIOLOGY, label: '生物', type: 'sub' },
  { key: Subject.HISTORY, label: '历史', type: 'sub' },
  { key: Subject.GEOGRAPHY, label: '地理', type: 'sub' },
  { key: Subject.POLITICS, label: '政治', type: 'sub' },
];

export const HOLLAND_QUESTIONS: HollandQuestion[] = [
  { id: 1, text: "喜欢修理电器、制作模型或摆弄机械", type: "R" },
  { id: 2, text: "喜欢户外运动，愿意和动植物打交道", type: "R" },
  { id: 3, text: "喜欢阅读科技杂志，探索未知的科学原理", type: "I" },
  { id: 4, text: "喜欢分析数据、解决复杂的数学或逻辑问题", type: "I" },
  { id: 5, text: "喜欢绘画、写作、摄影或演奏乐器", type: "A" },
  { id: 6, text: "想法独特，不喜欢墨守成规的做事方式", type: "A" },
  { id: 7, text: "喜欢帮助他人，乐于教导或照顾别人", type: "S" },
  { id: 8, text: "善于倾听，朋友们常向你倾诉心事", type: "S" },
  { id: 9, text: "喜欢担任班干部，组织活动或领导团队", type: "E" },
  { id: 10, text: "口才好，喜欢辩论或向别人推销想法", type: "E" },
  { id: 11, text: "喜欢按计划行事，做事井井有条", type: "C" },
  { id: 12, text: "整理归纳资料，处理数字或文字校对很细心", type: "C" },
];

export const EXAM_TYPES = [
  { id: 'mid_term_1', label: '高一上期中 (必填)', required: true },
  { id: 'final_term_1', label: '高一上期末 (必填)', required: true },
  { id: 'mid_term_2', label: '高一下期中 (选填)', required: false },
];
