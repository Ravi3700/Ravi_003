import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  User,
  Layers,
  BarChart3,
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  Send,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';

export interface TourStep {
  id: string;
  targetId: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
}

interface PortfolioTourProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (path: string) => void;
}

// Master tour steps matching real portfolio homepage sections
export const TOUR_STEPS: TourStep[] = [
  {
    id: 'hero',
    targetId: 'hero-section',
    title: 'Welcome to my portfolio 👋',
    subtitle: 'Hero & Value Overview',
    description:
      'Get a quick overview of my profile, data analytics expertise, and professional focus.',
    icon: Sparkles,
  },
  {
    id: 'about',
    targetId: 'about-section',
    title: 'About Me',
    subtitle: 'Background & Core Philosophy',
    description:
      'Learn about my approach to translating complex business requirements into high-impact analytical solutions.',
    icon: User,
  },
  {
    id: 'projects',
    targetId: 'projects-section',
    title: 'Featured Projects',
    subtitle: 'End-to-End Case Studies',
    description:
      'Explore practical projects, dashboards, analytics solutions, Star Schema models, and business-focused work.',
    icon: BarChart3,
  },
  {
    id: 'skills',
    targetId: 'skills-section',
    title: 'Skills & Technologies',
    subtitle: 'Technical & BI Competencies',
    description:
      'Explore the tools and technologies I work with across data analytics, Power BI, SQL, Python, Excel, and ETL.',
    icon: Layers,
  },
  {
    id: 'experience',
    targetId: 'experience-section',
    title: 'Experience',
    subtitle: 'Professional Career Journey',
    description:
      'Discover my professional journey, cross-functional reporting operations, and track record in data analytics.',
    icon: Briefcase,
  },
  {
    id: 'education',
    targetId: 'education-section',
    title: 'Education & Academic Foundation',
    subtitle: 'Formal Qualifications',
    description:
      'Formal background in computer applications and relational database query engineering.',
    icon: GraduationCap,
  },
  {
    id: 'certifications',
    targetId: 'certifications-section',
    title: 'Verified Certifications',
    subtitle: 'Industry Credentials',
    description:
      'Browse verified accreditations across Power BI, SQL databases, and agile business analysis.',
    icon: Award,
  },
  {
    id: 'resume',
    targetId: 'resume-section',
    title: 'Curriculum Vitae & Resume',
    subtitle: 'Recruiter Hub',
    description:
      'Download my verified resume in PDF format or inspect core competencies directly.',
    icon: FileText,
  },
  {
    id: 'contact',
    targetId: 'contact-section',
    title: "Let's Connect",
    subtitle: 'Direct Messaging & Socials',
    description:
      'Reach out directly via WhatsApp, LinkedIn, GitHub, or email for full-time roles and collaborations.',
    icon: Send,
  },
];

export const PortfolioTour: React.FC<PortfolioTourProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const totalSteps = TOUR_STEPS.length;
  const currentStep = TOUR_STEPS[activeStepIndex] || TOUR_STEPS[0];

  // Helper to scroll cleanly to the target element with header offset
  const scrollToTarget = useCallback((targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      const headerOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth',
      });
    }
  }, []);

  // When tour opens or closes, manage route and reset state
  useEffect(() => {
    if (isOpen) {
      setActiveStepIndex(0);
      setIsFinished(false);
      // Ensure we are on the homepage where all sections reside
      if (onNavigate && window.location.pathname !== '/' && window.location.hash !== '' && window.location.hash !== '#/') {
        onNavigate('/');
      }
    } else {
      setTargetRect(null);
      setIsFinished(false);
      setActiveStepIndex(0);
    }
  }, [isOpen, onNavigate]);

  // When active step changes or tour finishes, handle scroll & calculate spotlight bounds
  useEffect(() => {
    if (!isOpen || isFinished || !currentStep) return;

    // Scroll to the active section
    scrollToTarget(currentStep.targetId);

    // Update spotlight rectangle
    const updateTargetRect = () => {
      const el = document.getElementById(currentStep.targetId);
      if (el) {
        setTargetRect(el.getBoundingClientRect());
      } else {
        setTargetRect(null);
      }
    };

    updateTargetRect();

    window.addEventListener('scroll', updateTargetRect, { passive: true });
    window.addEventListener('resize', updateTargetRect, { passive: true });

    // Multi-interval checks to catch smooth scroll landings and layout shifts
    const t1 = setTimeout(updateTargetRect, 100);
    const t2 = setTimeout(updateTargetRect, 300);
    const t3 = setTimeout(updateTargetRect, 600);

    return () => {
      window.removeEventListener('scroll', updateTargetRect);
      window.removeEventListener('resize', updateTargetRect);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isOpen, isFinished, activeStepIndex, currentStep, scrollToTarget]);

  // Step transition handlers
  const handleNext = () => {
    if (activeStepIndex < totalSteps - 1) {
      setActiveStepIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleBack = () => {
    if (isFinished) {
      setIsFinished(false);
      return;
    }
    if (activeStepIndex > 0) {
      setActiveStepIndex((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setIsFinished(false);
    setActiveStepIndex(0);
  };

  const handleStepClick = (idx: number) => {
    if (idx >= 0 && idx < totalSteps) {
      setIsFinished(false);
      setActiveStepIndex(idx);
    }
  };

  const handleClose = () => {
    setIsFinished(false);
    setActiveStepIndex(0);
    onClose();
  };

  // Keyboard navigation: ArrowRight / Enter -> Next, ArrowLeft -> Back, Escape -> Close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (!isFinished) {
          e.preventDefault();
          handleNext();
        }
      } else if (e.key === 'ArrowLeft') {
        if (!isFinished && activeStepIndex > 0) {
          e.preventDefault();
          handleBack();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFinished, activeStepIndex, totalSteps]);

  if (!isOpen) return null;

  const StepIcon = currentStep ? currentStep.icon : Compass;

  return (
    <div
      id="portfolio-tour-root"
      role="dialog"
      aria-modal="true"
      aria-label="Interactive Guided Portfolio Tour"
      className="fixed inset-0 z-[60] overflow-hidden pointer-events-none"
    >
      {/* 1. Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-slate-950/70 dark:bg-slate-950/80 backdrop-blur-[2px] transition-opacity duration-300 pointer-events-auto"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* 2. Spotlight Highlight Frame (if section rect is detected and not in finished state) */}
      {!isFinished && targetRect && (
        <div
          id="tour-spotlight-highlight"
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: `${Math.max(12, targetRect.top - 8)}px`,
            left: `${Math.max(12, targetRect.left - 8)}px`,
            width: `${Math.min(window.innerWidth - 24, targetRect.width + 16)}px`,
            height: `${Math.min(window.innerHeight - 24, targetRect.height + 16)}px`,
            transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="pointer-events-none rounded-3xl ring-4 ring-indigo-500/80 shadow-[0_0_50px_rgba(99,102,241,0.4)] border-2 border-indigo-400/50 z-[61]"
        />
      )}

      {/* 3. Floating Tour Card / Tooltip Window */}
      <div className="fixed inset-x-4 bottom-6 sm:bottom-8 sm:inset-x-auto sm:right-8 sm:max-w-md z-[70] flex flex-col items-center pointer-events-auto">
        <div
          ref={cardRef}
          className="w-full rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-700/90 shadow-2xl p-5 sm:p-6 transition-all duration-300 ease-out space-y-4 ring-1 ring-slate-900/5 dark:ring-white/10"
        >
          {/* ========================================================== */}
          {/* TOUR COMPLETION VIEW                                       */}
          {/* ========================================================== */}
          {isFinished ? (
            <div className="text-center space-y-4 py-2">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  That&apos;s the tour! 🚀
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm mx-auto">
                  Thanks for exploring my portfolio. Feel free to dive into any case studies, download my resume, or connect directly.
                </p>
              </div>

              {/* Completion Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  id="tour-explore-yourself-btn"
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-500 text-white shadow-md transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  Explore Yourself
                </button>
                <button
                  id="tour-restart-btn"
                  type="button"
                  onClick={handleRestart}
                  className="w-full sm:w-auto py-2.5 px-3.5 rounded-xl font-semibold text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restart</span>
                </button>
                <button
                  id="tour-close-finish-btn"
                  type="button"
                  onClick={handleClose}
                  aria-label="Close tour"
                  className="w-full sm:w-auto py-2.5 px-3.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* ========================================================== */
            /* ACTIVE STEP VIEW                                           */
            /* ========================================================== */
            <>
              {/* Header: Icon, Step Pill, Title, and Close Button */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 shadow-xs">
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {currentStep?.subtitle}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        Step {activeStepIndex + 1} of {totalSteps}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                      {currentStep?.title}
                    </h3>
                  </div>
                </div>

                <button
                  id="tour-skip-x-btn"
                  type="button"
                  onClick={handleClose}
                  aria-label="Skip tour"
                  title="Skip Tour"
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Step Description */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {currentStep?.description}
              </p>

              {/* Progress Dots Indicator */}
              <div className="flex items-center justify-center gap-1.5 py-1" aria-hidden="true">
                {TOUR_STEPS.map((step, idx) => (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => handleStepClick(idx)}
                    aria-label={`Jump to step ${idx + 1}: ${step.title}`}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === activeStepIndex
                        ? 'w-6 bg-indigo-600 dark:bg-indigo-400'
                        : idx < activeStepIndex
                        ? 'w-1.5 bg-indigo-300 dark:bg-indigo-800'
                        : 'w-1.5 bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                ))}
              </div>

              {/* Bottom Control Actions */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  id="tour-skip-link-btn"
                  type="button"
                  onClick={handleClose}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors px-2 py-1.5 cursor-pointer"
                >
                  Skip Tour
                </button>

                <div className="flex items-center gap-2">
                  <button
                    id="tour-prev-btn"
                    type="button"
                    onClick={handleBack}
                    disabled={activeStepIndex === 0}
                    aria-label="Previous tour step"
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-colors cursor-pointer ${
                      activeStepIndex === 0
                        ? 'opacity-40 cursor-not-allowed border-transparent text-slate-400'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    id="tour-next-btn"
                    type="button"
                    onClick={handleNext}
                    aria-label={activeStepIndex === totalSteps - 1 ? 'Finish Tour' : 'Next tour step'}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-500 text-white shadow-xs flex items-center gap-1.5 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    <span>{activeStepIndex === totalSteps - 1 ? 'Finish' : 'Next'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
