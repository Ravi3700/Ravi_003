import { ThemeTokens } from '../types/theme';

/**
 * Converts a hex color string (#ffffff or #fff) to RGB components.
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  if (!hex) return null;
  let cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (cleanHex.length !== 6) return null;

  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return { r, g, b };
}

/**
 * Calculates WCAG relative luminance for an sRGB component.
 */
function getComponentLuminance(val: number): number {
  const sRGB = val / 255;
  return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
}

/**
 * Calculates the relative luminance of a hex color.
 */
export function getRelativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0.5;
  const rLum = getComponentLuminance(rgb.r);
  const gLum = getComponentLuminance(rgb.g);
  const bLum = getComponentLuminance(rgb.b);
  return 0.2126 * rLum + 0.7152 * gLum + 0.0722 * bLum;
}

/**
 * Calculates WCAG 2.1 Contrast Ratio between two hex colors (1.0 - 21.0).
 */
export function calculateContrastRatio(color1: string, color2: string): number {
  const lum1 = getRelativeLuminance(color1);
  const lum2 = getRelativeLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Math.round(ratio * 10) / 10;
}

export interface ContrastEvaluation {
  ratio: number;
  rating: 'AAA' | 'AA' | 'AA Large' | 'Warning';
  isAccessible: boolean;
  message: string;
}

export function evaluateContrast(textColor: string, bgColor: string): ContrastEvaluation {
  const ratio = calculateContrastRatio(textColor, bgColor);
  if (ratio >= 7.0) {
    return {
      ratio,
      rating: 'AAA',
      isAccessible: true,
      message: 'Excellent contrast (WCAG AAA)',
    };
  } else if (ratio >= 4.5) {
    return {
      ratio,
      rating: 'AA',
      isAccessible: true,
      message: 'Good readability (WCAG AA)',
    };
  } else if (ratio >= 3.0) {
    return {
      ratio,
      rating: 'AA Large',
      isAccessible: false,
      message: 'Acceptable only for large headings (3.0:1)',
    };
  } else {
    return {
      ratio,
      rating: 'Warning',
      isAccessible: false,
      message: 'Poor contrast warning: text may be hard to read',
    };
  }
}

/**
 * Maps ThemeTokens to CSS custom property definitions.
 */
export function generateCssVariables(tokens: ThemeTokens): Record<string, string> {
  return {
    '--text-primary': tokens.textPrimary,
    '--text-secondary': tokens.textSecondary,
    '--text-muted': tokens.textMuted,
    '--text-link': tokens.textLink,
    '--text-accent': tokens.textAccent,

    '--bg-canvas': tokens.bgCanvas,
    '--bg-surface': tokens.bgSurface,
    '--bg-surface-elevated': tokens.bgSurfaceElevated,
    '--bg-header': tokens.bgHeader,
    '--bg-footer': tokens.bgFooter,
    '--border-default': tokens.borderDefault,
    '--border-subtle': tokens.borderSubtle,

    '--accent-primary': tokens.accentPrimary,
    '--accent-primary-hover': tokens.accentPrimaryHover,
    '--accent-secondary': tokens.accentSecondary,
    '--accent-nav-active': tokens.accentNavActive,
    '--btn-primary-bg': tokens.btnPrimaryBg,
    '--btn-primary-text': tokens.btnPrimaryText,

    '--badge-bg': tokens.badgeBg,
    '--badge-text': tokens.badgeText,
    '--accent-emerald': tokens.accentEmerald,
    '--accent-amber': tokens.accentAmber,
  };
}

/**
 * Injects or updates an inline <style id="dynamic-theme-tokens"> tag
 * with current active CSS variables.
 */
export function applyDynamicCssTokens(tokens: ThemeTokens, isDarkMode: boolean): void {
  if (typeof document === 'undefined') return;

  let styleTag = document.getElementById('dynamic-theme-tokens') as HTMLStyleElement | null;
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'dynamic-theme-tokens';
    document.head.appendChild(styleTag);
  }

  const cssVars = generateCssVariables(tokens);
  const rules = Object.entries(cssVars)
    .map(([key, val]) => `  ${key}: ${val} !important;`)
    .join('\n');

  const selector = isDarkMode ? ':root, .dark, html' : ':root, html';
  styleTag.textContent = `${selector} {\n${rules}\n}\n`;
}
