import { View, type ViewProps } from 'react-native';

import { Colors } from '@shared/constants/theme';
import { useColorScheme } from '@shared/hooks/use-color-scheme';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

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
