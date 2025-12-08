/**
 * Color palette - the single source of truth for all theme colors.
 * Used by both Tailwind/CSS variables and runtime components (TabNavigator, etc).
 * RGB values are used for CSS variables; hex values for React Native components.
 */

export const palette = {
  light: {
    primary: { rgb: '10 126 164', hex: '#0a7ea4' },
    accent: { rgb: '129 199 132', hex: '#81c784' },
    background: { rgb: '245 245 245', hex: '#f5f5f5' },
    foreground: { rgb: '17 24 28', hex: '#111c1c' },
    muted: { rgb: '156 163 175', hex: '#9ca3af' },
    mutedForeground: { rgb: '107 114 128', hex: '#6b7280' },
    border: { rgb: '229 231 235', hex: '#e5e7eb' },
  },
  dark: {
    primary: { rgb: '10 126 164', hex: '#0a7ea4' },
    accent: { rgb: '129 199 132', hex: '#81c784' },
    background: { rgb: '21 23 24', hex: '#151718' },
    foreground: { rgb: '236 237 238', hex: '#ecedee' },
    muted: { rgb: '107 114 128', hex: '#6b7280' },
    mutedForeground: { rgb: '156 163 175', hex: '#9ca3af' },
    border: { rgb: '55 65 81', hex: '#374151' },
  },
} as const;

export type ThemeName = keyof typeof palette;
