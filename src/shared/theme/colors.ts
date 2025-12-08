import { vars } from 'nativewind';

/**
 * Theme definitions using NativeWind CSS variables.
 * These feed into the Tailwind tokens defined in tailwind.config.js
 */
export const themes = {
  light: vars({
    '--background': '245 245 245',
    '--foreground': '17 24 28',
    '--primary': '10 126 164',
    '--primary-foreground': '255 255 255',
    '--muted': '156 163 175',
    '--muted-foreground': '107 114 128',
    '--border': '229 231 235',
    '--accent': '129 199 132',
  }),
  dark: vars({
    '--background': '21 23 24',
    '--foreground': '236 237 238',
    '--primary': '10 126 164',
    '--primary-foreground': '255 255 255',
    '--muted': '107 114 128',
    '--muted-foreground': '156 163 175',
    '--border': '55 65 81',
    '--accent': '129 199 132',
  }),
} as const;

export type ThemeName = keyof typeof themes;
