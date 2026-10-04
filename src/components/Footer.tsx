import React from 'react';
import {
  Linkedin,
  Github,
  Youtube,
  Facebook,
  Twitter,
  Instagram,
  Mail,
  ArrowUpRight,
  BarChart3,
  FileDown,
  ArrowUp,
  Palette,
} from 'lucide-react';
import { userProfile } from '../data/profile';
import { useThemeStudio } from '../context/ThemeContext';
import { VisitorCounter } from './VisitorCounter';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { setIsThemeStudioOpen } = useThemeStudio();

  const handleScrollTo = (sectionId: string, fallbackPath: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const headerOffset = 76;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      try {
        window.history.replaceState(null, '', `#${sectionId}`);
      } catch (e) {}
    } else {
      onNavigate(fallbackPath);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      window.history.replaceState(null, '', '#');
    } catch (e) {}
  };

  return (
    <footer
      id="main-footer"
      style={{
        backgroundColor: 'var(--bg-footer)',
        borderTopColor: 'var(--border-default)',
      }}
      className="text-slate-300 border-t transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div
          style={{ borderBottomColor: 'rgba(255,255,255,0.1)' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b"
        >
          {/* Identity & Mission */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <div
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  color: 'var(--btn-primary-text)',
                }}
                className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-md"
              >
                DA
              </div>
              <span className="text-xl font-bold text-white tracking-tight">{userProfile.name}</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Engineering end-to-end business intelligence systems, robust data models, and executive analytics dashboards. Transforming complex
              raw data into clear, actionable, and decision-ready insights.
            </p>
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                Connect & Social Profiles
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                {/* LinkedIn */}
                <a
                  id="footer-social-linkedin"
                  href={userProfile.socialLinks?.linkedin || userProfile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  title="LinkedIn"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#0A66C2] hover:text-white text-slate-300 flex items-center justify-center transition-all duration-150 border border-white/10 hover:scale-105 shadow-sm"
                >
                  <Linkedin className="w-4 h-4" />
                </a>

                {/* GitHub */}
                <a
                  id="footer-social-github"
                  href={userProfile.socialLinks?.github || userProfile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  title="GitHub"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-slate-800 hover:text-white text-slate-300 flex items-center justify-center transition-all duration-150 border border-white/10 hover:scale-105 shadow-sm"
                >
                  <Github className="w-4 h-4" />
                </a>

                {/* YouTube */}
                <a
                  id="footer-social-youtube"
                  href={userProfile.socialLinks?.youtube || "YOUR_YOUTUBE_URL"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube Channel"
                  title="YouTube"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#FF0000] hover:text-white text-slate-300 flex items-center justify-center transition-all duration-150 border border-white/10 hover:scale-105 shadow-sm"
                >
                  <Youtube className="w-4 h-4" />
                </a>

                {/* Twitter / X */}
                <a
                  id="footer-social-twitter"
                  href={userProfile.socialLinks?.twitter || "YOUR_X_URL"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter / X Profile"
                  title="Twitter / X"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#1DA1F2] hover:text-white text-slate-300 flex items-center justify-center transition-all duration-150 border border-white/10 hover:scale-105 shadow-sm"
                >
                  <Twitter className="w-4 h-4" />
                </a>

                {/* Instagram */}
                <a
                  id="footer-social-instagram"
                  href={userProfile.socialLinks?.instagram || "YOUR_INSTAGRAM_URL"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Profile"
                  title="Instagram"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#E1306C] hover:text-white text-slate-300 flex items-center justify-center transition-all duration-150 border border-white/10 hover:scale-105 shadow-sm"
                >
                  <Instagram className="w-4 h-4" />
                </a>

                {/* Facebook */}
                <a
                  id="footer-social-facebook"
                  href={userProfile.socialLinks?.facebook || "YOUR_FACEBOOK_URL"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Profile"
                  title="Facebook"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#1877F2] hover:text-white text-slate-300 flex items-center justify-center transition-all duration-150 border border-white/10 hover:scale-105 shadow-sm"
                >
                  <Facebook className="w-4 h-4" />
                </a>

                {/* Email */}
                <a
                  id="footer-social-email"
                  href={`mailto:${userProfile.email}`}
                  aria-label="Send Email"
                  title="Email"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-emerald-600 hover:text-white text-slate-300 flex items-center justify-center transition-all duration-150 border border-white/10 hover:scale-105 shadow-sm"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Portfolio Navigation</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => scrollToTop()}
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <BarChart3 className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                  <span>Home / Overview</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo('about-section', '/about')}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  About & Background
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo('projects-section', '/projects')}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Project Case Studies
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo('skills-section', '/skills')}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Skills & Technology Stack
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo('experience-section', '/experience')}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Work Experience
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo('education-section', '/education')}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Education & Degrees
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo('certifications-section', '/certifications')}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Verified Certifications
                </button>
              </li>
            </ul>
          </div>

          {/* Recruiter Resources */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Recruiter & Theme Tools</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => setIsThemeStudioOpen(true)}
                  className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white font-medium transition-colors cursor-pointer"
                >
                  <Palette className="w-4 h-4 text-blue-400" />
                  <span>Open Theme Customizer</span>
                </button>
              </li>
              <li>
                <a
                  href={userProfile.resumePath}
                  download="Resume.pdf"
                  className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white font-medium transition-colors"
                >
                  <FileDown className="w-4 h-4 text-blue-400" />
                  <span>Download Resume (PDF)</span>
                </a>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo('contact-section', '/contact')}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Contact & Hiring Channels
                </button>
              </li>
              <li>
                <a
                  href={userProfile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
                >
                  <span>Connect on LinkedIn</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href={userProfile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
                >
                  <span>GitHub Repository</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Live Unique Visitor Counter */}
        <div className="pt-8 pb-4">
          <VisitorCounter variant="footer" />
        </div>

        {/* Bottom Credits & Back to Top */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-3 text-center sm:text-left">
            <span className="font-semibold text-slate-300">
              Designed & Developed by Ravi Kumar Shrivastav
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span>© 2026 Ravi Kumar Shrivastav. All Rights Reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <span
                style={{ backgroundColor: 'var(--accent-emerald)' }}
                className="w-2 h-2 rounded-full"
              />
              Verified Data Analyst Portfolio
            </span>
            <span>•</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Back to top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
