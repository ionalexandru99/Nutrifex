import { Link } from 'expo-router';

import { ThemedText } from '@ui/components/themed-text';
import { ThemedView } from '@ui/components/themed-view';

/**
 * Renders a centered modal containing a title and a link to return to the home screen.
 *
 * @returns A React element with a themed centered view, a title text, and a link that dismisses the modal and navigates to `/`.
 */
export default function ModalScreen() {
  return (
    <ThemedView className="flex-1 items-center justify-center p-5">
      <ThemedText type="title">This is a modal</ThemedText>
      <Link href="/" dismissTo className="mt-[15px] py-[15px]">
        <ThemedText type="link">Go to home screen</ThemedText>
      </Link>
    </ThemedView>
  );
}