import { AuthenticatedUserProvider } from './providers';
import { NativeBaseProvider } from 'native-base';
import React from 'react';
import { RootNavigator } from './navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App = () => {
  return (
    <AuthenticatedUserProvider>
      <SafeAreaProvider>
      <NativeBaseProvider>
        <RootNavigator />
      </NativeBaseProvider>
      </SafeAreaProvider>
    </AuthenticatedUserProvider>
  );
};

export default App;
