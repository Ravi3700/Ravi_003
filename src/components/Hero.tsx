import React, { useState, useEffect, useMemo } from 'react';
import {
  FileDown,
  ArrowRight,
  Linkedin,
  Github,
  Mail,
  BarChart3,
  Sparkles,
  Database,
  LineChart,
  CheckCircle2,
  TrendingUp,
  Activity,
  Sun,
  Sunrise,
  Sunset,
  Moon,
} from 'lucide-react';
import { userProfile } from '../data/profile';

interface HeroProps {
  onNavigate: (path: string) => void;
  onOpenAssistant: () => void;
}

// Compute client local time-based greeting using native browser APIs
function getLocalTimeGreeting(): { greeting: string; iconType: 'morning' | 'afternoon' | 'evening' | 'night' } {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return { greeting: 'Good Morning', iconType: 'morning' };
  } else if (hour >= 12 && hour < 17) {
    return { greeting: 'Good Afternoon', iconType: 'afternoon' };
  } else if (hour >= 17 && hour < 22) {
    return { greeting: 'Good Evening', iconType: 'evening' };
  } else {
    return { greeting: 'Good Evening', iconType: 'night' };
  }
}

export const Hero: React.FC<HeroProps> = ({
  onNavigate,
  onOpenAssistant,
}) => {
  const [imgError, setImgError] = useState(false);
  const [timeGreeting, setTimeGreeting] = useState(() => getLocalTimeGreeting());
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Dynamic roles array from profile configuration
  const roles = useMemo(() => {
    return userProfile.rotatingRoles && userProfile.rotatingRoles.length > 0
      ? userProfile.rotatingRoles
      : ['Data Analyst', 'Power BI Developer', 'Content Creator'];
  }, []);

  // 1. Accessibility: Detect reduced-motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(listener);
      return () => mediaQuery.removeListener(listener);
    }
  }, []);

  // 2. Periodic check for time-based greeting update (every 60 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      const updated = getLocalTimeGreeting();
      setTimeGreeting((prev) => {
        if (prev.greeting !== updated.greeting || prev.iconType !== updated.iconType) {
          return updated;
        }
        return prev;
      });
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // 3. Rotating role animation cycle (approx 2.8s display + smooth transition)
  useEffect(() => {
    if (roles.length <= 1) return;

    const interval = setInterval(() => {
      if (prefersReducedMotion) {
        setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
      } else {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
          setIsTransitioning(false);
        }, 300);
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [roles.length, prefersReducedMotion]);

  const handleScrollTo = (sectionId: string, fallbackPath: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const headerOffset = 76;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      try {
        window.history.replaceState(null, '', `#${sectionId}`);
      } catch (e) {}
    } else {
      onNavigate(fallbackPath);
    }
  };

  const renderGreetingIcon = () => {
    switch (timeGreeting.iconType) {
      case 'morning':
        return <Sunrise className="w-4 h-4 text-amber-500 inline-block shrink-0" />;
      case 'afternoon':
        return <Sun className="w-4 h-4 text-amber-500 inline-block shrink-0" />;
      case 'evening':
        return <Sunset className="w-4 h-4 text-orange-500 inline-block shrink-0" />;
      case 'night':
      default:
        return <Moon className="w-4 h-4 text-indigo-400 inline-block shrink-0" />;
    }
  };

  return (
    <section
      id="hero-section"
      className="relative overflow-hidden pt-8 pb-14 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24 bg-gradient-to-b from-slate-50 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900/90 dark:to-slate-950 border-b border-slate-200/80 dark:border-slate-800"
    >
      {/* Subtle Background Mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 dark:opacity-20">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text Content Area */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Status Badge */}
            <div className="flex items-center justify-center lg:justify-start">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/80 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Available for Data Analyst & BI Roles</span>
              </div>
            </div>

            {/* Main Greeting & Name */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-sm sm:text-base font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {renderGreetingIcon()}
                <span>{timeGreeting.greeting}, I'm</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                {userProfile.name}
              </h1>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-3 gap-y-1 pt-1">
                {/* Animated Rotating Role with stable height */}
                <div
                  className="inline-flex items-center min-h-[2rem] sm:min-h-[2.5rem] lg:min-h-[2.75rem]"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <span
                    className={`text-xl sm:text-2xl lg:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 dark:from-blue-400 dark:via-indigo-300 dark:to-blue-300 transition-all duration-300 ease-out transform inline-block ${
                      isTransitioning && !prefersReducedMotion
                        ? 'opacity-0 -translate-y-2'
                        : 'opacity-100 translate-y-0'
                    }`}
                  >
                    {roles[currentRoleIndex]}
                  </span>
                </div>
                <span className="text-slate-300 dark:text-slate-600 font-bold hidden sm:inline">•</span>
                <span className="text-base sm:text-lg lg:text-xl font-semibold text-slate-700 dark:text-slate-200">
                  Business Intelligence & Data Modeling
                </span>
              </div>
            </div>

            {/* Profile Value Statement */}
            <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs border border-slate-200/80 dark:border-slate-800 shadow-xs max-w-2xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-100 dark:ring-blue-900/50" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Core Analytics Value Proposition
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                {userProfile.daHeadline}
              </p>
              <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Key Pillars:</span>
                <span className="px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-medium border border-blue-200/60 dark:border-blue-800/60">Power BI</span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border border-slate-200/60 dark:border-slate-700/60">SQL</span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border border-slate-200/60 dark:border-slate-700/60">DAX</span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border border-slate-200/60 dark:border-slate-700/60">Data Modeling</span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border border-slate-200/60 dark:border-slate-700/60">Power Query ETL</span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border border-slate-200/60 dark:border-slate-700/60">Advanced Excel</span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border border-slate-200/60 dark:border-slate-700/60">Pivot Tables</span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border border-slate-200/60 dark:border-slate-700/60">Business Analysis</span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border border-slate-200/60 dark:border-slate-700/60">Problem Solving</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                id="hero-primary-cta"
                onClick={() => handleScrollTo('projects-section', '/projects')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <span>Explore Projects & Dashboards</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-skills-cta"
                onClick={() => handleScrollTo('skills-section', '/skills')}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-300 dark:border-slate-700 shadow-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span>Skills & Tech Stack</span>
              </button>

              <a
                id="hero-resume-cta"
                href={userProfile.resumePath}
                download="Data_Analyst_Resume.pdf"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <FileDown className="w-4 h-4 text-slate-500" />
                <span>Resume</span>
              </a>

              <button
                id="hero-contact-cta"
                onClick={() => handleScrollTo('contact-section', '/contact')}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Me</span>
              </button>
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center lg:justify-start gap-4 pt-3 text-slate-500 dark:text-slate-400 text-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Connect:</span>
              <a
                href={userProfile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={userProfile.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href={`mailto:${userProfile.email}`}
                aria-label="Send Email"
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Portrait & Visual Card Area */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Decorative Card Frame */}
              <div className="relative rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl transition-all duration-300">
                {/* Portrait Placeholder with Graceful Fallback */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center group">
                  {!imgError ? (
                    <img
                      src={userProfile.photoPath}
                      alt={`${userProfile.name} - Data Analyst Portrait`}
                      onError={() => setImgError(true)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400 dark:text-slate-300">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg mb-3">
                        DA
                      </div>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                        {userProfile.name}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Data Analyst Portrait Area
                      </p>
                      <span className="text-[10px] text-slate-400 bg-slate-200/70 dark:bg-slate-700/70 px-2 py-0.5 rounded mt-2 font-mono">
                        /assets/profile.jpg
                      </span>
                    </div>
                  )}

                  {/* Profile Badge Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-700 shadow-md flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs font-bold text-slate-800 dark:text-white">
                        Data Analyst
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/60">
                      Open to Work
                    </span>
                  </div>
                </div>

                {/* Quick Capability Matrix under portrait */}
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2.5 text-left">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50">
                    <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 mb-1">
                      <Database className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-bold">Data Modeling</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1">
                      Star Schema • DAX • SQL
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50">
                    <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 mb-1">
                      <LineChart className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-bold">BI & Reporting</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1">
                      Power BI • KPI Scorecards
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
