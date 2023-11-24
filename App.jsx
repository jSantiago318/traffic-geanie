import { NativeBaseProvider } from 'native-base';
import React from 'react';
import { RootNavigator } from './navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';

enableScreens(); 
const App = () => {
      return (
          <SafeAreaProvider>
          <NativeBaseProvider>
            <RootNavigator />
          </NativeBaseProvider>
          </SafeAreaProvider>
      )
  
};
export default App