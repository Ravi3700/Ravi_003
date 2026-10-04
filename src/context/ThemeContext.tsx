import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { ThemeTokens, ThemePreset } from '../types/theme';
import {
  themePresets,
  defaultLightTokens,
  defaultDarkTokens,
} from '../data/themePresets';
import { applyDynamicCssTokens } from '../utils/themeUtils';

interface ThemeContextType {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  toggleTheme: () => void;
  presetId: string;
  setPresetId: (presetId: string) => void;
  currentTokens: ThemeTokens;
  activePreset: ThemePreset;
  customTokens: {
    light: Partial<ThemeTokens>;
    dark: Partial<ThemeTokens>;
  };
  updateToken: (key: keyof ThemeTokens, value: string) => void;
  resetToken: (key: keyof ThemeTokens) => void;
  resetCategory: (category: 'text' | 'backgrounds' | 'accents' | 'components') => void;
  resetAll: () => void;
  isThemeStudioOpen: boolean;
  setIsThemeStudioOpen: (open: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'portfolio_theme_customizer_v1';
const THEME_MODE_KEY = 'portfolio_theme';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Dark Mode State with local storage
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(THEME_MODE_KEY);
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // 2. Preset and Custom Tokens state
  const [presetId, setPresetIdState] = useState<string>(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.presetId) return parsed.presetId;
      }
    } catch {}
    return 'professional-blue';
  });

  const [customTokens, setCustomTokens] = useState<{
    light: Partial<ThemeTokens>;
    dark: Partial<ThemeTokens>;
  }>(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.customTokens) return parsed.customTokens;
      }
    } catch {}
    return { light: {}, dark: {} };
  });

  const [isThemeStudioOpen, setIsThemeStudioOpen] = useState(false);

  // Active preset reference
  const activePreset = useMemo(() => {
    const found = themePresets.find((p) => p.id === presetId);
    return found || themePresets[0];
  }, [presetId]);

  // Compute combined tokens based on mode, preset and custom overrides
  const currentTokens = useMemo<ThemeTokens>(() => {
    const baseTokens = isDarkMode ? activePreset.dark : activePreset.light;
    const overrides = isDarkMode ? customTokens.dark : customTokens.light;
    return {
      ...baseTokens,
      ...overrides,
    };
  }, [isDarkMode, activePreset, customTokens]);

  // Apply Tailwind `.dark` class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_MODE_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_MODE_KEY, 'light');
    }
  }, [isDarkMode]);

  // Apply dynamic CSS variables to document head & persist in localStorage
  useEffect(() => {
    applyDynamicCssTokens(currentTokens, isDarkMode);

    try {
      const payload = {
        presetId,
        customTokens,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.warn('Unable to persist custom theme settings', err);
    }
  }, [currentTokens, isDarkMode, presetId, customTokens]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const setPresetId = (id: string) => {
    setPresetIdState(id);
    // When a preset is chosen, we keep existing custom modifications or reset to clean preset
    setCustomTokens({ light: {}, dark: {} });
  };

  const updateToken = (key: keyof ThemeTokens, value: string) => {
    setCustomTokens((prev) => {
      const modeKey = isDarkMode ? 'dark' : 'light';
      return {
        ...prev,
        [modeKey]: {
          ...prev[modeKey],
          [key]: value,
        },
      };
    });
  };

  const resetToken = (key: keyof ThemeTokens) => {
    setCustomTokens((prev) => {
      const modeKey = isDarkMode ? 'dark' : 'light';
      const updatedModeTokens = { ...prev[modeKey] };
      delete updatedModeTokens[key];
      return {
        ...prev,
        [modeKey]: updatedModeTokens,
      };
    });
  };

  const resetCategory = (category: 'text' | 'backgrounds' | 'accents' | 'components') => {
    const keysToRemove: (keyof ThemeTokens)[] = [];
    switch (category) {
      case 'text':
        keysToRemove.push('textPrimary', 'textSecondary', 'textMuted', 'textLink', 'textAccent');
        break;
      case 'backgrounds':
        keysToRemove.push('bgCanvas', 'bgSurface', 'bgSurfaceElevated', 'bgHeader', 'bgFooter', 'borderDefault', 'borderSubtle');
        break;
      case 'accents':
        keysToRemove.push('accentPrimary', 'accentPrimaryHover', 'accentSecondary', 'accentNavActive', 'btnPrimaryBg', 'btnPrimaryText');
        break;
      case 'components':
        keysToRemove.push('badgeBg', 'badgeText', 'accentEmerald', 'accentAmber');
        break;
    }

    setCustomTokens((prev) => {
      const modeKey = isDarkMode ? 'dark' : 'light';
      const updated = { ...prev[modeKey] };
      keysToRemove.forEach((k) => delete updated[k]);
      return {
        ...prev,
        [modeKey]: updated,
      };
    });
  };

  const resetAll = () => {
    setPresetIdState('professional-blue');
    setCustomTokens({ light: {}, dark: {} });
    setIsDarkMode(false);
  };

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        setIsDarkMode,
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
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useThemeStudio() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeStudio must be used within a ThemeProvider');
  }
  return context;
}
