import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AIPortfolioAssistant } from './components/AIPortfolioAssistant';
import { ProjectCaseStudyModal } from './components/ProjectCaseStudyModal';
import { ThemeStudioModal } from './components/ThemeStudioModal';
import { ThemeProvider, useThemeStudio } from './context/ThemeContext';
import { VisitorProvider } from './context/VisitorContext';
import { HomePage } from './pages/HomePage';
import { DataAnalystPage } from './pages/DataAnalystPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { SkillsPage } from './pages/SkillsPage';
import { CertificationsPage } from './pages/CertificationsPage';
import { ResumePage } from './pages/ResumePage';
import { ContactPage } from './pages/ContactPage';
import { Project } from './types';
import { FloatingActionControls } from './components/FloatingActionControls';
import { PortfolioTour } from './components/PortfolioTour';
import { userProfile } from './data/profile';

function AppContent() {
  const { isDarkMode, toggleTheme, setIsThemeStudioOpen } = useThemeStudio();

  // Simple client-side path router state
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash.startsWith('/')) return hash;
    return window.location.pathname || '/';
  });

  // Assistant modal state
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Portfolio Tour modal state
  const [isTourOpen, setIsTourOpen] = useState(false);

  // Global Project Modal state
  const [globalCaseStudyProject, setGlobalCaseStudyProject] = useState<Project | null>(null);

  // Handle browser popstate / back / forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('/')) {
        setCurrentPath(hash);
      } else {
        setCurrentPath(window.location.pathname || '/');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    window.history.pushState(null, '', path.startsWith('/') ? `#${path}` : path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render Page Content based on currentPath
  const renderCurrentPage = () => {
    switch (currentPath) {
      case '/data-analyst':
        return (
          <DataAnalystPage
            onNavigate={handleNavigate}
            onOpenAssistant={() => setIsAssistantOpen(true)}
          />
        );
      case '/projects':
        return <ProjectsPage onNavigate={handleNavigate} />;
      case '/skills':
        return (
          <SkillsPage
            onSelectProject={(p) => setGlobalCaseStudyProject(p)}
          />
        );
      case '/certifications':
        return <CertificationsPage />;
      case '/resume':
        return <ResumePage />;
      case '/contact':
        return <ContactPage />;
      case '/':
      default:
        return (
          <HomePage
            onNavigate={handleNavigate}
            onOpenAssistant={() => setIsAssistantOpen(true)}
          />
        );
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-canvas)',
        color: 'var(--text-primary)',
      }}
      className="min-h-screen flex flex-col font-sans transition-colors duration-200 selection:bg-blue-500 selection:text-white"
    >
      {/* Global Header */}
      <Header
        currentPath={currentPath}
        onNavigate={handleNavigate}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenThemeStudio={() => setIsThemeStudioOpen(true)}
      />

      {/* Main Page View */}
      <main className="flex-1">{renderCurrentPage()}</main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Movable Floating Action Controls: WhatsApp, DataMate AI & Portfolio Tour */}
      <FloatingActionControls
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onStartTour={() => {
          handleNavigate('/');
          setIsTourOpen(true);
        }}
      />

      {/* Interactive Guided Portfolio Tour */}
      <PortfolioTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Theme Studio Customizer Drawer / Modal */}
      <ThemeStudioModal />

      {/* Floating AI Assistant Drawer / Modal */}
      <AIPortfolioAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onNavigate={handleNavigate}
        onSelectProject={(p) => setGlobalCaseStudyProject(p)}
      />

      {/* Global Case Study Modal */}
      {globalCaseStudyProject && (
        <ProjectCaseStudyModal
          project={globalCaseStudyProject}
          onClose={() => setGlobalCaseStudyProject(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <VisitorProvider>
        <AppContent />
      </VisitorProvider>
    </ThemeProvider>
  );
}
