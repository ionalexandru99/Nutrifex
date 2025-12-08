import { Tabs } from 'expo-router';
import React from 'react';

import { Colors } from '@shared/constants/theme';
import { useColorScheme } from '@shared/hooks/use-color-scheme';
import { HapticTab } from '@ui/components/haptic-tab';
import { IconSymbol } from '@ui/components/icon-symbol';

/**
 * Renders the app's bottom tab layout with Home and Explore screens.
 *
 * Uses the current color scheme to set the active tab tint, hides headers,
 * and applies `HapticTab` as the tab button. Defines the "Home" and "Explore"
 * tabs with their respective icons.
 *
 * @returns A JSX element containing the configured `Tabs` navigator.
 */
export function TabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
