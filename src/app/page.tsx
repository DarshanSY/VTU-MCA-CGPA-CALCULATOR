'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SemesterCard from '@/components/SemesterCard';
import GPASummary from '@/components/GPASummary';
import Charts from '@/components/Charts';
import WhatIfSimulator from '@/components/WhatIfSimulator';
import { useGPAStore } from '@/lib/store';
import { specializations } from '@/lib/semesterData';
import { exportToPDF } from '@/lib/pdfExport';

export default function Home() {
  const semesters = useGPAStore((s) => s.semesters);
  const specialization = useGPAStore((s) => s.specialization);
  const resetAll = useGPAStore((s) => s.resetAll);
  const getSem3Subjects = useGPAStore((s) => s.getSem3Subjects);

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'calculator' | 'dashboard'>('calculator');

  useEffect(() => {
    setMounted(true);
  }, []);

  const allSemSubjects = useMemo(() => {
    return [
      semesters[0] || [],
      semesters[1] || [],
      getSem3Subjects(),
      semesters[3] || [],
    ];
  }, [semesters, getSem3Subjects]);

  const handleExportPDF = () => {
    const specName = specialization ? specializations[specialization].name : null;
    exportToPDF(allSemSubjects, specName);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading calculator...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-20">
      {/* Hero Header */}
      <header className="relative overflow-hidden">
        {/* Glowing orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-72 h-72 bg-purple-500/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full 
                bg-indigo-500/10 border border-indigo-500/20 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-xs font-medium text-indigo-300 tracking-wide">
                2026 SCHEME • MCA PROGRAM
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
              VTU MCA{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                GPA Calculator
              </span>
            </h1>

            <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
              Calculate your SGPA &amp; CGPA with real-time grade computation, 
              specialization electives, interactive charts, and PDF export.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {/* Tab Switcher */}
              <div className="flex bg-white/5 rounded-xl border border-white/10 p-1">
                {(['calculator', 'dashboard'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${activeTab === tab
                        ? 'bg-indigo-500/20 text-indigo-300 shadow-lg'
                        : 'text-gray-400 hover:text-gray-300'
                      }`}
                  >
                    {tab === 'calculator' ? '📝 Calculator' : '📊 Dashboard'}
                  </button>
                ))}
              </div>

              {/* Export PDF */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleExportPDF}
                className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300
                  text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all duration-200
                  flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export PDF
              </motion.button>

              {/* Reset All */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={resetAll}
                className="px-5 py-2.5 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400
                  text-sm font-medium hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-200
                  flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Reset All
              </motion.button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <AnimatePresence mode="wait">
          {activeTab === 'calculator' ? (
            <motion.div
              key="calculator"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* What-If Simulator */}
              <WhatIfSimulator />

              {/* Semester Cards */}
              {[0, 1, 2, 3].map((idx) => (
                <SemesterCard key={idx} semIndex={idx} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* GPA Summary */}
              <GPASummary />

              {/* Charts */}
              <Charts />

              {/* Grade Reference Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="backdrop-blur-xl bg-white/[0.03] rounded-2xl border border-white/10 p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Grade Reference
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                  {[
                    { range: '90–100', grade: 'O', gp: 10, color: '#00e676' },
                    { range: '80–89', grade: 'A+', gp: 9, color: '#76ff03' },
                    { range: '70–79', grade: 'A', gp: 8, color: '#64dd17' },
                    { range: '60–69', grade: 'B+', gp: 7, color: '#ffeb3b' },
                    { range: '55–59', grade: 'B', gp: 6, color: '#ffc107' },
                    { range: '50–54', grade: 'C', gp: 5, color: '#ff9800' },
                    { range: '<50', grade: 'F', gp: 0, color: '#ff1744' },
                  ].map((g) => (
                    <div
                      key={g.grade}
                      className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/5"
                    >
                      <p className="text-lg font-bold" style={{ color: g.color }}>
                        {g.grade}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{g.range}</p>
                      <p className="text-sm font-mono text-gray-300 mt-0.5">GP: {g.gp}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="mt-20 mb-8 text-center space-y-4">
        <p className="text-xs text-gray-600">
          Built for VTU MCA Students • 2026 Scheme •{' '}
          <span className="text-gray-500">Data saved locally in your browser</span>
        </p>
        <p className="text-xs text-gray-500">
          Created by{' '}
          <a
            href="https://my-portfolio-rho-eight-89.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
          >
            Darshan S Y
          </a>
        </p>
        <motion.a
          href="https://my-portfolio-rho-eight-89.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
            bg-gradient-to-r from-indigo-500/10 to-purple-500/10 
            border border-indigo-500/20 hover:border-indigo-500/40
            text-indigo-300 hover:text-indigo-200
            text-sm font-medium transition-all duration-300
            hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Visit Creator&apos;s Profile
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </motion.a>
      </footer>
    </main>
  );
}
