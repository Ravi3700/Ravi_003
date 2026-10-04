import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Sun,
  Moon,
  FileDown,
  Layers,
  Sparkles,
  Award,
  Mail,
  Home,
  User,
  Briefcase,
  GraduationCap,
  Palette,
} from 'lucide-react';
import { userProfile } from '../data/profile';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { useThemeStudio } from '../context/ThemeContext';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenAssistant: () => void;
  onOpenThemeStudio?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  onNavigate,
  isDarkMode,
  onToggleTheme,
  onOpenAssistant,
  onOpenThemeStudio,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { setIsThemeStudioOpen, activePreset } = useThemeStudio();

  const handleOpenStudio = () => {
    if (onOpenThemeStudio) {
      onOpenThemeStudio();
    } else {
      setIsThemeStudioOpen(true);
    }
  };

  // All tracked section IDs on the single-page portfolio
  const sectionIds = [
    'hero-section',
    'about-section',
    'requirement-to-dashboard-bridge',
    'workflow-section',
    'projects-section',
    'skills-section',
    'experience-section',
    'education-section',
    'certifications-section',
    'achievements-section',
    'resume-section',
    'contact-section',
  ];

  const rawActiveSection = useScrollSpy(sectionIds, { offset: 110 });

  // Map sub-sections to their primary navigation item
  const getNormalizedActiveNavId = (activeId: string): string => {
    switch (activeId) {
      case 'requirement-to-dashboard-bridge':
      case 'workflow-section':
        return 'about-section';
      case 'achievements-section':
        return 'certifications-section';
      default:
        return activeId || 'hero-section';
    }
  };

  const activeNavId = getNormalizedActiveNavId(rawActiveSection);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero-section', path: '/', label: 'Home', icon: Home },
    { id: 'about-section', path: '/about', label: 'About', icon: User },
    { id: 'projects-section', path: '/projects', label: 'Projects', icon: Layers },
    { id: 'skills-section', path: '/skills', label: 'Skills', icon: Sparkles },
    { id: 'experience-section', path: '/experience', label: 'Experience', icon: Briefcase },
    { id: 'education-section', path: '/education', label: 'Education', icon: GraduationCap },
    { id: 'certifications-section', path: '/certifications', label: 'Certifications', icon: Award },
    { id: 'resume-section', path: '/resume', label: 'Resume', icon: FileDown },
  ];

  const handleNavLinkClick = (item: (typeof navItems)[0]) => {
    setMobileMenuOpen(false);

    // If on home/single-page layout, perform smooth scrolling with header offset
    const targetElement = document.getElementById(item.id);
    if (targetElement) {
      const headerOffset = 76;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: item.id === 'hero-section' ? 0 : offsetPosition,
        behavior: 'smooth',
      });

      // Update URL hash without jumping
      try {
        window.history.replaceState(null, '', item.path === '/' ? '#' : `#${item.id}`);
      } catch (e) {}
    } else {
      // Fallback navigation if on standalone subpage
      onNavigate(item.path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-header"
      style={{
        backgroundColor: 'var(--bg-header)',
        borderBottomColor: 'var(--border-default)',
      }}
      className={`sticky top-0 z-40 transition-all duration-300 border-b backdrop-blur-md ${
        isScrolled ? 'shadow-sm bg-opacity-95' : 'bg-opacity-85'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-1 sm:gap-3">
          {/* Logo & Identity */}
          <button
            id="brand-logo-btn"
            onClick={() => handleNavLinkClick(navItems[0])}
            className="flex-shrink-0 flex items-center gap-3 group text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl p-1 transition-transform"
          >
            <div
              style={{
                backgroundColor: 'var(--accent-primary)',
                boxShadow: '0 0 0 1px rgba(255,255,255,0.12)',
              }}
              className="w-10 h-10 flex-shrink-0 rounded-full overflow-hidden shadow-sm group-hover:scale-105 transition-transform"
            >
              <img
                src={userProfile.photoPath}
                alt="Ravi Kumar Shrivastav logo"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="hidden sm:flex flex-col justify-center min-w-0">
              <span
                style={{ color: 'var(--text-primary)' }}
                className="text-sm sm:text-base font-bold tracking-tight leading-tight whitespace-nowrap"
              >
                {userProfile.name}
              </span>
              <span
                style={{ color: 'var(--text-muted)' }}
                className="text-[11px] font-medium flex items-center gap-1.5 whitespace-nowrap mt-0.5"
              >
                <span
                  style={{ backgroundColor: 'var(--accent-emerald)' }}
                  className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse"
                />
                Data Analyst Portfolio
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links with Active Scroll-Spy Highlighting */}
          <nav className="hidden xl:flex items-center gap-1 lg:gap-1.5">
            {navItems.map((item) => {
              const isActive = activeNavId === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavLinkClick(item)}
                  aria-current={isActive ? 'page' : undefined}
                  style={
                    isActive
                      ? {
                          color: 'var(--accent-nav-active)',
                          backgroundColor: 'var(--badge-bg)',
                          borderColor: 'var(--border-default)',
                        }
                      : {
                          color: 'var(--text-secondary)',
                          borderColor: 'transparent',
                        }
                  }
                  className={`relative px-2.5 lg:px-3 py-1.5 text-xs lg:text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5 border hover:bg-slate-100/60 dark:hover:bg-slate-800/60 ${
                    isActive ? 'font-bold shadow-2xs' : ''
                  }`}
                >
                  {isActive && (
                    <span
                      style={{ backgroundColor: 'var(--accent-nav-active)' }}
                      className="w-1.5 h-1.5 rounded-full"
                    />
                  )}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Tablet Compact Nav Bar (lg screens) */}
          <nav className="hidden md:flex xl:hidden items-center gap-1">
            {navItems.slice(0, 6).map((item) => {
              const isActive = activeNavId === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-tablet-${item.id}`}
                  onClick={() => handleNavLinkClick(item)}
                  aria-current={isActive ? 'page' : undefined}
                  style={
                    isActive
                      ? {
                          color: 'var(--accent-nav-active)',
                          backgroundColor: 'var(--badge-bg)',
                          borderColor: 'var(--border-default)',
                        }
                      : {
                          color: 'var(--text-secondary)',
                        }
                  }
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer border ${
                    isActive ? 'font-bold' : 'border-transparent'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Theme Studio Customizer Launcher */}
            <button
              id="header-theme-studio-btn"
              onClick={handleOpenStudio}
              title="Open Theme Studio & Customize Website Colors"
              aria-label="Customize portfolio colors and themes"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-2xs group"
            >
              <Palette className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">Theme</span>
            </button>

            {/* Resume Download CTA */}
            <a
              id="header-resume-download"
              href={userProfile.resumePath}
              download="Data_Analyst_Resume.pdf"
              style={{
                backgroundColor: 'var(--btn-primary-bg)',
                color: 'var(--btn-primary-text)',
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl shadow-xs hover:opacity-90 transition-opacity"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Resume</span>
            </a>

            {/* Dark / Light Mode Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={onToggleTheme}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 transition-colors cursor-pointer"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              title={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-label="Toggle navigation menu"
              className="xl:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          style={{
            backgroundColor: 'var(--bg-header)',
            borderColor: 'var(--border-default)',
          }}
          className="xl:hidden border-b shadow-xl px-4 pt-3 pb-6 space-y-2 animate-in fade-in slide-in-from-top-3 duration-200"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNavId === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => handleNavLinkClick(item)}
                  style={
                    isActive
                      ? {
                          color: 'var(--accent-nav-active)',
                          backgroundColor: 'var(--badge-bg)',
                          borderColor: 'var(--border-default)',
                        }
                      : {
                          color: 'var(--text-primary)',
                        }
                  }
                  className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left cursor-pointer border ${
                    isActive ? 'font-bold shadow-2xs' : 'border-transparent hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon
                      className="w-4 h-4"
                      style={{
                        color: isActive ? 'var(--accent-nav-active)' : 'var(--text-muted)',
                      }}
                    />
                    <span>{item.label}</span>
                  </span>
                  {isActive && (
                    <span
                      style={{
                        backgroundColor: 'var(--badge-bg)',
                        color: 'var(--accent-nav-active)',
                        borderColor: 'var(--border-default)',
                      }}
                      className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border"
                    >
                      Active
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Theme Studio & Theme Toggle row in Mobile Drawer */}
          <div className="pt-2 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleOpenStudio();
              }}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 cursor-pointer"
            >
              <Palette className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Theme Studio</span>
            </button>

            <button
              onClick={onToggleTheme}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                  <span>Light Mode</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-3 mt-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAssistant();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800/60 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Ask AI Portfolio</span>
            </button>
            <a
              href={userProfile.resumePath}
              download="Data_Analyst_Resume.pdf"
              style={{
                backgroundColor: 'var(--btn-primary-bg)',
                color: 'var(--btn-primary-text)',
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-xl text-center"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
