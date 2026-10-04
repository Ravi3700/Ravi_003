import React from 'react';
import {
  HelpCircle,
  FileCog,
  Boxes,
  Binary,
  BarChart4,
  TrendingUp,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { userProfile } from '../data/profile';

export const Workflow: React.FC = () => {
  const iconMap: Record<string, React.ElementType> = {
    HelpCircle,
    FileCog,
    Boxes,
    Binary,
    BarChart4,
    TrendingUp,
  };

  return (
    <section id="workflow-section" className="py-16 sm:py-20 lg:py-24 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200/70 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 mb-3">
            Structured End-to-End Methodology
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My 6-Step Analytical & Problem-Solving Lifecycle
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
            A structured process for transforming raw data and analytical requirements into validated datasets, reliable Power BI models, interactive dashboards, and decision-ready insights.
          </p>
        </div>

        {/* 6-Step Workflow Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userProfile.analyticsWorkflow.map((step, idx) => {
            const Icon = iconMap[step.iconName] || HelpCircle;

            return (
              <div
                key={step.stepNumber}
                className="relative flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all group"
              >
                {/* Step Top Bar */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black font-mono text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {step.stepNumber}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 group-hover:bg-blue-50 dark:group-hover:bg-blue-950 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{step.title}</h3>
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3">{step.shortSummary}</p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {step.description}
                  </p>

                  {/* Key Activities */}
                  <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-700/60 mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Core Activities:</span>
                    <div className="space-y-1">
                      {step.keyActivities.map((act, aIdx) => (
                        <div key={aIdx} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                          <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span>{act}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Deliverable Badge */}
                <div className="mt-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/50">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Primary Deliverable:
                  </span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {step.deliverable}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
