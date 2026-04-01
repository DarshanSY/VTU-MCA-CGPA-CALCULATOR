import { GradeInfo } from './types';

export function getGradeInfo(marks: number | null, credits: number, maxMarks: number = 100): GradeInfo {
  if (marks === null || marks === undefined || isNaN(marks)) {
    return { grade: '-', gradePoint: 0, creditPoints: 0 };
  }

  // Normalize marks to percentage (0-100 scale)
  const percentage = (marks / maxMarks) * 100;
  const m = Math.round(percentage);

  let grade: string;
  let gradePoint: number;

  if (m >= 90 && m <= 100) {
    grade = 'O';
    gradePoint = 10;
  } else if (m >= 80) {
    grade = 'A+';
    gradePoint = 9;
  } else if (m >= 70) {
    grade = 'A';
    gradePoint = 8;
  } else if (m >= 60) {
    grade = 'B+';
    gradePoint = 7;
  } else if (m >= 55) {
    grade = 'B';
    gradePoint = 6;
  } else if (m >= 50) {
    grade = 'C';
    gradePoint = 5;
  } else {
    grade = 'F';
    gradePoint = 0;
  }

  return {
    grade,
    gradePoint,
    creditPoints: credits * gradePoint,
  };
}

export function calculateSGPA(
  subjects: { marks: number | null; credits: number; isNCMC: boolean; maxMarks?: number }[]
): number {
  let totalCreditPoints = 0;
  let totalCredits = 0;

  for (const sub of subjects) {
    if (sub.isNCMC) continue;
    if (sub.marks === null || sub.marks === undefined) continue;

    const info = getGradeInfo(sub.marks, sub.credits, sub.maxMarks ?? 100);
    totalCreditPoints += info.creditPoints;
    totalCredits += sub.credits;
  }

  if (totalCredits === 0) return 0;
  return Math.round((totalCreditPoints / totalCredits) * 100) / 100;
}

export function calculateCGPA(
  semesters: { marks: number | null; credits: number; isNCMC: boolean; maxMarks?: number }[][]
): number {
  let totalCreditPoints = 0;
  let totalCredits = 0;

  for (const subjects of semesters) {
    for (const sub of subjects) {
      if (sub.isNCMC) continue;
      if (sub.marks === null || sub.marks === undefined) continue;

      const info = getGradeInfo(sub.marks, sub.credits, sub.maxMarks ?? 100);
      totalCreditPoints += info.creditPoints;
      totalCredits += sub.credits;
    }
  }

  if (totalCredits === 0) return 0;
  return Math.round((totalCreditPoints / totalCredits) * 100) / 100;
}

export function getGradeColor(grade: string): string {
  switch (grade) {
    case 'O': return '#00e676';
    case 'A+': return '#76ff03';
    case 'A': return '#64dd17';
    case 'B+': return '#ffeb3b';
    case 'B': return '#ffc107';
    case 'C': return '#ff9800';
    case 'F': return '#ff1744';
    default: return '#9e9e9e';
  }
}
