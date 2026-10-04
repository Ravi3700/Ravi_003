import React, { useState } from 'react';
import {
  ExternalLink,
  Github,
  Play,
  ArrowRight,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onViewCaseStudy: (project: Project) => void;
  onOpenVideo?: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onViewCaseStudy,
  onOpenVideo,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      id={`project-card-${project.id}`}
      className="group relative flex flex-col justify-between rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 overflow-hidden"
    >
      <div>
        {/* Card Thumbnail / Preview Banner */}
        <div
          className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900 border-b border-slate-100 dark:border-slate-700/60 cursor-pointer"
          onClick={() => onViewCaseStudy(project)}
        >
          {!imgError && project.thumbnail ? (
            <img
              src={project.thumbnail}
              alt={project.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 text-slate-300">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-xs font-bold text-white tracking-wide line-clamp-1">
                {project.title}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 uppercase font-mono">
                {project.domain}
              </span>
            </div>
          )}

          {/* Domain & Profile Chips Floating on Image */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-white border border-white/10 shadow-sm">
              {project.domain}
            </span>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md bg-blue-600/90 text-white">
              Data Analytics
            </span>
          </div>
        </div>

        {/* Card Content Area */}
        <div className="p-5 sm:p-6 space-y-4">
          <div>
            <h3
              onClick={() => onViewCaseStudy(project)}
              className="text-lg font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer line-clamp-1"
            >
              {project.title}
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
              {project.shortDescription}
            </p>
          </div>

          {/* Tools Used Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {(project.tools || []).slice(0, 4).map((tool, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-700/70 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-600/60"
              >
                {tool}
              </span>
            ))}
            {(project.tools || []).length > 4 && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold text-slate-400">
                +{(project.tools || []).length - 4} more
              </span>
            )}
          </div>

          {/* Outcome Snippet */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold mb-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Business Impact</span>
            </div>
            <p className="line-clamp-2 leading-relaxed text-[11px]">
              {project.businessOutcome || project.outcome || 'Measurable ROI & process optimization achieved.'}
            </p>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-5 sm:p-6 pt-0 space-y-2.5">
        {/* Main CTA: View Full Case Study */}
        <button
          id={`view-case-study-${project.id}`}
          onClick={() => onViewCaseStudy(project)}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs text-white bg-slate-900 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-xs transition-colors cursor-pointer"
        >
          <span>View Detailed Case Study</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {/* Secondary Links Row */}
        <div className="flex items-center justify-between gap-2 pt-1 text-xs">
          {(project as any).liveDashboardUrl || project.dashboardUrl ? (
            <a
              href={(project as any).liveDashboardUrl || project.dashboardUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              <span>Live Dashboard</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span className="text-[11px] text-slate-400">PBI Model Included</span>
          )}

          <div className="flex items-center gap-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Repository"
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            )}

            {project.videoUrl && onOpenVideo && (
              <button
                onClick={() => onOpenVideo(project)}
                aria-label="Watch Video Demo"
                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/60 transition-colors cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
