import { ThemedText } from '@ui/components/themed-text';
import { ThemedView } from '@ui/components/themed-view';

/**
 * Settings screen component.
 */
export default function ExploreScreen() {
  return (
    <ThemedView className="flex-1 items-center justify-center px-6">
      <ThemedText type="title">Settings</ThemedText>
      <ThemedText className="mt-4 text-center">Manage your preferences</ThemedText>
    </ThemedView>
  );
}
