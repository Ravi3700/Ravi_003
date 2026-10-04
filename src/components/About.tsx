import React from 'react';
import {
  BrainCircuit,
  Database,
  BarChart3,
  FileSpreadsheet,
  Users,
  CheckCircle2,
  LayoutDashboard,
  Network,
  Calculator,
  LineChart,
} from 'lucide-react';
import { userProfile } from '../data/profile';

interface AboutProps {
  onNavigate?: (path: string) => void;
}

export const About: React.FC<AboutProps> = () => {
  // Map icon strings to Lucide components
  const iconMap: Record<string, React.ElementType> = {
    BrainCircuit,
    Database,
    BarChart3,
    FileSpreadsheet,
    Users,
    LayoutDashboard,
    Network,
    Calculator,
    LineChart,
  };

  return (
    <section id="about-section" className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-slate-900 border-b border-slate-200/70 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mb-3 border border-slate-200 dark:border-slate-700">
            About My Professional Background
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Data-Driven Analytics & Decision Intelligence
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {userProfile.daBio}
          </p>
        </div>

        {/* What I Bring Subsection */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Core Value Pillars & Analytical Mindset</h3>
            <span className="text-xs text-slate-400 font-medium">6 Key Strengths</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {userProfile.whatIBring.map((item, idx) => {
              const Icon = iconMap[item.iconName] || BrainCircuit;
              return (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-400 dark:hover:border-blue-500 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 shadow-xs border border-slate-200 dark:border-slate-600 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">{item.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* What I Can Do Grid */}
        <div id="what-i-can-do">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">What I Deliver / Practical Analytics Capabilities</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Practical analytics, reporting, and dashboard capabilities applied across projects
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userProfile.whatICanDo.map((item) => {
              const Icon = iconMap[item.iconName] || CheckCircle2;

              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex items-start gap-3.5 hover:shadow-md transition-shadow"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{item.title}</h4>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{item.description}</p>
                    <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300">
                      Data Analytics
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
