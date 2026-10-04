import React from 'react';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Workflow } from '../components/Workflow';
import { RequirementToDashboard } from '../components/RequirementToDashboard';
import { ProjectsSection } from '../components/ProjectsSection';
import { SkillsSection } from '../components/SkillsSection';
import { ExperienceSection } from '../components/ExperienceSection';
import { EducationSection } from '../components/EducationSection';
import { CertificationsSection } from '../components/CertificationsSection';
import { AchievementsSection } from '../components/AchievementsSection';
import { ResumeSection } from '../components/ResumeSection';
import { ContactSection } from '../components/ContactSection';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onOpenAssistant: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenAssistant,
}) => {
  return (
    <div className="space-y-0">
      {/* 1. Hero */}
      <Hero
        onNavigate={onNavigate}
        onOpenAssistant={onOpenAssistant}
      />

      {/* 2. About & Value Proposition */}
      <About onNavigate={onNavigate} />

      {/* 3. Special Bridge: From Business Requirement to Dashboard */}
      <RequirementToDashboard />

      {/* 4. Structured Analytical Workflow */}
      <Workflow />

      {/* 5. Projects Section */}
      <ProjectsSection onNavigate={onNavigate} />

      {/* 6. Skills & Toolset */}
      <SkillsSection />

      {/* 7. Professional Experience */}
      <ExperienceSection />

      {/* 8. Education */}
      <EducationSection />

      {/* 9. Verified Certifications */}
      <CertificationsSection />

      {/* 10. Achievements & Milestones */}
      <AchievementsSection />

      {/* 11. Resume / CV Recruiter Hub */}
      <ResumeSection />

      {/* 12. Contact */}
      <ContactSection />
    </div>
  );
};
