export interface Subject {
  id: string;
  name: string;
  credits: number;
  isNCMC: boolean;
  marks: number | null;
  maxMarks?: number; // defaults to 100 if not specified
}

export interface Semester {
  id: number;
  name: string;
  color: string;
  subjects: Subject[];
  totalCredits: number;
}

export interface GradeInfo {
  grade: string;
  gradePoint: number;
  creditPoints: number;
}

export interface Specialization {
  id: string;
  name: string;
  electives: string[];
}

export type SpecializationKey = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
