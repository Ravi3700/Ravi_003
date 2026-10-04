export type ProfileType = 'data-analyst';

export type SkillCategory =
  | 'all'
  | 'data-analytics'
  | 'business-intelligence'
  | 'database'
  | 'spreadsheet'
  | 'tools';

export type SkillLevel = 'Advanced' | 'Intermediate' | 'Working Knowledge';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  profile?: ProfileType;
  logoKey: string;
  icon?: string;
  level?: SkillLevel;
  featured?: boolean;
  primary?: boolean;
  isCore?: boolean;
  description: string;
  usedFor: string[];
  relatedSkills: string[];
  relatedProjects?: string[];
  linkedProjects?: string[];
  aiExplanation?: string;
}

export interface CodeSnippet {
  type: 'DAX' | 'SQL' | 'Python' | 'Excel';
  title: string;
  code: string;
  explanation?: string;
}

export interface ProjectImage {
  url: string;
  title: string;
  description: string;
  tag: 'Main' | 'Executive' | 'Detail' | 'Drill-through' | 'Mobile' | 'Data Model' | 'Architecture';
}

export interface Project {
  id: string;
  profile?: ProfileType;
  title: string;
  category: string;
  domain: string;
  shortDescription: string;
  description: string;
  problem: string;
  objective: string;
  dataset?: string;
  dataPrep?: string;
  dataModeling?: string;
  dataModelDescription?: string;
  analysis?: string;
  codeSnippets?: CodeSnippet[];
  images: ProjectImage[];
  galleryImages?: string[];
  thumbnail?: string;
  businessOutcome?: string;
  keyInsights: string[];
  recommendations: string[];
  outcome?: string;
  tools: string[];
  skills: string[];
  dashboardUrl?: string;
  liveDashboardUrl?: string;
  githubUrl?: string;
  projectUrl?: string;
  videoUrl?: string;
  videoPlatform?: 'youtube' | 'linkedin' | 'direct';
  featured?: boolean;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  location?: string;
  profile?: ProfileType;
  description: string;
  responsibilities: string[];
  achievements?: string[];
  technologies: string[];
}

export interface Education {
  id: string;
  degree: string;
  shortDegree?: string;
  institution?: string;
  university?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  year?: string;
  status?: string;
  grade?: string;
  specialization?: string;
  description?: string;
  highlights?: string[];
  coursework?: string[];
  logo?: string;
  certificateUrl?: string;
  credentialUrl?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  verificationUrl?: string;
  skillsCovered: string[];
  badgeColor?: string;
}

export interface Achievement {
  id: string;
  title: string;
  category: string;
  description: string;
  date: string;
  organization?: string;
  link?: string;
}

export interface SocialLink {
  platform: 'linkedin' | 'github' | 'email' | 'phone' | 'portfolio' | 'resume';
  url: string;
  label: string;
  username?: string;
}

export interface WhatIBringItem {
  title: string;
  description: string;
  iconName: string;
}

export interface WhatICanDoItem {
  id: string;
  title: string;
  description: string;
  profile?: ProfileType;
  iconName: string;
}

export interface WorkflowStep {
  stepNumber: string;
  title: string;
  shortSummary: string;
  description: string;
  iconName: string;
  keyActivities: string[];
  deliverable: string;
}

export interface BridgeStep {
  stepNumber: number;
  stage: string;
  phase: 'Business' | 'Bridge' | 'Analytics' | 'Decision';
  title: string;
  description: string;
  deliverable: string;
  tools: string[];
}

export interface UserProfile {
  name: string;
  primaryTitle: string;
  secondaryTitle: string;
  daHeadline: string;
  email: string;
  phone?: string;
  location: string;
  linkedin: string;
  github: string;
  whatsapp?: string;
  socialLinks?: {
    facebook: string;
    youtube: string;
    twitter: string;
    instagram: string;
    github: string;
    linkedin: string;
  };
  resumePath: string;
  resumeGoogleDriveUrl?: string; // Configurable Google Drive resume link
  resumeSourceUrl?: string; // Direct link to current resume document
  photoPath: string;
  bioOverview: string;
  daBio: string;
  rotatingRoles?: string[];
  whatIBring: WhatIBringItem[];
  whatICanDo: WhatICanDoItem[];
  analyticsWorkflow: WorkflowStep[];
  fromRequirementToDashboard: BridgeStep[];
}
