'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGPAStore } from '@/lib/store';
import { calculateSGPA, calculateCGPA } from '@/lib/gradeUtils';
import { semesterMeta } from '@/lib/semesterData';

export default function GPASummary() {
  const semesters = useGPAStore((s) => s.semesters);
  const getSem3Subjects = useGPAStore((s) => s.getSem3Subjects);

  const allSemSubjects = useMemo(() => {
    return [
      semesters[0] || [],
      semesters[1] || [],
      getSem3Subjects(),
      semesters[3] || [],
    ];
  }, [semesters, getSem3Subjects]);

  const sgpas = useMemo(
    () => allSemSubjects.map((sub) => calculateSGPA(sub)),
    [allSemSubjects]
  );

  const cgpa = useMemo(
    () => calculateCGPA(allSemSubjects),
    [allSemSubjects]
  );

  const totalCreditsEarned = useMemo(() => {
    let total = 0;
    for (const subjects of allSemSubjects) {
      for (const sub of subjects) {
        if (!sub.isNCMC && sub.marks !== null && sub.marks >= 50) {
          total += sub.credits;
        }
      }
    }
    return total;
  }, [allSemSubjects]);

  const totalCredits = 80; // 18 + 22 + 24 + 16

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* CGPA Main Card */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-purple-600/20 to-pink-600/30" />
        <div className="absolute inset-0 backdrop-blur-xl" />
        <div className="relative border border-white/10 rounded-2xl p-8 text-center">
          <p className="text-sm text-gray-300 font-medium uppercase tracking-widest mb-2">
            Cumulative GPA
          </p>
          <motion.div
            key={cgpa}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <span className="text-7xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-mono">
              {cgpa > 0 ? cgpa.toFixed(2) : '0.00'}
            </span>
          </motion.div>
          <p className="text-sm text-gray-400 mt-3">
            {totalCreditsEarned} / {totalCredits} credits earned
          </p>

          {/* Progress bar */}
          <div className="mt-4 w-full max-w-xs mx-auto bg-white/10 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${(totalCreditsEarned / totalCredits) * 100}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* SGPA Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {sgpas.map((sgpa, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="backdrop-blur-xl bg-white/[0.03] rounded-xl border border-white/10 p-4 text-center"
          >
            <div
              className="w-2 h-2 rounded-full mx-auto mb-2"
              style={{ backgroundColor: semesterMeta[idx].color }}
            />
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Sem {idx + 1}
            </p>
            <p className="text-2xl font-bold text-white font-mono mt-1">
              {sgpa > 0 ? sgpa.toFixed(2) : '—'}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
