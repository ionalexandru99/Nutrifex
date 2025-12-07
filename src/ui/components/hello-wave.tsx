import Animated from 'react-native-reanimated';

const waveAnimationStyle = {
  animationName: {
    '50%': { transform: [{ rotate: '25deg' }] },
  },
  animationIterationCount: 4,
  animationDuration: '300ms',
};

/**
 * Renders an animated waving hand emoji.
 *
 * @returns A JSX element containing the animated waving hand.
 */
export function HelloWave() {
  return (
    <Animated.Text className="text-[28px] leading-8 -mt-1.5" style={waveAnimationStyle}>
      👋
    </Animated.Text>
  );
}
