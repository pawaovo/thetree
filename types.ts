export enum Gender {
  MALE = 'Boy',
  FEMALE = 'Girl'
}

export enum Subject {
  CHINESE = 'Chinese',
  MATH = 'Math',
  ENGLISH = 'English',
  PHYSICS = 'Physics',
  CHEMISTRY = 'Chemistry',
  BIOLOGY = 'Biology',
  HISTORY = 'History',
  GEOGRAPHY = 'Geography',
  POLITICS = 'Politics'
}

export interface ExamRecord {
  examName: string; // e.g., "Grade 10 Mid-term"
  scores: Record<string, number>; // Subject key -> Score
  subjectGrades?: Record<string, string>; // Subject key -> Grade (A/B/C/D/E) for elective subjects
  totalScore?: number;
  rank?: number;
  totalStudents?: number;
}

export interface HollandQuestion {
  id: number;
  text: string;
  type: string; // R, I, A, S, E, C
}

export interface UserProfile {
  name: string;
  gender: Gender;
  exams: ExamRecord[];
  interestedSubjects: string[];
  interestedMajors?: string;
  interestedCareers?: string;
  specialTalents: string;
  hollandScores: Record<string, number>; // R: 5, I: 2, etc.
  hollandCode: string; // e.g., "IRS"
}

// AI Response Structures
export interface CareerPath {
  majors: {
    highProb: string[];
    medProb: string[];
  };
  careers: {
    highRel: string[];
    potential: string[];
  };
}

export interface Recommendation {
  subjects: string[]; // e.g., ["Physics", "Chemistry", "Biology"]
  score: number; // 0-100
  reason: string;
  path: CareerPath;
}

export interface AIAnalysisResult {
  studentSummary: string;
  recommendations: Recommendation[];
}