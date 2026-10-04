import React, { useState, useMemo } from 'react';
import {
  Layers,
  Search,
  Filter,
  HelpCircle,
} from 'lucide-react';
import { Project } from '../types';
import { projectsData } from '../data/projects';
import { ProjectCard } from './ProjectCard';
import { ProjectCaseStudyModal } from './ProjectCaseStudyModal';
import { VideoEmbedModal } from './VideoEmbedModal';

interface ProjectsSectionProps {
  onNavigate?: (path: string) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  onNavigate,
}) => {
  const [domainFilter, setDomainFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<Project | null>(null);
  const [selectedVideoProject, setSelectedVideoProject] = useState<Project | null>(null);

  const uniqueDomains = useMemo(() => {
    const domains = new Set(projectsData.map((p) => p.domain));
    return ['All', ...Array.from(domains)];
  }, []);

  const filteredProjects = useMemo(() => {
    return projectsData.filter((project) => {
      // 1. Domain filter
      const matchesDomain = domainFilter === 'All' || project.domain === domainFilter;

      // 2. Search query
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (project.title && project.title.toLowerCase().includes(q)) ||
        (project.shortDescription && project.shortDescription.toLowerCase().includes(q)) ||
        (project.problem && project.problem.toLowerCase().includes(q)) ||
        (project.tools || []).some((t) => t.toLowerCase().includes(q)) ||
        (project.skills || []).some((s) => s.toLowerCase().includes(q));

      return matchesDomain && matchesSearch;
    });
  }, [domainFilter, searchQuery]);

  return (
    <section id="projects-section" className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-slate-900 border-b border-slate-200/70 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Structured Portfolio Work</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Data Analyst Projects & Case Studies
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Practical end-to-end projects covering data cleaning, SQL analysis, Power BI dashboards, DAX measures, data modeling, and decision-ready insights.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs mb-8 space-y-4">
          <div className="grid grid-cols-1 gap-3 items-center">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="search-projects-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects (e.g. Sales, HR, DAX, Churn, SQL, Power BI)..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Domain Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-t border-slate-200 dark:border-slate-700/60 pt-3">
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Domain:
            </span>
            {uniqueDomains.map((domain) => (
              <button
                key={domain}
                onClick={() => setDomainFilter(domain)}
                className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  domainFilter === domain
                    ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
                }`}
              >
                {domain}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onViewCaseStudy={(p) => setSelectedCaseStudy(p)}
                onOpenVideo={(p) => setSelectedVideoProject(p)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 p-8 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
            <HelpCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">No projects found</h4>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              No project case studies matched your selected filters or search terms. Try clearing your search query.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setDomainFilter('All');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Case Study Full Modal */}
      {selectedCaseStudy && (
        <ProjectCaseStudyModal
          project={selectedCaseStudy}
          onClose={() => setSelectedCaseStudy(null)}
          onOpenVideo={(p) => {
            setSelectedCaseStudy(null);
            setSelectedVideoProject(p);
          }}
        />
      )}

      {/* Video Demonstration Modal */}
      {selectedVideoProject && (
        <VideoEmbedModal
          project={selectedVideoProject}
          onClose={() => setSelectedVideoProject(null)}
        />
      )}
    </section>
  );
};
