import { Text, type TextProps } from 'react-native';

import { Colors } from '@shared/constants/theme';
import { useColorScheme } from '@shared/hooks/use-color-scheme';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

/**
 * Render a Text element with typography presets and a color that adapts to the current color scheme.
 *
 * The component selects a text color using `lightColor`/`darkColor` when both are provided, otherwise it uses the theme color for the active color scheme. When `type` is `'link'`, a fixed link color is used. Applies type-specific className presets and merges any provided `style` and other Text props.
 *
 * @param className - Additional utility classes applied alongside the preset for the selected `type`.
 * @param style - Additional style or style array merged with the computed `{ color }` style.
 * @param lightColor - Optional color to use when the active color scheme is light; only used when `darkColor` is also provided.
 * @param darkColor - Optional color to use when the active color scheme is dark; only used when `lightColor` is also provided.
 * @param type - Typography preset to apply. One of: `'default'`, `'title'`, `'defaultSemiBold'`, `'subtitle'`, `'link'`.
 * @returns A React Native `Text` element styled according to the resolved color, selected `type` preset, and provided props.
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
    title: 'text-[32px] leading-8 font-bold',
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