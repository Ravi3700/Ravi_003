import React from 'react';
import { CertificationsSection } from '../components/CertificationsSection';
import { EducationSection } from '../components/EducationSection';
import { AchievementsSection } from '../components/AchievementsSection';

export const CertificationsPage: React.FC = () => {
  return (
    <div className="space-y-0 pt-4">
      <CertificationsSection />
      <EducationSection />
      <AchievementsSection />
    </div>
  );
};
