import React from 'react';
import { X, CheckCircle, Layers, ArrowRight, Sparkles, Star } from 'lucide-react';
import { Skill, Project } from '../types';
import { TechLogo } from './TechLogo';
import { projectsData } from '../data/projects';

interface SkillDetailModalProps {
  skill: Skill | null;
  onClose: () => void;
  onSelectProject?: (project: Project) => void;
  onCompareWith?: (skill: Skill) => void;
}

export const SkillDetailModal: React.FC<SkillDetailModalProps> = ({
  skill,
  onClose,
  onSelectProject,
  onCompareWith,
}) => {
  if (!skill) return null;

  const projectIds = skill.relatedProjects || skill.linkedProjects || [];
  const linkedProjects = projectsData.filter((p) =>
    projectIds.includes(p.id) ||
    (p.tools || []).some((t) => t.toLowerCase() === skill.name.toLowerCase()) ||
    (p.skills || []).some((s) => s.toLowerCase() === skill.name.toLowerCase())
  );

  return (
    <div
      id="skill-detail-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="skill-detail-modal"
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <TechLogo logoKey={skill.logoKey || skill.icon || skill.id} size={36} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {skill.name}
                </h3>
                {skill.isCore && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    Core Tool
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                Category: <span className="text-blue-600 dark:text-blue-400">{skill.category}</span>
                {skill.level && ` • Proficiency: ${skill.level}`}
              </p>
            </div>
          </div>

          <button
            id="close-skill-modal-btn"
            onClick={onClose}
            aria-label="Close skill details"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Overview</h4>
          <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
            {skill.description}
          </p>
        </div>

        {/* What I Use It For */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            What I Use It For & Practical Execution
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {skill.usedFor.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-200"
              >
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Related Skills */}
        {skill.relatedSkills && skill.relatedSkills.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Related Stack</h4>
            <div className="flex flex-wrap gap-1.5">
              {skill.relatedSkills.map((rel, rIdx) => (
                <span
                  key={rIdx}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                >
                  {rel}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Applied Projects */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            Applied in Case Studies ({linkedProjects.length})
          </h4>
          {linkedProjects.length > 0 ? (
            <div className="space-y-2">
              {linkedProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between gap-3 hover:border-blue-400 transition-colors"
                >
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white">{proj.title}</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {proj.shortDescription}
                    </p>
                  </div>
                  {onSelectProject && (
                    <button
                      onClick={() => {
                        onClose();
                        onSelectProject(proj);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 rounded-lg hover:bg-blue-100 transition-colors shrink-0 cursor-pointer"
                    >
                      <span>View Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              Integrated across general analytics workflows and reporting templates.
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Domain: <strong className="text-slate-700 dark:text-slate-300">Data Analytics & BI</strong>
          </span>
          <div className="flex items-center gap-2">
            {onCompareWith && (
              <button
                onClick={() => {
                  onClose();
                  onCompareWith(skill);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer"
              >
                Compare Skill
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
