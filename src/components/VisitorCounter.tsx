import React, { useState } from 'react';
import { Eye, Users, Activity, ShieldCheck, Info, X } from 'lucide-react';
import { useVisitorStats } from '../context/VisitorContext';

interface VisitorCounterProps {
  variant?: 'footer' | 'hero' | 'badge';
  className?: string;
}

export const VisitorCounter: React.FC<VisitorCounterProps> = ({
  variant = 'footer',
  className = '',
}) => {
  const {
    totalUniqueVisitors,
    liveVisitors,
    isLoading,
    isFirebaseConnected,
    formatVisitorCount,
  } = useVisitorStats();

  const [showInfoModal, setShowInfoModal] = useState(false);
  const isConnected = isFirebaseConnected;

  if (variant === 'hero' || variant === 'badge') {
    return (
      <>
        <div
          id="hero-visitor-counter-badge"
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs text-xs shadow-2xs transition-all ${className}`}
          style={{ borderColor: 'var(--border-default)' }}
        >
          <span className="relative flex h-2 w-2">
            {isConnected && (
              <span
                style={{ backgroundColor: 'var(--accent-emerald)' }}
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              />
            )}
            <span
              style={{ backgroundColor: isConnected ? 'var(--accent-emerald)' : '#94a3b8' }}
              className="relative inline-flex rounded-full h-2 w-2"
            />
          </span>

          <div className="flex items-center gap-1.5 font-medium" style={{ color: 'var(--text-primary)' }}>
            <Eye className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
            <span>
              {isLoading ? (
                <span className="inline-block w-8 h-3.5 bg-slate-200 dark:bg-slate-700 animate-pulse rounded" />
              ) : (
                <strong className="font-bold">{formatVisitorCount(totalUniqueVisitors)}</strong>
              )}
            </span>
            <span style={{ color: 'var(--text-muted)' }} className="text-[11px]">
              Total Unique Visitors
            </span>
          </div>

          {isConnected && (
            <>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <div className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                <Activity className="w-3 h-3 text-emerald-500" />
                <span>{liveVisitors} {liveVisitors === 1 ? 'active now' : 'active now'}</span>
              </div>
            </>
          )}

          <button
            type="button"
            onClick={() => setShowInfoModal(true)}
            aria-label="Visitor Counter Technology Info"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors ml-0.5 cursor-pointer"
          >
            <Info className="w-3 h-3" />
          </button>
        </div>

        {showInfoModal && <VisitorInfoModal onClose={() => setShowInfoModal(false)} />}
      </>
    );
  }

  return (
    <>
      <div
        id="footer-visitor-counter"
        className={`p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-white text-sm">
                {isLoading ? (
                  <span className="inline-block w-12 h-4 bg-white/20 animate-pulse rounded" />
                ) : (
                  <span>{formatVisitorCount(totalUniqueVisitors)}</span>
                )}
              </span>
              <span className="text-slate-300 font-medium">Total Unique Visitors</span>
              {isConnected ? (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live Counter
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-500/20 text-slate-400 border border-slate-500/30">
                  Connecting
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
              {isConnected ? (
                <>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-300 font-medium">
                      {liveVisitors} {liveVisitors === 1 ? 'Visitor Active Now' : 'Visitors Active Now'}
                    </span>
                  </span>
                  <span>•</span>
                </>
              ) : null}
              <span>Unique browser/device counting • live activity updates automatically</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowInfoModal(true)}
          className="self-start sm:self-center inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer text-[11px] font-medium"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>How It Counts</span>
        </button>
      </div>

      {showInfoModal && <VisitorInfoModal onClose={() => setShowInfoModal(false)} />}
    </>
  );
};

const VisitorInfoModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div
      id="visitor-info-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        id="visitor-info-modal"
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Visitor Counter Technology
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2.5 leading-relaxed">
          <p>
            This portfolio uses a public <strong>CounterAPI</strong> service for visitor counting, so it works directly from GitHub Pages without Firebase credentials or a private backend.
          </p>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-1.5">
            <div className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span><strong>Unique counting:</strong> A persistent anonymous browser/device ID prevents normal refreshes from adding another unique visitor.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span><strong>Live presence:</strong> Each open browser sends a lightweight heartbeat and the live number is recalculated from activity in the last 5 minutes.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span><strong>Automatic updates:</strong> The counter refreshes its live value every 15 seconds without a page reload.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span><strong>GitHub Pages compatible:</strong> No server process or Firebase secret is required by the visitor counter.</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            * <em>Note:</em> “Unique visitor” means a browser/device identity. Clearing site storage or using a new/incognito browser creates a new identity. “Active now” means activity recorded within the last 5 minutes.
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-xs"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
