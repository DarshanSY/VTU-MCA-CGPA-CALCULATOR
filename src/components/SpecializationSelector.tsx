'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { specializations } from '@/lib/semesterData';
import { SpecializationKey } from '@/lib/types';
import { useGPAStore } from '@/lib/store';

const specKeys: SpecializationKey[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const specIcons: Record<SpecializationKey, string> = {
  A: '📊', B: '🌐', C: '🖧', D: '💻', E: '☁️', F: '🤖', G: '📡', H: '🔒',
};

export default function SpecializationSelector() {
  const specialization = useGPAStore((s) => s.specialization);
  const selectedElectives = useGPAStore((s) => s.selectedElectives);
  const setSpecialization = useGPAStore((s) => s.setSpecialization);
  const toggleElective = useGPAStore((s) => s.toggleElective);

  const currentSpec = specialization ? specializations[specialization] : null;

  return (
    <div className="space-y-6">
      {/* Specialization Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Choose Your Specialization
        </label>
        <div className="relative">
          <select
            value={specialization ?? ''}
            onChange={(e) => {
              if (e.target.value) {
                setSpecialization(e.target.value as SpecializationKey);
              }
            }}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white
              text-sm appearance-none cursor-pointer outline-none
              focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50
              transition-all duration-200"
          >
            <option value="" className="bg-gray-900">— Select Specialization —</option>
            {specKeys.map((key) => (
              <option key={key} value={key} className="bg-gray-900">
                {specIcons[key]} {specializations[key].name} ({key})
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            ▾
          </div>
        </div>
      </div>

      {/* Electives Selection */}
      {currentSpec && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-300">
              Select Any 3 Electives
            </label>
            <span className={`text-xs font-mono px-2 py-1 rounded-full ${
              selectedElectives.length === 3
                ? 'bg-green-500/20 text-green-400'
                : 'bg-indigo-500/20 text-indigo-400'
            }`}>
              {selectedElectives.length}/3 selected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {currentSpec.electives.map((elective) => {
              const isSelected = selectedElectives.includes(elective);
              const isDisabled = !isSelected && selectedElectives.length >= 3;

              return (
                <motion.button
                  key={elective}
                  whileHover={!isDisabled ? { scale: 1.02 } : {}}
                  whileTap={!isDisabled ? { scale: 0.98 } : {}}
                  onClick={() => !isDisabled && toggleElective(elective)}
                  disabled={isDisabled}
                  className={`px-4 py-3 rounded-xl text-left text-sm font-medium
                    transition-all duration-200 border
                    ${isSelected
                      ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-lg shadow-indigo-500/10'
                      : isDisabled
                        ? 'bg-white/[0.02] border-white/5 text-gray-600 cursor-not-allowed'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20 cursor-pointer'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center shrink-0
                      ${isSelected
                        ? 'border-indigo-500 bg-indigo-500'
                        : 'border-gray-600'
                      }`}
                    >
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    {elective}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
