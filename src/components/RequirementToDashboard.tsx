import React, { useState } from 'react';
import {
  Workflow,
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  Database,
  LayoutDashboard,
  Layers,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { userProfile } from '../data/profile';
import { BridgeStep } from '../types';

export const RequirementToDashboard: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState<number>(1);
  const steps = userProfile.fromRequirementToDashboard;

  const currentStep = steps.find((s) => s.stepNumber === selectedStep) || steps[0];

  const phaseColors: Record<string, { badge: string; text: string; ring: string }> = {
    Business: {
      badge: 'bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      text: 'text-purple-600 dark:text-purple-400',
      ring: 'border-purple-500',
    },
    Bridge: {
      badge: 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      text: 'text-amber-600 dark:text-amber-400',
      ring: 'border-amber-500',
    },
    Analytics: {
      badge: 'bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      text: 'text-blue-600 dark:text-blue-400',
      ring: 'border-blue-500',
    },
    Decision: {
      badge: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      text: 'text-emerald-600 dark:text-emerald-400',
      ring: 'border-emerald-500',
    },
  };

  return (
    <section
      id="requirement-to-dashboard-bridge"
      className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-slate-900 border-b border-slate-200/70 dark:border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 mb-3">
            <Workflow className="w-3.5 h-3.5" />
            <span>Analytics Delivery Pipeline</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            From Raw Data to Decision-Ready Dashboard
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            How I transform raw and inconsistent datasets into clean, validated data, reliable models, interactive Power BI reports, and decision-ready insights.
          </p>
        </div>

        {/* Interactive Step Navigator */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-8">
          {steps.map((step) => {
            const isSelected = selectedStep === step.stepNumber;
            const phaseStyle = phaseColors[step.phase] || phaseColors.Business;

            return (
              <button
                key={step.stepNumber}
                onClick={() => setSelectedStep(step.stepNumber)}
                className={`p-3 rounded-xl text-left transition-all border cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? `bg-slate-900 text-white dark:bg-slate-800 border-blue-500 shadow-md ring-2 ring-blue-400/30`
                    : `bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800`
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span
                    className={`font-mono text-xs font-bold ${
                      isSelected ? 'text-blue-400' : 'text-slate-400'
                    }`}
                  >
                    0{step.stepNumber}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase ${
                      isSelected
                        ? 'bg-slate-800 text-slate-200 border-slate-700'
                        : phaseStyle.badge
                    }`}
                  >
                    {step.phase}
                  </span>
                </div>
                <span className="text-xs font-bold leading-tight line-clamp-2">{step.stage}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Step Expanded Visual Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Info Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-blue-600 text-white font-mono font-bold text-sm flex items-center justify-center">
                  0{currentStep.stepNumber}
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border uppercase ${
                    phaseColors[currentStep.phase]?.badge
                  }`}
                >
                  {currentStep.phase} Phase
                </span>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Stage: {currentStep.stage}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {currentStep.title}
              </h3>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentStep.description}
              </p>

              {/* Tools Employed */}
              <div className="pt-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Applied Tools & Techniques:
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentStep.tools.map((tool, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-3 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 shadow-2xs"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Deliverable Card */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Concrete Deliverable</span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {currentStep.deliverable}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Provides a transparent audit trail ensuring zero ambiguity between the original business request
                  and final production report logic.
                </p>

                {/* Progress Indicator */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">
                    Step {currentStep.stepNumber} of {steps.length}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      disabled={selectedStep <= 1}
                      onClick={() => setSelectedStep(selectedStep - 1)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-30 cursor-pointer"
                    >
                      Previous
                    </button>
                    <button
                      disabled={selectedStep >= steps.length}
                      onClick={() => setSelectedStep(selectedStep + 1)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-600 text-white disabled:opacity-30 cursor-pointer"
                    >
                      Next Step
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
