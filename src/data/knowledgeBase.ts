import { userProfile } from './profile';
import { skillsData } from './skills';
import { projectsData } from './projects';
import { experienceData } from './experience';
import { educationData } from './education';
import { certificationsData } from './certifications';
import { achievementsData } from './achievements';

/**
 * Primary Resume Configuration
 * Paste your shareable Google Drive link here or in src/data/profile.ts
 */
export const RESUME_SOURCE_URL: string =
  userProfile.resumeGoogleDriveUrl &&
  userProfile.resumeGoogleDriveUrl !== 'YOUR_GOOGLE_DRIVE_RESUME_LINK'
    ? userProfile.resumeGoogleDriveUrl
    : userProfile.resumePath || '/assets/resume.pdf';

export function getResumeSourceUrl(): string {
  return RESUME_SOURCE_URL;
}

export const portfolioKnowledgeBase = {
  profile: {
    ...userProfile,
    resumeSourceUrl: RESUME_SOURCE_URL,
  },
  skills: skillsData,
  projects: projectsData,
  experience: experienceData,
  education: educationData,
  certifications: certificationsData,
  achievements: achievementsData,
  sources: [
    {
      priority: 1,
      name: "Portfolio Data & Content",
      type: "primary_portfolio",
      status: "active",
    },
    {
      priority: 2,
      name: "Resume Source (Google Drive / PDF)",
      url: RESUME_SOURCE_URL,
      type: "primary_resume",
      status: RESUME_SOURCE_URL.includes('drive.google.com') ? "configured_drive" : "local_file",
    },
  ],
};

export function getFilteredSkills() {
  return skillsData;
}

export function getFilteredProjects() {
  return projectsData;
}

export function getProjectsBySkill(skillName: string) {
  const query = skillName.toLowerCase();
  return projectsData.filter(
    (p) =>
      p.tools.some((t) => t.toLowerCase().includes(query)) ||
      p.skills.some((s) => s.toLowerCase().includes(query)) ||
      p.title.toLowerCase().includes(query)
  );
}

export function searchPortfolio(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return { skills: [], projects: [], certifications: [] };

  const matchedSkills = skillsData.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.usedFor.some((u) => u.toLowerCase().includes(q))
  );

  const matchedProjects = projectsData.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.domain.toLowerCase().includes(q) ||
      p.tools.some((t) => t.toLowerCase().includes(q)) ||
      p.skills.some((s) => s.toLowerCase().includes(q))
  );

  const matchedCerts = certificationsData.filter(
    (c) =>
      c.title.toLowerCase().includes(q) ||
      c.issuer.toLowerCase().includes(q) ||
      c.skillsCovered.some((sc) => sc.toLowerCase().includes(q))
  );

  return {
    skills: matchedSkills,
    projects: matchedProjects,
    certifications: matchedCerts,
  };
}
