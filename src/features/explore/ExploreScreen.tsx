import { ThemedText } from '@ui/components/themed-text';
import { ThemedView } from '@ui/components/themed-view';

/**
 * Explore screen component with simple informational text.
 *
 * @returns A React element containing the screen UI.
 */
export default function ExploreScreen() {
  return (
    <ThemedView className="flex-1 items-center justify-center px-6">
      <ThemedText type="title">Settings</ThemedText>
      <ThemedText className="mt-4 text-center">Explore and manage your preferences</ThemedText>
    </ThemedView>
  );
}
