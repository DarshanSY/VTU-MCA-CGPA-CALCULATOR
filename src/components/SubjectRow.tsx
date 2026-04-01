'use client';

import React, { useState, useEffect } from 'react';
import { Subject } from '@/lib/types';
import { getGradeInfo, getGradeColor } from '@/lib/gradeUtils';
import { motion } from 'framer-motion';

interface SubjectRowProps {
  subject: Subject;
  onMarksChange: (marks: number | null) => void;
  index: number;
}

export default function SubjectRow({ subject, onMarksChange, index }: SubjectRowProps) {
  const maxMarks = subject.maxMarks ?? 100;
  const info = getGradeInfo(subject.marks, subject.credits, maxMarks);
  const isFailed = info.grade === 'F' && subject.marks !== null;

  // Local state so typing is never blocked
  const [localValue, setLocalValue] = useState<string>(
    subject.marks !== null ? String(subject.marks) : ''
  );

  // Sync local state when external marks change (e.g. reset)
  useEffect(() => {
    setLocalValue(subject.marks !== null ? String(subject.marks) : '');
  }, [subject.marks]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow free typing — no blocking
    setLocalValue(val);

    // Also update parent in real-time if valid
    if (val === '') {
      onMarksChange(null);
    } else {
      const num = parseInt(val);
      if (!isNaN(num) && num >= 0 && num <= maxMarks) {
        onMarksChange(num);
      }
    }
  };

  const handleBlur = () => {
    // Clamp and finalize on blur
    if (localValue === '') {
      onMarksChange(null);
      return;
    }
    const num = parseInt(localValue);
    if (isNaN(num) || num < 0) {
      setLocalValue('');
      onMarksChange(null);
    } else if (num > maxMarks) {
      setLocalValue(String(maxMarks));
      onMarksChange(maxMarks);
    } else {
      setLocalValue(String(num));
      onMarksChange(num);
    }
  };

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`border-b border-white/5 transition-colors duration-200 ${
        isFailed
          ? 'bg-red-500/10 hover:bg-red-500/15'
          : 'hover:bg-white/5'
      }`}
    >
      {/* Subject Name */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${
            subject.isNCMC ? 'text-gray-400 italic' : 'text-gray-200'
          }`}>
            {subject.name}
          </span>
          {subject.isNCMC && (
            <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-full font-semibold">
              NCMC
            </span>
          )}
          {maxMarks !== 100 && !subject.isNCMC && (
            <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded-full font-semibold">
              /{maxMarks}
            </span>
          )}
          {isFailed && (
            <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full font-semibold animate-pulse">
              FAIL
            </span>
          )}
        </div>
      </td>

      {/* Credits */}
      <td className="py-3 px-4 text-center">
        <span className="text-sm text-gray-400 font-mono">
          {subject.isNCMC ? '—' : subject.credits}
        </span>
      </td>

      {/* Marks Input */}
      <td className="py-3 px-4 text-center">
        {subject.isNCMC ? (
          <span className="text-xs text-gray-500 italic">Excluded</span>
        ) : (
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={localValue}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={`0-${maxMarks}`}
            className={`w-24 px-3 py-1.5 rounded-lg text-center text-sm font-mono
              bg-white/5 border transition-all duration-200 outline-none
              focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50
              ${isFailed
                ? 'border-red-500/50 text-red-300'
                : 'border-white/10 text-white'
              }
              placeholder:text-gray-600`}
          />
        )}
      </td>

      {/* Grade */}
      <td className="py-3 px-4 text-center">
        {!subject.isNCMC && subject.marks !== null ? (
          <span
            className="text-sm font-bold px-2 py-0.5 rounded"
            style={{ color: getGradeColor(info.grade) }}
          >
            {info.grade}
          </span>
        ) : (
          <span className="text-gray-600 text-sm">—</span>
        )}
      </td>

      {/* Grade Point */}
      <td className="py-3 px-4 text-center">
        {!subject.isNCMC && subject.marks !== null ? (
          <span className="text-sm font-mono text-gray-300">{info.gradePoint}</span>
        ) : (
          <span className="text-gray-600 text-sm">—</span>
        )}
      </td>

      {/* Credit Points */}
      <td className="py-3 px-4 text-center">
        {!subject.isNCMC && subject.marks !== null ? (
          <span className="text-sm font-mono text-gray-300">{info.creditPoints}</span>
        ) : (
          <span className="text-gray-600 text-sm">—</span>
        )}
      </td>
    </motion.tr>
  );
}

