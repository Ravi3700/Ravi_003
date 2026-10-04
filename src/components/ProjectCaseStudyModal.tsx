import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Github,
  Play,
  Linkedin,
  Copy,
  Check,
  BarChart3,
  Database,
  Code2,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle2,
  Workflow,
  Sparkles,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import { Project } from '../types';

interface ProjectCaseStudyModalProps {
  project: Project | null;
  onClose: () => void;
  onOpenVideo?: (project: Project) => void;
}

export const ProjectCaseStudyModal: React.FC<ProjectCaseStudyModalProps> = ({
  project,
  onClose,
  onOpenVideo,
}) => {
  if (!project) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'technical' | 'insights' | 'gallery'>('overview');
  const [activeCodeSnippetIdx, setActiveCodeSnippetIdx] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const isDA = project.profile === 'data-analyst';
  const isBA = project.profile === 'business-analyst';

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div
      id="project-case-study-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="project-case-study-modal"
        className="relative w-full max-w-5xl my-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {project.domain}
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                  Data Analytics
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight line-clamp-1">
                {project.title}
              </h2>
            </div>
          </div>

          <button
            id="close-case-study-btn"
            onClick={onClose}
            aria-label="Close Case Study"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="px-4 sm:px-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1 sm:gap-2 overflow-x-auto text-xs shrink-0 py-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>1. Executive Summary & Problem</span>
          </button>

          <button
            onClick={() => setActiveTab('technical')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'technical'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>2. Data Model & Code Snippets</span>
          </button>

          <button
            onClick={() => setActiveTab('insights')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'insights'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>3. Insights & Business Impact</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'gallery'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>4. Visual Gallery & Screenshots</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto flex-1 space-y-8">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Problem & Objective 2-Column */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Problem */}
                <div className="p-5 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/40 space-y-2">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                    <AlertTriangle className="w-4 h-4" />
                    <h3 className="text-xs font-bold uppercase tracking-wider">Business Problem</h3>
                  </div>
                  <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    {project.problem}
                  </p>
                </div>

                {/* Objective */}
                <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 space-y-2">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                    <TrendingUp className="w-4 h-4" />
                    <h3 className="text-xs font-bold uppercase tracking-wider">Business Objective & Target KPIs</h3>
                  </div>
                  <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    {project.objective}
                  </p>
                </div>
              </div>

              {/* Dataset & Tools Breakdown */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Dataset & Schema Description:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      {(project as any).datasetDescription || project.dataset || 'Comprehensive transactional and operational data records.'}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Tools & Stack:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(project.tools || []).map((tool, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Preparation & Cleaning */}
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                  <span>Data Preparation & ETL Workflow</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {(project as any).dataPreparation || project.dataPrep || 'Structured ETL pipeline using Power Query and SQL staging queries to clean, transform, and validate source records.'}
                </p>
              </div>

              {/* Outcome Highlight Box */}
              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                    Measurable Business Outcome
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 mt-1 leading-relaxed">
                    {project.businessOutcome || project.outcome || 'Optimized operational efficiency and provided automated decision-support reporting.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TECHNICAL & CODE */}
          {activeTab === 'technical' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Data Model Architecture */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <Database className="w-4 h-4" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">
                    Data Model Architecture (Star Schema & Cardinality)
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-mono">
                  {(project as any).dataModel || project.dataModelDescription || project.dataModeling || 'Normalized Star Schema structure with single-directional 1-to-many relationships and surrogate keys.'}
                </p>
              </div>

              {/* Code Snippets Section */}
              {project.codeSnippets && project.codeSnippets.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-blue-500" />
                      <span>Production Code & Formula Snippets</span>
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">
                      {project.codeSnippets[activeCodeSnippetIdx]?.type || (project.codeSnippets[activeCodeSnippetIdx] as any)?.language || 'DAX'}
                    </span>
                  </div>

                  {/* Snippet Selector Tabs */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                    {project.codeSnippets.map((snippet, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveCodeSnippetIdx(idx)}
                        className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                          activeCodeSnippetIdx === idx
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {snippet.title}
                      </button>
                    ))}
                  </div>

                  {/* Code Editor Box */}
                  <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 text-slate-100 shadow-xl">
                    <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="ml-2 font-mono text-slate-400 text-[11px]">
                          {project.codeSnippets[activeCodeSnippetIdx]?.title}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          handleCopyCode(project.codeSnippets[activeCodeSnippetIdx]?.code || '')
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                      </button>
                    </div>

                    <pre className="p-4 overflow-x-auto text-xs font-mono leading-relaxed text-emerald-300 bg-slate-950">
                      <code>{project.codeSnippets[activeCodeSnippetIdx]?.code}</code>
                    </pre>

                    {(project.codeSnippets[activeCodeSnippetIdx]?.explanation || (project.codeSnippets[activeCodeSnippetIdx] as any)?.description) && (
                      <div className="p-3 bg-slate-900/90 border-t border-slate-800 text-xs text-slate-400 leading-relaxed">
                        <strong className="text-slate-300">Technical Context: </strong>
                        {project.codeSnippets[activeCodeSnippetIdx]?.explanation || (project.codeSnippets[activeCodeSnippetIdx] as any)?.description}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No code snippets attached to this record.</p>
              )}

              {/* Analysis & Exploration */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Analysis & Exploration Methodology</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {(project as any).analysisExploration || project.analysis || 'Applied exploratory analysis, cohort groupings, and metric correlation assessments.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: INSIGHTS & RECOMMENDATIONS */}
          {activeTab === 'insights' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Key Insights Discovered */}
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>Key Analytical Insights Discovered</span>
                </h3>
                <div className="space-y-2.5">
                  {(project.keyInsights || []).map((insight, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 flex items-start gap-3"
                    >
                      <span className="w-5 h-5 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                        {insight}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strategic Recommendations */}
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-blue-500" />
                  <span>Actionable Business Recommendations</span>
                </h3>
                <div className="space-y-2.5">
                  {(project.recommendations || []).map((rec, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 flex items-start gap-3"
                    >
                      <span className="w-5 h-5 rounded-full bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                        {rec}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Challenges & Lessons Learned */}
              {((project as any).challenges || (project as any).lessonsLearned) && (
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Engineering Challenges & Lessons Learned
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {(project as any).challenges || (project as any).lessonsLearned}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {((project.galleryImages && project.galleryImages.length > 0) || (project.images && project.images.length > 0)) ? (
                <div className="space-y-4">
                  {/* Big Image Viewer */}
                  {(() => {
                    const imageList = project.galleryImages || (project.images ? project.images.map(img => img.url) : []);
                    const currentImg = imageList[activeImageIdx] || imageList[0];
                    return (
                      <>
                        <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center shadow-lg">
                          <img
                            src={currentImg}
                            alt={`${project.title} screenshot ${activeImageIdx + 1}`}
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                            className="w-full h-full object-contain"
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-slate-400 -z-0">
                            <BarChart3 className="w-12 h-12 text-blue-500 mb-2 opacity-60" />
                            <span className="text-sm font-bold text-slate-300">{project.title}</span>
                            <span className="text-xs text-slate-500 font-mono mt-1">
                              {currentImg}
                            </span>
                          </div>
                        </div>

                        {/* Thumbnail Row */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2">
                          {imageList.map((img, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActiveImageIdx(idx)}
                              className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                                activeImageIdx === idx
                                  ? 'border-blue-500 ring-2 ring-blue-400/30'
                                  : 'border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-100'
                              }`}
                            >
                              <div className="w-full h-full bg-slate-900 flex items-center justify-center text-[10px] text-slate-400 font-mono">
                                View {idx + 1}
                              </div>
                            </button>
                          ))}
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="text-center py-12 p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">
                    High-resolution screenshots can be placed in `/assets/projects/` to preview live dashboards.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Sticky Bottom Action Bar */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            {project.liveDashboardUrl && (
              <a
                href={project.liveDashboardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-colors shadow-xs"
              >
                <span>Live Dashboard</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-white transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Code</span>
              </a>
            )}

            {project.videoUrl && onOpenVideo && (
              <button
                onClick={() => onOpenVideo(project)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-100 border border-red-200 dark:border-red-800 text-xs font-bold transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Video Demo</span>
              </button>
            )}

            {project.linkedinPostUrl && (
              <a
                href={project.linkedinPostUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 text-xs font-semibold transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn Showcase</span>
              </a>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
          >
            Close Case Study
          </button>
        </div>
      </div>
    </div>
  );
};
