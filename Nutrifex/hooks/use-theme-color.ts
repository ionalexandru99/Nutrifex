/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * Selects the appropriate color string for the active theme, allowing an optional per-theme override.
 *
 * @param props - Optional overrides with `light` and/or `dark` color values.
 * @param colorName - A key that exists in both `Colors.light` and `Colors.dark` to look up the default color.
 * @returns The color string from `props` for the current theme if present, otherwise the color from `Colors` for `colorName` and the current theme.
 */
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}