import 'react-native-reanimated';

import { RootNavigator, unstable_settings } from '@core/navigation/RootNavigator';

export { unstable_settings };

export default function RootLayout() {
  return <RootNavigator />;
}
