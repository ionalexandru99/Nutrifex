import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useMemo } from 'react';

import { palette } from '@shared/theme/palette';
import { useTheme } from '@shared/theme/ThemeProvider';

/**
 * Bottom tab navigator with Home and Settings screens.
 * Tab bar color is derived from the current theme.
 */
export function TabNavigator() {
  const { theme } = useTheme();

  // Memoize the tab color to avoid recomputing on every render
  const tabBarActiveTintColor = useMemo(() => palette[theme].primary.hex, [theme]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
