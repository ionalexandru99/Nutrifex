import { atom } from 'jotai';

import { type ThemeName } from '@shared/theme/colors';

/**
 * Atom for user's theme preference ('light', 'dark', or 'system')
 */
export const themePreferenceAtom = atom<ThemeName | 'system'>('system');

/**
 * Derived atom that resolves the actual color scheme considering system preference
 */
export const themeAtom = atom<ThemeName>((get) => {
  const preference = get(themePreferenceAtom);

  if (preference === 'system') {
    // Use NativeWind's useColorScheme in atom effects if needed
    // For now, we'll handle this in ThemeProvider
    return 'light';
  }

  return preference as ThemeName;
});
