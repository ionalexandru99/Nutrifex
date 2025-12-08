import { Text, View } from 'react-native';

/**
 * Home screen - main landing page of the app.
 */
export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Text className="text-3xl font-bold text-foreground">Nutrifex</Text>
      <Text className="mt-4 text-center text-mutedForeground">Welcome to your nutrition app</Text>
    </View>
  );
}
