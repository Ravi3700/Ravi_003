import React, { useState } from 'react';
import {
  FileDown,
  Eye,
  CheckCircle2,
  FileText,
  Download,
} from 'lucide-react';
import { userProfile } from '../data/profile';
import { skillsData } from '../data/skills';
import { experienceData } from '../data/experience';
import { educationData } from '../data/education';

export const ResumeSection: React.FC = () => {
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const daCoreSkills = skillsData.slice(0, 8);

  return (
    <section id="resume-section" className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-slate-900 border-b border-slate-200/70 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 mb-3">
            <FileText className="w-3.5 h-3.5" />
            <span>Recruiter Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Curriculum Vitae & Resume
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Download my verified resume in PDF format or inspect core competencies and career milestones directly online.
          </p>
        </div>

        {/* Quick Action Banner */}
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shadow-xl mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Updated for 2026 Hiring Cycles</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              Ready for Offline Review or ATS Screening
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md">
              Comprehensive format formatted for ATS compliance with clear section headers and measurable metrics.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            {userProfile.resumeGoogleDriveUrl && userProfile.resumeGoogleDriveUrl !== 'YOUR_GOOGLE_DRIVE_RESUME_LINK' && (
              <a
                id="google-drive-resume-btn"
                href={userProfile.resumeGoogleDriveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-md transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Google Drive</span>
              </a>
            )}

            <a
              id="download-resume-pdf-btn"
              href={userProfile.resumePath}
              download="Resume.pdf"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-slate-900 bg-white hover:bg-slate-100 shadow-md transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span>Download PDF</span>
            </a>

            <button
              onClick={() => setShowPreviewModal(true)}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Preview Online</span>
            </button>
          </div>
        </div>

        {/* Interactive Online Resume Summary */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 p-6 sm:p-8 space-y-8 shadow-xs">
          {/* Header Identity in Resume */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {userProfile.name}
              </h3>
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                Data Analyst
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {userProfile.location} • {userProfile.email}
              </p>
            </div>
          </div>

          {/* Professional Summary */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Executive Summary
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              {userProfile.daBio}
            </p>
          </div>

          {/* Key Technical Competencies */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Key Competencies & Toolset
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {daCoreSkills.map((s) => (
                <div
                  key={s.id}
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-700/60 border border-slate-200/70 dark:border-slate-600/70 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="truncate">{s.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Highlights */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Experience Summary
            </h4>
            <div className="space-y-4">
              {experienceData.map((exp) => (
                <div
                  key={exp.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-700/40 border border-slate-200/70 dark:border-slate-600/70 space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {exp.role} — <span className="text-blue-600 dark:text-blue-400">{exp.company}</span>
                    </span>
                    <span className="text-slate-400 font-medium">{exp.duration}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Education Highlights */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Education
            </h4>
            {educationData.map((edu) => {
              const displayTime =
                edu.year ||
                (edu.startDate && edu.endDate
                  ? `${edu.startDate} — ${edu.endDate}`
                  : edu.startDate || edu.endDate || '');
              const place = edu.institution || edu.university || '';
              return (
                <div key={edu.id} className="text-xs text-slate-700 dark:text-slate-300 py-1">
                  <strong className="text-slate-900 dark:text-white">{edu.degree}</strong>
                  {place && ` — ${place}`}
                  {displayTime && ` (${displayTime})`}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Online Resume Preview Modal */}
      {showPreviewModal && (
        <div
          id="resume-preview-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setShowPreviewModal(false)}
        >
          <div
            id="resume-preview-modal"
            className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Resume Document Preview
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={userProfile.resumePath}
                  download="Resume.pdf"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Embedded Iframe or PDF Reader View */}
            <div className="flex-1 p-6 overflow-y-auto bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
              <iframe
                src={userProfile.resumePath}
                title="Resume PDF Document"
                className="w-full h-[65vh] rounded-xl border border-slate-300 dark:border-slate-800 bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
