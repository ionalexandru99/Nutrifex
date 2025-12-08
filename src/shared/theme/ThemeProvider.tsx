import { useAtom, useAtomValue } from 'jotai';
import { View, type ViewProps } from 'react-native';

import { themeAtom, themePreferenceAtom } from '@shared/theme/atoms';
import { themes } from '@shared/theme/colors';

type Props = ViewProps & {
  children: React.ReactNode;
};

/**
 * ThemeProvider - wraps the app with Jotai atoms for theme state.
 * Manages theme switching and applies CSS variables via NativeWind.
 */
export function ThemeProvider({ children, ...rest }: Props) {
  const resolvedTheme = useAtomValue(themeAtom);

  const themeVars = themes[resolvedTheme];
  const { style, ...props } = rest;
  const mergedStyle = [themeVars, style];

  return (
    <View style={mergedStyle} className="flex-1" {...props}>
      {children}
    </View>
  );
}

/**
 * Hook to access and control theme state via Jotai atoms.
 */
export function useTheme() {
  const theme = useAtomValue(themeAtom);
  const [preference, setPreference] = useAtom(themePreferenceAtom);

  const toggleTheme = () => {
    setPreference(theme === 'light' ? 'dark' : 'light');
  };

  return {
    theme,
    preference,
    setTheme: setPreference,
    toggleTheme,
  };
}
