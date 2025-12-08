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
 * Root navigation stack with theme support.
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
