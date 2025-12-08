import { ThemedText } from '@ui/components/themed-text';
import { ThemedView } from '@ui/components/themed-view';

/**
 * Home screen component with simple welcome text.
 *
 * @returns The Home screen JSX element.
 */
export default function HomeScreen() {
  return (
    <ThemedView className="flex-1 items-center justify-center px-6">
      <ThemedText type="title">Nutrifex</ThemedText>
      <ThemedText className="mt-4 text-center">Welcome to your nutrition app</ThemedText>
    </ThemedView>
  );
}
