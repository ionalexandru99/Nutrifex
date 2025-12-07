import { View, type ViewProps } from 'react-native';

import { Colors } from '@shared/constants/theme';
import { useColorScheme } from '@shared/hooks/use-color-scheme';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

/**
 * Render a View whose background color is selected according to the active color scheme.
 *
 * If both `lightColor` and `darkColor` are provided, the corresponding value is used for the current scheme;
 * otherwise the theme's background color for the active scheme is used.
 *
 * @param className - Optional class name to apply to the View
 * @param style - Additional styles to merge with the computed background color
 * @param lightColor - Optional background color override to use when the color scheme is `light`
 * @param darkColor - Optional background color override to use when the color scheme is `dark`
 * @returns A JSX.Element representing a View with its background color set for the current color scheme
 */
export function ThemedView({
  className = '',
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const colorScheme = useColorScheme() ?? 'light';

  const backgroundColor =
    lightColor && darkColor
      ? colorScheme === 'light'
        ? lightColor
        : darkColor
      : Colors[colorScheme].background;

  return <View className={className} style={[{ backgroundColor }, style]} {...otherProps} />;
}