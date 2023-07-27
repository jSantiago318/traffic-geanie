import React, {useEffect} from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthenticatedUserProvider } from './providers';
// import '@fontsource/roboto/300.css';
// import '@fontsource/roboto/400.css';
// import '@fontsource/roboto/500.css';
// import '@fontsource/roboto/700.css';
import { NativeBaseProvider } from 'native-base';
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
      );
    
  
};

export default App;
