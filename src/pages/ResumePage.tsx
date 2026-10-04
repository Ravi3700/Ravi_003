import React from 'react';
import { ResumeSection } from '../components/ResumeSection';
import { ExperienceSection } from '../components/ExperienceSection';
import { EducationSection } from '../components/EducationSection';

export const ResumePage: React.FC = () => {
  return (
    <div className="space-y-0 pt-4">
      <ResumeSection />
      <ExperienceSection />
      <EducationSection />
    </div>
  );
};
