import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, X, GripVertical, Compass } from 'lucide-react';
import { userProfile } from '../data/profile';

interface FloatingActionControlsProps {
  onOpenAssistant: () => void;
  onStartTour?: () => void;
}

const STORAGE_KEY = 'datamate_contact_hub_pos_v4';
const LAUNCHER_SIZE = 56; // Button size in pixels (56x56)

export const FloatingActionControls: React.FC<FloatingActionControlsProps> = ({
  onOpenAssistant,
  onStartTour,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const launcherButtonRef = useRef<HTMLButtonElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showAssistantAnim, setShowAssistantAnim] = useState(true);

  // Drag tracking ref
  const dragTracker = useRef<{
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
    hasDragged: boolean;
    isPointerDown: boolean;
    pointerId: number | null;
  }>({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
    hasDragged: false,
    isPointerDown: false,
    pointerId: null,
  });

  // Calculate safe default position (bottom-right corner)
  const getDefaultPosition = useCallback(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const defaultX = Math.max(16, window.innerWidth - LAUNCHER_SIZE - (isMobile ? 18 : 28));
    const defaultY = Math.max(16, window.innerHeight - LAUNCHER_SIZE - (isMobile ? 88 : 28));
    return { x: defaultX, y: defaultY };
  }, []);

  // Clamp position to viewport bounds with a safe margin
  const clampPosition = useCallback((x: number, y: number) => {
    const margin = 12;
    const minX = margin;
    const maxX = Math.max(margin, window.innerWidth - LAUNCHER_SIZE - margin);
    const minY = margin;
    const maxY = Math.max(margin, window.innerHeight - LAUNCHER_SIZE - margin);

    return {
      x: Math.min(Math.max(x, minX), maxX),
      y: Math.min(Math.max(y, minY), maxY),
    };
  }, []);

  // Restore saved position on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          setPosition(clampPosition(parsed.x, parsed.y));
          return;
        }
      }
    } catch {
      // Ignore parse failure
    }
    setPosition(getDefaultPosition());
  }, [clampPosition, getDefaultPosition]);

  // Re-clamp position on window resize
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => (prev ? clampPosition(prev.x, prev.y) : getDefaultPosition()));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [clampPosition, getDefaultPosition]);

  // Re-enable assistant visibility after hub closes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setShowAssistantAnim(true);
      }, 350);
      return () => clearTimeout(timer);
    } else {
      setShowAssistantAnim(false);
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (isOpen && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        launcherButtonRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Window pointermove and pointerup listeners for smooth dragging
  useEffect(() => {
    const handleWindowPointerMove = (e: PointerEvent) => {
      if (!dragTracker.current.isPointerDown) return;

      const deltaX = e.clientX - dragTracker.current.startX;
      const deltaY = e.clientY - dragTracker.current.startY;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance > 6) {
        dragTracker.current.hasDragged = true;
        setIsDragging(true);

        const newX = dragTracker.current.initialX + deltaX;
        const newY = dragTracker.current.initialY + deltaY;
        setPosition(clampPosition(newX, newY));
      }
    };

    const handleWindowPointerUp = (e: PointerEvent) => {
      if (!dragTracker.current.isPointerDown) return;

      const wasDragging = dragTracker.current.hasDragged;
      dragTracker.current.isPointerDown = false;
      setIsDragging(false);

      if (wasDragging && position) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(position));
        } catch {
          // Ignore
        }
      } else if (!wasDragging) {
        // Direct tap/click detected: toggle launcher!
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('pointermove', handleWindowPointerMove);
    window.addEventListener('pointerup', handleWindowPointerUp);
    window.addEventListener('pointercancel', handleWindowPointerUp);

    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerup', handleWindowPointerUp);
      window.removeEventListener('pointercancel', handleWindowPointerUp);
    };
  }, [clampPosition, position]);

  // PointerDown handler on the launcher button
  const handleLauncherPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return; // Only left-click/primary touch

    const currentPos = position || getDefaultPosition();
    dragTracker.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: currentPos.x,
      initialY: currentPos.y,
      hasDragged: false,
      isPointerDown: true,
      pointerId: e.pointerId,
    };
  };

  // Keyboard accessibility
  const handleLauncherKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    }
  };

  const handleOpenAssistant = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    onOpenAssistant();
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  const handleStartTour = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    if (onStartTour) {
      onStartTour();
    }
  };

  // Smart expansion direction calculation based on available viewport space
  const currentPos = position || { x: -9999, y: -9999 };
  const currentY = position ? position.y : (typeof window !== 'undefined' ? window.innerHeight - 100 : 500);
  const currentX = position ? position.x : (typeof window !== 'undefined' ? window.innerWidth - 100 : 500);

  // If launcher is positioned in the lower viewport (Y > 210px), expand UPWARDS
  const expandUpward = currentY > 210;
  // If launcher is positioned on the right side of the screen, align popup to the RIGHT edge
  const alignRight = currentX > (typeof window !== 'undefined' ? window.innerWidth / 2 : 500);

  // Assistant & bubble positioning:
  // When near right edge, bubble sits to the LEFT of the launcher
  // When near bottom, bubble and boy sit ABOVE the launcher
  const bubbleOnLeft = alignRight;
  const assistantAbove = expandUpward;

  const rawWhatsApp = userProfile.whatsapp || '';
  const whatsappUrl =
    rawWhatsApp.startsWith('http')
      ? rawWhatsApp
      : rawWhatsApp && rawWhatsApp !== 'YOUR_WHATSAPP_LINK'
      ? `https://wa.me/${rawWhatsApp.replace(/[^0-9]/g, '')}`
      : 'https://wa.me/';

  return (
    <aside
      id="floating-contact-hub"
      ref={containerRef}
      aria-label="Smart Floating Contact Hub & AI Assistant"
      style={{
        position: 'fixed',
        left: `${currentPos.x}px`,
        top: `${currentPos.y}px`,
        zIndex: 50,
        touchAction: 'none',
        visibility: position ? 'visible' : 'hidden',
        userSelect: 'none',
      }}
      className="relative flex items-center justify-center"
    >
      {/* ========================================================================= */}
      {/* CUTE FRIENDLY BOY ASSISTANT & SPEECH BUBBLE (ONLY WHEN CLOSED)            */}
      {/* ========================================================================= */}
      {!isOpen && showAssistantAnim && (
        <div
          id="cute-assistant-anchor"
          aria-hidden="true"
          className={`absolute pointer-events-none transition-all duration-300 ease-out animate-gentle-float ${
            assistantAbove ? 'bottom-full mb-2' : 'top-full mt-2'
          } ${bubbleOnLeft ? 'right-0' : 'left-0'} flex items-end ${
            bubbleOnLeft ? 'flex-row-reverse' : 'flex-row'
          } gap-2 z-10`}
        >
          {/* Cute Friendly Boy Vector Illustration */}
          <div className="relative w-12 h-14 shrink-0 flex items-center justify-center drop-shadow-md">
            <svg
              viewBox="0 0 80 90"
              className="w-full h-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Boy Head/Hair Back */}
              <path
                d="M20 38C20 22 28 12 40 12C52 12 60 22 60 38C60 48 54 54 40 54C26 54 20 48 20 38Z"
                fill="#1e293b"
              />
              <path
                d="M22 28C22 14 30 8 40 8C50 8 58 14 58 28C56 20 48 14 40 14C32 14 24 20 22 28Z"
                fill="#0f172a"
              />

              {/* Ears */}
              <circle cx="19" cy="38" r="4.5" fill="#fed7aa" />
              <circle cx="61" cy="38" r="4.5" fill="#fed7aa" />

              {/* Face */}
              <rect x="22" y="24" width="36" height="30" rx="15" fill="#ffedd5" />

              {/* Stylized Modern Fringe Hair */}
              <path
                d="M22 26C28 32 38 28 42 22C46 30 54 30 58 26C58 20 52 12 40 12C28 12 22 20 22 26Z"
                fill="#1e293b"
              />
              <path
                d="M28 20C34 23 37 19 40 16C36 15 31 16 28 20Z"
                fill="#334155"
              />

              {/* Cheerful Friendly Eyes */}
              <ellipse cx="31" cy="36" rx="2.5" ry="3.5" fill="#0f172a" />
              <ellipse cx="49" cy="36" rx="2.5" ry="3.5" fill="#0f172a" />
              {/* Eye Sparkles */}
              <circle cx="32" cy="35" r="1" fill="#ffffff" />
              <circle cx="50" cy="35" r="1" fill="#ffffff" />

              {/* Rosy Cheeks */}
              <circle cx="27" cy="41" r="3" fill="#fca5a5" opacity="0.75" />
              <circle cx="53" cy="41" r="3" fill="#fca5a5" opacity="0.75" />

              {/* Sweet Friendly Smile */}
              <path
                d="M36 43C37.5 46 42.5 46 44 43"
                stroke="#b91c1c"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Tech Analyst Hoodie Body */}
              <path
                d="M23 54C16 58 12 68 12 78C12 80 14 82 16 82H64C66 82 68 80 68 78C68 68 64 58 57 54C53 58 47 61 40 61C33 61 27 58 23 54Z"
                fill="#2563eb"
              />
              {/* Hoodie Collar & Badge */}
              <path
                d="M32 54L40 65L48 54"
                stroke="#60a5fa"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Mini Data Badge on Hoodie */}
              <rect x="44" y="68" width="12" height="7" rx="2" fill="#1e40af" />
              <circle cx="47" cy="71.5" r="1.5" fill="#38bdf8" />
              <line x1="50" y1="70" x2="54" y2="70" stroke="#93c5fd" strokeWidth="1" />
              <line x1="50" y1="73" x2="53" y2="73" stroke="#93c5fd" strokeWidth="1" />

              {/* Left Hand: Pointing down toward launcher */}
              <g>
                <path
                  d="M17 68C14 72 16 78 20 80C23 81 26 78 24 73L21 68"
                  fill="#fed7aa"
                />
                <circle cx="21" cy="78" r="3" fill="#fed7aa" />
                {/* Pointer finger cue */}
                <path
                  d="M21 78L22 84"
                  stroke="#fb923c"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>

              {/* Right Hand: Waving gesture (Animated) */}
              <g className="animate-wave-hand">
                {/* Arm raised */}
                <path
                  d="M62 62C68 56 72 50 74 42C74 38 70 38 68 41C65 46 62 52 58 58"
                  fill="#2563eb"
                />
                {/* Waving Palm & Fingers */}
                <circle cx="73" cy="38" r="5.5" fill="#fed7aa" />
                <path
                  d="M72 33C72 31 74 31 74 33V37"
                  stroke="#fed7aa"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M75 34C75 32 77 32 77 34V38"
                  stroke="#fed7aa"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M69 35C69 33 71 33 71 35V38"
                  stroke="#fed7aa"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </g>
            </svg>
          </div>

          {/* Friendly Speech Bubble */}
          <div className="relative mb-2 px-3 py-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800/80 shadow-lg flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
              <span>Hi! Let&apos;s connect</span>
              <span className="inline-block animate-wave-hand">👋</span>
            </span>
            {/* Bubble Tail pointing toward launcher */}
            <div
              className={`absolute -bottom-1.5 ${
                bubbleOnLeft ? 'right-4' : 'left-4'
              } w-3 h-3 bg-white dark:bg-slate-900 border-r border-b border-indigo-200 dark:border-indigo-800/80 transform rotate-45`}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* POP-OUT EXPANDED ACTIONS MENU (WHATSAPP + DATAMATE AI)                     */}
      {/* ========================================================================= */}
      <div
        id="floating-contact-menu"
        role="menu"
        aria-orientation="vertical"
        aria-hidden={!isOpen}
        className={`absolute w-56 sm:w-60 p-2 rounded-2xl bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-700/70 dark:border-slate-700/80 shadow-2xl space-y-1.5 transition-all duration-200 ease-out transform motion-reduce:transition-none ${
          expandUpward ? 'bottom-full mb-3' : 'top-full mt-3'
        } ${alignRight ? 'right-0' : 'left-0'} ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none ' + (expandUpward ? 'translate-y-2' : '-translate-y-2')
        }`}
      >
        {/* Menu Header Label */}
        <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 flex items-center justify-between">
          <span>Quick Contact Hub</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* 1. WhatsApp Action Button */}
        <a
          id="hub-whatsapp-btn"
          role="menuitem"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppClick}
          tabIndex={isOpen ? 0 : -1}
          aria-label="Contact via WhatsApp"
          title="Contact via WhatsApp"
          className="group flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/80 hover:bg-[#25D366] text-slate-200 hover:text-white transition-all duration-150 border border-slate-700/50 hover:border-emerald-400 cursor-pointer shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
        >
          <div className="w-8 h-8 rounded-lg bg-[#25D366] group-hover:bg-white text-white group-hover:text-[#25D366] flex items-center justify-center shrink-0 transition-colors shadow-xs">
            <svg
              className="w-4 h-4 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.8 14.16c-.24.68-1.2 1.24-1.68 1.32-.45.08-1.04.14-3.04-.69-2.56-1.06-4.21-3.66-4.34-3.83-.13-.17-1.04-1.38-1.04-2.64 0-1.25.66-1.87.89-2.12.24-.25.52-.31.69-.31.18 0 .35.01.5.02.16.01.38-.06.59.45.22.53.76 1.85.83 1.99.07.14.11.31.02.5-.09.18-.14.3-.27.46-.14.15-.29.34-.41.46-.14.13-.28.28-.12.56.16.27.7 1.15 1.5 1.86 1.03.92 1.9 1.2 2.17 1.34.27.13.43.11.59-.07.16-.18.69-.8.87-1.08.18-.27.37-.23.61-.14.24.09 1.54.73 1.81.86.27.13.45.2.52.31.06.12.06.69-.18 1.37z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white group-hover:text-white flex items-center justify-between">
              <span>WhatsApp</span>
              <span className="text-[10px] text-emerald-400 group-hover:text-white font-semibold">Online</span>
            </div>
            <p className="text-[11px] text-slate-400 group-hover:text-emerald-50 truncate">
              Direct chat & messaging
            </p>
          </div>
        </a>

        {/* 2. DataMate AI Action Button */}
        <button
          id="hub-datamate-ai-btn"
          role="menuitem"
          type="button"
          onClick={handleOpenAssistant}
          tabIndex={isOpen ? 0 : -1}
          aria-label="Open DataMate AI Portfolio Assistant"
          title="Open DataMate AI"
          className="w-full group flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/80 hover:bg-indigo-600 text-slate-200 hover:text-white transition-all duration-150 border border-slate-700/50 hover:border-indigo-400 cursor-pointer shadow-sm text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-blue-500 group-hover:bg-white text-white group-hover:text-indigo-600 flex items-center justify-center shrink-0 transition-colors shadow-xs">
            <Sparkles className="w-4 h-4 fill-current" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white flex items-center justify-between">
              <span>DataMate AI</span>
              <span className="text-[10px] text-indigo-300 group-hover:text-white font-semibold">AI Bot</span>
            </div>
            <p className="text-[11px] text-slate-400 group-hover:text-indigo-100 truncate">
              Skills, projects & resume Q&A
            </p>
          </div>
        </button>

        {/* 3. Portfolio Tour Action Button */}
        <button
          id="hub-portfolio-tour-btn"
          role="menuitem"
          type="button"
          onClick={handleStartTour}
          tabIndex={isOpen ? 0 : -1}
          aria-label="Start Guided Portfolio Tour"
          title="Start Guided Portfolio Tour"
          className="w-full group flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/80 hover:bg-amber-600 text-slate-200 hover:text-white transition-all duration-150 border border-slate-700/50 hover:border-amber-400 cursor-pointer shadow-sm text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 group-hover:bg-white text-white group-hover:text-amber-600 flex items-center justify-center shrink-0 transition-colors shadow-xs">
            <Compass className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white flex items-center justify-between">
              <span>Portfolio Tour</span>
              <span className="text-[10px] text-amber-300 group-hover:text-white font-semibold">Tour</span>
            </div>
            <p className="text-[11px] text-slate-400 group-hover:text-amber-100 truncate">
              Explore Portfolio
            </p>
          </div>
        </button>

        {/* Drag Hint / Helper */}
        <div className="pt-1 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
          <GripVertical className="w-3 h-3 text-slate-400" />
          <span>Drag button to move anywhere</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SINGLE COMPACT LAUNCHER BUTTON (DRAGGABLE ANCHOR)                          */}
      {/* ========================================================================= */}
      <div className="relative group">
        <button
          id="floating-hub-launcher-btn"
          ref={launcherButtonRef}
          type="button"
          onPointerDown={handleLauncherPointerDown}
          onKeyDown={handleLauncherKeyDown}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close contact options' : 'Open contact options'}
          title={isOpen ? 'Close contact options' : 'Open contact options (WhatsApp & DataMate AI)'}
          className={`relative w-[52px] h-[52px] sm:w-[56px] sm:h-[56px] rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-200 border cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 ${
            isOpen
              ? 'bg-slate-900 text-white border-slate-600 scale-95 rotate-90 ring-2 ring-indigo-400/50'
              : 'bg-gradient-to-tr from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-500 text-white border-indigo-400/40 hover:scale-105'
          } ${isDragging ? 'cursor-grabbing scale-102 ring-2 ring-indigo-400 shadow-indigo-500/30' : 'cursor-grab'}`}
        >
          {/* Animated Icon Transition */}
          {isOpen ? (
            <X className="w-6 h-6 transition-transform duration-150" />
          ) : (
            <div className="relative flex items-center justify-center">
              {/* Chat Speech Icon */}
              <svg
                className="w-6 h-6 fill-white/15 text-white transition-transform duration-150 group-hover:scale-110"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1.5 -right-1.5 animate-pulse" />
            </div>
          )}

          {/* Active Status Pulse Indicator when Closed */}
          {!isOpen && (
            <span className="absolute top-0.5 right-0.5 flex h-3 w-3 pointer-events-none">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-900" />
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};
