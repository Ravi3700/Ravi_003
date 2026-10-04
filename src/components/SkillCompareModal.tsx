import React, { useState } from 'react';
import { X, ArrowRightLeft, CheckCircle2, Sparkles } from 'lucide-react';
import { Skill } from '../types';
import { skillsData } from '../data/skills';
import { TechLogo } from './TechLogo';

interface SkillCompareModalProps {
  initialSkillA: Skill;
  onClose: () => void;
}

export const SkillCompareModal: React.FC<SkillCompareModalProps> = ({ initialSkillA, onClose }) => {
  const [skillA, setSkillA] = useState<Skill>(initialSkillA);
  const defaultSkillB = skillsData.find((s) => s.id !== initialSkillA.id) || skillsData[1];
  const [skillB, setSkillB] = useState<Skill>(defaultSkillB);

  return (
    <div
      id="skill-compare-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="skill-compare-modal"
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Compare Skills & Tools</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Understand how different tools and methodologies complement each other in my analytics workflow
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dropdowns for selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Primary Skill A</label>
            <select
              value={skillA.id}
              onChange={(e) => {
                const found = skillsData.find((s) => s.id === e.target.value);
                if (found) setSkillA(found);
              }}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white"
            >
              {skillsData.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.category})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Comparison Skill B</label>
            <select
              value={skillB.id}
              onChange={(e) => {
                const found = skillsData.find((s) => s.id === e.target.value);
                if (found) setSkillB(found);
              }}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white"
            >
              {skillsData.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Side-by-side comparison grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Card A */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center gap-3">
              <TechLogo logoKey={skillA.icon} size={32} />
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{skillA.name}</h4>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{skillA.category}</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{skillA.description}</p>
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Primary Use Cases:
              </span>
              {skillA.usedFor.map((u, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{u}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card B */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center gap-3">
              <TechLogo logoKey={skillB.icon} size={32} />
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{skillB.name}</h4>
                <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">{skillB.category}</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{skillB.description}</p>
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Primary Use Cases:
              </span>
              {skillB.usedFor.map((u, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{u}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Synergy Section */}
        <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-sm font-bold text-indigo-950 dark:text-indigo-100 mb-0.5">
              Workflow Synergy:
            </strong>
            When combined, <strong className="font-semibold">{skillA.name}</strong> and{' '}
            <strong className="font-semibold">{skillB.name}</strong> allow me to bridge functional discovery and
            rigorous technical modeling without information loss across project phases.
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
