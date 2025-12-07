import Animated from 'react-native-reanimated';

/**
 * Render an animated waving hand emoji.
 *
 * Renders an Animated.Text containing the 👋 emoji with a keyframe that rotates 25 degrees at 50%, repeated 4 times with a 300ms duration per iteration.
 *
 * @returns A JSX element that displays the animated waving hand.
 */
export function HelloWave() {
  return (
    <Animated.Text
      style={{
        fontSize: 28,
        lineHeight: 32,
        marginTop: -6,
        animationName: {
          '50%': { transform: [{ rotate: '25deg' }] },
        },
        animationIterationCount: 4,
        animationDuration: '300ms',
      }}
    >
      👋
    </Animated.Text>
  );
}