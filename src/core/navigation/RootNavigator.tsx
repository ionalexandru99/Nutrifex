import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider, useTheme } from '@shared/theme/ThemeProvider';

export const unstable_settings = {
  anchor: '(tabs)',
};

/**
 * Render the app's navigation stack inside a react-navigation ThemeProvider chosen from the current app theme.
 *
 * @returns A React element containing the themed navigation stack with the primary "(tabs)" screen and a status bar.
 */
function NavigationContent() {
  const { theme } = useTheme();

  return (
    <NavigationThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </NavigationThemeProvider>
  );
}

/**
 * Provide the app's root navigation wrapped with safe-area and theme providers.
 *
 * Wraps NavigationContent with SafeAreaProvider and the app ThemeProvider so navigation
 * has access to safe-area insets and the global theme.
 *
 * @returns A React element containing the root navigation tree with safe-area and theme context.
 */
export function RootNavigator() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}