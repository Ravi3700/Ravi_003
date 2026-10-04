import React, { useState, useMemo } from 'react';
import {
  Search,
  Sparkles,
  ArrowRight,
  Filter,
  Star,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { Skill, Project } from '../types';
import { skillsData, skillCategories } from '../data/skills';
import { TechLogo } from './TechLogo';
import { SkillDetailModal } from './SkillDetailModal';
import { SkillCompareModal } from './SkillCompareModal';

interface SkillsSectionProps {
  onSelectProject?: (project: Project) => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  onSelectProject,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalSkill, setActiveModalSkill] = useState<Skill | null>(null);
  const [compareSkillA, setCompareSkillA] = useState<Skill | null>(null);

  const filteredSkills = useMemo(() => {
    return skillsData.filter((skill) => {
      // 1. Category filter
      const matchesCategory =
        selectedCategory === 'All' ||
        selectedCategory === 'all' ||
        (selectedCategory === 'Core Tools' && skill.isCore) ||
        skill.category === selectedCategory;

      // 2. Search query
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        skill.name.toLowerCase().includes(q) ||
        skill.category.toLowerCase().includes(q) ||
        skill.description.toLowerCase().includes(q) ||
        (skill.usedFor || []).some((u) => u.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const coreSkills = useMemo(() => {
    return skillsData.filter((s) => s.isCore || s.featured);
  }, []);

  return (
    <section id="skills-section" className="py-16 sm:py-20 lg:py-24 bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/70 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Technical & Analytics Toolset</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Skills, Tools & Data Analyst Competencies
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
            A practical overview of the tools, technologies, and analytical skills I use for data cleaning, analysis, visualization, dashboard development, and reporting.
          </p>
        </div>

        {/* Core Spotlight Carousel / Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Core Data Toolset Spotlight
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">Click any card for practical use cases</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {coreSkills.map((skill) => (
              <button
                key={skill.id}
                onClick={() => setActiveModalSkill(skill)}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-md hover:border-blue-500 dark:hover:border-blue-400 transition-all text-center flex flex-col items-center justify-between group cursor-pointer"
              >
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 mb-2.5 group-hover:scale-110 transition-transform">
                  <TechLogo logoKey={skill.logoKey || skill.icon || skill.id} size={36} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {skill.name}
                  </h4>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold block mt-0.5">
                    {skill.level || 'Advanced'}
                  </span>
                </div>
                <div className="mt-2 text-[10px] text-slate-400 group-hover:text-blue-600 transition-colors flex items-center gap-0.5">
                  <span>Details</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-xs mb-8 space-y-4">
          <div className="grid grid-cols-1 gap-3 items-center">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="search-skills-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skills (e.g., Power BI, DAX, SQL, Star Schema, Power Query)..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-t border-slate-100 dark:border-slate-700/60 pt-3">
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Categories:
            </span>
            {skillCategories.map((cat) => {
              const isSelected =
                (selectedCategory === 'All' && cat.id === 'all') ||
                selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id === 'all' ? 'All' : cat.id)}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {cat.id === 'all' ? `All Skills (${skillsData.length})` : cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Skills Grid */}
        {filteredSkills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredSkills.map((skill) => {
              return (
                <div
                  key={skill.id}
                  onClick={() => setActiveModalSkill(skill)}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    {/* Top Row */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700/60 border border-slate-100 dark:border-slate-700 group-hover:scale-105 transition-transform">
                          <TechLogo logoKey={skill.logoKey || skill.icon || skill.id} size={30} />
                        </div>
                        <div>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {skill.name}
                          </h4>
                          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 capitalize">
                            {skill.category.replace(/-/g, ' ')}
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                        {skill.level || 'DA'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-3">
                      {skill.description}
                    </p>

                    {/* What I Use It For preview */}
                    <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                      {(skill.usedFor || []).slice(0, 2).map((use, uIdx) => (
                        <div key={uIdx} className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1">
                          <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span className="truncate">{use}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">
                      {(skill.relatedProjects || skill.linkedProjects || []).length > 0
                        ? `${(skill.relatedProjects || skill.linkedProjects || []).length} Case Studies`
                        : 'Core Tool'}
                    </span>
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>View Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h4 className="text-base font-bold text-slate-900 dark:text-white">No matching skills found</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Try adjusting your search keywords or resetting the category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-3 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Skill Detail Modal */}
      {activeModalSkill && (
        <SkillDetailModal
          skill={activeModalSkill}
          onClose={() => setActiveModalSkill(null)}
          onSelectProject={onSelectProject}
          onCompareWith={(skill) => {
            setActiveModalSkill(null);
            setCompareSkillA(skill);
          }}
        />
      )}

      {/* Skill Compare Modal */}
      {compareSkillA && (
        <SkillCompareModal
          initialSkillA={compareSkillA}
          onClose={() => setCompareSkillA(null)}
        />
      )}
    </section>
  );
};
