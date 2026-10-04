import React, { useState } from 'react';
import {
  Palette,
  X,
  Sun,
  Moon,
  RotateCcw,
  Sparkles,
  Check,
  AlertTriangle,
  CheckCircle2,
  Type,
  Layout,
  Copy,
  ArrowRight,
  BarChart3,
  ExternalLink,
} from 'lucide-react';
import { useThemeStudio } from '../context/ThemeContext';
import { themePresets } from '../data/themePresets';
import { CustomizerTab, ThemeTokens, ThemePresetCategory } from '../types/theme';
import { evaluateContrast } from '../utils/themeUtils';

export const ThemeStudioModal: React.FC = () => {
  const {
    isDarkMode,
    toggleTheme,
    presetId,
    setPresetId,
    currentTokens,
    activePreset,
    customTokens,
    updateToken,
    resetToken,
    resetCategory,
    resetAll,
    isThemeStudioOpen,
    setIsThemeStudioOpen,
  } = useThemeStudio();

  const [activeTab, setActiveTab] = useState<CustomizerTab>('presets');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [copiedNotification, setCopiedNotification] = useState(false);

  if (!isThemeStudioOpen) return null;

  // Active mode overrides
  const activeCustomOverrides = isDarkMode ? customTokens.dark : customTokens.light;
  const hasAnyOverrides = Object.keys(activeCustomOverrides).length > 0;

  // Real-time accessibility contrast checks
  const textOnCanvasContrast = evaluateContrast(currentTokens.textPrimary, currentTokens.bgCanvas);
  const bodyOnSurfaceContrast = evaluateContrast(currentTokens.textSecondary, currentTokens.bgSurface);
  const buttonContrast = evaluateContrast(currentTokens.btnPrimaryText, currentTokens.btnPrimaryBg);
  const headerContrast = evaluateContrast(currentTokens.accentNavActive, currentTokens.bgHeader);

  const hasContrastWarning =
    !textOnCanvasContrast.isAccessible ||
    !bodyOnSurfaceContrast.isAccessible ||
    !buttonContrast.isAccessible;

  // Categories for preset filtering
  const categories: ('all' | ThemePresetCategory)[] = ['all', 'Corporate', 'Tech', 'Modern', 'Executive'];
  const filteredPresets = selectedCategoryFilter === 'all'
    ? themePresets
    : themePresets.filter((p) => p.category === selectedCategoryFilter);

  const handleCopyPaletteJson = () => {
    const json = JSON.stringify(currentTokens, null, 2);
    navigator.clipboard.writeText(json);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  // Color picker row helper
  const renderColorControl = (
    tokenKey: keyof ThemeTokens,
    label: string,
    description: string,
    contrastPair?: { label: string; bg: string }
  ) => {
    const currentValue = currentTokens[tokenKey];
    const isOverridden = tokenKey in activeCustomOverrides;

    let contrastInfo = null;
    if (contrastPair) {
      contrastInfo = evaluateContrast(currentValue, contrastPair.bg);
    }

    return (
      <div
        key={tokenKey}
        className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 hover:border-blue-300 dark:hover:border-blue-700/60 transition-all space-y-2.5"
      >
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                {label}
              </span>
              {isOverridden && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                  Custom
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {description}
            </p>
          </div>

          {/* Color preview swatch + Native Color Picker */}
          <div className="flex items-center gap-2">
            <div className="relative flex items-center gap-1.5 p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs">
              <input
                type="color"
                id={`picker-${tokenKey}`}
                aria-label={`Select ${label}`}
                value={currentValue}
                onChange={(e) => updateToken(tokenKey, e.target.value)}
                className="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent p-0 overflow-hidden"
              />
              <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300 px-1.5 uppercase">
                {currentValue}
              </span>
            </div>

            {isOverridden && (
              <button
                type="button"
                onClick={() => resetToken(tokenKey)}
                title="Reset this color to preset default"
                aria-label={`Reset ${label}`}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Contrast evaluation helper tag if provided */}
        {contrastInfo && (
          <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
            <span className="text-slate-500 dark:text-slate-400">
              Contrast on {contrastPair?.label}:
            </span>
            <span
              className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-md ${
                contrastInfo.isAccessible
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                  : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60'
              }`}
            >
              {contrastInfo.isAccessible ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              ) : (
                <AlertTriangle className="w-3 h-3 text-amber-500" />
              )}
              <span>{contrastInfo.ratio}:1 ({contrastInfo.rating})</span>
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      id="theme-studio-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="theme-studio-container"
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  Portfolio Theme Customizer
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  <Sparkles className="w-3 h-3 text-blue-500" />
                  <span>{activePreset.name}</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live color customization across presets, typography, and surface backgrounds
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Light/Dark Toggle */}
            <button
              id="theme-studio-darkmode-toggle"
              onClick={toggleTheme}
              title={isDarkMode ? 'Switch to Light Mode palette' : 'Switch to Dark Mode palette'}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer shadow-2xs"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-700" />
                  <span>Light Mode</span>
                </>
              )}
            </button>

            {/* Close Modal Button */}
            <button
              id="theme-studio-close-btn"
              onClick={() => setIsThemeStudioOpen(false)}
              aria-label="Close Theme Studio"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Working Sample / Interactive Preview Box */}
        <div className="px-5 sm:px-6 py-3.5 bg-slate-100/60 dark:bg-slate-950/60 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Live Theme Preview:
              </span>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Updates instantly with active theme colors
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              {hasContrastWarning ? (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  <AlertTriangle className="w-3 h-3 text-amber-500" />
                  <span>Contrast Alert</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span>Accessible WCAG Contrast</span>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Live Sample Canvas */}
          <div
            id="theme-live-preview-box"
            style={{
              backgroundColor: currentTokens.bgCanvas,
              borderColor: currentTokens.borderDefault,
            }}
            className="p-3 sm:p-4 rounded-2xl border shadow-inner transition-colors duration-200 space-y-2.5"
          >
            {/* Header Strip in Preview */}
            <div
              style={{
                backgroundColor: currentTokens.bgHeader,
                borderColor: currentTokens.borderDefault,
              }}
              className="flex items-center justify-between px-3 py-1.5 rounded-xl border shadow-2xs text-xs"
            >
              <div className="flex items-center gap-2">
                <div
                  style={{
                    backgroundColor: currentTokens.accentPrimary,
                    color: currentTokens.btnPrimaryText,
                  }}
                  className="w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px]"
                >
                  DA
                </div>
                <span style={{ color: currentTokens.textPrimary }} className="font-bold text-xs">
                  Ravi Shrivastav
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span
                  style={{
                    color: currentTokens.accentNavActive,
                    backgroundColor: currentTokens.badgeBg,
                  }}
                  className="px-2 py-0.5 rounded-md font-bold"
                >
                  ● Active Page
                </span>
                <span style={{ color: currentTokens.textSecondary }}>Projects</span>
                <span style={{ color: currentTokens.textSecondary }}>Skills</span>
              </div>
            </div>

            {/* Sample Card / Hero Surface */}
            <div
              style={{
                backgroundColor: currentTokens.bgSurface,
                borderColor: currentTokens.borderDefault,
              }}
              className="p-3.5 rounded-xl border shadow-xs transition-colors duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1 max-w-md">
                <div className="flex items-center gap-2">
                  <span
                    style={{
                      backgroundColor: currentTokens.badgeBg,
                      color: currentTokens.badgeText,
                    }}
                    className="px-2 py-0.5 rounded-md text-[10px] font-bold"
                  >
                    Executive KPI Dashboard
                  </span>
                  <span style={{ color: currentTokens.textMuted }} className="text-[11px]">
                    SQL • Power BI • DAX
                  </span>
                </div>
                <h4 style={{ color: currentTokens.textPrimary }} className="font-extrabold text-sm sm:text-base tracking-tight">
                  Sample Analytics Project Title
                </h4>
                <p style={{ color: currentTokens.textSecondary }} className="text-xs leading-relaxed">
                  Real-time visualization demonstrating data transformations, metric formulas, and pipeline insights.
                </p>
                <div className="pt-1 flex items-center gap-3 text-xs">
                  <span style={{ color: currentTokens.textLink }} className="font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer">
                    <span>View Case Study</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                  <span style={{ color: currentTokens.textAccent }} className="font-bold">
                    +34% Growth Metric
                  </span>
                </div>
              </div>

              {/* Sample Action Button */}
              <div className="flex-shrink-0 flex items-center gap-2">
                <button
                  type="button"
                  style={{
                    backgroundColor: currentTokens.btnPrimaryBg,
                    color: currentTokens.btnPrimaryText,
                  }}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <span>Download Resume</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Footer Strip in Preview */}
            <div
              style={{
                backgroundColor: currentTokens.bgFooter,
              }}
              className="flex items-center justify-between px-3 py-1.5 rounded-xl text-[10px] text-white/80"
            >
              <span>© Data Analyst Portfolio</span>
              <span>Built with Power BI & SQL Stack</span>
            </div>
          </div>
        </div>

        {/* 3 Main Customizer Navigation Tabs */}
        <div className="flex items-center gap-1 px-5 sm:px-6 pt-3 pb-2 overflow-x-auto border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <button
            id="tab-presets"
            onClick={() => setActiveTab('presets')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'presets'
                ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1. Theme Presets (8)</span>
          </button>

          <button
            id="tab-text"
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'text'
                ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>2. Text Colors</span>
          </button>

          <button
            id="tab-backgrounds"
            onClick={() => setActiveTab('backgrounds')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'backgrounds'
                ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>3. Backgrounds & Surfaces</span>
          </button>
        </div>

        {/* Tab Body Content Area (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: PRESETS (8 Presets) */}
          {activeTab === 'presets' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Select a Designer Theme Preset
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Click any preset to transform the entire website and sample preview simultaneously
                  </p>
                </div>

                {/* Preset Category Pills */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer ${
                        selectedCategoryFilter === cat
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-2xs'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Presets Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {filteredPresets.map((preset) => {
                  const isSelected = presetId === preset.id;
                  const preview = isDarkMode ? preset.dark : preset.light;

                  return (
                    <button
                      key={preset.id}
                      id={`preset-card-${preset.id}`}
                      onClick={() => setPresetId(preset.id)}
                      className={`p-4 rounded-2xl text-left transition-all relative border flex flex-col justify-between group cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/90 dark:bg-blue-950/70 border-blue-500 ring-2 ring-blue-500/30 shadow-md'
                          : 'bg-white dark:bg-slate-800/70 border-slate-200/80 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-xs'
                      }`}
                    >
                      {/* Active Check Indicator */}
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                            {preset.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {preset.description}
                        </p>
                      </div>

                      {/* Visual Swatches Preview */}
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                        <div className="flex items-center -space-x-1.5">
                          <div
                            className="w-5 h-5 rounded-full ring-2 ring-white dark:ring-slate-800 shadow-2xs"
                            style={{ backgroundColor: preview.accentPrimary }}
                            title="Accent Color"
                          />
                          <div
                            className="w-5 h-5 rounded-full ring-2 ring-white dark:ring-slate-800 shadow-2xs"
                            style={{ backgroundColor: preview.bgSurface }}
                            title="Surface Color"
                          />
                          <div
                            className="w-5 h-5 rounded-full ring-2 ring-white dark:ring-slate-800 shadow-2xs"
                            style={{ backgroundColor: preview.textPrimary }}
                            title="Text Color"
                          />
                          <div
                            className="w-5 h-5 rounded-full ring-2 ring-white dark:ring-slate-800 shadow-2xs"
                            style={{ backgroundColor: preview.bgFooter }}
                            title="Footer Color"
                          />
                        </div>

                        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          {preset.category}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: TEXT COLORS */}
          {activeTab === 'text' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Text & Typography Colors
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Independently adjust headings, body text, links, and muted captions
                  </p>
                </div>
                <button
                  onClick={() => resetCategory('text')}
                  className="flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Text Colors</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {renderColorControl(
                  'textPrimary',
                  'Heading / Primary Text',
                  'Main H1, H2 titles, section headers, and hero name text',
                  { label: 'Page Background', bg: currentTokens.bgCanvas }
                )}
                {renderColorControl(
                  'textSecondary',
                  'Body Text',
                  'Standard paragraphs, project descriptions, and skill details',
                  { label: 'Card Surface', bg: currentTokens.bgSurface }
                )}
                {renderColorControl(
                  'textMuted',
                  'Secondary / Muted Text',
                  'Timeline durations, category labels, and secondary metadata',
                  { label: 'Card Surface', bg: currentTokens.bgSurface }
                )}
                {renderColorControl(
                  'textLink',
                  'Link / Accent Text',
                  'Clickable URLs, repository links, and external references',
                  { label: 'Card Surface', bg: currentTokens.bgSurface }
                )}
                {renderColorControl(
                  'textAccent',
                  'Key Metric / Highlight Text',
                  'Key metric highlights, bold impact statements, and DAX phrases',
                  { label: 'Card Surface', bg: currentTokens.bgSurface }
                )}
              </div>
            </div>
          )}

          {/* TAB 3: BACKGROUNDS & SURFACES */}
          {activeTab === 'backgrounds' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Backgrounds & Surfaces
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Customize page background, cards, header, footer, and borders
                  </p>
                </div>
                <button
                  onClick={() => resetCategory('backgrounds')}
                  className="flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Backgrounds</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {renderColorControl(
                  'bgCanvas',
                  'Main Page Background',
                  'Main body and background layer of all portfolio sections'
                )}
                {renderColorControl(
                  'bgSurface',
                  'Card / Surface Background',
                  'Project cards, skill boxes, timeline tiles, and forms'
                )}
                {renderColorControl(
                  'bgSurfaceElevated',
                  'Section / Elevated Surface',
                  'Secondary containers, raised cards, and interactive flyouts'
                )}
                {renderColorControl(
                  'bgHeader',
                  'Header Background',
                  'Top sticky navigation bar background'
                )}
                {renderColorControl(
                  'bgFooter',
                  'Footer Background',
                  'Bottom portfolio footer container background'
                )}
                {renderColorControl(
                  'borderDefault',
                  'Card & Section Border Tone',
                  'Subtle frame borders around cards, tables, and inputs'
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 sm:px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80">
          <div className="flex items-center gap-2">
            <button
              id="theme-studio-reset-all-btn"
              onClick={resetAll}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All to Defaults</span>
            </button>

            <button
              id="theme-studio-copy-json-btn"
              onClick={handleCopyPaletteJson}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              {copiedNotification ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied JSON!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Tokens JSON</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="theme-studio-apply-close-btn"
              onClick={() => setIsThemeStudioOpen(false)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-sm transition-all cursor-pointer"
            >
              <span>Keep & Close Studio</span>
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
