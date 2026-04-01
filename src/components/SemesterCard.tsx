'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import SubjectRow from './SubjectRow';
import SpecializationSelector from './SpecializationSelector';
import { useGPAStore } from '@/lib/store';
import { calculateSGPA } from '@/lib/gradeUtils';
import { semesterMeta } from '@/lib/semesterData';

interface SemesterCardProps {
  semIndex: number;
}

export default function SemesterCard({ semIndex }: SemesterCardProps) {
  const semesters = useGPAStore((s) => s.semesters);
  const setMarks = useGPAStore((s) => s.setMarks);
  const resetSemester = useGPAStore((s) => s.resetSemester);
  const getSem3Subjects = useGPAStore((s) => s.getSem3Subjects);
  const specialization = useGPAStore((s) => s.specialization);
  const selectedElectives = useGPAStore((s) => s.selectedElectives);

  const meta = semesterMeta[semIndex];

  const subjects = useMemo(() => {
    if (semIndex === 2) {
      return getSem3Subjects();
    }
    return semesters[semIndex] || [];
  }, [semIndex, semesters, getSem3Subjects, specialization, selectedElectives]);

  const sgpa = useMemo(() => calculateSGPA(subjects), [subjects]);

  const handleMarksChange = (subjectId: string, marks: number | null) => {
    if (semIndex === 2) {
      // For sem3, update the semesters[2] array
      const updatedSem3 = subjects.map((s) =>
        s.id === subjectId ? { ...s, marks } : s
      );
      useGPAStore.setState((state) => {
        const newSemesters = [...state.semesters];
        newSemesters[2] = updatedSem3;
        return { semesters: newSemesters };
      });
    } else {
      setMarks(semIndex, subjectId, marks);
    }
  };

  const filledSubjects = subjects.filter((s) => s.marks !== null && !s.isNCMC).length;
  const totalGradedSubjects = subjects.filter((s) => !s.isNCMC).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: semIndex * 0.1, duration: 0.5 }}
      className="relative group"
    >
      {/* Glass Card */}
      <div className="relative backdrop-blur-xl bg-white/[0.03] rounded-2xl border border-white/10
        shadow-2xl overflow-hidden">
        
        {/* Top Accent Bar */}
        <div
          className="h-1 w-full"
          style={{
            background: `linear-gradient(90deg, ${meta.color}, ${meta.color}80, transparent)`,
          }}
        />

        {/* Header */}
        <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: meta.color }}
              />
              {meta.name}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {meta.totalCredits} Credits • {filledSubjects}/{totalGradedSubjects} subjects filled
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* SGPA Badge */}
            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-xs text-gray-400 block">SGPA</span>
              <span className="text-2xl font-bold text-white font-mono">
                {sgpa > 0 ? sgpa.toFixed(2) : '—'}
              </span>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => resetSemester(semIndex)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400
                hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400
                transition-all duration-200"
              title="Reset Semester"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Specialization Selector for Sem 3 */}
        {semIndex === 2 && (
          <div className="px-6 py-5 border-b border-white/5">
            <SpecializationSelector />
          </div>
        )}

        {/* Subject Table */}
        {(semIndex !== 2 || (specialization && selectedElectives.length > 0)) && subjects.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Subject</th>
                  <th className="py-3 px-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Credits</th>
                  <th className="py-3 px-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Marks</th>
                  <th className="py-3 px-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Grade</th>
                  <th className="py-3 px-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">GP</th>
                  <th className="py-3 px-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">CP</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject, idx) => (
                  <SubjectRow
                    key={subject.id}
                    subject={subject}
                    index={idx}
                    onMarksChange={(marks) => handleMarksChange(subject.id, marks)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty state for Sem 3 */}
        {semIndex === 2 && (!specialization || selectedElectives.length === 0) && (
          <div className="px-6 py-10 text-center">
            <p className="text-gray-500 text-sm">
              {!specialization
                ? '👆 Select a specialization above to view elective subjects'
                : '👆 Select at least 1 elective to begin entering marks'}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
