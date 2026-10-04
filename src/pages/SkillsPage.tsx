import React from 'react';
import { SkillsSection } from '../components/SkillsSection';
import { Workflow } from '../components/Workflow';
import { Project } from '../types';

interface SkillsPageProps {
  onSelectProject?: (project: Project) => void;
}

export const SkillsPage: React.FC<SkillsPageProps> = ({ onSelectProject }) => {
  return (
    <div className="space-y-0 pt-4">
      <SkillsSection
        onSelectProject={onSelectProject}
      />
      <Workflow />
    </div>
  );
};
