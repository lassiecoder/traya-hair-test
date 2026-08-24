/**
 * Traya App
 *
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';

function App(): React.JSX.Element {
  return (
    // initialMetrics seeds the insets context synchronously from the metrics captured at native
    // module init, so the very first render already has real inset values instead of waiting on
    // an async measurement — avoids a top-inset flash on cold start.
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <StatusBar barStyle="dark-content" />
      <RootNavigator />
    </SafeAreaProvider>
  );
}

export default App;
