import 'react-native-reanimated';
import '../global.css';

import { RootNavigator, unstable_settings } from '@core/navigation/RootNavigator';

export { unstable_settings };

export default function RootLayout() {
  return <RootNavigator />;
}
