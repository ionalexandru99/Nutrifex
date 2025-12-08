import { Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@shared/theme/ThemeProvider';

/**
 * Render the Settings screen containing a header and a Dark Mode toggle.
 *
 * The toggle reflects the current theme and invokes the theme provider's toggle when changed.
 *
 * @returns A React element representing the Settings screen UI
 */
export default function ExploreScreen() {
  const { theme, toggleTheme } = useTheme();

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1 px-6">
        <Text className="mb-8 mt-4 text-3xl font-bold text-foreground">Settings</Text>

        <View className="flex-row items-center justify-between border-b border-border py-4">
          <Text className="text-lg text-foreground">Dark Mode</Text>
          <Switch value={theme === 'dark'} onValueChange={toggleTheme} />
        </View>
      </SafeAreaView>
    </View>
  );
}