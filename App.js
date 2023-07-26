import React, {useEffect} from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';

import { AuthenticatedUserProvider } from './providers';
import { LogBox } from "react-native"
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
   LogBox.ignoreLogs([ 'In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.', ])
 
 
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
const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'blue',
  },
  text: {
    color: 'white',
    maxWidth: '80%',
    textAlign: 'center',
    fontSize: 14,
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 32,
  },
});


export default App;
