import { Text, type TextProps } from 'react-native';

import { Colors } from '@shared/constants/theme';
import { useColorScheme } from '@shared/hooks/use-color-scheme';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

/**
 * A Text component that adapts color to light/dark mode with typography presets.
 */
export function ThemedText({
  className = '',
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const colorScheme = useColorScheme() ?? 'light';

  const typeClasses = {
    default: 'text-base leading-6',
    defaultSemiBold: 'text-base leading-6 font-semibold',
    title: 'text-[32px] leading-[40px] font-bold',
    subtitle: 'text-xl font-bold',
    link: 'text-base leading-[30px]',
  };

  const textColor =
    lightColor && darkColor
      ? colorScheme === 'light'
        ? lightColor
        : darkColor
      : Colors[colorScheme].text;

  const linkColor = '#0a7ea4';
  const finalColor = type === 'link' ? linkColor : textColor;

  const classes = `${typeClasses[type]} ${className}`.trim();

  return <Text className={classes} style={[{ color: finalColor }, style]} {...rest} />;
}
