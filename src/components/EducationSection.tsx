import React from 'react';
import {
  GraduationCap,
  BookOpen,
  MapPin,
  Calendar,
  Award,
  ExternalLink,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { educationData } from '../data/education';

export const EducationSection: React.FC = () => {
  return (
    <section
      id="education-section"
      className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-slate-900 border-b border-slate-200/70 dark:border-slate-800 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Background</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Education & Qualifications
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Formal computer applications and analytics foundation providing rigorous training in relational database systems, SQL query engineering, data structures, and statistical problem-solving.
          </p>
        </div>

        {/* Education Timeline / Cards */}
        <div className="max-w-4xl mx-auto space-y-8">
          {educationData.map((edu, idx) => {
            const hasInstitution = Boolean(edu.institution);
            const hasUniversity = Boolean(edu.university);
            const displayTime =
              edu.year ||
              (edu.startDate && edu.endDate
                ? `${edu.startDate} — ${edu.endDate}`
                : edu.startDate || edu.endDate || '');

            return (
              <div
                key={edu.id || `edu-${idx}`}
                id={`education-card-${edu.id || idx}`}
                className="relative rounded-3xl bg-slate-50/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 p-6 sm:p-8 shadow-xs hover:shadow-md transition-all duration-200"
              >
                {/* Header Row */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-6 border-b border-slate-200/70 dark:border-slate-700/70">
                  <div className="flex items-start gap-4">
                    {/* Degree Icon / Logo */}
                    <div className="w-12 h-12 rounded-2xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5 border border-blue-200/60 dark:border-blue-500/30">
                      {edu.logo ? (
                        <img
                          src={edu.logo}
                          alt={edu.institution || edu.degree}
                          className="w-7 h-7 object-contain"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <GraduationCap className="w-6 h-6" />
                      )}
                    </div>

                    <div className="space-y-1">
                      {/* Short Degree Tag & Status Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        {edu.shortDegree && (
                          <span className="px-2.5 py-0.5 rounded-md text-xs font-extrabold uppercase bg-blue-600 text-white shadow-2xs">
                            {edu.shortDegree}
                          </span>
                        )}
                        {edu.status && (
                          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                            {edu.status}
                          </span>
                        )}
                        {edu.grade && (
                          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/60">
                            {edu.grade}
                          </span>
                        )}
                      </div>

                      {/* Degree Title */}
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                        {edu.degree}
                      </h3>

                      {/* Institution / University */}
                      {(hasInstitution || hasUniversity) && (
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-blue-600 dark:text-blue-400">
                          {hasInstitution && (
                            <span className="flex items-center gap-1.5">
                              <Building2 className="w-4 h-4 text-blue-500 shrink-0" />
                              <span>{edu.institution}</span>
                            </span>
                          )}
                          {hasInstitution && hasUniversity && (
                            <span className="text-slate-400 dark:text-slate-600">•</span>
                          )}
                          {hasUniversity && (
                            <span className="text-slate-600 dark:text-slate-300 font-medium">
                              {edu.university}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Specialization */}
                      {edu.specialization && (
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                          <span className="font-medium text-slate-700 dark:text-slate-300">Specialization:</span>{' '}
                          {edu.specialization}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Metadata (Date & Location & Credential Link) */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-2 text-xs text-slate-600 dark:text-slate-400 shrink-0">
                    {displayTime && (
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-750 px-3 py-1.5 rounded-xl border border-slate-200/70 dark:border-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-blue-500" />
                        <span>{displayTime}</span>
                      </div>
                    )}
                    {edu.location && (
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{edu.location}</span>
                      </div>
                    )}
                    {(edu.credentialUrl || edu.certificateUrl) && (
                      <a
                        href={edu.credentialUrl || edu.certificateUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline mt-1"
                      >
                        <span>View Credential</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Description */}
                {edu.description && (
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {edu.description}
                  </p>
                )}

                {/* Key Academic & Project Highlights */}
                {edu.highlights && edu.highlights.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>Academic Competencies & Focus Areas:</span>
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      {edu.highlights.map((highlight, hIdx) => (
                        <li
                          key={hIdx}
                          className="flex items-start gap-2 bg-white/70 dark:bg-slate-700/50 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Coursework Grid */}
                {edu.coursework && edu.coursework.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                      <span>Core Coursework & Modules:</span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {edu.coursework.map((course, cIdx) => (
                        <span
                          key={cIdx}
                          className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700/70 border border-slate-200/80 dark:border-slate-600/80 text-xs font-medium text-slate-800 dark:text-slate-200 shadow-2xs"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
