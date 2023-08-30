import { NativeBaseProvider } from 'native-base';
import React from 'react';
import { RootNavigator } from './navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { block } from "million/react";
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
// const AppBlock = /* @optimize */ block(App);
export default App;