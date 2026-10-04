import React from 'react';
import { X, ExternalLink, Play, AlertCircle } from 'lucide-react';
import { Project } from '../types';

interface VideoEmbedModalProps {
  project: Project;
  onClose: () => void;
}

export const VideoEmbedModal: React.FC<VideoEmbedModalProps> = ({ project, onClose }) => {
  const videoUrl = project.videoUrl || '';
  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');

  // Helper to extract YouTube embed URL
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('watch?v=')) {
      const id = url.split('watch?v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  return (
    <div
      id="video-embed-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="video-embed-modal"
        className="relative w-full max-w-3xl bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center">
              <Play className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight line-clamp-1">{project.title}</h3>
              <p className="text-xs text-slate-400">Video Walkthrough & Demonstration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player or Fallback View */}
        <div className="relative aspect-video bg-black flex items-center justify-center">
          {videoUrl ? (
            <iframe
              src={getEmbedUrl(videoUrl)}
              title={`${project.title} Video Demonstration`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="p-8 text-center max-w-md space-y-3">
              <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
              <h4 className="text-base font-bold">Video Walkthrough Available Upon Request</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                A live demonstration can be scheduled during interviews, or you can explore the complete step-by-step
                case study and interactive metrics in the project overview.
              </p>
              {project.linkedinPostUrl && (
                <a
                  href={project.linkedinPostUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors"
                >
                  <span>Watch Walkthrough on LinkedIn</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-400">
            Domain: <strong className="text-slate-200">{project.domain}</strong> • Tools:{' '}
            <strong className="text-slate-200">{project.tools.join(', ')}</strong>
          </div>
          <div className="flex items-center gap-2">
            {videoUrl && (
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                <span>Open in New Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
