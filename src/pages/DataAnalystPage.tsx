import React from 'react';
import {
  BarChart3,
  ArrowRight,
} from 'lucide-react';
import { About } from '../components/About';
import { RequirementToDashboard } from '../components/RequirementToDashboard';
import { Workflow } from '../components/Workflow';
import { ProjectsSection } from '../components/ProjectsSection';
import { SkillsSection } from '../components/SkillsSection';
import { ExperienceSection } from '../components/ExperienceSection';
import { EducationSection } from '../components/EducationSection';
import { AchievementsSection } from '../components/AchievementsSection';
import { CertificationsSection } from '../components/CertificationsSection';
import { ResumeSection } from '../components/ResumeSection';
import { ContactSection } from '../components/ContactSection';
import { userProfile } from '../data/profile';

interface DataAnalystPageProps {
  onNavigate: (path: string) => void;
  onOpenAssistant: () => void;
}

export const DataAnalystPage: React.FC<DataAnalystPageProps> = ({
  onNavigate,
  onOpenAssistant,
}) => {
  return (
    <div className="space-y-0">
      {/* DA Hero Banner */}
      <section className="py-14 sm:py-20 bg-gradient-to-b from-blue-50/70 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 border-b border-slate-200/70 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Dedicated Career Track</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Data Analyst Portfolio
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {userProfile.daBio}
            </p>

            {/* Quick stats / strengths row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 block">Core Tool</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">Power BI & DAX</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 block">Database</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">Advanced SQL</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 block">Architecture</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">Star Schema</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 block">Certification</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">PL-300 Certified</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <a
                href="#projects-section"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors cursor-pointer"
              >
                <span>Explore DA Case Studies</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                onClick={onOpenAssistant}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              >
                <span>Ask AI Assistant</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section in DA Focus */}
      <About onNavigate={onNavigate} />

      {/* Special Bridge */}
      <RequirementToDashboard />

      {/* Workflow */}
      <Workflow />

      {/* DA Projects */}
      <ProjectsSection onNavigate={onNavigate} />

      {/* DA Skills */}
      <SkillsSection />

      {/* Experience */}
      <ExperienceSection />

      {/* Education */}
      <EducationSection />

      {/* Certifications */}
      <CertificationsSection />

      {/* Achievements */}
      <AchievementsSection />

      {/* Resume */}
      <ResumeSection />

      {/* Contact */}
      <ContactSection />
    </div>
  );
};
