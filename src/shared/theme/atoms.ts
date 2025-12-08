import { atom } from 'jotai';

import { type ThemeName } from '@shared/theme/colors';

/**
 * Atom for user's theme preference ('light' or 'dark')
 */
export const themePreferenceAtom = atom<ThemeName>('light');

/**
 * Alias for themePreferenceAtom for consistency.
 * Returns the current theme preference.
 */
export const themeAtom = atom<ThemeName>((get) => {
  return get(themePreferenceAtom);
});
