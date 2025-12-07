import 'react-native-reanimated';
import '../global.css';

import { RootNavigator, unstable_settings } from '@core/navigation/RootNavigator';

export { unstable_settings };

/**
 * App root component that renders the application's root navigator.
 *
 * @returns The root React element that mounts the `RootNavigator` component
 */
export default function RootLayout() {
  return <RootNavigator />;
}