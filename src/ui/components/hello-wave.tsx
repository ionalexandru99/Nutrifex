import { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

/**
 * Displays a hand emoji that performs a short waving animation (rotates to 25° then back) repeated four times.
 *
 * @returns The animated hand emoji element.
 */
export function HelloWave() {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withSequence(withTiming(25, { duration: 300 }), withTiming(0, { duration: 300 })),
      4,
      false,
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <Animated.Text className="text-[28px] leading-8 -mt-1.5" style={animatedStyle}>
      👋
    </Animated.Text>
  );
}