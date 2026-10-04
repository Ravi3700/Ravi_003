import React from 'react';
import { ProjectsSection } from '../components/ProjectsSection';
import { RequirementToDashboard } from '../components/RequirementToDashboard';

interface ProjectsPageProps {
  onNavigate: (path: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-0 pt-4">
      <ProjectsSection onNavigate={onNavigate} />
      <RequirementToDashboard />
    </div>
  );
};
