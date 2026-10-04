import React from 'react';
import { Trophy, Award, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';
import { achievementsData } from '../data/achievements';

export const AchievementsSection: React.FC = () => {
  return (
    <section id="achievements-section" className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-slate-900 border-b border-slate-200/70 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 mb-3">
            <Trophy className="w-3.5 h-3.5" />
            <span>Honors & Key Milestones</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Professional Recognition & Achievements
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
  Professional certifications, structured data analytics training, and open-source contributions demonstrating practical development and analytical skills.          </p>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {achievementsData.map((ach) => (
            <div
              key={ach.id}
              className="p-6 sm:p-7 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  {ach.category}
                </span>
                <span className="text-xs font-semibold text-slate-400">{ach.date}</span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{ach.title}</h3>
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">{ach.organization}</p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {ach.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
