'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Subject, SpecializationKey } from './types';
import {
  sem1Subjects,
  sem2Subjects,
  sem3FixedSubjects,
  sem4Subjects,
  specializations,
} from './semesterData';

interface GPAStore {
  semesters: Subject[][];
  specialization: SpecializationKey | null;
  selectedElectives: string[];

  setMarks: (semIndex: number, subjectId: string, marks: number | null) => void;
  setSpecialization: (key: SpecializationKey) => void;
  toggleElective: (elective: string) => void;
  resetSemester: (semIndex: number) => void;
  resetAll: () => void;
  getSem3Subjects: () => Subject[];
}

function buildInitialSemesters(): Subject[][] {
  return [
    sem1Subjects.map((s) => ({ ...s })),
    sem2Subjects.map((s) => ({ ...s })),
    [], // sem3 dynamic
    sem4Subjects.map((s) => ({ ...s })),
  ];
}

export const useGPAStore = create<GPAStore>()(
  persist(
    (set, get) => ({
      semesters: buildInitialSemesters(),
      specialization: null,
      selectedElectives: [],

      setMarks: (semIndex, subjectId, marks) =>
        set((state) => {
          const newSemesters = state.semesters.map((sem, i) => {
            if (i !== semIndex) return sem;
            return sem.map((sub) =>
              sub.id === subjectId ? { ...sub, marks } : sub
            );
          });
          return { semesters: newSemesters };
        }),

      setSpecialization: (key) =>
        set(() => ({
          specialization: key,
          selectedElectives: [],
        })),

      toggleElective: (elective) =>
        set((state) => {
          const current = state.selectedElectives;
          if (current.includes(elective)) {
            return { selectedElectives: current.filter((e) => e !== elective) };
          }
          if (current.length >= 3) return state;
          return { selectedElectives: [...current, elective] };
        }),

      resetSemester: (semIndex) =>
        set((state) => {
          const newSemesters = state.semesters.map((sem, i) => {
            if (i !== semIndex) return sem;
            return sem.map((sub) => ({ ...sub, marks: null }));
          });
          if (semIndex === 2) {
            return {
              semesters: newSemesters,
              specialization: null,
              selectedElectives: [],
            };
          }
          return { semesters: newSemesters };
        }),

      resetAll: () =>
        set(() => ({
          semesters: buildInitialSemesters(),
          specialization: null,
          selectedElectives: [],
        })),

      getSem3Subjects: () => {
        const state = get();
        const electives: Subject[] = state.selectedElectives.map(
          (name, idx) => ({
            id: `s3-elec-${idx}`,
            name,
            credits: 3,
            isNCMC: false,
            marks: state.semesters[2]?.find((s) => s.name === name)?.marks ?? null,
          })
        );
        const project = sem3FixedSubjects.map((s) => ({
          ...s,
          marks: state.semesters[2]?.find((sub) => sub.id === s.id)?.marks ?? null,
        }));
        return [...electives, ...project];
      },
    }),
    {
      name: 'vtu-gpa-calculator-storage',
      version: 3, // bumped: project maxMarks changed to 200
      migrate: () => {
        // On version mismatch, return fresh initial state
        return {
          semesters: buildInitialSemesters(),
          specialization: null,
          selectedElectives: [],
        };
      },
      partialize: (state) => ({
        semesters: state.semesters,
        specialization: state.specialization,
        selectedElectives: state.selectedElectives,
      }),
    }
  )
);
