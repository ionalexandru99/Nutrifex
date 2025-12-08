import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useColorScheme } from '@shared/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

/**
 * Render the app's root navigation stack wrapped in a theme provider.
 *
 * The selected theme is based on the current color scheme; the stack includes the main
 * "(tabs)" screen (header hidden) and a "modal" screen presented as a modal. A status bar
 * is rendered alongside the navigator.
 *
 * @returns A JSX element containing the themed root navigator and status bar.
 */
export function RootNavigator() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
