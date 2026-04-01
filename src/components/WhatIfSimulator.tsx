'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGPAStore } from '@/lib/store';
import { calculateCGPA, getGradeInfo } from '@/lib/gradeUtils';

export default function WhatIfSimulator() {
  const [isOpen, setIsOpen] = useState(false);
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

  const currentCGPA = useMemo(() => calculateCGPA(allSemSubjects), [allSemSubjects]);

  // Simulate: what if every remaining (null marks) subject gets X marks?
  const [simMarks, setSimMarks] = useState(75);

  const simulatedCGPA = useMemo(() => {
    const simulated = allSemSubjects.map((subjects) =>
      subjects.map((sub) => {
        if (sub.marks !== null || sub.isNCMC) return sub;
        // Scale the percentage simMarks to the subject's maxMarks
        const subMax = sub.maxMarks ?? 100;
        const scaledMarks = Math.round((simMarks / 100) * subMax);
        return { ...sub, marks: scaledMarks };
      })
    );
    return calculateCGPA(simulated);
  }, [allSemSubjects, simMarks]);

  const simGrade = getGradeInfo(simMarks, 1);
  const remainingSubjects = allSemSubjects.flat().filter(
    (s) => s.marks === null && !s.isNCMC
  ).length;

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full backdrop-blur-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 
          rounded-2xl border border-amber-500/20 p-5 text-left transition-all duration-300
          hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔮</span>
            <div>
              <h3 className="text-lg font-semibold text-amber-300">What-If GPA Simulator</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                See how future marks affect your CGPA
              </p>
            </div>
          </div>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            className="text-amber-400"
          >
            ▾
          </motion.span>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-5">
              <div className="backdrop-blur-xl bg-white/[0.03] rounded-xl border border-white/10 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <label className="text-sm text-gray-300 block mb-2">
                      If I score <span className="text-amber-400 font-bold">{simMarks}</span> marks
                      <span className="text-gray-500"> (Grade: {simGrade.grade})</span> in all remaining
                      <span className="text-amber-400 font-bold"> {remainingSubjects}</span> subjects:
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={simMarks}
                      onChange={(e) => setSimMarks(parseInt(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-amber-400
                        [&::-webkit-slider-thumb]:shadow-lg
                        [&::-webkit-slider-thumb]:shadow-amber-500/30
                        [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                      <span>0</span>
                      <span>50</span>
                      <span>100</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-center px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">Current</p>
                      <p className="text-xl font-bold text-white font-mono">
                        {currentCGPA > 0 ? currentCGPA.toFixed(2) : '—'}
                      </p>
                    </div>

                    <span className="text-gray-600 text-lg">→</span>

                    <div className="text-center px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <p className="text-[10px] text-amber-400 uppercase tracking-wider">Projected</p>
                      <motion.p
                        key={simulatedCGPA}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="text-xl font-bold text-amber-300 font-mono"
                      >
                        {simulatedCGPA > 0 ? simulatedCGPA.toFixed(2) : '—'}
                      </motion.p>
                    </div>
                  </div>
                </div>

                {/* Quick presets */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {[50, 60, 70, 80, 90, 100].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setSimMarks(preset)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200
                        ${simMarks === preset
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                        } border`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
