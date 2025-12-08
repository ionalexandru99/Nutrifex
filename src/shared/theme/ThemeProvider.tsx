import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import React, { createContext, useContext, useMemo } from 'react';
import { View, type ViewProps } from 'react-native';

import { type ThemeName, themes } from '@shared/theme/colors';

type ThemeContextValue = {
  theme: ThemeName;
  setTheme: (theme: ThemeName | 'system') => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Access the current theme context value.
 *
 * @returns The theme context value containing `theme`, `setTheme`, and `toggleTheme`.
 * @throws Error if called outside of a `<ThemeProvider />`.
 */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider />');
  return ctx;
}

type Props = ViewProps & {
  children: React.ReactNode;
};

/**
 * Provides theme context to descendants and renders a container View styled with the current theme.
 *
 * @param children - React nodes to render inside the themed container
 * @returns A ThemeContext provider wrapping a View that applies the active theme's styles and renders `children`
 */
export function ThemeProvider({ children, ...rest }: Props) {
  const { colorScheme, setColorScheme } = useNativeWindColorScheme();

  const value = useMemo(
    () => ({
      theme: (colorScheme ?? 'light') as ThemeName,
      setTheme: (t: ThemeName | 'system') => setColorScheme(t),
      toggleTheme: () => setColorScheme(colorScheme === 'light' ? 'dark' : 'light'),
    }),
    [colorScheme, setColorScheme],
  );

  const themeVars = themes[(colorScheme ?? 'light') as ThemeName];

  return (
    <ThemeContext.Provider value={value}>
      <View style={themeVars} className="flex-1" {...rest}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
}