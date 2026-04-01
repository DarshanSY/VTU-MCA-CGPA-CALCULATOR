import { Subject, SpecializationKey } from './types';

// ═══════════════════════════════════════════════
// SEM 1 — 18 Credits
// ═══════════════════════════════════════════════
export const sem1Subjects: Subject[] = [
  { id: 's1-1', name: 'Programming in C', credits: 4, isNCMC: false, marks: null },
  { id: 's1-2', name: 'Discrete Mathematics', credits: 3, isNCMC: false, marks: null },
  { id: 's1-3', name: 'DBMS', credits: 3, isNCMC: false, marks: null },
  { id: 's1-4', name: 'Operating Systems', credits: 3, isNCMC: false, marks: null },
  { id: 's1-5', name: 'Web Technologies', credits: 3, isNCMC: false, marks: null },
  { id: 's1-6', name: 'DBMS + Web Lab', credits: 2, isNCMC: false, marks: null },
  { id: 's1-7', name: 'Research Methodology', credits: 0, isNCMC: true, marks: null },
];

// ═══════════════════════════════════════════════
// SEM 2 — 22 Credits
// ═══════════════════════════════════════════════
export const sem2Subjects: Subject[] = [
  { id: 's2-1', name: 'Machine Learning with Python', credits: 4, isNCMC: false, marks: null },
  { id: 's2-2', name: 'OOP using Java', credits: 4, isNCMC: false, marks: null },
  { id: 's2-3', name: 'Data Structures', credits: 4, isNCMC: false, marks: null },
  { id: 's2-4', name: 'Software Engineering', credits: 3, isNCMC: false, marks: null },
  { id: 's2-5', name: 'Web Application Development', credits: 3, isNCMC: false, marks: null },
  { id: 's2-6', name: 'Java Lab', credits: 2, isNCMC: false, marks: null },
  { id: 's2-7', name: 'DSA Lab', credits: 2, isNCMC: false, marks: null },
  { id: 's2-8', name: 'Ability Enhancement', credits: 0, isNCMC: true, marks: null },
];

// ═══════════════════════════════════════════════
// SEM 3 — Fixed subject (Project)
// ═══════════════════════════════════════════════
export const sem3FixedSubjects: Subject[] = [
  { id: 's3-project', name: 'Project', credits: 15, isNCMC: false, marks: null, maxMarks: 200 },
];

// ═══════════════════════════════════════════════
// SEM 4 — 16 Credits
// ═══════════════════════════════════════════════
export const sem4Subjects: Subject[] = [
  { id: 's4-1', name: 'Online Course', credits: 3, isNCMC: false, marks: null },
  { id: 's4-2', name: 'Technical Seminar', credits: 2, isNCMC: false, marks: null },
  { id: 's4-3', name: 'Internship', credits: 11, isNCMC: false, marks: null },
];

// ═══════════════════════════════════════════════
// Specializations & Electives
// ═══════════════════════════════════════════════
export const specializations: Record<SpecializationKey, { name: string; electives: string[] }> = {
  A: {
    name: 'Data Science & Analytics',
    electives: [
      'Data Mining & Visualization',
      'Big Data Analytics',
      'Business Data Analytics',
      'ERP',
      'Exploratory Data Analysis',
      'Social Media Analytics',
    ],
  },
  B: {
    name: 'Web Application Development',
    electives: [
      'Full Stack Development',
      'Rich Internet Applications',
      'PHP & MySQL',
      'Enterprise App Dev',
      'Advanced Web Tech',
      'Java Web Programming',
    ],
  },
  C: {
    name: 'Network & System Admin',
    electives: [
      'Computer Networks',
      'Linux Administration',
      'TCP/IP',
      'Unix Shell Programming',
      'Cloud Essentials',
      'SAP Basis',
    ],
  },
  D: {
    name: 'Software Development',
    electives: [
      'MIS',
      'Database Design',
      'Software Architecture',
      'Computer Organization',
      'Design Patterns',
      'OOAD',
    ],
  },
  E: {
    name: 'Cloud Computing',
    electives: [
      'Mobile Computing',
      'Data Storage Networks',
      'Data Centres',
      'Wireless Communication',
      'SDN',
      'Cloud Computing',
    ],
  },
  F: {
    name: 'AI & ML',
    electives: [
      'Generative AI',
      'Neural Networks',
      'NLP',
      'Deep Learning',
      'Machine Learning',
      'Computer Vision',
    ],
  },
  G: {
    name: 'IoT',
    electives: [
      'IoT Data Management',
      'Embedded Systems',
      'Cross Platform Apps',
      'IoT Applications',
      'IoT Networking',
      'IoT Programming',
    ],
  },
  H: {
    name: 'Cyber Security',
    electives: [
      'Ethical Hacking',
      'Cyber Security',
      'Cryptography',
      'Blockchain',
      'Web Security',
      'Mobile Security',
    ],
  },
};

export const semesterMeta = [
  { id: 1, name: 'Semester 1', totalCredits: 18, color: '#00e676' },
  { id: 2, name: 'Semester 2', totalCredits: 22, color: '#ffd740' },
  { id: 3, name: 'Semester 3', totalCredits: 24, color: '#448aff' },
  { id: 4, name: 'Semester 4', totalCredits: 16, color: '#ff5252' },
];
