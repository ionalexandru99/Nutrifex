import { vars } from 'nativewind';

import { palette } from '@shared/theme/palette';

/**
 * Theme definitions using NativeWind CSS variables.
 * These feed into the Tailwind tokens defined in tailwind.config.js
 */
export const themes = {
  light: vars({
    '--background': palette.light.background.rgb,
    '--foreground': palette.light.foreground.rgb,
    '--primary': palette.light.primary.rgb,
    '--primary-foreground': '255 255 255',
    '--muted': palette.light.muted.rgb,
    '--muted-foreground': palette.light.mutedForeground.rgb,
    '--border': palette.light.border.rgb,
    '--accent': palette.light.accent.rgb,
  }),
  dark: vars({
    '--background': palette.dark.background.rgb,
    '--foreground': palette.dark.foreground.rgb,
    '--primary': palette.dark.primary.rgb,
    '--primary-foreground': '255 255 255',
    '--muted': palette.dark.muted.rgb,
    '--muted-foreground': palette.dark.mutedForeground.rgb,
    '--border': palette.dark.border.rgb,
    '--accent': palette.dark.accent.rgb,
  }),
} as const;

export type ThemeName = keyof typeof themes;
