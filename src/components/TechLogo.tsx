import React from 'react';

interface TechLogoProps {
  logoKey?: string;
  className?: string;
  size?: number;
}

export const TechLogo: React.FC<TechLogoProps> = ({ logoKey = '', className = '', size = 28 }) => {
  const s = size;

  switch ((logoKey || '').toLowerCase()) {
    case 'powerbi':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} aria-label="Power BI Logo">
          <rect width="32" height="32" rx="6" fill="#F2C811" />
          <rect x="6" y="16" width="4.5" height="10" rx="1.5" fill="#242424" fillOpacity="0.85" />
          <rect x="13.5" y="11" width="4.5" height="15" rx="1.5" fill="#242424" fillOpacity="0.85" />
          <rect x="21" y="6" width="4.5" height="20" rx="1.5" fill="#242424" fillOpacity="0.85" />
        </svg>
      );

    case 'sql':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} aria-label="SQL Database Logo">
          <rect width="32" height="32" rx="6" fill="#0284C7" />
          <ellipse cx="16" cy="10" rx="10" ry="3.5" stroke="#FFFFFF" strokeWidth="2" fill="#38BDF8" fillOpacity="0.4" />
          <path d="M6 10V16C6 17.9 10.5 19.5 16 19.5C21.5 19.5 26 17.9 26 16V10" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <path d="M6 16V22C6 23.9 10.5 25.5 16 25.5C21.5 25.5 26 23.9 26 22V16" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'excel':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} aria-label="Microsoft Excel Logo">
          <rect width="32" height="32" rx="6" fill="#107C41" />
          <rect x="14" y="6" width="13" height="20" rx="2" fill="#185C37" />
          <rect x="17" y="9" width="3" height="3" fill="#FFFFFF" fillOpacity="0.7" />
          <rect x="22" y="9" width="3" height="3" fill="#FFFFFF" fillOpacity="0.7" />
          <rect x="17" y="14" width="3" height="3" fill="#FFFFFF" fillOpacity="0.7" />
          <rect x="22" y="14" width="3" height="3" fill="#FFFFFF" fillOpacity="0.7" />
          <rect x="17" y="19" width="3" height="3" fill="#FFFFFF" fillOpacity="0.7" />
          <rect x="22" y="19" width="3" height="3" fill="#FFFFFF" fillOpacity="0.7" />
          <rect x="5" y="8.5" width="13" height="15" rx="2.5" fill="#21A366" stroke="#107C41" strokeWidth="0.5" />
          <path d="M8.5 12L14.5 20M14.5 12L8.5 20" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    case 'googlesheets':
    case 'google-sheets':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} aria-label="Google Sheets Logo">
          <rect width="32" height="32" rx="6" fill="#34A853" />
          <rect x="8" y="6" width="16" height="20" rx="3" fill="#FFFFFF" />
          <path d="M12 11H20M12 16H20M12 21H17" stroke="#34A853" strokeWidth="2" strokeLinecap="round" />
          <path d="M18 6V11H22L18 6Z" fill="#A8E6B2" />
          <path d="M13 18L16 21L18.5 18.5" stroke="#34A853" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'dax':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} aria-label="DAX Expressions Logo">
          <rect width="32" height="32" rx="6" fill="#0F172A" />
          <path d="M7 10L13 22M13 10L7 22" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M17 11H25M17 16H23M17 21H25" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'powerquery':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} aria-label="Power Query Logo">
          <rect width="32" height="32" rx="6" fill="#D97706" />
          <path d="M8 12C8 9.79 9.79 8 12 8H20C22.21 8 24 9.79 24 12V20C24 22.21 22.21 24 20 24H12C9.79 24 8 22.21 8 20V12Z" stroke="#FFFFFF" strokeWidth="2" />
          <path d="M12 16L16 20L20 12" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'datamodeling':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} aria-label="Data Modeling Logo">
          <rect width="32" height="32" rx="6" fill="#4F46E5" />
          <circle cx="16" cy="16" r="4.5" fill="#A5B4FC" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="7" cy="8" r="3" fill="#6366F1" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="25" cy="8" r="3" fill="#6366F1" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="7" cy="24" r="3" fill="#6366F1" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="25" cy="24" r="3" fill="#6366F1" stroke="#FFFFFF" strokeWidth="1.5" />
          <line x1="9.5" y1="9.5" x2="13" y2="13.5" stroke="#FFFFFF" strokeWidth="1.5" />
          <line x1="22.5" y1="9.5" x2="19" y2="13.5" stroke="#FFFFFF" strokeWidth="1.5" />
          <line x1="9.5" y1="22.5" x2="13" y2="18.5" stroke="#FFFFFF" strokeWidth="1.5" />
          <line x1="22.5" y1="22.5" x2="19" y2="18.5" stroke="#FFFFFF" strokeWidth="1.5" />
        </svg>
      );

    case 'python':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} aria-label="Python Logo">
          <rect width="32" height="32" rx="6" fill="#1E293B" />
          <path d="M15.8 6C11 6 11.4 8.1 11.4 8.1L11.4 10.3H16V11H9.4C7.3 11 6 12.4 6 15.2C6 18.5 7.4 18.7 7.4 18.7H8.8V16.6C8.8 14.1 10.5 14.1 10.5 14.1H15.1C17.5 14.1 17.5 12.3 17.5 12.3V8.2C17.5 8.2 17.8 6 15.8 6ZM13.1 7.7C13.6 7.7 14 8.1 14 8.6C14 9.1 13.6 9.5 13.1 9.5C12.6 9.5 12.2 9.1 12.2 8.6C12.2 8.1 12.6 7.7 13.1 7.7Z" fill="#38BDF8" />
          <path d="M16.2 26C21 26 20.6 23.9 20.6 23.9L20.6 21.7H16V21H22.6C24.7 21 26 19.6 26 16.8C26 13.5 24.6 13.3 24.6 13.3H23.2V15.4C23.2 17.9 21.5 17.9 21.5 17.9H16.9C14.5 17.9 14.5 19.7 14.5 19.7V23.8C14.5 23.8 14.2 26 16.2 26ZM18.9 24.3C18.4 24.3 18 23.9 18 23.4C18 22.9 18.4 22.5 18.9 22.5C19.4 22.5 19.8 22.9 19.8 23.4C19.8 23.9 19.4 24.3 18.9 24.3Z" fill="#FBBF24" />
        </svg>
      );

    case 'tableau':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} aria-label="Tableau Logo">
          <rect width="32" height="32" rx="6" fill="#E11D48" />
          <rect x="15" y="5" width="2" height="22" fill="#FFFFFF" rx="1" />
          <rect x="5" y="15" width="22" height="2" fill="#FFFFFF" rx="1" />
          <rect x="10" y="9" width="2" height="14" fill="#FFFFFF" fillOpacity="0.8" rx="1" />
          <rect x="20" y="9" width="2" height="14" fill="#FFFFFF" fillOpacity="0.8" rx="1" />
          <rect x="9" y="10" width="14" height="2" fill="#FFFFFF" fillOpacity="0.8" rx="1" />
          <rect x="9" y="20" width="14" height="2" fill="#FFFFFF" fillOpacity="0.8" rx="1" />
        </svg>
      );

    case 'jira':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} aria-label="Jira Logo">
          <rect width="32" height="32" rx="6" fill="#0052CC" />
          <path d="M16 6L23 13L16 20L9 13L16 6Z" fill="#2684FF" />
          <path d="M16 12L23 19L16 26L9 19L16 12Z" fill="#FFFFFF" />
        </svg>
      );

    case 'confluence':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} aria-label="Confluence Logo">
          <rect width="32" height="32" rx="6" fill="#172B4D" />
          <path d="M8 20C8 14 12 10 17 9C14 11 13 14 14 18C15 22 19 23 24 23C19 24 10 24 8 20Z" fill="#0052CC" />
          <path d="M24 12C24 18 20 22 15 23C18 21 19 18 18 14C17 10 13 9 8 9C13 8 22 8 24 12Z" fill="#2684FF" />
        </svg>
      );

    case 'github':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} aria-label="GitHub Logo">
          <rect width="32" height="32" rx="6" fill="#181717" />
          <path fillRule="evenodd" clipRule="evenodd" d="M16 6C10.48 6 6 10.48 6 16C6 20.42 8.87 24.17 12.84 25.49C13.34 25.58 13.52 25.27 13.52 25.01C13.52 24.77 13.51 23.99 13.51 23.14C11 23.61 10.35 22.44 10.15 21.88C10.04 21.6 9.55 20.71 9.13 20.47C8.78 20.28 8.28 19.82 9.12 19.81C9.91 19.8 10.47 20.54 10.66 20.84C11.56 22.36 13 21.93 13.57 21.67C13.66 21.02 13.92 20.58 14.2 20.33C11.97 20.08 9.63 19.22 9.63 15.39C9.63 14.3 10.02 13.4 10.66 12.7C10.56 12.45 10.21 11.42 10.76 10.05C10.76 10.05 11.6 9.79 13.51 11.08C14.31 10.86 15.16 10.75 16.01 10.75C16.86 10.75 17.71 10.86 18.51 11.08C20.42 9.78 21.26 10.05 21.26 10.05C21.81 11.42 21.46 12.45 21.36 12.7C22 13.4 22.39 14.29 22.39 15.39C22.39 19.23 20.04 20.08 17.81 20.33C18.17 20.64 18.48 21.24 18.48 22.18C18.48 23.53 18.47 24.62 18.47 25.01C18.47 25.28 18.65 25.6 19.16 25.49C23.13 24.16 26 20.41 26 16C26 10.48 21.52 6 16 6Z" fill="#FFFFFF" />
        </svg>
      );

    case 'azure':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} aria-label="Microsoft Azure Logo">
          <rect width="32" height="32" rx="6" fill="#0078D4" />
          <path d="M19.5 6L13.8 17.5L8 15L15.2 6H19.5Z" fill="#50E6FF" />
          <path d="M19.5 6L11.5 22L7 26H20.5L25 17.5L19.5 6Z" fill="#FFFFFF" fillOpacity="0.95" />
          <path d="M15.5 17.5L19.5 26H25L15.5 17.5Z" fill="#005BA1" />
        </svg>
      );

    case 'mysql':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} aria-label="MySQL Logo">
          <rect width="32" height="32" rx="6" fill="#00758F" />
          <path d="M8 22C10 20 12 18 15 17C18 16 22 17 24 15C22 13 18 12 14 13C11 14 8 16 7 19L8 22Z" fill="#F29111" />
          <path d="M11 11C13 8 18 7 22 9C25 11 26 15 25 18C23 23 17 25 12 24C10 23 8 21 8 21C8 21 11 21 13 20C17 18 19 15 18 13C17 11 14 11 11 11Z" fill="#FFFFFF" />
          <circle cx="21.5" cy="11.5" r="1" fill="#00758F" />
        </svg>
      );

    case 'sqlserver':
    case 'sql-server':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} aria-label="Microsoft SQL Server Logo">
          <rect width="32" height="32" rx="6" fill="#CC292B" />
          <ellipse cx="16" cy="9" rx="9" ry="3" fill="#FFFFFF" fillOpacity="0.9" />
          <path d="M7 9V14C7 15.65 11.03 17 16 17C20.97 17 25 15.65 25 14V9" stroke="#FFFFFF" strokeWidth="1.8" fill="none" />
          <path d="M7 14V19C7 20.65 11.03 22 16 22C20.97 22 25 20.65 25 19V14" stroke="#FFFFFF" strokeWidth="1.8" fill="none" />
          <path d="M7 19V23C7 24.65 11.03 26 16 26C20.97 26 25 24.65 25 23V19" stroke="#FFFFFF" strokeWidth="1.8" fill="none" />
        </svg>
      );

    case 'requirements':
    case 'documentation':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} aria-label="Requirements Document Logo">
          <rect width="32" height="32" rx="6" fill="#8B5CF6" />
          <path d="M9 7H19L24 12V25H9V7Z" fill="#DDD6FE" />
          <path d="M19 7V12H24" fill="#A78BFA" />
          <path d="M12 16H20M12 20H18" stroke="#5B21B6" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'userstories':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} aria-label="User Stories Logo">
          <rect width="32" height="32" rx="6" fill="#EC4899" />
          <rect x="7" y="8" width="18" height="16" rx="3" fill="#FCE7F3" />
          <circle cx="12" cy="13" r="2" fill="#BE185D" />
          <rect x="16" y="12" width="6" height="2" rx="1" fill="#BE185D" />
          <rect x="10" y="18" width="12" height="2" rx="1" fill="#BE185D" fillOpacity="0.7" />
        </svg>
      );

    case 'processmapping':
    case 'gapanalysis':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} aria-label="Process Mapping Logo">
          <rect width="32" height="32" rx="6" fill="#059669" />
          <rect x="6" y="12" width="6" height="8" rx="2" fill="#D1FAE5" />
          <rect x="20" y="12" width="6" height="8" rx="2" fill="#D1FAE5" />
          <path d="M12 16H20M17 13L20 16L17 19" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'uat':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} aria-label="UAT Testing Logo">
          <rect width="32" height="32" rx="6" fill="#0D9488" />
          <path d="M16 6L24 10V16C24 21 20 25 16 26C12 25 8 21 8 16V10L16 6Z" fill="#CCFBF1" />
          <path d="M12 16L15 19L20 13" stroke="#0F766E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'stakeholders':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} aria-label="Stakeholder Logo">
          <rect width="32" height="32" rx="6" fill="#6366F1" />
          <circle cx="16" cy="11" r="3.5" fill="#E0E7FF" />
          <circle cx="9" cy="14" r="2.5" fill="#C7D2FE" />
          <circle cx="23" cy="14" r="2.5" fill="#C7D2FE" />
          <path d="M11 23C11 20 13 18 16 18C19 18 21 20 21 23" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'kpi':
    case 'datavis':
    default:
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className} aria-label="Analytics Tool Logo">
          <rect width="32" height="32" rx="6" fill="#2563EB" />
          <path d="M7 23L13 15L18 19L25 9" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="25" cy="9" r="2" fill="#FBBF24" />
        </svg>
      );
  }
};
