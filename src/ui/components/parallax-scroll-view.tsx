import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from 'react-native-reanimated';

import { useColorScheme } from '@shared/hooks/use-color-scheme';
import { ThemedView } from '@ui/components/themed-view';

import type { PropsWithChildren, ReactElement } from 'react';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

/**
 * Renders a scrollable view with a parallax header image that translates and scales based on vertical scroll.
 *
 * @param children - Content rendered below the header.
 * @param headerImage - Element displayed inside the parallax header.
 * @param headerBackgroundColor - Object with `light` and `dark` background colors used for the header based on the current color scheme.
 * @returns The scrollable React element containing the animated header and content.
 */
export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75],
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  const backgroundColor = colorScheme === 'light' ? '#fff' : '#151718';

  return (
    <Animated.ScrollView
      ref={scrollRef}
      className="flex-1"
      style={{ backgroundColor }}
      scrollEventThrottle={16}
    >
      <Animated.View
        className="h-[250px] overflow-hidden"
        style={[{ backgroundColor: headerBackgroundColor[colorScheme] }, headerAnimatedStyle]}
      >
        {headerImage}
      </Animated.View>
      <ThemedView className="flex-1 p-8 gap-4 overflow-hidden">{children}</ThemedView>
    </Animated.ScrollView>
  );
}
