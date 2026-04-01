'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useGPAStore } from '@/lib/store';
import { calculateSGPA, getGradeInfo, getGradeColor } from '@/lib/gradeUtils';
import { semesterMeta } from '@/lib/semesterData';

export default function Charts() {
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

  // SGPA Line Chart Data
  const sgpaData = useMemo(() => {
    return allSemSubjects.map((sub, idx) => ({
      name: `Sem ${idx + 1}`,
      sgpa: calculateSGPA(sub),
      color: semesterMeta[idx].color,
    }));
  }, [allSemSubjects]);

  // Grade Distribution Pie Chart
  const gradeDistribution = useMemo(() => {
    const counts: Record<string, number> = {
      O: 0, 'A+': 0, A: 0, 'B+': 0, B: 0, C: 0, F: 0,
    };

    for (const subjects of allSemSubjects) {
      for (const sub of subjects) {
        if (sub.isNCMC || sub.marks === null) continue;
        const info = getGradeInfo(sub.marks, sub.credits, sub.maxMarks ?? 100);
        if (counts[info.grade] !== undefined) {
          counts[info.grade]++;
        }
      }
    }

    return Object.entries(counts)
      .filter(([, count]) => count > 0)
      .map(([grade, count]) => ({
        name: grade,
        value: count,
        color: getGradeColor(grade),
      }));
  }, [allSemSubjects]);

  const hasData = sgpaData.some((d) => d.sgpa > 0);

  if (!hasData) {
    return (
      <div className="backdrop-blur-xl bg-white/[0.03] rounded-2xl border border-white/10 p-10 text-center">
        <p className="text-gray-500 text-sm">📈 Charts will appear once you enter marks</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      {/* SGPA Line Chart */}
      <div className="backdrop-blur-xl bg-white/[0.03] rounded-2xl border border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500" />
          SGPA Progression
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={sgpaData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
            <YAxis domain={[0, 10]} stroke="#6b7280" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(17,17,27,0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '13px',
              }}
            />
            <Line
              type="monotone"
              dataKey="sgpa"
              stroke="url(#sgpaGradient)"
              strokeWidth={3}
              dot={{
                fill: '#818cf8',
                stroke: '#312e81',
                strokeWidth: 2,
                r: 6,
              }}
              activeDot={{ r: 8, fill: '#a78bfa' }}
            />
            <defs>
              <linearGradient id="sgpaGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Grade Distribution Pie */}
      <div className="backdrop-blur-xl bg-white/[0.03] rounded-2xl border border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500" />
          Grade Distribution
        </h3>
        {gradeDistribution.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={gradeDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {gradeDistribution.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} fillOpacity={0.8} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17,17,27,0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '13px',
                }}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-sm text-center py-10">No grades yet</p>
        )}
      </div>
    </motion.div>
  );
}
