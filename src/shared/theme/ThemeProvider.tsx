import { useAtom, useAtomValue } from 'jotai';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import { View, type ViewProps } from 'react-native';

import { themeAtom, themePreferenceAtom } from '@shared/theme/atoms';
import { type ThemeName, themes } from '@shared/theme/colors';

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

  return (
    <View style={themeVars} className="flex-1" {...rest}>
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
  const { colorScheme } = useNativeWindColorScheme();

  const toggleTheme = () => {
    setPreference((prev: ThemeName | 'system') => {
      if (prev === 'system') {
        return colorScheme === 'dark' ? 'light' : 'dark';
      }
      return prev === 'light' ? 'dark' : 'light';
    });
  };

  return {
    theme,
    preference,
    setTheme: setPreference,
    toggleTheme,
  };
}
