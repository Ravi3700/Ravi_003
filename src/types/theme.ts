export interface ThemeTokens {
  // 1. Text Colors
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textLink: string;
  textAccent: string;

  // 2. Background & Surface Colors
  bgCanvas: string;
  bgSurface: string;
  bgSurfaceElevated: string;
  bgHeader: string;
  bgFooter: string;
  borderDefault: string;
  borderSubtle: string;

  // 3. Accent & Interaction Colors
  accentPrimary: string;
  accentPrimaryHover: string;
  accentSecondary: string;
  accentNavActive: string;
  btnPrimaryBg: string;
  btnPrimaryText: string;

  // 4. Component / Special Badges & States
  badgeBg: string;
  badgeText: string;
  accentEmerald: string;
  accentAmber: string;
}

export type ThemePresetCategory = 'Corporate' | 'Tech' | 'Modern' | 'Executive';

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  category: ThemePresetCategory;
  previewColors: {
    primary: string;
    surface: string;
    accent: string;
    text: string;
  };
  light: ThemeTokens;
  dark: ThemeTokens;
}

export type CustomizerTab =
  | 'presets'
  | 'text'
  | 'backgrounds';

export interface ThemeCustomizerState {
  presetId: string;
  isDarkMode: boolean;
  customTokens: {
    light: Partial<ThemeTokens>;
    dark: Partial<ThemeTokens>;
  };
}
