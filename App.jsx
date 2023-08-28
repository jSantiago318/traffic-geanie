import * as TaskManager from 'expo-task-manager';

import { AuthenticatedUserProvider } from './providers';
// import '@fontsource/roboto/300.css';
// import '@fontsource/roboto/400.css';
// import '@fontsource/roboto/500.css';
// import '@fontsource/roboto/700.css';
import { NativeBaseProvider } from 'native-base';
import React from 'react';
import { RootNavigator } from './navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';

enableScreens(); 
const App = () => {
  
      return (
        <AuthenticatedUserProvider>
          <SafeAreaProvider>
          <NativeBaseProvider>
            <RootNavigator />
          </NativeBaseProvider>
          </SafeAreaProvider>
        </AuthenticatedUserProvider>
      )
  
};
export default App;